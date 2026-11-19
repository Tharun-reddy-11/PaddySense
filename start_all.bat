@echo off
setlocal
title PaddySense - AI Methane Estimation Platform Launcher
color 0A

echo ===============================================================================
echo                PADDYSENSE FULL-STACK PLATFORM LAUNCHER
echo          "Smarter Insights. Sustainable Rice Cultivation."
echo ===============================================================================
echo.

set ROOT_DIR=%~dp0
if "%ROOT_DIR:~-1%"=="\" set ROOT_DIR=%ROOT_DIR:~0,-1%
set PYTHON_EXE=%ROOT_DIR%\.venv\Scripts\python.exe
set BACKEND_JAR=%ROOT_DIR%\backend\target\paddysense-backend-1.0.0.jar

if not exist "%PYTHON_EXE%" (
    echo [ERROR] Python virtual environment not found at: %PYTHON_EXE%
    pause
    exit /b 1
)

if not exist "%BACKEND_JAR%" (
    echo [ERROR] Spring Boot backend jar not found at: %BACKEND_JAR%
    echo Please compile the backend using: cd backend ^&^& mvn clean package -DskipTests
    pause
    exit /b 1
)

echo [1/3] Starting Python FastAPI ML Service (Port 8000)...
start "PaddySense ML Service (FastAPI :8000)" cmd /k "cd /d %ROOT_DIR%\ml-service && %PYTHON_EXE% -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Starting Spring Boot Backend (Port 8080)...
start "PaddySense Backend (Spring Boot :8080)" cmd /k "cd /d %ROOT_DIR%\backend && java -jar %BACKEND_JAR%"

echo [3/3] Starting React Vite Frontend (Port 5173)...
start "PaddySense Frontend (Vite :5173)" cmd /k "cd /d %ROOT_DIR%\frontend && npm run dev"

echo.
echo ===============================================================================
echo All microservices are launching in separate terminal windows:
echo   - ML Service (FastAPI):  http://localhost:8000 (Swagger: http://localhost:8000/docs)
echo   - Backend (Spring Boot): http://localhost:8080 (REST API: http://localhost:8080/api)
echo   - Frontend (Vite):       http://localhost:5173 (Farmer Dashboard: http://localhost:5173)
echo ===============================================================================
echo Keep the launched terminal windows open while using the application.
echo Press any key to exit this launcher window...
pause >nul
