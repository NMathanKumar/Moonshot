@echo off
cd /d "%~dp0"
echo Running Forget Password tests...
call npm run test:run -- ForgetPassword.test.tsx
pause
