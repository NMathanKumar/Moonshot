@echo off
cd /d "c:\Users\mathankumar.n\Downloads\HST_IDP\iet-ui-testtaker-1"

echo.
echo === TEST 1: Running ForgetPassword tests ===
echo.
call npm run test -- src/pages/ForgetPassword/ForgetPassword.test.tsx --run
set TEST_EXIT=%ERRORLEVEL%

echo.
echo === TEST 2: TypeScript check ===
echo.
call npx tsc --noEmit
set TS_EXIT=%ERRORLEVEL%

echo.
echo === TEST 3: Production build ===
echo.
call npm run build
set BUILD_EXIT=%ERRORLEVEL%

echo.
echo === SUMMARY ===
echo Test exit code: %TEST_EXIT%
echo TypeScript exit code: %TS_EXIT%
echo Build exit code: %BUILD_EXIT%
echo.
