/**
 * Environment Configuration
 * Typed access to VITE_ environment variables
 */

export interface Env {
  VITE_API_BASE_URL: string;
  VITE_APP_NAME: string;
  VITE_APP_VERSION?: string;
  VITE_ENABLE_MOCK_SERVER: string;
  VITE_ENABLE_ANALYTICS: string;
  VITE_COGNITO_REGION: string;
  VITE_COGNITO_USER_POOL_ID: string;
  VITE_COGNITO_USER_POOL_CLIENT_ID: string;
  VITE_COGNITO_DOMAIN: string;
  VITE_REDIRECT_SIGN_IN: string;
  VITE_REDIRECT_SIGN_OUT: string;
}

/**
 * Returns the environment variables loaded at build time.
 * Only variables prefixed with VITE_ are exposed to the client bundle.
 */
export function getEnv(): Env {
  return {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    VITE_ENABLE_MOCK_SERVER: import.meta.env.VITE_ENABLE_MOCK_SERVER,
    VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
    VITE_COGNITO_REGION: import.meta.env.VITE_COGNITO_REGION,
    VITE_COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    VITE_COGNITO_USER_POOL_CLIENT_ID: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    VITE_COGNITO_DOMAIN: import.meta.env.VITE_COGNITO_DOMAIN,
    VITE_REDIRECT_SIGN_IN: import.meta.env.VITE_REDIRECT_SIGN_IN,
    VITE_REDIRECT_SIGN_OUT: import.meta.env.VITE_REDIRECT_SIGN_OUT,
  };
}