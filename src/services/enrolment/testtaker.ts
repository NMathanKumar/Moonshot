/**
 * Test Taker Service
 * API client for /test-takers/v1/me endpoints
 *
 * Manages test taker profile information.
 * All endpoints require Bearer token authentication.
 */

import { apiRequest } from '../apiClient';
import { CreateTestTakerRequest, UpdateTestTakerRequest, TestTakerResponse } from './types';

/**
 * Get the current test taker's profile
 *
 * GET /test-takers/v1/me
 *
 * @returns Test taker profile information
 * @throws ApiError if not authenticated (401) or request fails
 */
export async function getTestTaker(): Promise<TestTakerResponse | null> {
  try {
    const response = await apiRequest<TestTakerResponse>('/test-takers/v1/me', 'GET');
    return response.data || null;
  } catch (error) {
    console.error('getTestTaker: Failed to fetch test taker profile:', error);
    throw error;
  }
}

/**
 * Create a new test taker profile
 *
 * POST /test-takers/v1/me
 *
 * Called after sign-up completion and email verification.
 * Persists the test taker's profile information to the Enrolment Service.
 *
 * @param data - Test taker profile data (givenName, familyName, dateOfBirth, gender)
 * @returns Created test taker profile
 * @throws ApiError if validation fails (400), not authenticated (401), or request fails (422)
 */
export async function createTestTaker(
  data: CreateTestTakerRequest
): Promise<TestTakerResponse | null> {
  try {
    console.log('createTestTaker: Persisting profile to Enrolment Service:', {
      givenName: data.givenName,
      familyName: data.familyName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
    });

    const response = await apiRequest<TestTakerResponse>('/test-takers/v1/me', 'POST', data);

    console.log('createTestTaker: Profile persisted successfully');
    return response.data || null;
  } catch (error) {
    console.error('createTestTaker: Failed to create test taker profile:', error);
    throw error;
  }
}

/**
 * Update the current test taker's profile
 *
 * PUT /test-takers/v1/me
 *
 * Updates an existing test taker profile.
 *
 * @param data - Updated test taker profile data
 * @returns Updated test taker profile
 * @throws ApiError if validation fails (400), not authenticated (401), or request fails (422)
 */
export async function updateTestTaker(
  data: UpdateTestTakerRequest
): Promise<TestTakerResponse | null> {
  try {
    console.log('updateTestTaker: Updating profile in Enrolment Service');

    const response = await apiRequest<TestTakerResponse>('/test-takers/v1/me', 'PUT', data);

    console.log('updateTestTaker: Profile updated successfully');
    return response.data || null;
  } catch (error) {
    console.error('updateTestTaker: Failed to update test taker profile:', error);
    throw error;
  }
}

/**
 * Delete the current test taker's profile
 *
 * DELETE /test-takers/v1/me
 *
 * Removes the test taker's profile from the Enrolment Service.
 *
 * @throws ApiError if not authenticated (401) or request fails
 */
export async function deleteTestTaker(): Promise<void> {
  try {
    console.log('deleteTestTaker: Deleting profile from Enrolment Service');

    await apiRequest<void>('/test-takers/v1/me', 'DELETE');

    console.log('deleteTestTaker: Profile deleted successfully');
  } catch (error) {
    console.error('deleteTestTaker: Failed to delete test taker profile:', error);
    throw error;
  }
}
