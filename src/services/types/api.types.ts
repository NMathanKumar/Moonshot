/**
 * API Types
 * Shared types for API responses and errors
 */

export type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  status: number;
  statusText: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = unknown> {
  data?: T[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * API Error class for unified error handling
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
