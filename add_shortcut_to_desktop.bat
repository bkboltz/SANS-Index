@echo off
set "targetDir=%~dp0"
if "%targetDir:~-1%"=="\" set "targetDir=%targetDir:~0,-1%"
set "shortcutPath=%USERPROFILE%\Desktop\SANS Study Indexer.lnk"
set "iconPath=%targetDir%\icon.png"

echo Creating SANS Study Indexer shortcut on your desktop...

powershell -NoProfile -Command "$sh = New-Object -ComObject WScript.Shell; $s = $sh.CreateShortcut('%shortcutPath%'); $s.TargetPath = '%targetDir%\node_modules\electron\dist\electron.exe'; $s.Arguments = '.'; $s.WorkingDirectory = '%targetDir%'; $s.Description = 'SANS Study Indexer'; if (Test-Path '%iconPath%') { $s.IconLocation = '%iconPath%' }; $s.Save()"

echo Done! Shortcut successfully created on your desktop.
pause
