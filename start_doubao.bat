@echo off
chcp 65001 >nul
echo 🚀 启动安粮期货后端服务（豆包大模型）...

REM 从配置文件读取豆包API Key（不硬编码在代码中）
FOR /F "tokens=2 delims==" %%a IN ('findstr "DOUBAO_API_KEY" "E:\hyt\other\anliang-futures\config_informations_not_upload.py"') DO (
    set DOUBAO_API_KEY=%%a
    goto :found
)

:found
set DOUBAO_API_KEY=%DOUBAO_API_KEY: =%
set DOUBAO_API_KEY=%DOUBAO_API_KEY:"=%

echo 📦 模型提供商: 豆包(Doubao)
echo 🔑 API Key: %DOUBAO_API_KEY:~0,8%****

REM 设置豆包模型端点ID（从火山引擎控制台获取）
set DOUBAO_MODEL=ep-20250112102620-xxx

set MODEL_PROVIDER=doubao

echo 🤖 模型端点: %DOUBAO_MODEL%
echo 📡 接口: http://127.0.0.1:8000/api/chat
echo ============================================

python agent_server.py
pause
