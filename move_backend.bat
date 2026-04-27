@echo off
chcp 65001 > nul
echo ========================================
echo   后端文件迁移脚本
echo   将后端文件和skills目录移动到独立目录
echo ========================================
echo.

REM 检查当前目录
if not exist "smart_agent_server.py" (
    echo 错误：请在项目根目录运行此脚本
    echo 当前目录：%cd%
    pause
    exit /b 1
)

REM 定义源目录和目标目录
set "SOURCE_DIR=%cd%"
set "TARGET_DIR=%~dp0..\anliang-futures-backend"

echo 项目根目录：%SOURCE_DIR%
echo 目标后端目录：%TARGET_DIR%
echo.

REM 创建目标目录
if not exist "%TARGET_DIR%" (
    mkdir "%TARGET_DIR%"
    echo ✅ 创建目标目录：%TARGET_DIR%
) else (
    echo ✅ 目标目录已存在
)

REM 创建子目录
if not exist "%TARGET_DIR%\skills" mkdir "%TARGET_DIR%\skills"
if not exist "%TARGET_DIR%\scripts" mkdir "%TARGET_DIR%\scripts"

echo.
echo [1/6] 移动Python脚本...
move "agent_funcs.py" "%TARGET_DIR%\" > nul
move "agent_server.py" "%TARGET_DIR%\" > nul
move "smart_agent_server.py" "%TARGET_DIR%\" > nul
move "test_server.py" "%TARGET_DIR%\" > nul
move "test.py" "%TARGET_DIR%\" > nul
echo ✅ Python脚本已移动

echo.
echo [2/6] 移动skills目录...
robocopy "skills" "%TARGET_DIR%\skills" /E /MOVE /NFL /NDL /NJH /NJS /NC /NS /NP
if errorlevel 8 (
    echo ⚠️  skills目录移动可能有问题
) else (
    echo ✅ skills目录已移动
)

echo.
echo [3/6] 移动部署文件...
move "requirements.txt" "%TARGET_DIR%\" > nul
move "deploy.sh" "%TARGET_DIR%\" > nul
move "deploy.bat" "%TARGET_DIR%\" > nul
move ".env.example" "%TARGET_DIR%\" > nul
echo ✅ 部署文件已移动

echo.
echo [4/6] 创建新的部署脚本（小程序侧）...
(
    echo @echo off
    echo chcp 65001 ^> nul
    echo echo ========================================
    echo   安粮期货小程序前端 - 后端启动辅助脚本
    echo ========================================
    echo.
    echo 后端已迁移到独立目录，请使用以下命令启动：
    echo.
    echo 方法1：在后端目录启动
    echo   1. 打开资源管理器，进入：%TARGET_DIR%
    echo   2. 双击 start_server.bat
    echo.
    echo 方法2：命令行启动
    echo   cd /d "%TARGET_DIR%"
    echo   python smart_agent_server.py
    echo.
    echo 方法3：使用部署脚本
    echo   cd /d "%TARGET_DIR%"
    echo   .\deploy.bat
    echo.
    echo 重要提示：
    echo - 后端运行后，API地址通常是：http://127.0.0.1:8000
    echo - 小程序 app.js 中的 apiBaseUrl 需要对应配置
    echo.
    pause
) > start_backend_guide.bat

echo.
echo [5/6] 更新 agent_server.py 中的 skills 路径（如果需要）...
if exist "%TARGET_DIR%\agent_server.py" (
    powershell -Command "(Get-Content '%TARGET_DIR%\agent_server.py') -replace 'SKILLS_BASE = \"./skills/Awesome-finance-skills/skills\"', 'SKILLS_BASE = \"skills/Awesome-finance-skills/skills\"' | Set-Content '%TARGET_DIR%\agent_server.py'"
    echo ✅ 已更新 agent_server.py 中的 SKILLS_BASE 路径
) else (
    echo ℹ️  agent_server.py 不存在，跳过
)

echo.
echo [6/6] 创建快捷方式...
(
    echo @echo off
    echo cd /d "%TARGET_DIR%"
    echo python smart_agent_server.py
) > "%TARGET_DIR%\start_server.bat"

(
    echo @echo off
    echo cd /d "%TARGET_DIR%"
    echo deploy.bat
) > "%TARGET_DIR%\setup.bat"

echo.
echo ========================================
echo   迁移完成！
echo ========================================
echo.
echo 总结：
echo 1. 后端文件已移至：%TARGET_DIR%
echo 2. skills 目录已移至：%TARGET_DIR%\skills
echo 3. 部署脚本已移至后端目录
echo 4. 小程序包体积将显著减少
echo.
echo 下一步操作：
echo 1. 启动后端服务：进入 %TARGET_DIR% 并运行 start_server.bat
echo 2. 验证后端运行：浏览器访问 http://127.0.0.1:8000
echo 3. 重新编译小程序：确保包体积小于 2MB
echo 4. 上传体验版供老板测试
echo.
echo 注意：如果之前已配置 cpolar，需确保后端仍在运行
echo.
pause