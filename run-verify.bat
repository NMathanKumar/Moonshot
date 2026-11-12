@echo off
echo Running Vitest...
npx vitest run --config vitest.config.ts
echo Vitest completed with exit code %errorlevel%

echo.
echo Running TypeScript check...
npx tsc --noEmit
echo TypeScript check completed with exit code %errorlevel%

echo.
echo Running build...
npm run build
echo Build completed with exit code %errorlevel%
