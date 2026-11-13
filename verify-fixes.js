#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';

const tests = [
  { name: 'ForgetPassword Tests', cmd: 'npx vitest run src/pages/ForgetPassword/ForgetPassword.test.tsx 2>&1' },
  { name: 'Auth Service Tests', cmd: 'npx vitest run src/services/auth.test.ts 2>&1' },
  { name: 'TypeScript Check', cmd: 'npx tsc --noEmit 2>&1' },
  { name: 'Build', cmd: 'npm run build 2>&1' },
];

console.log('=== VERIFICATION SUITE ===\n');

for (const test of tests) {
  console.log(`\n⏳ Running: ${test.name}`);
  console.log('─'.repeat(50));
  
  try {
    const output = execSync(test.cmd, { 
      cwd: process.cwd(), 
      encoding: 'utf-8',
      maxBuffer: 100 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    // Print last 30 lines for brevity
    const lines = output.split('\n');
    const lastLines = lines.slice(Math.max(0, lines.length - 30)).join('\n');
    console.log(lastLines);
    console.log(`✅ ${test.name}: PASSED (exit 0)`);
  } catch (error) {
    const stdout = error.stdout ? error.stdout.toString() : '';
    const stderr = error.stderr ? error.stderr.toString() : '';
    const output = stdout + stderr;
    
    // Print last 30 lines
    const lines = output.split('\n');
    const lastLines = lines.slice(Math.max(0, lines.length - 30)).join('\n');
    console.log(lastLines);
    
    const exitCode = error.status !== undefined ? error.status : -1;
    console.log(`❌ ${test.name}: FAILED (exit ${exitCode})`);
  }
}

console.log('\n=== VERIFICATION COMPLETE ===\n');
