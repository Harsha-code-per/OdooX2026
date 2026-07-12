"use client";

import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/auth.service";
import type { MessageResponse, ResetPasswordPayload } from "@/types/auth";

export function useResetPassword() {
  return useMutation<MessageResponse, Error, ResetPasswordPayload>({
    mutationFn: resetPassword,
  });
}
