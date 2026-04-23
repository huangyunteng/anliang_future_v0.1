import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from typing import Dict, Any, List, Optional, Tuple
import json

from agentscope import init
from agentscope.agent import ReActAgent
from agentscope.model import DashScopeChatModel, OpenAIChatModel
from agentscope.formatter import DashScopeChatFormatter
from agentscope.memory import InMemoryMemory

import agentscope.tool as tool_module
print([name for name in dir(tool_module) if not name.startswith('_')])

from agentscope.tool import Toolkit, execute_python_code, ToolResponse
from agentscope.message import Msg


# 全局工具函数
def extract_text_from_response(resp) -> str:
    """从AgentScope响应中提取文本内容"""
    if not resp:
        return ""
    
    # 如果有text属性，直接使用
    if hasattr(resp, 'text'):
        return resp.text
    
    # 如果有content属性，可能为字符串或列表
    if hasattr(resp, 'content'):
        content = resp.content
        if isinstance(content, str):
            return content
        elif isinstance(content, list):
            # 处理列表格式，如 [{'type': 'text', 'text': '...'}]
            text_parts = []
            for item in content:
                if isinstance(item, dict) and 'text' in item:
                    text_parts.append(item['text'])
                elif isinstance(item, str):
                    text_parts.append(item)
            if text_parts:
                return '\n'.join(text_parts)
    
    # 其他情况转换为字符串
    return str(resp)


# ===================== 1. 模型配置 =====================
# 通过设置环境变量 MODEL_PROVIDER 来切换模型，可选值：bailian, siliconflow, doubao
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "bailian").lower()

if MODEL_PROVIDER == "bailian":
    # 阿里百炼配置
    MODEL_CLASS = DashScopeChatModel
    MODEL_CONFIG = {
        "model_name": "qwen-max",  # 可选: qwen-max, qwen-plus, qwen-turbo
        "api_key": os.getenv("DASHSCOPE_API_KEY", "sk-c722d4d16f9c4fca9e7b8e8401603a29"),
        "stream": True,
    }
    FORMATTER = DashScopeChatFormatter()
    print("✅ 当前使用的模型提供商: 百炼 (DashScope)")

elif MODEL_PROVIDER == "siliconflow":
    # 硅基流动配置 (OpenAI 兼容)
    MODEL_CLASS = OpenAIChatModel
    MODEL_CONFIG = {
        "model_name": "deepseek-ai/DeepSeek-V3",
        "api_key": os.getenv("SILICONFLOW_API_KEY", "your-siliconflow-api-key"),
        "client_kwargs": {"base_url": "https://api.siliconflow.cn/v1"},
        "stream": True,
    }
    FORMATTER = None  # OpenAI 兼容模型通常不需要额外格式化器
    print("✅ 当前使用的模型提供商: 硅基流动 (SiliconFlow)")

elif MODEL_PROVIDER == "doubao":
    # 豆包配置 (OpenAI 兼容)
    MODEL_CLASS = OpenAIChatModel
    MODEL_CONFIG = {
        "model_name": os.getenv("DOUBAO_MODEL", "ep-xxxxxxxxxxxx"),  # 替换为你的模型ID
        "api_key": os.getenv("DOUBAO_API_KEY", "your-doubao-api-key"),
        "client_kwargs": {"base_url": "https://ark.cn-beijing.volces.com/api/v3"},
        "stream": True,
    }
    FORMATTER = None
    print("✅ 当前使用的模型提供商: 豆包 (Doubao)")

else:
    raise ValueError(f"不支持的模型提供商: {MODEL_PROVIDER}")

# ===================== 2. 初始化 AgentScope =====================
init(name="安粮期货-智能投研系统")

# 全局技能函数字典
skill_functions = {}

# ===================== 3. 加载 Skills 作为工具 =====================
def load_skills_tools(toolkit: Toolkit) -> Dict[str, Dict]:
    """
    加载 Awesome-finance-skills 中的技能作为工具，并注册自定义金融工具
    返回技能信息字典
    """
    global skill_functions
    
    # 技能信息列表，用于API返回
    skills_info = []
    
    # 通用工具：执行Python代码（谨慎使用）
    toolkit.register_tool_function(execute_python_code)
    
    # 如果安装了agentscope的web搜索工具，可以注册
    try:
        toolkit.register_tool_function(web_search)
        toolkit.register_tool_function(web_digest)
        print("✅ 已注册 web_search 和 web_digest 工具")
    except Exception as e:
        print(f"⚠️  web_search/web_digest 工具注册失败: {e}")
    
    # 添加自定义工具：获取当前时间、计算器等
    import datetime
    import math
    import random
    
    def get_current_time() -> ToolResponse:
        """获取当前日期和时间"""
        content = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return ToolResponse(content=content)
    
    def calculator(expression: str) -> ToolResponse:
        """计算数学表达式，例如：calculator('3 + 5 * 2')"""
        try:
            # 安全限制：只允许数学运算
            allowed_chars = set('0123456789+-*/(). ')
            if any(c not in allowed_chars for c in expression):
                content = "错误：表达式包含不允许的字符"
            else:
                result = eval(expression, {"__builtins__": {}}, {"math": math})
                content = str(result)
        except Exception as e:
            content = f"计算错误: {e}"
        return ToolResponse(content=content)
    
    # ================ 金融相关工具 ================
    
    def fetch_finance_news(keyword: str = "", limit: int = 5) -> ToolResponse:
        """获取财经新闻（模拟数据）"""
        news_list = [
            "央行宣布维持基准利率不变，市场预期稳定",
            "国家统计局公布CPI数据，同比上涨2.1%",
            "国际油价大幅波动，地缘政治因素影响明显",
            "多家上市公司发布业绩预告，超七成预喜",
            "期货市场交易活跃，农产品板块表现突出",
            "黄金价格突破历史高位，避险情绪升温",
            "国务院发布关于促进期货市场发展的指导意见",
            "证监会：加强期货市场监管，防范市场风险"
        ]
        if keyword:
            filtered = [news for news in news_list if keyword in news]
            if not filtered:
                filtered = [f"未找到包含'{keyword}'的新闻，以下为热门新闻"] + news_list[:limit]
            result = filtered[:limit]
        else:
            result = news_list[:limit]
        
        content = "\n".join([f"{i+1}. {news}" for i, news in enumerate(result)])
        return ToolResponse(content=content)
    
    def extract_finance_data(data_type: str = "stock") -> ToolResponse:
        """提取金融数据（模拟）"""
        data_map = {
            "stock": "股票数据：上证指数 3250.12 (+1.2%)，深证成指 11800.45 (+0.8%)",
            "future": "期货数据：螺纹钢主力合约 3800 (+2.1%)，原油主力合约 550.3 (-1.5%)",
            "macro": "宏观数据：GDP增长率预估 5.2%，PMI指数 50.8，CPI同比 2.1%",
            "bond": "债券数据：10年期国债收益率 2.85%，企业债利差收窄"
        }
        content = data_map.get(data_type, "未知数据类型，支持：stock, future, macro, bond")
        return ToolResponse(content=content)
    
    def generate_chart(chart_type: str = "line") -> ToolResponse:
        """生成图表数据（模拟）"""
        chart_data = {
            "line": "生成折线图数据：x轴时间序列，y轴价格数据，显示上升趋势",
            "bar": "生成柱状图数据：对比不同品种收益率，螺纹钢涨幅最大",
            "pie": "生成饼图数据：投资组合占比，股票40%，债券30%，期货20%，现金10%",
            "candle": "生成K线图数据：展示开盘、收盘、最高、最低价，显示市场波动"
        }
        content = chart_data.get(chart_type, "未知图表类型，支持：line, bar, pie, candle")
        return ToolResponse(content=content)
    
    def predict_market_trend(period: str = "short") -> ToolResponse:
        """预测市场趋势（模拟）"""
        predictions = {
            "short": "短期（1周）预测：市场震荡上行概率65%，建议关注技术突破",
            "medium": "中期（1月）预测：基本面支撑较强，上涨概率70%",
            "long": "长期（3月）预测：宏观环境向好，但需注意政策变化风险"
        }
        content = predictions.get(period, "未知周期，支持：short, medium, long")
        return ToolResponse(content=content)
    
    def sentiment_analysis(text: str) -> ToolResponse:
        """情绪分析（模拟）"""
        positive_words = ["上涨", "利好", "增长", "看好", "突破"]
        negative_words = ["下跌", "利空", "下滑", "谨慎", "风险"]
        
        pos_count = sum(1 for word in positive_words if word in text)
        neg_count = sum(1 for word in negative_words if word in text)
        
        if pos_count > neg_count:
            sentiment = f"积极情绪（积极词{pos_count}个，消极词{neg_count}个）"
        elif neg_count > pos_count:
            sentiment = f"消极情绪（积极词{pos_count}个，消极词{neg_count}个）"
        else:
            sentiment = f"中性情绪（积极词{pos_count}个，消极词{neg_count}个）"
        
        content = f"文本情绪分析：{sentiment}\n原文：{text[:100]}..."
        return ToolResponse(content=content)
    
    def backtest_strategy(strategy_rules: str) -> ToolResponse:
        """回测策略（模拟）"""
        content = f"策略回测报告（模拟）：\n策略规则：{strategy_rules[:200]}...\n回测期间：2023-01-01 至 2024-12-31\n总收益率：+15.8%\n最大回撤：-8.2%\n夏普比率：1.35\n胜率：58.6%"
        return ToolResponse(content=content)
    
    def risk_management(position: float, volatility: float = 0.2) -> ToolResponse:
        """风险管理计算（模拟）"""
        var_95 = position * volatility * 1.645
        expected_loss = position * 0.05
        content = f"风险管理报告：\n持仓金额：{position}万元\n波动率：{volatility*100}%\n95%置信度VaR：{var_95:.2f}万元\n预期最大损失：{expected_loss:.2f}万元"
        return ToolResponse(content=content)
    
    def generate_report(report_type: str = "market") -> ToolResponse:
        """生成报告（模拟）"""
        reports = {
            "market": "市场分析报告：当前市场处于震荡上行阶段，建议适度乐观",
            "strategy": "策略报告：推荐趋势跟踪策略，设置动态止损",
            "risk": "风险评估报告：整体风险可控，建议仓位不超过60%",
            "industry": "行业分析报告：农产品期货供需偏紧，关注天气因素"
        }
        content = reports.get(report_type, "未知报告类型，支持：market, strategy, risk, industry")
        return ToolResponse(content=content)
    
    # ================ 技能注册和元数据 ================
    # 定义技能信息（ID对应前端hotSkills的ID）
    skills_metadata = [
        {
            "id": 1,
            "name": "新闻聚合",
            "description": "获取实时财经新闻，支持关键词筛选",
            "function": fetch_finance_news,
            "params": {"keyword": "搜索关键词（可选）", "limit": "返回数量（默认5）"}
        },
        {
            "id": 2,
            "name": "数据提取",
            "description": "提取股票、期货、宏观等金融数据",
            "function": extract_finance_data,
            "params": {"data_type": "数据类型：stock, future, macro, bond"}
        },
        {
            "id": 3,
            "name": "图表生成",
            "description": "生成各类金融图表数据",
            "function": generate_chart,
            "params": {"chart_type": "图表类型：line, bar, pie, candle"}
        },
        {
            "id": 4,
            "name": "预测模型",
            "description": "预测市场短期、中期、长期趋势",
            "function": predict_market_trend,
            "params": {"period": "预测周期：short, medium, long"}
        },
        {
            "id": 5,
            "name": "情绪分析",
            "description": "分析文本中的市场情绪倾向",
            "function": sentiment_analysis,
            "params": {"text": "待分析的文本内容"}
        },
        {
            "id": 6,
            "name": "回测引擎",
            "description": "对交易策略进行历史回测",
            "function": backtest_strategy,
            "params": {"strategy_rules": "策略规则描述"}
        },
        {
            "id": 7,
            "name": "风险管理",
            "description": "计算风险指标和风险管理建议",
            "function": risk_management,
            "params": {"position": "持仓金额（万元）", "volatility": "波动率（默认0.2）"}
        },
        {
            "id": 8,
            "name": "报告生成",
            "description": "生成各类金融分析报告",
            "function": generate_report,
            "params": {"report_type": "报告类型：market, strategy, risk, industry"}
        },
        {
            "id": 9,
            "name": "计算器",
            "description": "执行数学表达式计算",
            "function": calculator,
            "params": {"expression": "数学表达式，如 3 + 5 * 2"}
        },
        {
            "id": 10,
            "name": "当前时间",
            "description": "获取当前日期和时间",
            "function": get_current_time,
            "params": {}
        }
    ]
    
    # 注册所有工具到toolkit
    toolkit.register_tool_function(get_current_time)
    toolkit.register_tool_function(calculator)
    toolkit.register_tool_function(fetch_finance_news)
    toolkit.register_tool_function(extract_finance_data)
    toolkit.register_tool_function(generate_chart)
    toolkit.register_tool_function(predict_market_trend)
    toolkit.register_tool_function(sentiment_analysis)
    toolkit.register_tool_function(backtest_strategy)
    toolkit.register_tool_function(risk_management)
    toolkit.register_tool_function(generate_report)
    
    # 构建技能函数字典，便于直接调用
    skill_functions.clear()
    for skill in skills_metadata:
        skill_name = skill["name"]
        skill_functions[skill_name] = skill
    
    print("✅ 金融工具已加载（包含新闻聚合、数据提取、图表生成、预测模型、情绪分析、回测引擎、风险管理、报告生成）")
    
    return skills_metadata

# ===================== 4. 创建智能体 =====================
async def create_agents() -> Tuple[Dict[str, ReActAgent], List[Dict]]:
    """创建专业智能体并返回智能体字典和技能信息"""
    
    # 初始化工具集
    toolkit = Toolkit()
    skills_info = load_skills_tools(toolkit)
    
    # 创建模型实例
    model = MODEL_CLASS(**MODEL_CONFIG)
    
    # 1. 任务规划智能体
    task_planning_agent = ReActAgent(
        name="任务规划智能体",
        sys_prompt="""
你是安粮期货的专业任务规划师。你的职责是：
1. 分析用户查询，拆解为可执行的任务步骤
2. 确定需要调用哪些专业智能体（信息搜索、品种分析、策略规划、策略回测）
3. 制定详细的任务执行计划和时间预估
4. 协调各智能体协作，确保任务顺利完成

你拥有的工具：
- 执行Python代码（可用于数据分析和处理）
- Web搜索（获取最新市场信息）
- 获取当前时间、计算器等基础工具

请使用渐进式披露的方式与用户沟通：
1. 首先确认用户需求，明确任务目标
2. 其次输出任务拆解步骤和预计执行时间
3. 然后逐步执行每个步骤，及时反馈进度
4. 最后汇总各步骤结果，形成完整报告

当用户提问时，请先分析任务类型，再决定：
- 如果问题简单可直接回答，则直接回答
- 如果需要最新信息，则调用搜索工具
- 如果需要复杂分析，则规划调用其他专业智能体
""",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )
    
    # 2. 信息搜索智能体
    info_search_agent = ReActAgent(
        name="信息搜索智能体",
        sys_prompt="""
你是安粮期货的专业信息搜索师。你的职责是：
1. 搜索最新的金融市场资讯、新闻、公告
2. 查找特定品种的历史数据、基本面信息
3. 获取宏观经济数据、政策变化等
4. 整理搜索结果的摘要和关键点

你拥有的工具：
- Web搜索（获取最新市场信息）
- Web摘要（获取网页主要内容）
- 执行Python代码（用于数据处理）

搜索策略：
1. 优先使用中文搜索引擎获取国内信息
2. 对于国际品种，使用英文搜索引擎
3. 对搜索结果进行可信度评估
4. 注明信息来源和时间戳

当用户提问时，请先判断：
- 如果信息已掌握，直接回答并注明来源
- 如果需要最新信息，立即执行搜索
- 如果信息需要加工分析，调用相应工具
""",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )
    
    # 3. 品种分析智能体
    variety_analysis_agent = ReActAgent(
        name="品种分析智能体",
        sys_prompt="""
你是安粮期货的资深品种分析师。你的职责是：
1. 分析特定期货品种的基本面和技术面
2. 评估品种的供需关系、库存变化
3. 分析价格走势、波动率、相关性
4. 识别关键支撑阻力位、趋势方向
5. 评估品种的风险收益特征

你拥有的工具：
- 执行Python代码（用于技术分析和数据计算）
- 获取当前时间
- 计算器

分析方法：
1. 基本面分析：供应、需求、库存、政策
2. 技术分析：趋势、形态、指标、波浪
3. 量化分析：统计特征、相关性、波动率
4. 风险评估：最大回撤、夏普比率、VAR

当用户提问时，请：
1. 首先确认分析品种和时间周期
2. 然后进行多维度分析
3. 最后给出综合结论和操作建议
""",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )
    
    # 4. 策略规划智能体
    strategy_planning_agent = ReActAgent(
        name="策略规划智能体",
        sys_prompt="""
你是安粮期货的高级策略规划师。你的职责是：
1. 设计期货交易策略（趋势跟踪、均值回归、套利等）
2. 制定具体的入场、出场、止损、止盈规则
3. 确定仓位管理方案和资金管理原则
4. 评估策略的预期收益和风险水平
5. 优化策略参数以适应不同市场环境

你拥有的工具：
- 执行Python代码（用于策略回测和优化）
- 计算器
- 获取当前时间

策略设计原则：
1. 明确策略逻辑和市场假设
2. 设定清晰的交易规则
3. 考虑交易成本和滑点
4. 制定风险管理措施
5. 提供策略的优缺点分析

当用户提问时，请：
1. 首先了解用户的投资目标和风险偏好
2. 然后设计适合的策略方案
3. 详细说明策略逻辑和具体规则
4. 提供策略的历史表现参考（如有）
""",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )
    
    # 5. 策略回测智能体
    backtest_agent = ReActAgent(
        name="策略回测智能体",
        sys_prompt="""
你是安粮期货的专业策略回测师。你的职责是：
1. 对交易策略进行历史数据回测
2. 计算策略的关键绩效指标（收益、回撤、胜率等）
3. 生成回测报告和可视化图表
4. 进行参数优化和稳健性测试
5. 评估策略的过拟合风险和实际可行性

你拥有的工具：
- 执行Python代码（用于回测计算和图表生成）
- 计算器
- 获取当前时间

回测要求：
1. 使用足够长的历史数据（至少3年）
2. 考虑交易成本和滑点
3. 进行样本外测试和交叉验证
4. 分析策略在不同市场环境的表现
5. 识别策略的潜在风险和改进点

当用户提问时，请：
1. 首先获取策略的详细规则
2. 然后收集必要的历史数据
3. 执行回测计算
4. 输出详细的回测报告
5. 提供改进建议
""",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )
    
    # 6. 宏观分析智能体
    macro_analysis_agent = ReActAgent(
        name="宏观分析智能体",
        sys_prompt="""
你是安粮期货的宏观分析师。你的职责是：
1. 分析国内外宏观经济形势和政策变化
2. 跟踪GDP、CPI、PMI、失业率等关键经济指标
3. 评估货币政策、财政政策对期货市场的影响
4. 分析全球主要经济体的联动效应
5. 预测宏观经济趋势及其对各类期货品种的影响

你拥有的工具：
- 执行Python代码（用于数据处理和经济模型分析）
- 获取当前时间
- 计算器
- 财经新闻工具（获取最新经济资讯）

分析方法：
1. 经济周期分析：识别当前经济周期阶段
2. 政策解读：分析政策含义和市场影响
3. 国际比较：对比主要经济体表现
4. 趋势预测：基于历史数据预测未来走向

当用户提问时，请：
1. 首先明确分析的时间范围和地域范围
2. 收集相关经济数据和政策信息
3. 进行多维度宏观分析
4. 给出对期货市场的具体影响分析
""",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )
    
    # 7. 风险评估智能体
    risk_assessment_agent = ReActAgent(
        name="风险评估智能体",
        sys_prompt="""
你是安粮期货的风险评估专家。你的职责是：
1. 识别和评估期货交易中的各类风险
2. 计算投资组合的风险暴露和风险价值（VaR）
3. 评估市场风险、信用风险、流动性风险等
4. 制定风险管理策略和风险控制措施
5. 提供风险调整后的收益分析

你拥有的工具：
- 执行Python代码（用于风险模型计算）
- 计算器
- 获取当前时间
- 风险管理工具（计算VaR、最大回撤等）

风险评估步骤：
1. 风险识别：识别潜在风险源
2. 风险度量：量化风险大小
3. 风险分析：分析风险成因和影响
4. 风险控制：提出风险缓解措施
5. 风险监测：建立风险监控机制

当用户提问时，请：
1. 首先了解投资组合和风险容忍度
2. 评估各类风险的大小和概率
3. 计算关键风险指标
4. 提供风险控制建议
""",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )
    
    # 8. 资金管理智能体
    capital_management_agent = ReActAgent(
        name="资金管理智能体",
        sys_prompt="""
你是安粮期货的资金管理专家。你的职责是：
1. 制定科学的资金分配和仓位管理方案
2. 计算最佳仓位大小和杠杆比例
3. 设计资金回撤控制和止损策略
4. 优化投资组合的资金使用效率
5. 评估资金管理策略的长期效果

你拥有的工具：
- 执行Python代码（用于资金管理模型计算）
- 计算器
- 获取当前时间

资金管理原则：
1. 风险优先：确保资金安全，避免重大亏损
2. 分散投资：合理分配资金到不同品种和策略
3. 动态调整：根据市场变化调整仓位
4. 纪律执行：严格执行资金管理规则

当用户提问时，请：
1. 首先了解用户的总资金量和风险偏好
2. 根据策略特点和市场环境制定资金分配方案
3. 计算具体的仓位大小和止损位置
4. 提供资金管理的具体执行计划
""",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )
    
    # 9. 协调智能体（用于统一处理用户查询）
    coordinator_agent = ReActAgent(
        name="协调智能体",
        sys_prompt="""
你是安粮期货的智能体助手。你的职责是：
1. 接收用户查询，分析查询类型
2. 使用可用的工具来回答问题或完成任务
3. 提供专业、准确的期货投研分析
4. 管理任务执行流程和进度

可用工具列表：
1. fetch_finance_news - 获取财经新闻，支持关键词筛选
2. extract_finance_data - 提取金融数据（股票、期货、宏观、债券）
3. generate_chart - 生成图表数据（折线图、柱状图、饼图、K线图）
4. predict_market_trend - 预测市场趋势（短期、中期、长期）
5. sentiment_analysis - 分析文本中的市场情绪倾向
6. backtest_strategy - 对交易策略进行历史回测
7. risk_management - 计算风险指标和风险管理建议
8. generate_report - 生成各类金融分析报告
9. calculator - 执行数学表达式计算
10. get_current_time - 获取当前日期和时间
11. execute_python_code - 执行Python代码（谨慎使用）

请先分析用户查询，然后：
1. 确定需要哪些工具来完成任务
2. 逐步调用工具，收集必要信息
3. 综合分析结果，形成专业回复
4. 保持回复的专业性和准确性

对于螺纹钢期货的投研任务，你可以：
1. 首先获取螺纹钢相关的最新新闻和市场数据
2. 分析螺纹钢的基本面和技术面
3. 评估市场趋势和风险
4. 提供专业的投研建议
""",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )
    
    agents = {
        "coordinator": coordinator_agent,
        "任务规划": task_planning_agent,
        "信息搜索": info_search_agent,
        "品种分析": variety_analysis_agent,
        "策略规划": strategy_planning_agent,
        "策略回测": backtest_agent,
        "宏观分析": macro_analysis_agent,
        "风险评估": risk_assessment_agent,
        "资金管理": capital_management_agent,
    }
    
    print("✅ 所有智能体创建完成")
    print(f"📊 加载技能数量: {len(skills_info)}")
    return agents, skills_info

# ===================== 5. FastAPI 应用 =====================
agents_pool: Dict[str, ReActAgent] = {}
coordinator_agent: Optional[ReActAgent] = None
skills_info: List[Dict] = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    """管理应用的生命周期，在启动时初始化智能体"""
    global agents_pool, coordinator_agent, skills_info
    agents_pool, skills_info = await create_agents()
    coordinator_agent = agents_pool["coordinator"]
    print("✅ 智能体初始化完成，服务已就绪！")
    print("🤖 可用智能体:", list(agents_pool.keys()))
    print(f"🛠️  可用技能数: {len(skills_info)}")
    yield
    # 这里可以添加关闭时的清理逻辑
    print("🛑 服务正在关闭...")

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件服务，用于提供图片资源
static_dir = os.path.join(os.path.dirname(__file__), 'images')
app.mount("/images", StaticFiles(directory=static_dir), name="images")

@app.get("/")
async def root():
    return {
        "code": 200,
        "message": "安粮期货智能投研系统",
        "version": "1.0.0",
        "agents": list(agents_pool.keys()),
        "endpoints": {
            "POST /api/chat": "通用聊天接口（由协调智能体路由）",
            "POST /api/chat/{agent_name}": "指定智能体聊天接口",
            "GET /api/agents": "获取所有智能体列表",
            "GET /api/skills": "获取所有技能列表",
            "POST /api/skill/{skill_name}": "执行指定技能"
        }
    }

@app.get("/api/agents")
async def list_agents():
    """获取所有智能体列表"""
    agents_info = []
    for name, agent in agents_pool.items():
        agents_info.append({
            "name": name,
            "description": agent.sys_prompt[:100] + "..." if len(agent.sys_prompt) > 100 else agent.sys_prompt,
        })
    return {"code": 200, "data": agents_info}

@app.get("/api/skills")
async def list_skills():
    """获取所有技能列表"""
    # 返回不包含function字段的技能信息，避免序列化问题
    clean_skills = []
    for skill in skills_info:
        skill_copy = skill.copy()
        # 移除function字段（不可序列化）
        skill_copy.pop("function", None)
        clean_skills.append(skill_copy)
    return {"code": 200, "data": clean_skills}

@app.post("/api/skill/{skill_name}")
async def execute_skill(skill_name: str, params: Dict[str, Any] = Body(...)):
    """
    执行指定技能
    """
    global skill_functions
    # 从全局技能字典中查找
    skill_data = skill_functions.get(skill_name)
    if not skill_data:
        raise HTTPException(status_code=404, detail=f"技能 '{skill_name}' 不存在")
    
    try:
        # 获取技能函数
        func = skill_data["function"]
        # 调用函数，传入参数
        result = func(**params)
        # 如果是ToolResponse对象，提取content
        if hasattr(result, 'content'):
            result_content = result.content
        else:
            result_content = result
        return {
            "code": 200,
            "data": {
                "skill": skill_name,
                "description": skill_data.get("description", ""),
                "result": result_content,
                "params": params
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"技能执行出错: {str(e)}")

@app.post("/api/chat")
async def chat(request: Dict[str, Any] = Body(...)):
    """
    通用聊天接口，由协调智能体自动路由到最合适的专业智能体
    """
    # 提取question字段
    question = request.get("question")
    if not question:
        raise HTTPException(status_code=422, detail="缺少必要参数: question")
    
    print(f"CODEBUDDY_DEBUG backend chat called - question={question[:50]}...")
    
    # 检查协调智能体是否已初始化
    global coordinator_agent
    if not coordinator_agent:
        raise HTTPException(status_code=503, detail="协调智能体尚未初始化，请稍后重试")
    
    try:
        print(f"CODEBUDDY_DEBUG backend chat - calling coordinator_agent")
        # 调用协调智能体进行路由和处理
        print(f"DEBUG: Creating Msg with question: {question[:100]}")
        response = await coordinator_agent(Msg(name="user", role="user", content=question))
        print(f"DEBUG: Response type: {type(response)}, response: {response}")
        
        # 使用全局函数提取响应文本
        response_text = extract_text_from_response(response)
        print(f"DEBUG: Extracted response_text: {response_text[:500]}...")
        
        print(f"CODEBUDDY_DEBUG backend chat success - response length={len(response_text)}")
        
        # 从响应中提取建议的智能体（如果协调智能体的系统提示中包含了建议逻辑）
        # 这里可以更复杂地解析响应，提取智能体建议
        suggested_agents = []
        if response_text:
            # 简单的关键词匹配（实际应用中可能需要更智能的解析）
            for agent_name in ["任务规划", "信息搜索", "品种分析", "策略规划", 
                              "策略回测", "宏观分析", "风险评估", "资金管理"]:
                if agent_name in response_text:
                    suggested_agents.append(agent_name)
        
        return {
            "code": 200,
            "data": {
                "answer": response_text if response_text else "智能体未返回有效响应",
                "agent_used": "coordinator",
                "suggested_agents": suggested_agents[:4] if suggested_agents else ["任务规划", "信息搜索", "品种分析", "策略规划"],
                "raw_response": response_text if response_text else ""
            }
        }
    except Exception as e:
        print(f"CODEBUDDY_DEBUG backend chat error - {str(e)}")
        raise HTTPException(status_code=500, detail=f"智能体处理出错: {str(e)}")

@app.post("/api/chat/{agent_name}")
async def chat_with_agent(agent_name: str, question: str = Body(..., embed=True)):
    """
    指定智能体聊天接口
    """
    print(f"CODEBUDDY_DEBUG backend chat_with_agent called - agent_name={agent_name}, question={question}")
    if agent_name not in agents_pool:
        raise HTTPException(status_code=404, detail=f"智能体 '{agent_name}' 不存在")

    try:
        agent = agents_pool[agent_name]
        # 调用智能体，ReActAgent 可能是可调用对象
        print(f"DEBUG: Calling agent {agent_name} with question: {question[:100]}")
        response = await agent(Msg(name="user", role="user", content=question))
        print(f"DEBUG: Response type: {type(response)}, response: {response}")
        
        # 使用全局函数提取响应文本
        response_text = extract_text_from_response(response)
        print(f"DEBUG: Extracted response_text: {response_text[:500]}...")
        
        print(f"CODEBUDDY_DEBUG backend chat_with_agent success - response length={len(response_text)}")
        return {
            "code": 200,
            "data": {
                "answer": response_text,
                "agent_used": agent_name,
            }
        }
    except Exception as e:
        print(f"CODEBUDDY_DEBUG backend chat_with_agent error - {str(e)}")
        raise HTTPException(status_code=500, detail=f"智能体处理出错: {str(e)}")

@app.post("/api/stream_chat")
async def stream_chat(question: str):
    """
    流式聊天接口，支持渐进式披露
    """
    global coordinator_agent
    if not coordinator_agent:
        raise HTTPException(status_code=503, detail="服务正在初始化")
    
    async def generate():
        """生成流式响应"""
        try:
            # 这里简化实现，实际需要根据agentscope的流式响应配置
            # 由于agentscope的流式支持可能有限，这里先返回完整响应
            response = await coordinator_agent(Msg(name="user", role="user", content=question))
            response_text = extract_text_from_response(response)
            yield f"data: {json.dumps({'chunk': response_text})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

# ===================== 6. 启动服务 =====================
if __name__ == "__main__":
    print("=" * 60)
    print("🚀 安粮期货智能投研系统启动")
    print(f"📦 模型提供商: {MODEL_PROVIDER.upper()}")
    print("📡 服务地址: http://127.0.0.1:8000")
    print("📡 接口文档: http://127.0.0.1:8000/docs")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)