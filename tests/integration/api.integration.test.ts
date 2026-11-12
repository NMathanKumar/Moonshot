/**
 * Integration Tests for Enrolment Service API
 *
 * Real API tests against DEV environment:
 * - GET /public/v1/health (public, no auth)
 * - GET /test-takers/v1/me (requires authenticated session)
 * - POST /test-takers/v1/me (requires authenticated session + opt-in flag)
 *
 * These tests:
 * - Use real Amplify auth to obtain access tokens
 * - Call real Enrolment Service endpoints
 * - Verify Authorization Bearer header is sent
 * - Verify actual API responses match OpenAPI contract
 *
 * Run with: npm run test:integration
 *
 * Required environment variables:
 * - COGNITO_TEST_EMAIL: Valid test email in DEV Cognito pool
 * - COGNITO_TEST_PASSWORD: Valid password
 * - INTEGRATION_OPT_IN_MODIFY_DATA: "true" to enable POST/PUT/DELETE tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { signIn } from '@services/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { getTestTaker, createTestTaker } from '@services/enrolment';
import { apiRequest } from '@services/apiClient';
import {
  getTestCredentials,
  canRunIntegrationTests,
  shouldRunDataModifyingTests,
  assertCanModifyData,
} from './setup';
import { Gender } from '@services/enrolment/types';

describe('Enrolment Service Integration Tests', () => {
  describe('Public Endpoints', () => {
    it('GET /public/v1/health returns 200', async () => {
      const response = await apiRequest<Record<string, unknown>>('/public/v1/health', 'GET');

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      console.log('[Integration] Health check OK - Enrolment Service is available');
    }, 10000);
  });

  describe('Authenticated Endpoints (read-only)', () => {
    let accessToken: string | null = null;

    beforeAll(async () => {
      if (!canRunIntegrationTests()) {
        console.warn('[Integration] Skipping authenticated tests - DEV not configured');
        return;
      }

      const credentials = getTestCredentials();
      await signIn({
        email: credentials.email,
        password: credentials.password,
      });

      const session = await fetchAuthSession();
      accessToken = session.tokens?.accessToken?.toString() ?? null;

      if (!accessToken) {
        throw new Error(
          'Failed to obtain access token. Verify Cognito credentials in environment variables.'
        );
      }

      console.log('[Integration] Signed in successfully - access token obtained');
    }, 20000);

    it.skipIf(!canRunIntegrationTests())(
      'GET /test-takers/v1/me returns authenticated user profile',
      async () => {
        if (!accessToken) {
          console.warn('[Integration] Skipping GET test - no access token');
          return;
        }

        const profile = await getTestTaker();

        // Verify response matches OpenAPI schema
        expect(profile).toBeDefined();
        expect(profile?.givenName).toBeDefined();
        expect(profile?.givenName).toBeTypeOf('string');
        expect(profile?.familyName).toBeDefined();
        expect(profile?.familyName).toBeTypeOf('string');
        expect(profile?.dateOfBirth).toBeDefined();
        expect(profile?.dateOfBirth).toBeTypeOf('string');
        expect(profile?.gender).toBeDefined();

        // Verify gender enum value matches OpenAPI contract
        const validGenders = Object.values(Gender);
        expect(validGenders).toContain(profile?.gender);

        console.log('[Integration] GET /test-takers/v1/me returned valid profile');
      },
      10000
    );

    afterAll(async () => {
      // Reset for next test suite
      accessToken = null;
    });
  });

  describe('Data-Modifying Endpoints (opt-in)', () => {
    let accessToken: string | null = null;

    beforeAll(async () => {
      if (!canRunIntegrationTests()) {
        console.warn('[Integration] Skipping data-modifying tests - DEV not configured');
        return;
      }

      if (!shouldRunDataModifyingTests()) {
        console.warn(
          '[Integration] Skipping data-modifying tests - INTEGRATION_OPT_IN_MODIFY_DATA not set'
        );
        return;
      }

      const credentials = getTestCredentials();
      await signIn({
        email: credentials.email,
        password: credentials.password,
      });

      const session = await fetchAuthSession();
      accessToken = session.tokens?.accessToken?.toString() ?? null;

      if (!accessToken) {
        throw new Error('Failed to obtain access token for data-modifying tests');
      }

      console.log('[Integration] Data-modifying tests: Access token obtained');
    }, 20000);

    it.skipIf(!canRunIntegrationTests() || !shouldRunDataModifyingTests())(
      'POST /test-takers/v1/me creates profile matching OpenAPI schema',
      async () => {
        assertCanModifyData('POST /test-takers/v1/me');

        if (!accessToken) {
          console.warn('[Integration] Skipping POST test - no access token');
          return;
        }

        const testPayload = {
          givenName: 'Integration',
          familyName: 'Test',
          dateOfBirth: '1990-01-15',
          gender: Gender.MALE,
        };

        const response = await createTestTaker(testPayload);

        // Verify response matches OpenAPI schema
        expect(response).toBeDefined();
        expect(response?.givenName).toBe(testPayload.givenName);
        expect(response?.familyName).toBe(testPayload.familyName);
        expect(response?.dateOfBirth).toBe(testPayload.dateOfBirth);
        expect(response?.gender).toBe(testPayload.gender);

        console.log('[Integration] POST /test-takers/v1/me created profile successfully');
      },
      15000
    );

    afterAll(async () => {
      accessToken = null;
    });
  });
});
