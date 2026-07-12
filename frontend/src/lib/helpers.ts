/**
 * Helpers — General-purpose utility functions.
 */

/**
 * Generate a simple UUID v4 (for mock data IDs).
 * Not cryptographically secure — for development use only.
 */
export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Clamp a value between min and max.
 * @example clamp(150, 0, 100) → 100
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Delay execution for a given number of milliseconds.
 * Useful for simulating network latency in mock services.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if we're running on the client side.
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Sort an array of objects by a key.
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc",
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Group an array of objects by a key.
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * Calculate a percentage.
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
