#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

// Test 1: TypeScript
console.log('\n' + '='.repeat(80));
console.log('TEST 1: TypeScript Compilation Check');
console.log('='.repeat(80));
console.log('Command: npx tsc --noEmit\n');

let tscOutput = '';
let tscCode = 0;
try {
  tscOutput = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8', stdio: 'pipe' });
  tscCode = 0;
} catch (e) {
  tscOutput = e.stdout || e.message || e.stderr || '';
  tscCode = e.status || 1;
}

console.log(tscOutput || '(no output)');
console.log(`\nExit Code: ${tscCode}`);
fs.writeFileSync('final-tsc-code.txt', tscCode.toString());
fs.writeFileSync('final-tsc-output.txt', tscOutput);

// Test 2: Unit Tests
console.log('\n' + '='.repeat(80));
console.log('TEST 2: Unit Test Suite');
console.log('='.repeat(80));
console.log('Command: npm run test:run\n');

let testOutput = '';
let testCode = 0;
try {
  testOutput = execSync('npm run test:run 2>&1', { encoding: 'utf-8', stdio: 'pipe', timeout: 300000 });
  testCode = 0;
} catch (e) {
  testOutput = e.stdout || e.message || e.stderr || '';
  testCode = e.status || 1;
}

console.log(testOutput || '(no output)');
console.log(`\nExit Code: ${testCode}`);
fs.writeFileSync('final-test-code.txt', testCode.toString());
fs.writeFileSync('final-test-output.txt', testOutput);

// Extract test summary
const passedMatch = testOutput.match(/\d+\s+passed/i);
const failedMatch = testOutput.match(/\d+\s+failed/i);
const skippedMatch = testOutput.match(/\d+\s+skipped/i);

console.log('\nTest Summary:');
if (passedMatch) console.log(`  Passed: ${passedMatch[0]}`);
if (failedMatch) console.log(`  Failed: ${failedMatch[0]}`);
if (skippedMatch) console.log(`  Skipped: ${skippedMatch[0]}`);
if (!passedMatch && !failedMatch) console.log('  (Could not extract summary - see full output above)');

// Test 3: Production Build
console.log('\n' + '='.repeat(80));
console.log('TEST 3: Production Build');
console.log('='.repeat(80));
console.log('Command: npm run build\n');

// Remove old dist
try {
  const distPath = path.join(projectRoot, 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log('Removed old dist directory\n');
  }
} catch (e) {
  console.log(`Warning: Could not remove old dist: ${e.message}\n`);
}

let buildOutput = '';
let buildCode = 0;
try {
  buildOutput = execSync('npm run build 2>&1', { encoding: 'utf-8', stdio: 'pipe', timeout: 300000 });
  buildCode = 0;
} catch (e) {
  buildOutput = e.stdout || e.message || e.stderr || '';
  buildCode = e.status || 1;
}

console.log(buildOutput || '(no output)');
console.log(`\nExit Code: ${buildCode}`);
fs.writeFileSync('final-build-code.txt', buildCode.toString());
fs.writeFileSync('final-build-output.txt', buildOutput);

// Check if dist was created
const distExists = fs.existsSync(path.join(projectRoot, 'dist'));
const indexHtmlExists = distExists && fs.existsSync(path.join(projectRoot, 'dist', 'index.html'));
console.log(`\nBuild Artifacts:`);
console.log(`  dist/ directory exists: ${distExists}`);
console.log(`  dist/index.html exists: ${indexHtmlExists}`);

// Final Summary
console.log('\n' + '='.repeat(80));
console.log('FINAL VERIFICATION SUMMARY');
console.log('='.repeat(80));
console.log(`TypeScript Exit Code: ${tscCode} ${tscCode === 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Tests Exit Code: ${testCode} ${testCode === 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Build Exit Code: ${buildCode} ${buildCode === 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Build Artifacts: ${indexHtmlExists ? '✅ CREATED' : '❌ MISSING'}`);

process.exit(Math.max(tscCode, testCode, buildCode));
