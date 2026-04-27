# 安粮期货投研智演实验室 - 微信小程序

## 项目概述

本项目是一个专业的期货投研智能助手微信小程序，集成AI智能体系统，提供期货分析、策略设计、资讯查询、风险管理等功能。

### 技术栈
- **前端**：微信小程序（WXML/WXSS/JavaScript）
- **后端**：Python FastAPI + AgentScope（多智能体协调）
- **AI服务**：支持阿里百炼、硅基流动、豆包等多种模型

## 快速开始

### 1. 开发环境配置
```bash
# 克隆项目
git clone <repository-url>
cd miniprogram-mpv-01

# 前端依赖（微信小程序工具）
# 安装微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

# 后端依赖
cd <项目目录>
pip install -r requirements.txt  # 如有requirements.txt文件
# 或手动安装：
pip install fastapi uvicorn agentscope python-dotenv
```

### 2. 本地开发测试
1. 启动后端服务：
```bash
python smart_agent_server.py
```
服务将运行在：http://127.0.0.1:8000

2. 打开微信开发者工具，导入本项目

3. 在 `app.js` 中确认 `apiBaseUrl` 为 `http://127.0.0.1:8000`

4. 点击编译，开始测试

## 快速测试方案（让老板远程体验）

如果您想让老板快速体验产品功能，但又来不及部署正式服务器，可以使用以下方案：

### 方案一：内网穿透（推荐）
1. **安装内网穿透工具**（如 ngrok、frp、花生壳等）
```bash
# 使用 ngrok (需要注册账号)
ngrok http 8000
```
2. **获取公网地址**，如：`https://abc123.ngrok.io`
3. **修改小程序配置**：
```javascript
// 在 app.js 中修改 apiBaseUrl
apiBaseUrl: 'https://abc123.ngrok.io',
```
4. **让老板扫描体验版二维码**即可测试

### 方案二：云服务器临时部署
1. **购买云服务器**（按小时计费，测试后释放）
   - 腾讯云/阿里云轻量应用服务器
   - 选择1核2G配置即可
2. **快速部署脚本**：
```bash
# 登录服务器后执行
git clone <您的仓库地址>
cd miniprogram-mpv-01
pip install -r requirements.txt
python smart_agent_server.py &
```
3. **配置安全组**：开放8000端口
4. **使用服务器公网IP**配置小程序

### 方案三：微信开发者工具远程调试
1. **开启"不校验合法域名"**选项
   - 微信开发者工具 → 详情 → 本地设置
   - 勾选"不校验合法域名、web-view域名、TLS版本以及HTTPS证书"
2. **使用体验版测试**，但注意：
   - 正式用户无法使用此选项
   - 仅适合内部测试

### 注意事项
1. **HTTPS要求**：微信小程序必须使用HTTPS，内网穿透工具通常提供
2. **时效性**：ngrok免费版地址每2小时变化，适合短期测试
3. **性能限制**：临时方案可能有性能限制，复杂查询请预留足够时间

## 生产环境部署

### 1. 后端服务器部署

#### 服务器要求
- Linux/Windows 服务器
- Python 3.8+
- 公网IP或域名
- HTTPS证书（小程序强制要求）

#### 部署步骤
```bash
# 1. 上传代码到服务器
scp -r miniprogram-mpv-01/ user@your-server:/path/to/

# 2. 安装依赖
cd /path/to/miniprogram-mpv-01
pip install fastapi uvicorn agentscope python-dotenv

# 3. 配置环境变量
cp .env.example .env
# 编辑.env文件，填写您的API密钥
vi .env

# 4. 配置AI模型（选择一种）
# 修改 smart_agent_server.py 中的 MODEL_PROVIDER
# 可选：bailian（阿里百炼）、siliconflow（硅基流动）、doubao（豆包）

# 5. 使用PM2或Supervisor管理进程（推荐）
# 使用PM2：
npm install -g pm2
pm2 start smart_agent_server.py --name "anliang-agent" --interpreter python

# 或使用nohup：
nohup python smart_agent_server.py > server.log 2>&1 &
```

#### 使用Docker部署（可选）
```dockerfile
FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn agentscope python-dotenv
EXPOSE 8000
CMD ["python", "smart_agent_server.py"]
```

### 2. 小程序前端部署

#### 修改配置
1. 打开 `app.js`，找到 `apiBaseUrl` 配置
2. 将开发环境配置注释，启用生产环境配置：
```javascript
// 开发环境（本地测试）
// apiBaseUrl: 'http://127.0.0.1:8000',

// 生产环境（线上部署）- 取消下面一行注释并填写您的服务器地址
apiBaseUrl: 'https://your-domain.com/api',
```
3. 确保URL以 `https://` 开头，微信小程序要求HTTPS

#### 微信小程序配置
1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入「开发」->「开发管理」->「开发设置」
3. 在「服务器域名」中配置：
   - request合法域名：`https://your-domain.com`
   - uploadFile合法域名：`https://your-domain.com`
   - downloadFile合法域名：`https://your-domain.com`
4. 如果使用WebSocket，还需配置socket合法域名

#### 上传发布
1. 在微信开发者工具中，点击「上传」
2. 填写版本号和项目备注
3. 在微信公众平台提交审核
4. 审核通过后发布

### 3. 域名和HTTPS配置

#### 必需配置
1. **域名备案**：国内服务器必须完成ICP备案
2. **SSL证书**：申请免费证书（Let's Encrypt）或购买商业证书
3. **Nginx配置**（推荐）：
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 环境配置详解

### 1. `.env` 配置文件
```bash
# 模型提供商配置
MODEL_PROVIDER=bailian  # 可选：bailian, siliconflow, doubao

# 阿里百炼（DashScope）API密钥
DASHSCOPE_API_KEY=sk-your-key-here

# 硅基流动（SiliconFlow）API密钥
SILICONFLOW_API_KEY=sk-your-key-here

# 豆包（Doubao）API密钥和模型ID
DOUBAO_API_KEY=your-doubao-api-key
DOUBAO_MODEL=ep-your-model-id
```

### 2. AI服务选择
- **阿里百炼**：国内稳定，适合中文场景
- **硅基流动**：支持多种开源模型
- **豆包**：字节跳动出品，性能优秀

## 测试验证

### 1. 后端服务健康检查
```bash
curl https://your-domain.com/
```
应返回：
```json
{
  "code": 200,
  "message": "安粮期货智能投研系统",
  "version": "1.0.0"
}
```

### 2. 小程序测试流程
1. 扫描体验版二维码
2. 进入AI智能体页面
3. 输入测试问题："当前时间"
4. 检查能否正常获取响应

### 3. 完整功能测试
1. **智能体协调**：提问复杂问题，如"请帮我规划螺纹钢期货投研任务"
2. **工具调用**：测试各金融工具功能
3. **性能测试**：确保960秒超时配置足够

## 故障排除

### 常见问题

#### 1. 网络请求失败
- 检查 `apiBaseUrl` 配置
- 确认服务器防火墙开放8000端口
- 验证HTTPS证书有效性

#### 2. AI服务无响应
- 检查 `.env` 文件中的API密钥
- 确认模型提供商服务可用
- 查看服务器日志：`tail -f server.log`

#### 3. 小程序审核被拒
- 确保内容符合微信平台规范
- 添加用户隐私协议页面
- 配置 `privacy.json` 文件

#### 4. 性能问题
- 复杂查询可能需要数分钟完成
- 超时时间已设置为960秒（16分钟）
- 考虑优化后端智能体调用逻辑

## 联系方式

- 技术问题：请查看服务日志或联系开发团队
- 业务咨询：安粮期货相关部门

## 版本历史

### v1.0.0 (2024-12-01)
- 初始版本发布
- 集成多智能体投研系统
- 支持期货分析、策略设计等功能

---

**重要提醒**：生产环境部署前，请确保：
1. 服务器安全配置完成
2. 数据备份机制就绪
3. 监控告警系统配置
4. 应急响应预案准备