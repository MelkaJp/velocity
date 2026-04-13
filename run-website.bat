@echo off
echo ========================================
echo   VeloCity - Starting Website
echo ========================================
echo.

cd /d "%~dp0"

echo Starting VeloCity website on port 5173...
echo.
echo Once started, open your browser and go to:
echo http://localhost:5173
echo.
echo If that doesn't work, try:
echo http://127.0.0.1:5173
echo.

npm run dev

pause