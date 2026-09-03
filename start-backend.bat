@echo off
TITLE Hostel360 - Spring Boot Backend
echo =======================================================
echo          STARTING HOSTEL360 BACKEND (PORT 8080)
echo =======================================================
cd /d "%~dp0backend"
call mvn spring-boot:run
pause
