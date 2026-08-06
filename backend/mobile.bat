@echo off
chcp 65001 >nul
title MediConnect - Lancement
color 0A

echo ========================================
echo   MediConnect - Configuration
echo ========================================
echo.

:: ====================================================
:: CONFIGURATION MANUELLE - MODIFIEZ CES 2 LIGNES
:: ====================================================
:: Mettez les chemins COMPLETS si la detection echoue
:: Exemple: set "DJANGO_PATH=C:\Users\abd\mediconnect-fullstack\backend"
:: Exemple: set "PWA_PATH=C:\Users\abd\mediconnect-fullstack\frontend"

set "DJANGO_PATH="      &:: Laisser vide pour detection auto
set "PWA_PATH="         &:: Laisser vide pour detection auto

set "DJANGO_PORT=8001"
set "PWA_PORT=3001"
:: ====================================================

:: Si les chemins sont vides, on utilise la detection
if "%DJANGO_PATH%"=="" (
    :: On suppose qu'on est dans mediconnect-fullstack ou dedans
    if exist "backend\manage.py" (
        set "DJANGO_PATH=backend"
        echo [OK] Backend trouve: backend\
    ) else if exist "mediconnect-fullstack\backend\manage.py" (
        set "DJANGO_PATH=mediconnect-fullstack\backend"
        echo [OK] Backend trouve: mediconnect-fullstack\backend\
    ) else if exist "manage.py" (
        set "DJANGO_PATH=."
        echo [OK] Backend trouve: dossier courant
    ) else (
        echo [X] Backend non trouve automatiquement
        set /p "DJANGO_PATH=Chemain complet vers backend (ex: C:\...\backend): "
    )
)

if "%PWA_PATH%"=="" (
    if exist "frontend\package.json" (
        set "PWA_PATH=frontend"
        echo [OK] Frontend trouve: frontend\
    ) else if exist "client\package.json" (
        set "PWA_PATH=client"
        echo [OK] Frontend trouve: client\
    ) else if exist "package.json" (
        set "PWA_PATH=."
        echo [OK] Frontend trouve: dossier courant
    ) else (
        echo [X] Frontend non trouve automatiquement
        set /p "PWA_PATH=Chemain complet vers frontend: "
    )
)

:: Verification finale
if not exist "%DJANGO_PATH%\manage.py" (
    echo.
    echo [ERREUR] manage.py non trouve dans: %DJANGO_PATH%
    echo Contenu du dossier:
    dir "%DJANGO_PATH%" /b 2>nul || echo Impossible d'acceder au dossier
    pause
    exit /b 1
)

if not exist "%PWA_PATH%\package.json" (
    echo.
    echo [ERREUR] package.json non trouve dans: %PWA_PATH%
    pause
    exit /b 1
)

echo.
echo [CONFIGURATION]
echo Backend: %DJANGO_PATH% (Port %DJANGO_PORT%)
echo Frontend: %PWA_PATH% (Port %PWA_PORT%)
echo.

:: Recuperation IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set "IP=%%a"
    set "IP=%IP: =%"
    goto :ip_ok
)
:ip_ok

:: ====================================================
:: LANCEMENT DJANGO
:: ====================================================
echo [*] Lancement Django...

cd /d "%DJANGO_PATH%" 2>nul
if errorlevel 1 (
    echo [X] Impossible d'acceder a: %DJANGO_PATH%
    pause
    exit /b 1
)

if not exist "venv\Scripts\activate.bat" (
    echo [+] Creation venv...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -q django djangorestframework django-cors-headers djangorestframework-simplejwt pillow

echo [+] Demarrage serveur Django...
start "DJANGO API" cmd /k "color 0B && cd /d "%CD%" && call venv\Scripts\activate.bat && echo Django: http://localhost:%DJANGO_PORT% && python manage.py runserver 0.0.0.0:%DJANGO_PORT%"

:: ====================================================
:: LANCEMENT PWA
:: ====================================================
echo [*] Lancement PWA...

cd /d "%PWA_PATH%" 2>nul
if errorlevel 1 (
    echo [X] Impossible d'acceder a: %PWA_PATH%
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [+] Installation npm...
    npm install
)

:: Detection commande selon framework
if exist "vite.config.js" (
    set "CMD=npm run dev -- --port %PWA_PORT%"
) else if exist "vue.config.js" (
    set "CMD=npm run serve -- --port %PWA_PORT%"
) else (
    set "CMD=set PORT=%PWA_PORT% && npm start"
)

start "PWA" cmd /k "color 0D && cd /d "%CD%" && %CMD%"

:: ====================================================
:: AFFICHAGE
:: ====================================================
timeout /t 3 >nul
cls
echo ========================================
echo    MEDICONNECT - ACTIF
echo ========================================
echo.
echo API Django:  http://localhost:%DJANGO_PORT%
echo              http://%IP%:%DJANGO_PORT%
echo.
echo PWA:         http://localhost:%PWA_PORT%
echo              http://%IP%:%PWA_PORT%
echo.
echo Appuyez sur une touche pour arreter...
pause >nul

:: ARRET
taskkill /F /FI "WINDOWTITLE eq DJANGO API*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq PWA*" >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
exit