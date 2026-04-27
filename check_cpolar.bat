@echo off
chcp 65001 > nul
echo ========================================
echo   cpolar 连接诊断脚本
echo ========================================
echo.

echo [1/5] 检查后端服务...
netstat -ano | findstr ":8000" > nul
if errorlevel 1 (
    echo ❌ 后端服务未在端口 8000 运行
    echo   请启动：python smart_agent_server.py
) else (
    echo ✅ 端口 8000 已被占用（后端服务运行中）
    
    netstat -ano | findstr ":8000"
    
    REM 检查是否为 Python 进程
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
        set "pid=%%a"
        echo 进程PID: %%a
        
        tasklist /FI "PID eq %%a" 2>nul | findstr /I "python"
        if errorlevel 1 (
            echo ⚠️  端口 8000 被其他进程占用（PID: %%a）
        ) else (
            echo ✅ 端口 8000 被 Python 进程占用（后端服务正常）
        )
    )
)

echo.
echo [2/5] 测试本地后端访问...
curl -s -o NUL -w "状态码: %%{http_code}\n响应长度: %%{size_download}字节\n" http://127.0.0.1:8000/
if errorlevel 1 (
    echo ❌ 无法访问本地后端 (127.0.0.1:8000)
    echo   请确保后端服务正在运行
) else (
    echo ✅ 本地后端访问正常
)

echo.
echo [3/5] 检查 cpolar 进程...
tasklist | findstr /I "cpolar"
if errorlevel 1 (
    echo ❌ cpolar 进程未运行
    echo   请启动：cpolar http 8000
    echo.
    echo   如果您没有安装 cpolar：
    echo   1. 访问 https://www.cpolar.com/download 下载
    echo   2. 安装后注册账号获取 authtoken
    echo   3. 运行：cpolar authtoken <您的token>
    echo   4. 运行：cpolar http 8000
) else (
    echo ✅ cpolar 进程正在运行
    
    REM 检查 cpolar 状态
    echo.
    echo ℹ️  检查 cpolar 隧道状态：
    timeout /t 2 > nul
    echo   可能需要查看命令窗口输出，获取隧道地址
)

echo.
echo [4/5] 获取本机IP地址（LAN访问备用）...
ipconfig | findstr "IPv4"
echo.

REM 显示可能的局域网IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set "ip=%%a"
    set "ip=!ip:~1!"
    echo 可用局域网地址：!ip!
)

echo.
echo [5/5] 综合诊断建议：
echo.
echo 🔍 问题分析：
echo   浏览器访问 https://6ffc7d06.r40.cpolar.top/ 返回 404
echo   可能原因：
echo   1. cpolar 隧道未正确建立
echo   2. cpolar 地址已过期（每次重启变化）
echo   3. 后端服务未运行或监听错误
echo   4. cpolar 配置错误
echo.
echo 🛠️  解决方案：
echo.
echo 方案A：重启 cpolar
echo   1. 关闭所有 cpolar 窗口
echo   2. 新开CMD运行：cpolar http 8000
echo   3. 复制新的隧道地址（如 https://xxxxx.cpolar.top）
echo   4. 更新 app.js 中的 apiBaseUrl
echo.
echo 方案B：使用局域网IP测试
echo   1. 修改 app.js：apiBaseUrl: 'http://YOUR_LOCAL_IP:8000'
echo   2. 手机和电脑连接同一WiFi
echo   3. 关闭微信开发者工具「不校验合法域名」
echo   4. 手机扫码测试
echo.
echo 方案C：临时本地测试
echo   1. 修改 app.js：apiBaseUrl: 'http://127.0.0.1:8000'
echo   2. 在开发者工具中直接测试功能
echo   3. 确认后端正常工作后，再配置远程访问
echo.
echo 📱 手机测试步骤：
echo   1. 确保后端运行：python smart_agent_server.py
echo   2. 确保 cpolar 运行：cpolar http 8000
echo   3. 确认 app.js apiBaseUrl 正确
echo   4. 重新上传小程序体验版
echo   5. 老板扫码测试
echo.
echo 📋 当前配置：
echo   apiBaseUrl: https://6ffc7d06.r40.cpolar.top
echo   请确认这是最新的 cpolar 地址
echo   每次 cpolar 重启地址会变，需要更新 app.js
echo.

pause