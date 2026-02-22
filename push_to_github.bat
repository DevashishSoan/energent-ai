@echo off
set /p repo_url="Enter your GitHub Repository URL (e.g., https://github.com/username/energent-ai.git): "
if "%repo_url%"=="" (
    echo Error: No URL provided.
    pause
    exit /b
)
echo Linking remote...
"C:\Program Files\Git\cmd\git.exe" remote add origin %repo_url%
echo Setting branch to main...
"C:\Program Files\Git\cmd\git.exe" branch -M main
echo Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo Done!
pause
