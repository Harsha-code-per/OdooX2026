/**
 * Validators — Shared validation helpers.
 *
 * Note: All form validation uses Zod schemas (in feature schemas/).
 * These are utility validators for non-form contexts.
 */

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check password strength.
 * Returns a score from 0 (very weak) to 4 (strong).
 */
export function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export type PasswordStrengthLabel = "Very Weak" | "Weak" | "Fair" | "Strong";

export function getPasswordStrengthLabel(score: number): PasswordStrengthLabel {
  const labels: PasswordStrengthLabel[] = [
    "Very Weak",
    "Weak",
    "Fair",
    "Strong",
  ];
  return labels[Math.min(score, labels.length - 1)];
}

/**
 * Validate that a string is a valid UUID.
 */
export function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
