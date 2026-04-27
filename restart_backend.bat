@echo off
chcp 65001 > nul
echo ========================================
echo   后端服务重启脚本
echo ========================================
echo.

echo [1/3] 停止现有后端进程...
taskkill /F /IM python.exe /T 2>nul
if errorlevel 1 (
    echo ℹ️  没有Python进程需要停止
) else (
    echo ✅ Python进程已停止
)

echo.
echo [2/3] 验证环境配置...
if exist ".env" (
    echo ✅ .env 文件存在
    echo   内容预览：
    type .env | findstr /V "^#" | findstr /V "^$"
) else (
    echo ❌ .env 文件不存在
    echo   请确保已配置API密钥
    pause
    exit /b 1
)

echo.
echo [3/3] 启动后端服务...
echo   启动命令: python smart_agent_server.py
echo   按 Ctrl+C 停止服务
echo.

python smart_agent_server.py

echo.
echo ⚠️  如果后端启动失败，请检查：
echo   1. .env 文件中的API密钥是否正确
echo   2. Python依赖是否安装: pip install -r requirements.txt
echo   3. 端口8000是否被占用
echo.
pause