@echo off  
git diff --name-only | findstr -v 'Test Taker Portal'  
echo ---  
npx vitest run --config vitest.config.ts  
