/**
 * Products Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiClientModule from '../apiClient';
import { getProducts } from './products';

describe('products service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches products from the API', async () => {
    const mockResponse = {
      data: [
        {
          id: 'prod-1',
          name: 'IDP English Test',
          description: 'Official IDP English proficiency test',
          category: 'proficiency',
          price: { amount: 30000, currency: 'AUD' },
          available: true,
        },
      ],
      pagination: {
        total: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    };

    const mockApiGet = vi.spyOn(apiClientModule, 'apiGet');
    mockApiGet.mockResolvedValue({ data: mockResponse, status: 200, statusText: 'OK' });

    const result = await getProducts();

    expect(mockApiGet).toHaveBeenCalledWith('/public/v1/products');
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0].name).toBe('IDP English Test');
    expect(result.pagination).toEqual(mockResponse.pagination);
  });

  it('returns empty data when API returns no data', async () => {
    const mockApiGet = vi.spyOn(apiClientModule, 'apiGet');
    mockApiGet.mockResolvedValue({ data: {}, status: 200, statusText: 'OK' });

    const result = await getProducts();

    expect(mockApiGet).toHaveBeenCalledWith('/public/v1/products');
    expect(result.data).toBeUndefined();
  });

  it('throws ApiError for failed requests', async () => {
    const mockApiGet = vi.spyOn(apiClientModule, 'apiGet');
    mockApiGet.mockRejectedValue(new apiClientModule.ApiError(404, 'Not Found', 'Not found'));

    await expect(getProducts()).rejects.toThrow('Not found');
  });
});
