const { execSync } = require('child_process');

try {
  const output = execSync('npm run test -- src/pages/ForgetPassword/ForgetPassword.test.tsx --run', {
    cwd: 'c:\\Users\\mathankumar.n\\Downloads\\HST_IDP\\iet-ui-testtaker-1',
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
  });
  console.log(output);
} catch (error) {
  console.log(error.stdout);
  console.log(error.stderr);
  process.exit(1);
}
