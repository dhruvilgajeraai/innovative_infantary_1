@echo off
title The Champions Club - ArenaFlow Starter
echo ===================================================
echo   THE CHAMPIONS CLUB - ARENAFLOW SPORTS COMPLEX
echo ===================================================
echo.
echo Checking dependencies...
if not exist node_modules (
    echo Installing dependencies (npm install)...
    call npm install
)

echo.
echo Starting ArenaFlow in development mode...
call npm run dev
pause