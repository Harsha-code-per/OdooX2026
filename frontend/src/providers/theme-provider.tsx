"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider — wraps next-themes to support Light / Dark / System modes.
 *
 * Strategy: class-based (adds "dark" class to <html>)
 * Default: system preference
 * Persistence: localStorage via next-themes
 *
 * suppressHydrationWarning is set on <html> in layout.tsx to prevent
 * React hydration mismatch caused by server/client theme difference.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="ecosphere-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
