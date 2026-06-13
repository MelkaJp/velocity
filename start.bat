@echo off
echo ========================================
echo   VeloCity - Starting All Services
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Please install Python 3.8+
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node is available
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Installing Backend dependencies...
cd /d %~dp0backend
pip install -q fastapi uvicorn pydantic python-multipart python-dotenv

echo [1/3] Starting Backend API (Port 8000)...
start "VeloCity Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend (Port 5173)...
start "VeloCity Frontend" cmd /k "cd /d %~dp0 && npm run dev -- --host"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Browser...
start http://localhost:5173

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo   Backend API:  http://localhost:8000
echo   Frontend:     http://localhost:5173
echo   API Docs:     http://localhost:8000/docs
echo.
echo   Press any key to exit this window...
pause >nul