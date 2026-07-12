/**
 * Theme Constants
 *
 * Animation durations and spacing tokens per 02-design-system.md.
 */

export const THEME = {
  ANIMATION: {
    FAST: 150 /* ms — hover effects, button states */,
    NORMAL: 250 /* ms — most transitions */,
    SLOW: 400 /* ms — page reveals, complex transitions */,
    MAX: 500 /* ms — never exceed this */,
  },
  SPACING: {
    /* 8-point spacing system */
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
    "2XL": 24,
    "3XL": 32,
    "4XL": 40,
    "5XL": 48,
    "6XL": 56,
    "7XL": 64,
    "8XL": 80,
    "9XL": 96,
  },
  RADIUS: {
    SM: 8 /* px */,
    MD: 12 /* px — cards, inputs */,
    LG: 16 /* px — dialogs */,
    XL: 24 /* px — extra large */,
    BUTTON: 10,
  },
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1280,
    MAX: 1440,
  },
  SHADOW_OPACITY_MAX: 0.15,
  TOAST_DURATION_MS: 3000,
} as const;

export type Theme = "light" | "dark" | "system";
