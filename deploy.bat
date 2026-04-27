@echo off
chcp 65001 > nul
echo ========================================
echo   安粮期货投研系统 - Windows部署脚本
echo ========================================
echo.

REM 检查Python
echo [1/5] 检查Python环境...
python --version > nul 2>&1
if errorlevel 1 (
    echo 错误: Python未安装或未添加到PATH
    echo 请从 https://www.python.org/downloads/ 下载安装Python 3.8+
    echo 安装时请勾选 "Add Python to PATH"
    pause
    exit /b 1
)

python --version

REM 检查是否在项目目录
echo.
echo [2/5] 检查项目文件...
if not exist "smart_agent_server.py" (
    echo 警告: 未找到 smart_agent_server.py
    echo 请确保在项目根目录执行此脚本
    set /p CONTINUE=是否继续？ (y/n): 
    if /i not "%CONTINUE%"=="y" exit /b 1
)

REM 安装依赖
echo.
echo [3/5] 安装Python依赖...
pip install --upgrade pip

if exist "requirements.txt" (
    pip install -r requirements.txt
) else (
    echo 未找到 requirements.txt，安装基础依赖...
    pip install fastapi uvicorn agentscope python-dotenv
)

REM 配置环境
echo.
echo [4/5] 配置环境...
if not exist ".env" (
    if exist ".env.example" (
        echo 复制 .env.example 为 .env
        copy .env.example .env
        echo 请编辑 .env 文件配置API密钥
        echo 用记事本打开: .env
    ) else (
        echo 创建 .env 文件...
        (
            echo # 模型提供商配置
            echo # 可选值：bailian, siliconflow, doubao
            echo MODEL_PROVIDER=bailian
            echo.
            echo # 阿里百炼（DashScope）API密钥
            echo DASHSCOPE_API_KEY=sk-xxxxxxxxxxxx
            echo.
            echo # 硅基流动（SiliconFlow）API密钥
            echo SILICONFLOW_API_KEY=sk-xxxxxxxxxxxx
            echo.
            echo # 豆包（Doubao）API密钥和模型ID
            echo DOUBAO_API_KEY=your-doubao-api-key
            echo DOUBAO_MODEL=ep-xxxxxxxxxxxx
            echo.
            echo # 服务端口
            echo PORT=8000
        ) > .env
        echo 请编辑 .env 文件配置API密钥
    )
)

REM 创建启动脚本
echo.
echo [5/5] 创建启动脚本...
(
    echo @echo off
    echo chcp 65001 ^> nul
    echo echo 启动安粮期货智能投研系统...
    echo echo 端口: 8000
    echo echo.
    echo echo 按 Ctrl+C 停止服务
    echo echo.
    echo python smart_agent_server.py
) > start_server.bat

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 下一步操作：
echo 1. 用记事本编辑 .env 文件，配置API密钥
echo 2. 双击 start_server.bat 启动服务
echo 3. 打开浏览器访问: http://localhost:8000/
echo 4. 修改小程序的 apiBaseUrl 配置
echo.
echo 重要提示：
echo - 生产环境需要部署到服务器，配置HTTPS和域名
echo - 微信小程序必须使用备案域名
echo - Windows防火墙需要开放8000端口
echo.
echo 详细部署说明请查看 README.md 文件
echo.
pause