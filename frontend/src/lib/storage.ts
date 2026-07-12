/**
 * Storage Utilities — Safe localStorage wrappers.
 *
 * Security rules (per AGENTS.md):
 * - Never store sensitive data (tokens, passwords) in localStorage
 * - localStorage is only for user preferences and non-sensitive UI state
 * - JWT tokens are managed via httpOnly cookies (backend decision)
 */

/**
 * Safely get an item from localStorage.
 * Returns null if localStorage is unavailable (SSR) or key not found.
 */
export function getStorageItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

/**
 * Safely set an item in localStorage.
 * Silently fails if localStorage is unavailable (SSR) or quota exceeded.
 */
export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Quota exceeded or unavailable — silently ignore */
  }
}

/**
 * Safely remove an item from localStorage.
 */
export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* Silently ignore */
  }
}

/**
 * Storage keys — centralized to avoid key collisions.
 * Only non-sensitive data is permitted.
 */
export const STORAGE_KEYS = {
  THEME: "ecosphere-theme",
  SIDEBAR_COLLAPSED: "ecosphere-sidebar-collapsed",
  NOTIFICATION_LAST_READ: "ecosphere-notifications-read",
} as const;
