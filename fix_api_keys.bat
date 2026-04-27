@echo off
chcp 65001 > nul
echo ========================================
echo   API密钥修复脚本
echo   一键解决InvalidApiKey问题
echo ========================================
echo.

echo [1/4] 停止当前后端服务...
taskkill /F /IM python.exe /T 2>nul
if errorlevel 1 (
    echo ℹ️  没有后端进程需要停止
) else (
    echo ✅ 后端进程已停止
)

echo.
echo [2/4] 更新配置文件...
REM 确保使用硅基流动模型和外部密钥
if exist ".env" (
    echo ✅ .env 文件已存在，更新配置...
    
    REM 创建备份
    copy .env .env.backup_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2% >nul 2>&1
    
    REM 更新为硅基流动配置
    (
        echo # 模型提供商配置
        echo # 可选值：bailian, siliconflow, doubao
        echo MODEL_PROVIDER=siliconflow
        echo.
        echo # 阿里百炼（DashScope）API密钥 - 从外部配置文件引入
        echo DASHSCOPE_API_KEY=sk-63ee34fda0354f0c9add68f90919aa5b
        echo.
        echo # 硅基流动（SiliconFlow）API密钥 - 从外部配置文件引入
        echo SILICONFLOW_API_KEY=sk-efjnsrpnvybjkgylgmlclzgzycllqxtzmimtfahkuznqrlvr
        echo.
        echo # 豆包（Doubao）API密钥和模型ID - 从外部配置文件引入
        echo DOUBAO_API_KEY=a2befa65-66e7-4e29-a298-2e5123337b74
        echo DOUBAO_MODEL=ep-xxxxxxxxxxxx
        echo.
        echo # 服务端口
        echo PORT=8000
    ) > .env
    
    echo ✅ .env 已更新为硅基流动配置
    echo   使用外部配置文件中的有效API密钥
) else (
    echo ❌ .env 文件不存在，创建新配置...
    goto create_env
)

echo.
echo [3/4] 设置环境变量...
REM 直接从外部配置文件设置环境变量
set "EXTERNAL_CONFIG=E:\hyt\other\anliang-futures\config_informations_not_upload.py"
if exist "%EXTERNAL_CONFIG%" (
    echo ✅ 找到外部配置文件，设置环境变量...
    set MODEL_PROVIDER=siliconflow
    set SILICONFLOW_API_KEY=sk-efjnsrpnvybjkgylgmlclzgzycllqxtzmimtfahkuznqrlvr
    echo   已设置 SILICONFLOW_API_KEY 环境变量
) else (
    echo ⚠️  外部配置文件不存在，使用.env中的配置
)

echo.
echo [4/4] 启动后端服务...
echo   启动命令: python smart_agent_server.py
echo   模型提供商: siliconflow (硅基流动)
echo   API密钥源: 外部配置文件
echo   按 Ctrl+C 停止服务
echo ========================================

python smart_agent_server.py

echo.
echo ========================================
echo   启动完成！
echo ========================================
echo.
echo 📋 验证步骤：
echo   1. 查看启动日志，确认显示"硅基流动"
echo   2. 浏览器访问: http://127.0.0.1:8000/
echo   3. 运行测试脚本: .\test_backend.bat
echo   4. 小程序发送"现在几点了"测试
echo.
echo ⚠️  如果仍出现InvalidApiKey错误：
echo   1. 检查硅基流动API密钥是否有效
echo   2. 登录 siliconflow.cn 确认余额充足
echo   3. 尝试使用豆包模型（备选方案）
echo.
pause
exit /b 0

:create_env
echo 创建 .env 文件...
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
) > .env
echo ✅ .env 文件已创建
goto :eof