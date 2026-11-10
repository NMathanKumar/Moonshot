@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\mathankumar.n\Downloads\HST_IDP\iet-ui-testtaker-1"

echo ===== TEST 1: npm run test:run =====
npm run test:run > test-output.txt 2>&1
set TEST_EXIT=%ERRORLEVEL%
type test-output.txt
echo.
echo TEST EXIT CODE: %TEST_EXIT%
echo.

echo ===== TEST 2: npx tsc --noEmit =====
npx tsc --noEmit > tsc-output.txt 2>&1
set TSC_EXIT=%ERRORLEVEL%
type tsc-output.txt
echo.
echo TSC EXIT CODE: %TSC_EXIT%
echo.

echo ===== TEST 3: npm run build =====
npm run build > build-output.txt 2>&1
set BUILD_EXIT=%ERRORLEVEL%
type build-output.txt
echo.
echo BUILD EXIT CODE: %BUILD_EXIT%
echo.

echo ===== SUMMARY =====
echo npm run test:run exit code: %TEST_EXIT%
echo npx tsc --noEmit exit code: %TSC_EXIT%
echo npm run build exit code: %BUILD_EXIT%
