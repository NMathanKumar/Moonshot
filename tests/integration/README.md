# Integration Tests - DEV Environment

This directory contains integration tests that run against the **real DEV environment**:

- Real AWS Cognito User Pool: `ap-southeast-1_OyLXCWR59`
- Real Enrolment Service API: `https://hih3u10m2i.execute-api.ap-southeast-1.amazonaws.com/dev`

## Prerequisites

### 1. Valid Test Account in Cognito

You must have a real test account that exists in the DEV Cognito pool:

```bash
# Create a test account (manually via AWS Console or using Cognito CLI)
# Example: testuser@idp-english-test.com / SecurePass123!
```

### 2. Environment Variables

Create `.env.test-integration` in the project root **(gitignored - never commit credentials!)**:

```env
# Plain environment variables (NOT VITE_-prefixed)
# Read in Node test environment, not exposed to browser bundle
COGNITO_TEST_EMAIL=testuser@example.com
COGNITO_TEST_PASSWORD=SecurePass123!

# Enable data-modifying tests (create/update/delete user data)
# Default: false (data-modifying tests will be skipped)
# Set to "true" ONLY in isolated test environments
INTEGRATION_OPT_IN_MODIFY_DATA=false
```

**Security:**

- Environment variables are NOT prefixed with `VITE_` (Node-only, not browser-exposed)
- Never commit `.env.test-integration` to source control
- For CI/CD, set variables as secrets

### 3. Verify DEV Configuration

The tests verify Amplify is configured with the correct DEV credentials:

```typescript
// From tests/integration/setup.ts
canRunIntegrationTests() // Checks:
  ✓ VITE_COGNITO_USER_POOL_ID === 'ap-southeast-1_OyLXCWR59'
  ✓ VITE_COGNITO_USER_POOL_CLIENT_ID === '5vb0inbm5cson031am1buja73i'
  ✓ VITE_API_BASE_URL includes 'execute-api.ap-southeast-1.amazonaws.com/dev'
```

If DEV config is not present, all integration tests are skipped.

## Running Tests

### All Integration Tests

```bash
npm run test:integration
```

### Specific Test File

```bash
npm run test:integration -- auth.integration.test
```

### With Custom Timeout

```bash
npm run test:integration -- --testTimeout 60000
```

### Unit Tests (excludes integration tests)

```bash
npm run test:run  # Uses vitest.config.ts (integration tests excluded)
```

## Test Suites

### 1. `auth.integration.test.ts` - Cognito Authentication

Tests real authentication flow:

- **Sign In**: Authenticates with test credentials, obtains access token
- **Session Persistence**: Verifies session remains valid across multiple calls
- **Current User**: Confirms user information is available after sign-in

**Requirements:** COGNITO_TEST_EMAIL + COGNITO_TEST_PASSWORD

### 2. `api.integration.test.ts` - Enrolment Service API

Tests real API endpoints:

#### Public Endpoints (no auth)

- **GET /public/v1/health**: Service health check

#### Authenticated Endpoints (requires valid session)

- **GET /test-takers/v1/me**: Retrieves test taker profile
  - Verifies response matches OpenAPI schema
  - Validates enum values (e.g., gender)

#### Data-Modifying Endpoints (requires INTEGRATION_OPT_IN_MODIFY_DATA=true)

- **POST /test-takers/v1/me**: Creates new test taker profile
  - Validates OpenAPI request contract
  - Verifies response matches schema
  - Only runs if `INTEGRATION_OPT_IN_MODIFY_DATA=true`

## OpenAPI Compliance

All tests verify requests and responses match the OpenAPI specification in `openapi (1).yaml`:

### POST /test-takers/v1/me

**Request Body** (all fields required):

```json
{
  "givenName": "string (1-256 chars)",
  "familyName": "string (1-256 chars)",
  "dateOfBirth": "YYYY-MM-DD format",
  "gender": "MALE | FEMALE | OTHER | PREFER_NOT_TO_SAY"
}
```

**Response** (200 OK):

- Returns test taker profile matching request schema
- Fields should echo the submitted values

**Errors**:

- 400: Invalid request format
- 401: Missing/invalid Bearer token
- 422: Invalid JSON body

## Data-Modifying Tests

### Protection Against Accidental Data Modification

Data-modifying tests (POST, PUT, DELETE) require EXPLICIT OPT-IN:

```bash
# Default: skipped
INTEGRATION_OPT_IN_MODIFY_DATA=false npm run test:integration

# Enable data-modifying tests
INTEGRATION_OPT_IN_MODIFY_DATA=true npm run test:integration
```

**When enabled, tests will:**

- Create test profiles in Enrolment Service
- Potentially update or delete existing test data
- Require valid test account credentials

**Safety measures:**

- Each test generates a unique test email
- Tests verify data was created with correct values
- No cleanup is performed (allows manual verification)

## Troubleshooting

### "Test credentials not configured"

Set environment variables:

```bash
export COGNITO_TEST_EMAIL=your-test@example.com
export COGNITO_TEST_PASSWORD=YourPassword123
npm run test:integration
```

### "DEV environment not configured"

Verify `.env.development` has correct DEV credentials:

```env
VITE_COGNITO_USER_POOL_ID=ap-southeast-1_OyLXCWR59
VITE_COGNITO_USER_POOL_CLIENT_ID=5vb0inbm5cson031am1buja73i
VITE_API_BASE_URL=https://hih3u10m2i.execute-api.ap-southeast-1.amazonaws.com/dev
```

### "401 Unauthorized"

Access token may be expired:

1. Verify test account exists in Cognito pool
2. Verify password is correct
3. Try signing in again with fresh credentials

### "Network Error"

1. Check internet connection
2. Verify AWS services are accessible
3. Check if DEV environment is deployed

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run integration tests
  env:
    COGNITO_TEST_EMAIL: ${{ secrets.COGNITO_TEST_EMAIL }}
    COGNITO_TEST_PASSWORD: ${{ secrets.COGNITO_TEST_PASSWORD }}
    INTEGRATION_OPT_IN_MODIFY_DATA: 'false' # Never auto-enable in CI
  run: npm run test:integration
```

**Never set `INTEGRATION_OPT_IN_MODIFY_DATA=true` in CI** unless you have isolated test data.

## Separation from Unit Tests

### Unit Tests (vitest.config.ts)

```bash
npm run test:run  # Excludes tests/integration/**
```

- Run in jsdom environment
- Use mocked Cognito and APIs
- Fast, no network calls
- Run on every commit/PR

### Integration Tests (vitest.config.integration.ts)

```bash
npm run test:integration  # Includes tests/integration/** only
```

- Run in Node environment
- Use real AWS services
- Require valid credentials
- Slower, may fail due to network/service issues
- Run manually or in staging/release CI

## Logs and Debugging

Integration tests log detailed information:

```
[Integration] Health check OK - Enrolment Service is available
[Integration] Signed in successfully
[Integration] Access token obtained - format verified (length: OK)
[Integration] Authenticated user: test+1701234567+abc123@example.com
[Integration] GET /test-takers/v1/me returned valid profile
```

Logs help verify:

- Amplify initialized with DEV config
- Cognito sign-in succeeded
- Token format is correct
- API calls completed
- Response schemas are valid
