#!/bin/bash

# 安粮期货投研系统 - 一键部署脚本
# 适用于 Linux 服务器（Ubuntu/CentOS）

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  安粮期货投研系统部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查Python版本
echo -e "${YELLOW}[1/6] 检查Python环境...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}错误: Python3 未安装${NC}"
    echo "请先安装 Python 3.8+:"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install python3 python3-pip"
    echo "  CentOS/RHEL: sudo yum install python3 python3-pip"
    exit 1
fi

python_version=$(python3 --version | cut -d' ' -f2)
echo "Python 版本: $python_version"

# 检查是否在项目目录
if [ ! -f "smart_agent_server.py" ]; then
    echo -e "${YELLOW}警告: 未找到 smart_agent_server.py，确保在项目根目录执行${NC}"
    read -p "是否继续？ (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 安装依赖
echo -e "${YELLOW}[2/6] 安装Python依赖...${NC}"
pip3 install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
else
    echo -e "${YELLOW}未找到 requirements.txt，安装基础依赖...${NC}"
    pip3 install fastapi uvicorn agentscope python-dotenv
fi

# 配置环境
echo -e "${YELLOW}[3/6] 配置环境...${NC}"

# 外部配置文件路径（项目目录的父目录）
CONFIG_FILE="../config_informations_not_upload.py"

# 从Python配置文件中提取API密钥的函数
extract_api_key() {
    local key_name=$1
    local config_file=$2
    
    if [ ! -f "$config_file" ]; then
        echo ""
        return 1
    fi
    
    # 使用Python安全地提取配置值
    python3 -c "
import re
import sys

try:
    with open('$config_file', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 匹配 key = \"value\" 或 key=\"value\" 格式
    pattern = r'${key_name}\s*=\s*[\"\\']([^\"\\']*)[\"\\']'
    match = re.search(pattern, content)
    
    if match:
        print(match.group(1))
    else:
        print('')
except Exception as e:
    print('')
" 2>/dev/null
}

# 检查是否存在外部配置文件
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${GREEN}✓ 发现外部配置文件: $CONFIG_FILE${NC}"
    echo -e "${YELLOW}正在提取API密钥...${NC}"
    
    # 提取各个API密钥
    DASHSCOPE_KEY=$(extract_api_key "DASHSCOPE_API_KEY" "$CONFIG_FILE")
    SILICONFLOW_KEY=$(extract_api_key "SILICONFLOW_API_KEY" "$CONFIG_FILE")
    DOUBAO_KEY=$(extract_api_key "DOUBAO_API_KEY" "$CONFIG_FILE")
    
    # 检查是否提取成功
    if [ -n "$DASHSCOPE_KEY" ]; then
        echo -e "${GREEN}✓ 阿里百炼API密钥提取成功${NC}"
    else
        echo -e "${YELLOW}⚠ 阿里百炼API密钥未找到${NC}"
    fi
    
    if [ -n "$SILICONFLOW_KEY" ]; then
        echo -e "${GREEN}✓ 硅基流动API密钥提取成功${NC}"
    else
        echo -e "${YELLOW}⚠ 硅基流动API密钥未找到${NC}"
    fi
    
    if [ -n "$DOUBAO_KEY" ]; then
        echo -e "${GREEN}✓ 豆包API密钥提取成功${NC}"
    else
        echo -e "${YELLOW}⚠ 豆包API密钥未找到${NC}"
    fi
else
    echo -e "${YELLOW}⚠ 未找到外部配置文件: $CONFIG_FILE${NC}"
    echo -e "${YELLOW}将使用默认占位符，请后续手动编辑 .env 文件${NC}"
    DASHSCOPE_KEY="sk-xxxxxxxxxxxx"
    SILICONFLOW_KEY="sk-xxxxxxxxxxxx"
    DOUBAO_KEY="your-doubao-api-key"
fi

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}复制 .env.example 为 .env${NC}"
        cp .env.example .env
        echo -e "${YELLOW}请编辑 .env 文件配置API密钥:${NC}"
        echo "  vi .env 或 nano .env"
        echo "  需要配置 MODEL_PROVIDER 和对应API密钥"
    else
        echo -e "${YELLOW}创建 .env 文件${NC}"
        cat > .env << EOF
# 模型提供商配置
# 可选值：bailian, siliconflow, doubao
MODEL_PROVIDER=bailian

# 阿里百炼（DashScope）API密钥
DASHSCOPE_API_KEY=${DASHSCOPE_KEY}

# 硅基流动（SiliconFlow）API密钥
SILICONFLOW_API_KEY=${SILICONFLOW_KEY}

# 豆包（Doubao）API密钥和模型ID
DOUBAO_API_KEY=${DOUBAO_KEY}
DOUBAO_MODEL=ep-xxxxxxxxxxxx

# 服务端口
PORT=8000
EOF
        
        if [ -f "$CONFIG_FILE" ]; then
            echo -e "${GREEN}✓ .env 文件已自动创建，API密钥已从外部配置文件导入${NC}"
        else
            echo -e "${YELLOW}请编辑 .env 文件配置API密钥${NC}"
            echo -e "${YELLOW}注意：当前使用的是占位符，需要替换为真实的API密钥${NC}"
        fi
    fi
else
    echo -e "${GREEN}✓ .env 文件已存在，跳过创建${NC}"
    echo -e "${YELLOW}如需更新API密钥，请手动编辑 .env 文件${NC}"
fi

# 创建服务管理脚本
echo -e "${YELLOW}[4/6] 创建服务管理脚本...${NC}"
cat > start_server.sh << 'EOF'
#!/bin/bash
# 启动脚本

set -e

# 加载环境变量
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# 设置端口
PORT=${PORT:-8000}

echo "启动安粮期货智能投研系统..."
echo "端口: $PORT"
echo "模型提供商: ${MODEL_PROVIDER:-未设置}"

python smart_agent_server.py
EOF

chmod +x start_server.sh

# 创建PM2配置文件（如果可用）
if command -v pm2 &> /dev/null || command -v npm &> /dev/null; then
    echo -e "${YELLOW}[5/6] 创建PM2配置...${NC}"
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'anliang-agent',
    script: 'smart_agent_server.py',
    interpreter: 'python3',
    env: {
      NODE_ENV: 'production',
    },
    env_production: {
      NODE_ENV: 'production',
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    merge_logs: true,
    max_memory_restart: '500M',
    instances: 1,
    autorestart: true,
    watch: false,
  }]
};
EOF
    
    echo -e "${GREEN}PM2 配置文件已创建${NC}"
    echo "启动命令: pm2 start ecosystem.config.js --env production"
    echo "查看日志: pm2 logs anliang-agent"
fi

# 创建systemd服务（可选）
echo -e "${YELLOW}[6/6] 创建systemd服务配置（可选）...${NC}"
if [ "$EUID" -eq 0 ]; then
    cat > /etc/systemd/system/anliang-agent.service << EOF
[Unit]
Description=Anliang Futures AI Agent Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
EnvironmentFile=$(pwd)/.env
ExecStart=/usr/bin/python3 $(pwd)/smart_agent_server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    echo -e "${GREEN}systemd 服务已创建${NC}"
    echo "启用服务: sudo systemctl enable anliang-agent"
    echo "启动服务: sudo systemctl start anliang-agent"
else
    echo -e "${YELLOW}需要root权限创建systemd服务${NC}"
    echo "可以手动创建: sudo nano /etc/systemd/system/anliang-agent.service"
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}下一步操作:${NC}"
echo "1. 编辑 .env 文件配置API密钥"
echo "2. 启动服务:"
echo "   - 简单启动: ./start_server.sh"
echo "   - PM2启动: pm2 start ecosystem.config.js"
echo "   - systemd: sudo systemctl start anliang-agent"
echo "3. 检查服务: curl http://localhost:8000/"
echo "4. 配置小程序中的 apiBaseUrl"
echo ""
echo -e "${YELLOW}重要提示:${NC}"
echo "- 生产环境需要配置HTTPS和域名"
echo "- 微信小程序必须使用备案域名"
echo "- 配置防火墙开放8000端口（或通过Nginx转发）"
echo "- 查看部署文档: cat README.md | less"
echo ""
echo -e "${GREEN}祝您使用愉快！${NC}"