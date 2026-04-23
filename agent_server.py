import os
import agentscope as asc
from agentscope.models import OpenAIChatWrapper, DashScopeChatWrapper
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# ===================== 模型配置 =====================
# 支持三种模型提供商: "bailian", "siliconflow", "doubao"
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "siliconflow").lower()

# 配置信息（不含 model_type，因为我们要手动创建 wrapper）
CONFIG_DATA = {
    "bailian": {
        "wrapper_class": DashScopeChatWrapper,
        "kwargs": {
            "config_name": "qwen",
            "api_key": os.getenv("DASHSCOPE_API_KEY", "sk-c722d4d16f9c4fca9e7b8e8401603a29"),
            "model_name": "qwen-plus",  # 或 qwen-turbo, qwen-max
            "generate_args": {"temperature": 0.7, "max_tokens": 4096},
        }
    },
    "siliconflow": {
        "wrapper_class": OpenAIChatWrapper,
        "kwargs": {
            "config_name": "siliconflow",
            "api_key": os.getenv("SILICONFLOW_API_KEY", "sk-xxxxxxxxxxxx"),
            "base_url": "https://api.siliconflow.cn/v1",
            "model_name": "deepseek-ai/DeepSeek-V3",
            "generate_args": {"temperature": 0.7, "max_tokens": 4096},
        }
    },
    "doubao": {
        "wrapper_class": OpenAIChatWrapper,
        "kwargs": {
            "config_name": "doubao",
            "api_key": os.getenv("DOUBAO_API_KEY", "your-doubao-api-key"),
            "base_url": "https://ark.cn-beijing.volces.com/api/v3",
            "model_name": os.getenv("DOUBAO_MODEL", "ep-xxxxxxxxxxxx"),
            "generate_args": {"temperature": 0.7, "max_tokens": 4096},
        }
    },
}

if MODEL_PROVIDER not in CONFIG_DATA:
    raise ValueError(f"不支持的模型提供商: {MODEL_PROVIDER}，可选: {list(CONFIG_DATA.keys())}")

config = CONFIG_DATA[MODEL_PROVIDER]
print(f"✅ 当前使用的模型提供商: {MODEL_PROVIDER.upper()}")

# ===================== 初始化 AgentScope（不传模型配置）=====================
asc.init(name="安粮期货-专业金融投研", save_log=False)

# ===================== 手动创建模型实例 =====================
model = config["wrapper_class"](**config["kwargs"])

# ===================== 加载 Skill =====================
SKILLS_BASE = "./skills/Awesome-finance-skills/skills"

def load_skill_prompt(skill_dir_name: str) -> str:
    skill_path = os.path.join(SKILLS_BASE, skill_dir_name, "SKILL.md")
    if not os.path.exists(skill_path):
        return f"⚠️ Skill {skill_dir_name} 未找到 SKILL.md"
    with open(skill_path, "r", encoding="utf-8") as f:
        return f.read()

skills_for_agents = {
    "future": ["alphaear-stock", "alphaear-predictor", "alphaear-sentiment"],
    "reporter": ["alphaear-news", "alphaear-reporter", "alphaear-stock"],
    "sentiment": ["alphaear-sentiment", "alphaear-news", "alphaear-predictor"],
}

skill_contents = {}
for agent_name, skill_list in skills_for_agents.items():
    for skill_dir in skill_list:
        if skill_dir not in skill_contents:
            skill_contents[skill_dir] = load_skill_prompt(skill_dir)

# ===================== 创建智能体（显式传入 model）=====================
def build_agent(agent_name: str, skill_dirs: list):
    combined_skill_text = "\n\n".join(
        f"## {skill_dir}\n{skill_contents[skill_dir]}" for skill_dir in skill_dirs
    )
    system_prompt = f"""你是安粮期货的资深投研专家。
你拥有以下专业技能，请严格按照每个技能描述的规则执行：

{combined_skill_text}

当用户提出问题时，请遵循上述技能的步骤拆解、调用对应工具（如果有），最后输出完整的分析报告。
"""
    return asc.DialogAgent(
        name=agent_name,
        system_prompt=system_prompt,
        model=model,  # 关键：直接传入 model 实例，不依赖全局配置
    )

agent_future = build_agent("期货分析师", skills_for_agents["future"])
agent_reporter = build_agent("研报专员", skills_for_agents["reporter"])
agent_sentiment = build_agent("情绪监控", skills_for_agents["sentiment"])

# ===================== 执行投研流程 =====================
def run_research(agent, question: str):
    result = agent(question)
    answer = result.content if hasattr(result, "content") else str(result)
    return f"""
📊 安粮期货 · 专业投研结果
问题：{question}

{answer}

⚠ 风险提示：投资有风险，入市需谨慎
"""

# ===================== FastAPI =====================
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

agent_map = {
    "future": agent_future,
    "reporter": agent_reporter,
    "sentiment": agent_sentiment,
}

@app.post("/api/research")
def api_research(agent_name: str, question: str):
    if agent_name not in agent_map:
        return {"code": 404, "msg": "智能体不存在"}
    try:
        report = run_research(agent_map[agent_name], question)
        return {"code": 200, "data": report}
    except Exception as e:
        return {"code": 500, "msg": str(e)}

# ===================== 启动 =====================
if __name__ == "__main__":
    print("="*60)
    print(f"🚀 安粮期货后端启动 | 模型提供商: {MODEL_PROVIDER.upper()}")
    print(f"📦 已加载 skills: {list(skill_contents.keys())}")
    print(f"🤖 智能体: {list(agent_map.keys())}")
    print("📡 接口: http://127.0.0.1:8000/api/research")
    print("="*60)
    uvicorn.run(app, host="0.0.0.0", port=8000)