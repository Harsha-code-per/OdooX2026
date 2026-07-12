/**
 * Formatters — Presentation utilities for numbers, currency, dates.
 *
 * Rules:
 * - Never format data inside components directly
 * - All presentation logic belongs here
 * - Use Intl API for locale-aware formatting
 */

/**
 * Format a number with locale-appropriate thousands separators.
 * @example formatNumber(1234567) → "1,234,567"
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number as a percentage.
 * @example formatPercent(84.5) → "84.5%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format carbon/energy/water values with appropriate units.
 * @example formatMetric(1234, "kg CO₂") → "1,234 kg CO₂"
 */
export function formatMetric(value: number, unit: string): string {
  return `${formatNumber(value)} ${unit}`;
}

/**
 * Format a KPI value with compact notation for large numbers.
 * @example formatCompact(1234567) → "1.2M"
 * @example formatCompact(1234) → "1.2K"
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format a score as a number out of 100.
 * @example formatScore(84) → "84 / 100"
 */
export function formatScore(value: number): string {
  return `${Math.round(value)} / 100`;
}

/**
 * Format a trend change for display.
 * @example formatTrend(5.2) → "+5.2%"
 * @example formatTrend(-2.1) → "-2.1%"
 */
export function formatTrend(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Format initials from a full name (for avatar fallback).
 * @example getInitials("Harshavardhan Reddy") → "HR"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
