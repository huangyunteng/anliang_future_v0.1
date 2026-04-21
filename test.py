import os
import asyncio
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agentscope import init
from agentscope.agent import ReActAgent
from agentscope.model import DashScopeChatModel, OpenAIChatModel
from agentscope.formatter import DashScopeChatFormatter
from agentscope.memory import InMemoryMemory
from agentscope.tool import Toolkit, execute_python_code

# ===================== 1. 模型配置区 =====================
# 通过设置环境变量 MODEL_PROVIDER 来切换模型，可选值：bailian, siliconflow, doubao
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "bailian").lower()

if MODEL_PROVIDER == "bailian":
    # 阿里百炼配置
    MODEL_CLASS = DashScopeChatModel
    MODEL_CONFIG = {
        "model_name": "qwen-max",  # 可选: qwen-max, qwen-plus, qwen-turbo
        "api_key": os.getenv("DASHSCOPE_API_KEY", "your-dashscope-api-key"),
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
init(name="安粮期货-专业金融投研", save_log=False)

# ===================== 3. 加载 Awesome-finance-skills =====================
# 请注意，此处仅为示例，你需要实现具体的技能加载逻辑
def load_skills_as_tools(toolkit: Toolkit):
    """将你的 skills 注册为 Agent 的工具"""
    # 假设你的技能都可以通过执行 Python 代码来完成
    toolkit.register_tool_function(execute_python_code)

# ===================== 4. 创建 Agent =====================
async def main():
    # 初始化 Toolkit 并注册你的技能
    toolkit = Toolkit()
    load_skills_as_tools(toolkit)

    # 创建模型实例
    model = MODEL_CLASS(**MODEL_CONFIG)

    # 创建 ReAct Agent
    agent = ReActAgent(
        name="安粮期货投研助手",
        sys_prompt="你是一个专业的金融投研助手，拥有数据分析、研报生成和情绪监控等技能。",
        model=model,
        formatter=FORMATTER,
        memory=InMemoryMemory(),
        toolkit=toolkit,
    )

    return agent

# ===================== 5. FastAPI 应用 =====================
agent_instance = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """管理应用的生命周期，在启动时初始化 Agent"""
    global agent_instance
    agent_instance = await main()
    print("✅ Agent 初始化完成，服务已就绪！")
    yield
    # 这里可以添加关闭时的清理逻辑
    print("🛑 服务正在关闭...")

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/api/chat")
async def chat(question: str):
    """
    小程序调用的聊天接口
    """
    global agent_instance
    if not agent_instance:
        return {"code": 503, "message": "服务正在初始化，请稍后再试"}
    try:
        # 执行 Agent 的推理逻辑
        response = await agent_instance.ask(question)
        return {"code": 200, "data": response.text}
    except Exception as e:
        return {"code": 500, "message": str(e)}

# ===================== 6. 启动服务 =====================
if __name__ == "__main__":
    print("="*60)
    print("🚀 安粮期货后端启动")
    print("="*60)
    uvicorn.run(app, host="0.0.0.0", port=8000)