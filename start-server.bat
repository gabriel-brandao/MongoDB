@echo off
cd "api"
npm run dev

rem @echo off
rem "C:\Program Files\PowerShell\7\pwsh.exe" -NoProfile -ExecutionPolicy Bypass -Command "cd 'api'; Start-Process 'C:\Program Files\PowerShell\7\pwsh.exe' -ArgumentList '-NoExit', '-WindowStyle', 'Minimized', '-Command', 'npm run dev'"