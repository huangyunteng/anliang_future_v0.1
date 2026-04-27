@echo off
chcp 65001 > nul
echo ========================================
echo   硅基流动模型启动脚本
echo ========================================
echo.

echo [1/3] 检查环境配置...
if exist ".env" (
    echo ✅ .env 文件存在
    echo   正在修改为硅基流动配置...
    
    REM 备份原配置
    copy .env .env.backup.bailian >nul 2>&1
    
    REM 更新配置为硅基流动
    (
        echo # 模型提供商配置
        echo # 可选值：bailian, siliconflow, doubao
        echo MODEL_PROVIDER=siliconflow
        echo.
        echo # 阿里百炼（DashScope）API密钥
        echo DASHSCOPE_API_KEY=sk-63ee34fda0354f0c9add68f90919aa5b
        echo.
        echo # 硅基流动（SiliconFlow）API密钥
        echo SILICONFLOW_API_KEY=sk-efjnsrpnvybjkgylgmlclzgzycllqxtzmimtfahkuznqrlvr
        echo.
        echo # 豆包（Doubao）API密钥和模型ID
        echo DOUBAO_API_KEY=a2befa65-66e7-4e29-a298-2e5123337b74
        echo DOUBAO_MODEL=ep-xxxxxxxxxxxx
        echo.
        echo # 服务端口
        echo PORT=8000
    ) > .env.siliconflow
    
    copy .env.siliconflow .env >nul
    echo ✅ 已切换为硅基流动模型
) else (
    echo ❌ .env 文件不存在
    pause
    exit /b 1
)

echo.
echo [2/3] 停止现有后端进程...
taskkill /F /IM python.exe /T 2>nul
if errorlevel 1 (
    echo ℹ️  没有Python进程需要停止
) else (
    echo ✅ Python进程已停止
)

echo.
echo [3/3] 启动硅基流动后端服务...
echo   启动命令: python smart_agent_server.py
echo   模型提供商: siliconflow (硅基流动)
echo   按 Ctrl+C 停止服务
echo.

set MODEL_PROVIDER=siliconflow
python smart_agent_server.py

echo.
echo ⚠️  如果启动失败，请检查：
echo   1. 硅基流动API密钥是否正确且余额充足
echo   2. 网络是否可访问 api.siliconflow.cn
echo   3. 默认模型: deepseek-ai/DeepSeek-V3 (可修改)
echo.
echo ℹ️  如需切换回百炼模型:
echo   copy .env.backup.bailian .env
echo   python smart_agent_server.py
echo.
pause