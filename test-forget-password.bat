@echo off
echo Running ForgetPassword and auth service tests...
npx vitest run --config vitest.config.ts src/pages/ForgetPassword/ForgetPassword.test.tsx src/services/auth.test.ts > test-forget-output.txt 2>&1
type test-forget-output.txt
