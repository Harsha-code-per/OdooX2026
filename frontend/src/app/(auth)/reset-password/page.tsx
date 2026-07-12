"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { LoadingButton } from "@/features/auth/components/loading-button";
import { PasswordField } from "@/features/auth/components/password-field";
import { SuccessMessage } from "@/features/auth/components/success-message";
import { useResetPassword } from "@/features/auth/hooks/use-reset-password";
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from "@/features/auth/schemas/reset-password.schema";

export default function ResetPasswordPage() {
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

  function onSubmit(data: ResetPasswordInput) {
    resetPasswordMutation.mutate({
      token: "mock-reset-token-12345",
      password: data.password,
    });
  }

  if (resetPasswordMutation.isSuccess) {
    return (
      <AuthCard>
        <SuccessMessage
          title="Password updated"
          message={
            resetPasswordMutation.data?.message ??
            "Your password has been successfully updated. You can now sign in with your new password."
          }
        />
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex w-full h-10 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Sign In with New Password
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Set a new password"
        description="Choose a secure, complex password for your EcoSphere account."
      />

      {/* Global mutation error banner */}
      {resetPasswordMutation.isError && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{resetPasswordMutation.error.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* New Password */}
        <PasswordField
          label="New Password"
          autoComplete="new-password"
          placeholder="••••••••"
          showStrength
          value={passwordValue}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Confirm Password */}
        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {/* Submit */}
        <LoadingButton
          isLoading={resetPasswordMutation.isPending}
          className="mt-2"
        >
          Update Password
        </LoadingButton>
      </form>
    </AuthCard>
  );
}
