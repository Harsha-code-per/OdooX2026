import { API_BASE_URL, API_TIMEOUT_MS } from "@/constants/api";
import type { ApiError } from "@/types/api";

/**
 * ApiClient — Centralized HTTP client for all API requests.
 *
 * Rules (per AGENTS.md and 01-frontend-architecture.md):
 * - Components must NEVER call fetch() or axios() directly
 * - All requests flow through this client → services → React Query → components
 * - Never hardcode base URLs — use API_BASE_URL constant
 * - All requests are typed
 *
 * Phase 1: Basic implementation (no auth headers)
 * Phase 12: Will add JWT injection, token refresh interceptor, retry logic
 */

class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: "include" /* Include httpOnly cookies for JWT */,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: ApiError | undefined;
      try {
        errorData = (await response.json()) as ApiError;
      } catch {
        /* JSON parse failed — use status text */
      }

      throw new ApiClientError(
        response.status,
        errorData?.message ?? response.statusText,
        errorData?.errors,
      );
    }

    /* 204 No Content — return empty */
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError(408, "Request timed out. Please try again.");
    }

    throw new ApiClientError(0, "Network error. Please check your connection.");
  }
}

export const apiClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>("GET", endpoint, undefined, headers),

  post: <T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
  ) => request<T>("POST", endpoint, body, headers),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
  ) => request<T>("PATCH", endpoint, body, headers),

  put: <T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
  ) => request<T>("PUT", endpoint, body, headers),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>("DELETE", endpoint, undefined, headers),
};

export { ApiClientError };
