const { spawn } = require('child_process');
const path = require('path');

const cwd = 'c:\\Users\\mathankumar.n\\Downloads\\HST_IDP\\iet-ui-testtaker-1';
const testFile = 'src/pages/ForgetPassword/ForgetPassword.test.tsx';

const vitest = spawn('npm', ['run', 'test', '--', testFile, '--run'], {
  cwd,
  env: { ...process.env },
  shell: true,
});

let output = '';
let errorOutput = '';

vitest.stdout.on('data', (data) => {
  output += data.toString();
  process.stdout.write(data);
});

vitest.stderr.on('data', (data) => {
  errorOutput += data.toString();
  process.stderr.write(data);
});

vitest.on('close', (code) => {
  console.log(`\n\n=== TEST SUMMARY ===`);
  console.log(`Exit code: ${code}`);
  
  // Parse the summary line
  const summaryMatch = output.match(/Test Files\s+(\d+)\s+(\d+)/);
  if (summaryMatch) {
    console.log(`Total tests: ${summaryMatch[0]}`);
  }
  
  process.exit(code === 0 ? 0 : 1);
});
