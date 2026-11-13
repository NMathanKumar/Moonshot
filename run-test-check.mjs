import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const testFile = 'src/pages/ForgetPassword/ForgetPassword.test.tsx';

const vitest = spawn('npm', ['run', 'test', '--', testFile, '--run'], {
  cwd: process.cwd(),
  stdio: 'pipe',
  shell: true,
});

let output = '';
let errorOutput = '';

vitest.stdout?.on('data', (data) => {
  output += data.toString();
});

vitest.stderr?.on('data', (data) => {
  errorOutput += data.toString();
});

vitest.on('close', (code) => {
  // Extract key information from output
  const lines = output.split('\n');
  const lastLines = lines.slice(-20);
  
  console.log('=== TEST OUTPUT (Last 20 lines) ===');
  lastLines.forEach(line => {
    if (line.trim()) console.log(line);
  });
  
  // Count test results
  const passCount = (output.match(/✓/g) || []).length;
  const failCount = (output.match(/✗/g) || []).length;
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Exit code: ${code}`);
});
