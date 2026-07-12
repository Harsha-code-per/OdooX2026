"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers — Application-wide provider composition.
 *
 * Order matters:
 * 1. ThemeProvider — must wrap everything for class-based theme switching
 * 2. QueryProvider — React Query context for server state
 * 3. AuthProvider — authentication session context
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
