/**
 * API Client Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  getCurrentAmplifyAccessToken,
  ApiError,
} from './apiClient';
import { fetchAuthSession, type AuthSession, type JWT } from 'aws-amplify/auth';

// Mock environment variables
vi.mock('../config/env', () => ({
  getEnv: () => ({
    VITE_API_BASE_URL: 'http://localhost:8080',
    VITE_APP_NAME: 'Test App',
    VITE_APP_VERSION: '1.0.0',
    VITE_ENABLE_MOCK_SERVER: 'false',
    VITE_ENABLE_ANALYTICS: 'false',
    VITE_COGNITO_REGION: 'us-east-1',
    VITE_COGNITO_USER_POOL_ID: 'test-pool-id',
    VITE_COGNITO_USER_POOL_CLIENT_ID: 'test-client-id',
  }),
}));

// Mock aws-amplify/auth fetchAuthSession
vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn(),
}));

// Mock fetch globally
const mockFetch = vi.fn();

// Helper to create a mock JWT token
function createMockJWT(): JWT {
  return {
    payload: { sub: 'test-user' },
    header: { alg: 'RS256' },
    signature: 'test-signature',
    toString: () =>
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.test-signature',
  } as JWT;
}

beforeEach(() => {
  global.fetch = mockFetch;
  clearAuthToken();
  vi.clearAllMocks();
  // Default mock - no auth session (tokens is omitted)
  vi.mocked(fetchAuthSession).mockResolvedValue({} as AuthSession);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('apiClient', () => {
  describe('setAuthToken / getAuthToken / clearAuthToken', () => {
    it('sets auth token', () => {
      setAuthToken('test-token-123');
      expect(getAuthToken()).toBe('test-token-123');
    });

    it('gets auth token', () => {
      setAuthToken('my-token');
      expect(getAuthToken()).toBe('my-token');
    });

    it('clears auth token', () => {
      setAuthToken('some-token');
      clearAuthToken();
      expect(getAuthToken()).toBeNull();
    });
  });

  describe('apiRequest', () => {
    const mockData = { id: 1, name: 'Test Product' };
    const mockError = { message: 'Not found' };

    it('makes GET request with correct method', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await apiRequest('/products', 'GET');

      expect(result.data).toEqual(mockData);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('makes POST request with body', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await apiRequest('/products', 'POST', { name: 'New Product' });

      expect(result.data).toEqual({ success: true });
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'New Product' }),
        })
      );
    });

    it('makes PUT request with body', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ updated: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await apiPut('/products/1', { name: 'Updated Product' });

      expect(result.data).toEqual({ updated: true });
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated Product' }),
        })
      );
    });

    it('makes PATCH request with body', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ patched: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await apiPatch('/products/1', { price: 29.99 });

      expect(result.data).toEqual({ patched: true });
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ price: 29.99 }),
        })
      );
    });

    it('makes DELETE request', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(null, {
          status: 204,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await apiDelete('/products/1');

      expect(result.data).toBeUndefined();
      expect(result.status).toBe(204);
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('includes Authorization header when Amplify token is available', async () => {
      vi.mocked(fetchAuthSession).mockResolvedValueOnce({
        tokens: { accessToken: createMockJWT() },
      } as AuthSession);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await apiGet('/products');

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer ' + createMockJWT().toString(),
          }),
        })
      );
    });

    it('includes Authorization header when fallback token is set (deprecated)', async () => {
      vi.mocked(fetchAuthSession).mockResolvedValueOnce({} as AuthSession);
      setAuthToken('my-bearer-token');
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await apiGet('/products');

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-bearer-token',
          }),
        })
      );
    });

    it('prefers Amplify token over fallback token', async () => {
      const mockToken = createMockJWT();
      vi.mocked(fetchAuthSession).mockResolvedValueOnce({
        tokens: { accessToken: mockToken },
      } as AuthSession);
      setAuthToken('fallback-token');
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await apiGet('/products');

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer ' + mockToken.toString(),
          }),
        })
      );
    });

    it('does not include Authorization header when no token is available', async () => {
      vi.mocked(fetchAuthSession).mockResolvedValueOnce({} as AuthSession);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await apiGet('/products');

      const fetchCall = mockFetch.mock.calls[0];
      const headers = fetchCall[1]?.headers as Record<string, string>;

      expect(headers).not.toHaveProperty('Authorization');
    });

    it('sets Content-Type header', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await apiGet('/products');

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('throws ApiError for HTTP errors', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify(mockError), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const promise = apiGet('/products');

      await expect(promise).rejects.toBeInstanceOf(ApiError);
      await expect(promise).rejects.toThrow('Not found');
    });

    it('throws ApiError for network failures', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const promise = apiGet('/products');

      await expect(promise).rejects.toBeInstanceOf(ApiError);
      await expect(promise).rejects.toThrow(
        'Network request failed. Please check your connection.'
      );
    });

    it('handles non-JSON responses gracefully', async () => {
      mockFetch.mockResolvedValue(
        new Response('Plain text response', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        })
      );

      const promise = apiGet('/products');

      await expect(promise).rejects.toBeInstanceOf(ApiError);
      await expect(promise).rejects.toThrow(
        'Expected JSON response but content-type is not application/json'
      );
    });
  });

  describe('apiGet', () => {
    it('is a GET shortcut', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await apiGet('/products');

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('apiPost', () => {
    it('is a POST shortcut with body', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ created: true }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await apiPost('/products', { name: 'Test' });

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test' }),
        })
      );
    });
  });

  describe('apiPut', () => {
    it('is a PUT shortcut with body', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ updated: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await apiPut('/products/1', { name: 'Updated' });

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated' }),
        })
      );
    });
  });

  describe('apiPatch', () => {
    it('is a PATCH shortcut with body', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ patched: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await apiPatch('/products/1', { price: 19.99 });

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ price: 19.99 }),
        })
      );
    });
  });

  describe('apiDelete', () => {
    it('is a DELETE shortcut', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(null, {
          status: 204,
        })
      );

      await apiDelete('/products/1');

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('getCurrentAmplifyAccessToken', () => {
    it('returns access token from Amplify session', async () => {
      const mockToken = createMockJWT();
      vi.mocked(fetchAuthSession).mockResolvedValueOnce({
        tokens: { accessToken: mockToken },
      } as AuthSession);

      const token = await getCurrentAmplifyAccessToken();

      expect(token).toBe(mockToken.toString());
    });

    it('returns null when no session tokens exist', async () => {
      vi.mocked(fetchAuthSession).mockResolvedValueOnce({} as AuthSession);

      const token = await getCurrentAmplifyAccessToken();

      expect(token).toBeNull();
    });

    it('returns null when fetchAuthSession fails', async () => {
      vi.mocked(fetchAuthSession).mockRejectedValueOnce(new Error('Session not available'));

      const token = await getCurrentAmplifyAccessToken();

      expect(token).toBeNull();
    });
  });
});
