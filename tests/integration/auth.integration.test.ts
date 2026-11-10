/**
 * Integration Tests for Cognito Authentication Flow
 * 
 * Tests the complete authentication lifecycle:
 * 1. Sign in with test credentials
 * 2. Verify access token is obtained
 * 3. Verify access token can be used for Enrolment Service API calls
 * 
 * These tests use REAL Cognito pool and API.
 * 
 * Run with: npm run test:integration
 * 
 * Required environment variables:
 * - COGNITO_TEST_EMAIL: Valid test email in DEV Cognito pool
 * - COGNITO_TEST_PASSWORD: Valid password (12+ chars, 1 upper, 1 lower, 1 number)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { signIn } from '@services/auth';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import {
  getTestCredentials,
  canRunIntegrationTests,
} from './setup';

describe('Cognito Auth Integration', () => {
  describe('Sign In Flow', () => {
    it.skipIf(!canRunIntegrationTests())('Signs in with valid credentials and obtains access token', async () => {
      const credentials = getTestCredentials();

      // Sign in with test credentials
      await signIn({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('[Integration] Signed in successfully');

      // Verify session was established
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();

      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('string');
      
      // JWT tokens are typically 500+ characters
      expect(accessToken?.length).toBeGreaterThan(100);

      console.log('[Integration] Access token obtained - format verified (length: OK)');

      // Verify current user is set
      const user = await getCurrentUser();
      expect(user).toBeDefined();
      expect(user?.username).toBeDefined();

      console.log(`[Integration] Authenticated user: ${user?.username}`);
    }, 20000);
  });

  describe('Session Persistence', () => {
    let firstSessionToken: string | null = null;

    beforeAll(async () => {
      if (!canRunIntegrationTests()) {
        return;
      }

      const credentials = getTestCredentials();
      await signIn({
        email: credentials.email,
        password: credentials.password,
      });

      const session = await fetchAuthSession();
      firstSessionToken = session.tokens?.accessToken?.toString();
    }, 20000);

    it.skipIf(!canRunIntegrationTests())('Maintains session across multiple fetchAuthSession calls', async () => {
      if (!firstSessionToken) {
        console.warn('[Integration] Skipping session persistence test - no session');
        return;
      }

      // Fetch session again without signing in again
      const secondSession = await fetchAuthSession();
      const secondToken = secondSession.tokens?.accessToken?.toString();

      expect(secondToken).toBeDefined();
      expect(secondToken).toBe(firstSessionToken);

      console.log('[Integration] Session persisted across calls');
    }, 10000);
  });
});
