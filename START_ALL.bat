@echo off
cls
echo ========================================
echo  Financial Flow - Full Stack Startup
echo ========================================
echo.
echo This will start both Backend and Frontend servers
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8081
echo.
pause

REM Start Backend in new window
echo Starting Backend Server...
start "Financial Flow Backend" cmd /k "cd fin-flow-backend && npm start"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend in new window
echo Starting Frontend Server...
start "Financial Flow Frontend" cmd /k "cd fin-flow && npm run dev"

echo.
echo ========================================
echo  Both servers are starting!
echo ========================================
echo.
echo Backend:  Check the "Financial Flow Backend" window
echo Frontend: Check the "Financial Flow Frontend" window
echo.
echo Once both are running, open: http://localhost:8081
echo.
pause
