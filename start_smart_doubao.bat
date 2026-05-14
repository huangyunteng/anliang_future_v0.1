@echo off
chcp 65001 >nul
echo =============================================
echo   安粮期货智能投研系统 - 模型切换已简化！
echo =============================================
echo.

REM 启动后端服务（配置在 config_informations_not_upload.py 中统一管理）
python smart_agent_server.py
pause
