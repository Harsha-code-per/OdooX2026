"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { setStorageItem } from "@/lib/storage";
import { login } from "@/services/auth.service";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
      // Store non-sensitive tokens/session parameters (development only)
      setStorageItem("mock-session-active", true);

      // Initialize session inside AuthContext
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });

      // Redirect to dashboard page
      router.push("/dashboard");
    },
  });
}
