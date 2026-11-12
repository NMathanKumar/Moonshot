import { execSync } from 'child_process';
try {
  const output = execSync('npm run build', { 
    cwd: process.cwd(),
    encoding: 'utf-8',
    stdio: 'pipe',
    maxBuffer: 10 * 1024 * 1024
  });
  console.log(output);
  process.exit(0);
} catch (error) {
  if (error.stdout) console.error(error.stdout);
  if (error.stderr) console.error(error.stderr);
  console.error('EXIT CODE:', error.status);
  process.exit(error.status || 1);
}
