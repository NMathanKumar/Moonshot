/**
 * Vitest Configuration for Integration Tests
 * 
 * This config is used ONLY for integration tests against real DEV environment.
 * Run with: npm run test:integration
 * 
 * Integration tests:
 * - Run against real AWS Cognito and Enrolment Service API
 * - Require valid test credentials in environment variables
 * - Are EXCLUDED from normal unit test runs (vitest.config.ts)
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

/**
 * Load .env.development file for integration tests
 * Returns object of VITE_ env vars to inject into test environment
 * Also loads .env.test-integration for optional test credentials
 */
function loadEnvForIntegration(): Record<string, string> {
  const envPath = path.resolve(__dirname, '.env.development');
  const testEnvPath = path.resolve(__dirname, '.env.test-integration');
  
  const envVars: Record<string, string> = {};

  // Load VITE_ vars from .env.development (required)
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        envVars[key] = valueParts.join('=');
      }
    });
    console.log('[vitest.config.integration] Loaded VITE_ vars from .env.development');
  } else {
    console.warn(`[vitest.config.integration] Warning: .env.development not found at ${envPath}`);
  }

  // Load plain env vars from .env.test-integration (optional)
  if (fs.existsSync(testEnvPath)) {
    const testEnvContent = fs.readFileSync(testEnvPath, 'utf-8');
    testEnvContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        envVars[key] = valueParts.join('=');
      }
    });
    console.log('[vitest.config.integration] Loaded test credentials from .env.test-integration');
  } else {
    console.warn(`[vitest.config.integration] Warning: .env.test-integration not found at ${testEnvPath}`);
    console.warn('[vitest.config.integration] Integration tests will skip credential-based tests');
  }

  return envVars;
}

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node', // Use Node environment for API tests (not jsdom)
    setupFiles: ['./tests/integration/setup.ts'], // Initialize Amplify and verify DEV config
    include: ['tests/integration/**/*.test.ts'],
    exclude: ['node_modules/'],
    testTimeout: 30000, // Integration tests may be slower
    hookTimeout: 30000,
    // IMPORTANT: Use env config to pass vars to process.env
    env: {
      // Explicitly load both .env.development (VITE_ vars for Cognito/API)
      // and .env.test-integration (plain vars for test credentials)
      ...loadEnvForIntegration(),
    },
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@components/*': path.resolve(__dirname, './src/components/*'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@hooks/*': path.resolve(__dirname, './src/hooks/*'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@styles/*': path.resolve(__dirname, './src/styles/*'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@assets/*': path.resolve(__dirname, './src/assets/*'),
      '@services': path.resolve(__dirname, './src/services'),
      '@services/*': path.resolve(__dirname, './src/services/*'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@routes/*': path.resolve(__dirname, './src/routes/*'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@utils/*': path.resolve(__dirname, './src/utils/*'),
    },
  },
});
