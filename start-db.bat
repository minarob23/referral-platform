@echo off
set PG_BIN=C:\Users\Asus\Downloads\postgresql-18.6-3-windows-x64-binaries\pgsql\bin
set PG_DATA=%~dp0pgdata

echo Checking PostgreSQL status...

netstat -ano | findstr :5432 | findstr LISTENING >nul
if %ERRORLEVEL% equ 0 (
    echo PostgreSQL is already running on port 5432.
    exit /b 0
)

if exist "%PG_DATA%\postmaster.pid" (
    echo Cleaning up stale postmaster.pid...
    del /f /q "%PG_DATA%\postmaster.pid"
)

echo Starting PostgreSQL...
"%PG_BIN%\pg_ctl.exe" start -D "%PG_DATA%" -l "%PG_DATA%\pg.log"
if %ERRORLEVEL% equ 0 (
    echo PostgreSQL started successfully!
) else (
    echo Failed to start PostgreSQL. Check %PG_DATA%\pg.log for details.
)

