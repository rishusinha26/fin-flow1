@echo off
cls
echo ========================================
echo  Financial Flow Backend Setup
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please add your GEMINI_API_KEY to the .env file
    echo    Get your API key from: https://aistudio.google.com/app/apikey
    echo.
    pause
)

echo Starting backend server...
echo.
node server.js
