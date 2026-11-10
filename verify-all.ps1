# Comprehensive verification script
$ErrorActionPreference = "Continue"

Write-Host "========== TEST 1: TypeScript Check ==========" 
Write-Host "Command: npx tsc --noEmit"
npx tsc --noEmit 2>&1 | Tee-Object -FilePath verify-tsc.log
$tscCode = $LASTEXITCODE
Write-Host "TypeScript Exit Code: $tscCode"
$tscCode | Out-File verify-tsc-exitcode.txt

Write-Host ""
Write-Host "========== TEST 2: Unit Tests ==========" 
Write-Host "Command: npm run test:run"
npm run test:run 2>&1 | Tee-Object -FilePath verify-tests.log
$testCode = $LASTEXITCODE
Write-Host "Tests Exit Code: $testCode"
$testCode | Out-File verify-tests-exitcode.txt

Write-Host ""
Write-Host "========== TEST 3: Production Build ==========" 
Write-Host "Command: npm run build"
npm run build 2>&1 | Tee-Object -FilePath verify-build.log
$buildCode = $LASTEXITCODE
Write-Host "Build Exit Code: $buildCode"
$buildCode | Out-File verify-build-exitcode.txt

Write-Host ""
Write-Host "========== SUMMARY ==========" 
Write-Host "TypeScript: Exit Code $tscCode"
Write-Host "Tests: Exit Code $testCode"
Write-Host "Build: Exit Code $buildCode"
