"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types/user";

/* ─── Auth Context Types ────────────────────────────────────────────────────── */
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

/* ─── Context ───────────────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ─── Provider ──────────────────────────────────────────────────────────────── */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider — manages the global authentication session.
 *
 * Responsibilities:
 * - Holds current authenticated user
 * - Provides isAuthenticated / isLoading flags
 * - Provides logout function
 *
 * Note: This is a shell implementation for Phase 1.
 * Full authentication logic (token management, session refresh) is
 * implemented in Phase 12 — Backend Integration.
 *
 * Protected pages should never perform authentication logic themselves.
 * They consume this context via useAuth().
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Phase 1 shell: immediately resolve loading.
     * Phase 12 will replace this with a real session check:
     * - Check for stored token
     * - Call GET /users/me
     * - Populate user state
     */
    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    /**
     * Phase 12 will add:
     * - Call POST /auth/logout
     * - Clear tokens from secure storage
     * - Invalidate all React Query cache
     * - Redirect to /login
     */
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────────────────────────────────────── */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
