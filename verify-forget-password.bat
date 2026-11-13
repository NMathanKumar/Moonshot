@echo off
cd /d "%~dp0"

echo ========================================
echo Forget Password Verification Script
echo ========================================
echo.

echo [1/4] TypeScript check...
call npm run build 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo FAILED: TypeScript check failed
    exit /b %ERRORLEVEL%
)
echo PASSED: TypeScript check passed
echo.

echo [2/4] Running ForgetPassword tests...
call npx vitest run --config vitest.config.ts src/pages/ForgetPassword/ForgetPassword.test.tsx
if %ERRORLEVEL% NEQ 0 (
    echo FAILED: ForgetPassword tests failed
    exit /b %ERRORLEVEL%
)
echo PASSED: ForgetPassword tests passed
echo.

echo [3/4] Running existing tests for regressions...
call npx vitest run --config vitest.config.ts src/components/auth/SignIn/SignIn.test.tsx
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Sign In tests failed - possible regression
) else (
    echo PASSED: Sign In tests passed - no regressions
)
echo.

echo [4/4] Figma verification...
echo MANUAL REVIEW REQUIRED: Verify implementation matches Figma design at:
echo https://www.figma.com/design/Pm2agRYFCKG4bwTiwat3uO/Untitled
echo.

echo ========================================
echo Verification Complete
echo ========================================
