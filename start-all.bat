@echo off
TITLE Hostel360 - 1-Click Full-Stack Platform Launcher
echo =======================================================
echo          HOSTEL360 FULL-STACK PLATFORM LAUNCHER
echo =======================================================
echo.
echo Starting Java Spring Boot Backend Server on Port 8080...
start "Hostel360 Backend (Port 8080)" cmd /k call "%~dp0start-backend.bat"

echo.
echo Starting React Vite Frontend Dev Server on Port 5173...
start "Hostel360 Frontend (Port 5173)" cmd /k call "%~dp0start-frontend.bat"

echo.
echo =======================================================
echo Both Backend (8080) and Frontend (5173) are launching!
echo.
echo Web App:    http://localhost:5173
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo H2 Console: http://localhost:8080/h2-console
echo =======================================================
echo.
pause
