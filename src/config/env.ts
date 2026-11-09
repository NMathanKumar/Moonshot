/**
 * Environment Configuration
 * Typed access to VITE_ environment variables
 */

export interface Env {
  VITE_API_BASE_URL: string;
  VITE_APP_NAME: string;
  VITE_ENABLE_MOCK_SERVER: string;
  VITE_ENABLE_ANALYTICS: string;
}

/**
 * Returns the environment variables loaded at build time.
 * Only variables prefixed with VITE_ are exposed to the client bundle.
 */
export function getEnv(): Env {
  return {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_ENABLE_MOCK_SERVER: import.meta.env.VITE_ENABLE_MOCK_SERVER,
    VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
  };
}