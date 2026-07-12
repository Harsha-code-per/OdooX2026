/**
 * API Response Types
 *
 * Mirror the standard response format defined in 04-api-contract.md.
 * All API responses follow this envelope pattern.
 */

/* ─── Standard Response Envelope ──────────────────────────────────────────── */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

/* ─── Pagination ───────────────────────────────────────────────────────────── */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

/* ─── HTTP Status Codes ────────────────────────────────────────────────────── */
export type HttpStatus =
  | 200
  | 201
  | 204
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429
  | 500;

/* ─── API Client Config ────────────────────────────────────────────────────── */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}
