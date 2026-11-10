/**
 * Integration Test Setup
 * Configuration for real DEV environment API testing
 * 
 * Run with: npm run test:integration
 * 
 * Required environment variables (NOT VITE_-prefixed, read in Node test environment):
 * - COGNITO_TEST_EMAIL: Valid test email in Cognito pool
 * - COGNITO_TEST_PASSWORD: Valid password for test account
 * - INTEGRATION_OPT_IN_MODIFY_DATA: Set to "true" to enable data-modifying tests
 * 
 * These tests:
 * - Use real Amplify auth to get access tokens
 * - Call real Enrolment Service API endpoints
 * - Verify Bearer token headers in requests
 * - Do NOT modify user data unless INTEGRATION_OPT_IN_MODIFY_DATA=true
 */

import '@testing-library/jest-dom/vitest';
import { Amplify } from 'aws-amplify';
import path from 'path';
import fs from 'fs';

/**
 * Load environment variables for integration tests
 * In Node environment, import.meta.env is not available,
 * so we manually load from process.env and .env files
 */
const loadEnvForIntegration = () => {
  // Load VITE_ vars from process.env (set by vitest.config.integration.ts)
  const envVars = {
    VITE_COGNITO_REGION: process.env.VITE_COGNITO_REGION || 'ap-southeast-1',
    VITE_COGNITO_USER_POOL_ID: process.env.VITE_COGNITO_USER_POOL_ID || 'ap-southeast-1_OyLXCWR59',
    VITE_COGNITO_USER_POOL_CLIENT_ID: process.env.VITE_COGNITO_USER_POOL_CLIENT_ID || '5vb0inbm5cson031am1buja73i',
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://hih3u10m2i.execute-api.ap-southeast-1.amazonaws.com/dev',
  };
  
  console.log('[Integration Tests] Loaded environment variables:', envVars);
  
  // IMPORTANT: Ensure process.env has these values for apiClient and other services
  process.env.VITE_COGNITO_REGION = envVars.VITE_COGNITO_REGION;
  process.env.VITE_COGNITO_USER_POOL_ID = envVars.VITE_COGNITO_USER_POOL_ID;
  process.env.VITE_COGNITO_USER_POOL_CLIENT_ID = envVars.VITE_COGNITO_USER_POOL_CLIENT_ID;
  process.env.VITE_API_BASE_URL = envVars.VITE_API_BASE_URL;
  
  // Also load test credentials if available in process.env (from vitest config)
  if (process.env.COGNITO_TEST_EMAIL) {
    console.log('[Integration Tests] Test credentials found in process.env');
  }
  
  return envVars;
};

/**
 * Load test credentials from .env.test-integration file
 * Ensures credentials are available even if vitest env config doesn't propagate them
 */
const loadTestCredentialsFromFile = () => {
  const testEnvPath = path.resolve(__dirname, '../.env.test-integration');
  
  if (!fs.existsSync(testEnvPath)) {
    return; // File doesn't exist - credentials may still be in process.env
  }

  try {
    const testEnvContent = fs.readFileSync(testEnvPath, 'utf-8');
    testEnvContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=');
        // Set in process.env so getTestCredentials() can find them
        process.env[key] = value;
      }
    });
    console.log('[Integration Tests] Test credentials loaded from .env.test-integration');
  } catch (err) {
    console.error('[Integration Tests] Error reading .env.test-integration:', err);
  }
};

const env = loadEnvForIntegration();
loadTestCredentialsFromFile();

// Initialize Amplify directly with DEV Cognito pool configuration
// We can't use initializeAmplify() from amplifyConfig.ts because it uses import.meta.env
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: env.VITE_COGNITO_REGION,
      userPoolId: env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
};

Amplify.configure(amplifyConfig);
console.log('[Integration Tests] Amplify initialized with DEV Cognito pool');

/**
 * Check if integration tests can run
 * Verifies Amplify is configured with valid DEV credentials
 */
export function canRunIntegrationTests(): boolean {
  const hasValidDevConfig = 
    env.VITE_COGNITO_USER_POOL_ID === 'ap-southeast-1_OyLXCWR59' &&
    env.VITE_COGNITO_USER_POOL_CLIENT_ID === '5vb0inbm5cson031am1buja73i' &&
    env.VITE_API_BASE_URL?.includes('execute-api.ap-southeast-1.amazonaws.com/dev');
  
  return hasValidDevConfig;
}

/**
 * Check if data-modifying tests should run (create/update/delete)
 * These tests are opt-in to prevent accidental data changes
 * 
 * Uses plain environment variable (not VITE_-prefixed)
 * Read from .env.test-integration or Node environment
 */
export function shouldRunDataModifyingTests(): boolean {
  const optIn = process.env.INTEGRATION_OPT_IN_MODIFY_DATA === 'true';
  if (optIn) {
    console.warn('[Integration Tests] WARNING: Data-modifying tests are enabled. Real user data may be modified.');
  }
  return optIn;
}

/**
 * Get test credentials from plain environment variables (not VITE_-prefixed)
 * These are read in Node test environment, not exposed to browser bundle
 * Never hardcode credentials!
 */
export function getTestCredentials(): { email: string; password: string } {
  // Try to get from process.env first (may not be set yet if config didn't propagate)
  let email = process.env.COGNITO_TEST_EMAIL;
  let password = process.env.COGNITO_TEST_PASSWORD;
  
  // If not set, check if vitest env config loaded them but didn't export to process.env
  // In that case, we need to read from the env object that was passed to the setup
  if (!email || !password) {
    // This is a fallback - in a proper setup, vitest should have set these
    console.warn('[Integration Tests] COGNITO_TEST_EMAIL or COGNITO_TEST_PASSWORD not in process.env');
    console.warn('[Integration Tests] Check if .env.test-integration exists and is readable');
  }
  
  if (!email || !password) {
    throw new Error(
      'Test credentials not configured. Set environment variables:\n' +
      '  COGNITO_TEST_EMAIL=<valid-test-email>\n' +
      '  COGNITO_TEST_PASSWORD=<valid-test-password>\n\n' +
      'Create .env.test-integration with these variables in the project root.\n' +
      'See .env.test-integration.example for the format.'
    );
  }
  
  return { email, password };
}

/**
 * Verify test can safely modify data
 * Ensures INTEGRATION_OPT_IN_MODIFY_DATA is explicitly set to true
 */
export function assertCanModifyData(testName: string): void {
  if (!shouldRunDataModifyingTests()) {
    throw new Error(
      `[${testName}] Data-modifying test requires INTEGRATION_OPT_IN_MODIFY_DATA=true. ` +
      `Set this flag only in isolated test environments.`
    );
  }
}

/**
 * Generate a unique test email to avoid conflicts
 */
export function generateTestEmail(prefix: string = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}+${timestamp}+${random}@integration-test.example.com`;
}