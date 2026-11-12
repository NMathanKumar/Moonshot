/**
 * Enrolment Service
 * API client for the IDP Enrolment Service (test-taker focused)
 *
 * Base URL: https://hih3u10m2i.execute-api.ap-southeast-1.amazonaws.com/dev
 * Authentication: Bearer token (Cognito access token) for protected endpoints
 *
 * Endpoints:
 * - GET/POST/PUT/DELETE /test-takers/v1/me — Test taker profile management
 * - GET /public/v1/health — Service health check (public)
 */

export * from './testtaker';
export * from './health';
export * from './types';
