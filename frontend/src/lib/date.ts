/**
 * Date Utilities — Consistent date formatting across the application.
 *
 * Rules:
 * - Never format dates directly in components
 * - Always use these helpers for consistent presentation
 */

/**
 * Format a date string into a readable format.
 * @example formatDate("2026-07-12") → "Jul 12, 2026"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format a date with time.
 * @example formatDateTime("2026-07-12T14:30:00") → "Jul 12, 2026, 2:30 PM"
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

/**
 * Format a relative time (e.g., "2 hours ago", "yesterday").
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(date);
}

/**
 * Get a greeting based on the current time of day.
 */
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/**
 * Format a month+year label for charts.
 * @example formatMonthLabel("2026-07") → "Jul 2026"
 */
export function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Check if a date is overdue (in the past).
 */
export function isOverdue(date: string | Date): boolean {
  return new Date(date) < new Date();
}
