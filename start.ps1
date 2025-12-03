# Exam Portal Startup Script
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "   EXAM PORTAL - Starting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Install frontend dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

# Install concurrently if needed
if (-not (Test-Path "node_modules\concurrently")) {
    Write-Host "Installing concurrently..." -ForegroundColor Yellow
    npm install concurrently --save-dev
}

# Check if backend venv exists
if (-not (Test-Path "backend\venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv venv
    .\venv\Scripts\pip.exe install django djangorestframework django-cors-headers pillow
    Set-Location ..
}

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
Set-Location backend
.\venv\Scripts\python.exe manage.py migrate --run-syncdb
Set-Location ..

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://127.0.0.1:8000" -ForegroundColor Magenta
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run both servers
npm run start:all

