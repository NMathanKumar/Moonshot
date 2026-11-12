/**
 * AWS Amplify Configuration
 * Direct Amplify v6 SDK authentication with Cognito User Pool
 * Supports USER_SRP_AUTH for secure password-based authentication
 */

import { Amplify } from 'aws-amplify';
import { getEnv } from './env';

// Get environment variables using the typed config
const { VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_USER_POOL_CLIENT_ID, VITE_COGNITO_REGION } =
  getEnv();

/**
 * Amplify v6 configuration for direct SDK authentication
 *
 * This configuration enables:
 * - Direct SDK signIn() with USER_SRP_AUTH flow (no Hosted UI redirect)
 * - Direct SDK signUp() and confirmSignUp() for account creation
 * - Session management via fetchAuthSession()
 * - Automatic token refresh
 *
 * Prerequisite: Cognito App Client must have these auth flows enabled in AWS console:
 * - ALLOW_USER_SRP_AUTH (required for signIn with USER_SRP_AUTH)
 * - ALLOW_REFRESH_TOKEN_AUTH (for session refresh)
 */
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: VITE_COGNITO_REGION,
      userPoolId: VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: VITE_COGNITO_USER_POOL_CLIENT_ID,
      // Note: OAuth2 loginWith.oauth removed — only direct SDK auth is used
    },
  },
};

/**
 * Initialize Amplify with the configuration
 * Call this once at app entry point before using any Amplify services
 */
export function initializeAmplify(): void {
  Amplify.configure(amplifyConfig);
}

export { amplifyConfig };
