"use client";

import { can, type Permission } from "@/constants/permissions";
import type { UserRole } from "@/constants/roles";
import { useAuthContext } from "@/providers/auth-provider";

/**
 * useAuth — Primary hook for accessing authentication state.
 *
 * Exposes:
 * - user: Current user object (null if not authenticated)
 * - isAuthenticated: Boolean
 * - isLoading: Boolean (while session is being initialized)
 * - logout: Function to end the session
 * - can: Permission check helper
 *
 * Usage:
 *   const { user, isAuthenticated, can } = useAuth()
 *   if (!can("CREATE_DEPARTMENT")) return null
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, logout } =
    useAuthContext();

  function checkPermission(permission: Permission): boolean {
    if (!user) return false;
    return can(user.role as UserRole, permission);
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    logout,
    can: checkPermission,
  };
}
