@echo off
setlocal
title Evoless Watermark Automation Tool

echo ========================================================
echo         EVOLESS VIDEO WATERMARK AUTOMATION (FFMPEG)
echo ========================================================
echo.

node "%~dp0watermark-batch.mjs" %*

echo.
echo Press any key to exit...
pause >nul

