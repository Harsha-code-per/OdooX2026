"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryProvider — React Query global configuration.
 *
 * Rules enforced:
 * - Never store server data in Zustand (React Query handles all server state)
 * - Service layer → React Query → Component
 * - Never fetch inside components directly
 *
 * Configuration:
 * - staleTime: 0 — queries are stale immediately (fresh data on focus)
 * - gcTime: 5 minutes — garbage collect unused cache after 5min
 * - retry: 2 — retry failed requests twice before showing error
 * - refetchOnWindowFocus: true — refresh stale data when user returns to tab
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export function QueryProvider({ children }: QueryProviderProps) {
  /**
   * useState ensures QueryClient is only created once per component lifecycle.
   * This is the recommended pattern for Next.js App Router to avoid shared
   * state between server and client renders.
   */
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only rendered in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
