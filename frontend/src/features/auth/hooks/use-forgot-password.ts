"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/auth.service";
import type { ForgotPasswordPayload, MessageResponse } from "@/types/auth";

export function useForgotPassword() {
  return useMutation<MessageResponse, Error, ForgotPasswordPayload>({
    mutationFn: forgotPassword,
  });
}
