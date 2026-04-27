@echo off
chcp 65001 > nul
echo ========================================
echo   后端服务测试脚本
echo ========================================
echo.

echo [1/4] 检查Python进程...
tasklist | findstr /I "python"
if errorlevel 1 (
    echo ❌ 没有Python进程在运行
) else (
    echo ✅ 有Python进程在运行
)

echo.
echo [2/4] 检查端口8000...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if errorlevel 1 (
    echo ❌ 端口8000没有被监听
) else (
    echo ✅ 端口8000已被监听
    echo   进程信息：
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
        tasklist /FI "PID eq %%a" 2>nul
    )
)

echo.
echo [3/4] 测试本地连接...
curl -s -o test_response.txt -w "状态码: %%{http_code} 时间: %%{time_total}s\n" http://127.0.0.1:8000/
if errorlevel 1 (
    echo ❌ 无法连接到本地后端 (127.0.0.1:8000)
) else (
    echo ✅ 本地连接成功
    echo   响应内容：
    type test_response.txt
    del test_response.txt 2>nul
)

echo.
echo [4/4] 测试API聊天接口...
echo   发送测试请求："现在几点了"
python -c "
import requests
import json
import sys

try:
    response = requests.post(
        'http://127.0.0.1:8000/api/chat',
        json={'question': '现在几点了'},
        timeout=10
    )
    print(f'状态码: {response.status_code}')
    if response.status_code == 200:
        data = response.json()
        print(f'✅ 成功: {json.dumps(data, ensure_ascii=False, indent=2)}')
    else:
        print(f'❌ 错误响应: {response.text[:500]}...')
except Exception as e:
    print(f'❌ 请求失败: {str(e)}')
" 2>&1

echo.
echo ========================================
echo   诊断结果：
echo.
echo 如果 ❌ 本地连接失败：
echo   1. 确保Python后端已启动：python smart_agent_server.py
echo   2. 检查防火墙是否允许端口8000
echo.
echo 如果 ❌ API返回非200状态：
echo   1. 检查API密钥是否正确（当前使用百炼模型）
echo   2. 尝试切换到硅基流动模型：.\start_siliconflow.bat
echo   3. 检查网络是否可访问相应API服务
echo.
echo 如果 ✅ 所有测试通过：
echo   1. cpolar隧道应正常工作
echo   2. 小程序应能正常访问
echo.
pause