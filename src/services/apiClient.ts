/**
 * API Client
 * Reusable HTTP client using native fetch
 */

import { fetchAuthSession } from 'aws-amplify/auth';

// Global auth token (optional, Bearer token) - DEPRECATED: Use Amplify auth session instead
let authToken: string | null = null;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestInit extends RequestInit {
  headers?: HeadersInit;
  body?: BodyInit | null;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  status: number;
  statusText: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * DEPRECATED: Set the Bearer token for authenticated requests
 * Use fetchAuthSession() from aws-amplify/auth instead
 */
export function setAuthToken(token: string): void {
  authToken = token;
}

/**
 * DEPRECATED: Clear the Bearer token
 * Use clearAuthToken() for backwards compatibility, but prefer Amplify auth session
 */
export function clearAuthToken(): void {
  authToken = null;
}

/**
 * DEPRECATED: Get the current Bearer token
 * Prefer getCurrentAmplifyAccessToken() for Amplify v6 integration
 */
export function getAuthToken(): string | null {
  return authToken;
}

/**
 * Get the current access token from Amplify auth session
 * Returns null if no session exists or token is unavailable
 */
export async function getCurrentAmplifyAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() ?? null;
  } catch (error) {
    // Session not available or fetch failed - return null for public requests
    return null;
  }
}

/**
 * Build the full URL for an API endpoint
 */
function buildUrl(path: string): string {
  // Try process.env first (for Node test environment)
  // Then fall back to import.meta.env (for Vite browser build)
  const baseUrl =
    process.env.VITE_API_BASE_URL ||
    (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_BASE_URL : undefined);

  if (!baseUrl) {
    throw new Error(
      'VITE_API_BASE_URL is not configured. ' + 'Check .env.development or environment variables.'
    );
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
}

/**
 * Check for HTTP error status codes
 */
function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

/**
 * Parse JSON response safely
 */
async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new ApiError(
        response.status,
        response.statusText,
        'Failed to parse JSON response',
        error
      );
    }
  }
  throw new ApiError(
    response.status,
    response.statusText,
    'Expected JSON response but content-type is not application/json'
  );
}

/**
 * Make an authenticated HTTP request
 */
export async function apiRequest<T = unknown>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<ApiResponse<T>> {
  const url = buildUrl(path);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Get token from Amplify auth session (preferred) or fall back to global token
  const amplifyToken = await getCurrentAmplifyAccessToken();
  const fallbackToken = authToken; // DEPRECATED: global token

  const accessToken = amplifyToken ?? fallbackToken;

  // Add Bearer token if available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const requestInit: ApiRequestInit = {
    method,
    headers,
    body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
  };

  let response: Response;

  try {
    response = await fetch(url, requestInit);
  } catch (networkError) {
    throw new ApiError(
      0,
      'Network Error',
      'Network request failed. Please check your connection.',
      networkError
    );
  }

  // Handle 204 No Content - no body to parse
  if (response.status === 204) {
    return {
      data: undefined,
      status: response.status,
      statusText: response.statusText,
    };
  }

  const responseClone = response.clone();
  let responseJson: T | undefined;
  let parseError: Error | undefined;

  try {
    responseJson = await parseJsonResponse<T>(responseClone);
  } catch (err) {
    parseError = err as Error;
  }

  if (parseError) {
    // Non-JSON response - return raw text as details
    const text = await responseClone.text();
    throw new ApiError(response.status, response.statusText, parseError.message, text);
  }

  if (!isSuccessStatus(response.status)) {
    const errorMessage =
      typeof responseJson === 'object' && responseJson !== null
        ? (responseJson as Record<string, unknown>).message
        : undefined;

    throw new ApiError(
      response.status,
      response.statusText,
      typeof errorMessage === 'string' ? errorMessage : response.statusText || 'An error occurred',
      responseJson
    );
  }

  return {
    data: responseJson,
    status: response.status,
    statusText: response.statusText,
  };
}

/**
 * GET request helper
 */
export async function apiGet<T = unknown>(path: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, 'GET');
}

/**
 * POST request helper
 */
export async function apiPost<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, 'POST', body);
}

/**
 * PUT request helper
 */
export async function apiPut<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, 'PUT', body);
}

/**
 * PATCH request helper
 */
export async function apiPatch<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, 'PATCH', body);
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = unknown>(path: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, 'DELETE');
}
