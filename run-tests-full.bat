@echo off
echo Running vitest for Settings and CheckInIdentity...
npx vitest run --config vitest.config.ts src/pages/Settings/Settings.test.tsx src/pages/CheckInIdentity/CheckInIdentity.test.tsx > test-output.txt 2>&1
type test-output.txt
