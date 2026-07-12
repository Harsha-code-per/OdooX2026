"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { Theme } from "@/constants/theme";

/**
 * useTheme — Wrapper around next-themes with mounted state guard.
 *
 * Problem: next-themes can't know the theme on the server.
 * Solution: Wait until mounted before reading/rendering theme-dependent UI.
 *
 * Usage:
 *   const { theme, setTheme, mounted } = useTheme()
 *   if (!mounted) return null // Prevent hydration mismatch
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    theme: theme as Theme | undefined,
    setTheme: setTheme as (theme: Theme) => void,
    resolvedTheme: resolvedTheme as "light" | "dark" | undefined,
    systemTheme: systemTheme as "light" | "dark" | undefined,
    mounted,
    isDark: resolvedTheme === "dark",
    isLight: resolvedTheme === "light",
  };
}
