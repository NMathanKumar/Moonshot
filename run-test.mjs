#!/usr/bin/env node
import { spawn } from 'child_process';
import fs from 'fs';

const cmd = process.argv[2] || 'npm';
const args = process.argv.slice(3);

const proc = spawn(cmd, args, {
  cwd: process.cwd(),
  stdio: 'pipe',
  shell: true
});

let stdout = '';
let stderr = '';

proc.stdout.on('data', (data) => {
  stdout += data.toString();
  process.stdout.write(data);
});

proc.stderr.on('data', (data) => {
  stderr += data.toString();
  process.stderr.write(data);
});

proc.on('close', (code) => {
  fs.writeFileSync('last-exit-code.txt', code.toString());
  process.exit(code);
});
