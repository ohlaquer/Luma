@echo off
cd /d D:\LUMA
start cmd /k "npm run dev -- --host"
start "" http://localhost:5173