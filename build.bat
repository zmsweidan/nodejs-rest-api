@echo off

set /p version="Enter build version: "

xcopy /s .\auth .\build\build_%version%\auth\ /Y /D
xcopy /s .\controllers .\build\build_%version%\controllers\ /Y /D
xcopy /s .\data\assets .\build\build_%version%\data\assets\ /Y /D
xcopy /s .\db .\build\build_%version%\db\ /Y /D
xcopy /s .\models .\build\build_%version%\models\ /Y /D
xcopy /s .\services .\build\build_%version%\services\ /Y /D
xcopy /s .\swagger .\build\build_%version%\swagger\ /Y /D
xcopy /s .\utils .\build\build_%version%\utils\ /Y /D
robocopy .\ .\build\build_%version%\ app.js server.js package.json  /NJH /NJS

echo """"""""""""""""""""""
echo build_%version% created