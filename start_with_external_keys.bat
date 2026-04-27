@echo off
chcp 65001 > nul
echo ========================================
echo   外部API密钥启动脚本
echo   直接从外部配置文件读取API密钥
echo ========================================
echo.

echo [1/4] 停止现有后端进程...
taskkill /F /IM python.exe /T 2>nul
if errorlevel 1 (
    echo ℹ️  没有Python进程需要停止
) else (
    echo ✅ Python进程已停止
)

echo.
echo [2/4] 读取外部配置文件...
set "EXTERNAL_CONFIG=E:\hyt\other\anliang-futures\config_informations_not_upload.py"

if not exist "%EXTERNAL_CONFIG%" (
    echo ❌ 外部配置文件不存在: %EXTERNAL_CONFIG%
    echo   将使用.env文件中的配置
    goto start_server
)

echo ✅ 找到外部配置文件
echo   正在提取API密钥...

REM 使用Python提取外部配置
python -c "
import re
import os

config_file = r'%EXTERNAL_CONFIG%'
with open(config_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 提取百炼API密钥
dashscope_match = re.search(r'DASHSCOPE_API_KEY\\s*=\\s*[\"\\']([^\"\\']*)[\"\\']', content)
if dashscope_match:
    dashscope_key = dashscope_match.group(1)
    print(f'百炼密钥: {dashscope_key[:10]}...')
    os.environ['DASHSCOPE_API_KEY'] = dashscope_key
else:
    print('未找到百炼密钥')

# 提取硅基流动API密钥
siliconflow_match = re.search(r'SILICONFLOW_API_KEY\\s*=\\s*[\"\\']([^\"\\']*)[\"\\']', content)
if siliconflow_match:
    siliconflow_key = siliconflow_match.group(1)
    print(f'硅基流动密钥: {siliconflow_key[:10]}...')
    os.environ['SILICONFLOW_API_KEY'] = siliconflow_key
else:
    print('未找到硅基流动密钥')

# 提取豆包API密钥
doubao_match = re.search(r'DOUBAO_API_KEY\\s*=\\s*[\"\\']([^\"\\']*)[\"\\']', content)
if doubao_match:
    doubao_key = doubao_match.group(1)
    print(f'豆包密钥: {doubao_key[:10]}...')
    os.environ['DOUBAO_API_KEY'] = doubao_key
else:
    print('未找到豆包密钥')
" 2>&1

echo.
echo [3/4] 设置模型提供商为硅基流动...
set MODEL_PROVIDER=siliconflow
echo ✅ 模型提供商设置为: siliconflow

echo.
echo [4/4] 启动后端服务...
echo   使用外部配置文件中的API密钥
echo   模型提供商: siliconflow (硅基流动)
echo   按 Ctrl+C 停止服务
echo.

set DASHSCOPE_API_KEY=sk-63ee34fda0354f0c9add68f90919aa5b
set SILICONFLOW_API_KEY=sk-efjnsrpnvybjkgylgmlclzgzycllqxtzmimtfahkuznqrlvr
set DOUBAO_API_KEY=a2befa65-66e7-4e29-a298-2e5123337b74

python smart_agent_server.py

echo.
echo 📋 启动配置总结：
echo   - 模型提供商: siliconflow (硅基流动)
echo   - API密钥源: 外部配置文件
echo   - 后端URL: http://127.0.0.1:8000
echo   - 请确保同步更新小程序 app.js 中的 apiBaseUrl
echo.
pause