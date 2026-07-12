import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT_MS } from "@/constants/api";
import { getCookie, removeCookie, setCookie } from "@/lib/cookies";
import type { ApiError } from "@/types/api";

/**
 * ApiClient — Centralized HTTP client for all API requests.
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

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getCookie("ecosphere_refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      },
    );

    if (!response.ok) {
      throw new Error("Refresh token expired or invalid");
    }

    const data = await response.json();
    const newAccessToken = data.access_token;
    const newRefreshToken = data.refresh_token || refreshToken;

    setCookie("ecosphere_access_token", newAccessToken, 1);
    setCookie("ecosphere_refresh_token", newRefreshToken, 30);
    return newAccessToken;
  } catch (_error) {
    removeCookie("ecosphere_access_token");
    removeCookie("ecosphere_refresh_token");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ecosphere-auth-failure"));
    }
    return null;
  }
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  headers?: Record<string, string>,
  isRetry = false,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const token = getCookie("ecosphere_access_token");
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    if (
      response.status === 401 &&
      !isRetry &&
      endpoint !== API_ENDPOINTS.AUTH.LOGIN &&
      endpoint !== API_ENDPOINTS.AUTH.REFRESH
    ) {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;
      if (newAccessToken) {
        return request<T>(method, endpoint, body, headers, true);
      }
    }

    if (!response.ok) {
      let errorData: ApiError | undefined;
      try {
        errorData = (await response.json()) as ApiError;
      } catch {
        /* JSON parse failed */
      }

      throw new ApiClientError(
        response.status,
        errorData?.message ?? response.statusText,
        errorData?.errors,
      );
    }

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

  delete: <T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
  ) => request<T>("DELETE", endpoint, body, headers),
};

export { ApiClientError };
