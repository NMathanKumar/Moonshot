@echo off
echo ============================
echo Running Full Test Suite
echo ============================
npm run test:run > test-full-output.txt 2>&1
echo Test run complete. Check test-full-output.txt for results.
