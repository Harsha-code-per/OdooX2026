"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth.service";
import type { RegisterPayload, RegisterResponse } from "@/types/auth";

export function useRegister() {
  const router = useRouter();

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: register,
    onSuccess: () => {
      // Redirect to login after successful registration with query param hint
      router.push("/login?registered=true");
    },
  });
}
