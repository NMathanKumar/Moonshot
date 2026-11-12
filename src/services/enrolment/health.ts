/**
 * Health Check Service
 * Public endpoint for Enrolment Service availability
 *
 * No authentication required
 */

import { apiRequest } from '../apiClient';

/**
 * Check Enrolment Service health
 *
 * GET /public/v1/health
 *
 * Public endpoint (no Bearer token required).
 * Can be used to verify API availability before making authenticated requests.
 *
 * @returns Success response if service is healthy
 * @throws ApiError if service is unavailable
 */
export async function checkHealth(): Promise<void> {
  try {
    console.log('checkHealth: Checking Enrolment Service availability');

    await apiRequest<Record<string, unknown>>('/public/v1/health', 'GET');

    console.log('checkHealth: Enrolment Service is healthy');
  } catch (error) {
    console.error('checkHealth: Enrolment Service health check failed:', error);
    throw error;
  }
}
