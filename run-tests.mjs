import { spawn } from 'child_process';

const proc = spawn('npm', ['run', 'test:run'], {
  cwd: process.cwd(),
  stdio: 'pipe',
  shell: true
});

let output = '';
proc.stdout.on('data', (data) => {
  output += data.toString();
});

proc.stderr.on('data', (data) => {
  output += data.toString();
});

proc.on('close', (code) => {
  // Extract and print summary
  const lines = output.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Test Files') || line.includes('Tests') || line.includes('FAIL') || line.includes('PASS')) {
      console.log(line);
    }
  }
  // Also print last 30 lines for context
  console.log('\n=== LAST 30 LINES ===');
  console.log(lines.slice(-30).join('\n'));
  process.exit(code);
});
