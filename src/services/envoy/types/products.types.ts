/**
 * Products Types
 * Types for the Products API (/public/v1/products)
 */

export interface Product {
  /**
   * Unique identifier for the product
   */
  id: string;

  /**
   * Product name (e.g., "IDP English Test")
   */
  name: string;

  /**
   * Product description
   */
  description: string;

  /**
   * Product category or type
   */
  category?: string;

  /**
   * Price in the currency's smallest unit (e.g., cents)
   */
  price?: {
    amount: number;
    currency: string;
  };

  /**
   * Whether the product is available for purchase
   */
  available?: boolean;

  /**
   * Timestamp when the product was created
   */
  createdAt?: string;

  /**
   * Timestamp when the product was last updated
   */
  updatedAt?: string;
}

/**
 * Response from GET /public/v1/products
 */
export interface GetProductsResponse {
  /**
   * Array of products
   */
  data?: Product[];

  /**
   * Pagination metadata (optional, per Swagger spec)
   */
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * Request body for creating a product
 */
export interface CreateProductRequest {
  name: string;
  description: string;
  category?: string;
  price?: {
    amount: number;
    currency: string;
  };
}

/**
 * Request body for updating a product
 */
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  category?: string;
  price?: {
    amount: number;
    currency: string;
  };
  available?: boolean;
}
