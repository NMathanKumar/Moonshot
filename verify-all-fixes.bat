@echo off
cd /d "c:\Users\mathankumar.n\Downloads\HST_IDP\iet-ui-testtaker-1"

echo.
echo === VERIFICATION SUITE ===
echo.

echo 1. Testing ForgetPassword and Auth Service...
echo.
call npx vitest run src/pages/ForgetPassword/ForgetPassword.test.tsx src/services/auth.test.ts
set TEST_EXIT=%ERRORLEVEL%

echo.
echo 2. TypeScript Check...
echo.
call npx tsc --noEmit
set TS_EXIT=%ERRORLEVEL%

echo.
echo 3. Production Build...
echo.
call npm run build
set BUILD_EXIT=%ERRORLEVEL%

echo.
echo === RESULTS ===
echo Test exit code: %TEST_EXIT%
echo TypeScript exit code: %TS_EXIT%
echo Build exit code: %BUILD_EXIT%
echo.

if %TEST_EXIT% equ 0 (
  if %TS_EXIT% equ 0 (
    if %BUILD_EXIT% equ 0 (
      echo All checks PASSED!
      exit /b 0
    )
  )
)
echo Some checks FAILED
exit /b 1
