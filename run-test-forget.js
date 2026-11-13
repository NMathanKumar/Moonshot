const { spawn } = require("child_process");
const vitest = spawn("npx", ["vitest", "run", "src/pages/ForgetPassword/ForgetPassword.test.tsx", "src/services/auth.test.ts"], {
  stdio: "inherit",
  shell: true
});
vitest.on("close", (code) => {
  process.exit(code);
});