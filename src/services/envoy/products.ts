/**
 * Products Service
 * API client for /public/v1/products endpoint
 */

import { apiGet } from '../apiClient';
import { GetProductsResponse } from './types/products.types';

/**
 * Get all available products
 *
 * GET /public/v1/products
 */
export async function getProducts(): Promise<GetProductsResponse> {
  const response = await apiGet<GetProductsResponse>('/public/v1/products');
  return response.data || {};
}
