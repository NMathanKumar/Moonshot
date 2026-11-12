const { spawn } = require('child_process');

// Run useAuth tests
const useAuthTest = spawn('npx', ['vitest', 'run', 'src/hooks/useAuth.test.tsx', '--config', 'vitest.config.ts'], {
  stdio: 'inherit',
  shell: true
});

useAuthTest.on('close', (code) => {
  console.log(`useAuth tests exited with code ${code}`);
  process.exit(code);
});
