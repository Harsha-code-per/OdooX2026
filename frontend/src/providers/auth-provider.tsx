"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/constants/api";
import type { UserRole } from "@/constants/roles";
import { apiClient } from "@/lib/api-client";
import { getCookie, removeCookie } from "@/lib/cookies";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

function mapRoleIdToUserRole(roleId: number): UserRole {
  if (roleId === 1) return "ADMIN";
  if (roleId === 2 || roleId === 3) return "MANAGER";
  return "EMPLOYEE";
}

interface MeResponse {
  id: string;
  email: string;
  full_name: string;
  role_id: number;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const accessToken = getCookie("ecosphere_access_token");
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiClient.get<MeResponse>(API_ENDPOINTS.USERS.ME);
        setUser({
          id: data.id,
          name: data.full_name,
          email: data.email,
          role: mapRoleIdToUserRole(data.role_id),
        });
      } catch (_error) {
        removeCookie("ecosphere_access_token");
        removeCookie("ecosphere_refresh_token");
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    function handleAuthFailure() {
      setUser(null);
    }
    window.addEventListener("ecosphere-auth-failure", handleAuthFailure);
    return () =>
      window.removeEventListener("ecosphere-auth-failure", handleAuthFailure);
  }, []);

  const logout = async () => {
    const refreshToken = getCookie("ecosphere_refresh_token");
    if (refreshToken) {
      try {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
          refresh_token: refreshToken,
        });
      } catch {
        // Ignore network errors on logout
      }
    }

    removeCookie("ecosphere_access_token");
    removeCookie("ecosphere_refresh_token");
    setUser(null);
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
