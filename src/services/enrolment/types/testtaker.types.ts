/**
 * Test Taker Types
 * Generated from Enrolment Service OpenAPI specification
 * 
 * Endpoint: /test-takers/v1/me
 * Authentication: Bearer token (required)
 */

/**
 * Gender enumeration values
 * Must match OpenAPI contract exactly
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

/**
 * Create Test Taker Request
 * POST /test-takers/v1/me
 * 
 * Persists test taker profile information after sign-up completion.
 * Called after email verification in the confirm-signup flow.
 */
export interface CreateTestTakerRequest {
  /** Given (first) name: 1-256 characters */
  givenName: string;
  
  /** Family (last) name: 1-256 characters */
  familyName: string;
  
  /** Date of birth in YYYY-MM-DD format */
  dateOfBirth: string;
  
  /** Gender preference */
  gender: Gender;
}

/**
 * Update Test Taker Request
 * PUT /test-takers/v1/me
 * 
 * Updates existing test taker profile information.
 * Same schema as create request.
 */
export interface UpdateTestTakerRequest extends CreateTestTakerRequest {}

/**
 * Test Taker Response
 * GET /test-takers/v1/me
 * 
 * Retrieves the current test taker's profile information.
 * 
 * NOTE: OpenAPI spec does not define response schema for 200 responses.
 * Based on endpoint design patterns, response likely includes the same fields
 * submitted in POST/PUT requests. Additional fields may be returned by backend.
 * 
 * Minimum guaranteed fields from POST/PUT request:
 * - givenName (1-256 chars)
 * - familyName (1-256 chars)
 * - dateOfBirth (YYYY-MM-DD)
 * - gender (enum)
 */
export interface TestTakerResponse {
  givenName?: string;
  familyName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  // Additional fields may be present in response — backend to confirm
  [key: string]: unknown;
}

/**
 * Error Response
 * Common error response for all endpoints
 */
export interface ErrorResponse {
  message: string;
}

/**
 * API Health Check Response
 * GET /public/v1/health
 * 
 * Public endpoint (no authentication required)
 */
export interface HealthCheckResponse {
  // Schema not specified in OpenAPI
  // Expected to be a simple OK response
}
