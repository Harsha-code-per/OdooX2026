import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — Utility for merging Tailwind CSS classes.
 *
 * Combines clsx (conditional classes) with tailwind-merge
 * (deduplicates conflicting Tailwind utilities).
 *
 * Usage:
 *   cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
