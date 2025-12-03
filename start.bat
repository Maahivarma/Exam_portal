@echo off
echo ========================================
echo    EXAM PORTAL - Starting Services
echo ========================================
echo.

:: Check if concurrently is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

:: Check if concurrently is installed
if not exist "node_modules\concurrently" (
    echo Installing concurrently...
    call npm install concurrently --save-dev
)

echo.
echo Starting Backend (Django) and Frontend (Vite)...
echo.
echo Backend will run at: http://127.0.0.1:8000
echo Frontend will run at: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

:: Run both servers
call npm run start:all

pause

