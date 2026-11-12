@echo off
echo ============================
echo Running Vitest Tests
echo ============================
npx vitest run --config vitest.config.ts 2>&1
echo.
echo ============================
echo Running TypeScript Check
echo ============================
npx tsc --noEmit 2>&1
echo.
echo ============================
echo Running Build
echo ============================
npm run build 2>&1
