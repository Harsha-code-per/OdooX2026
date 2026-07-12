"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { FormField } from "@/features/auth/components/form-field";
import { LoadingButton } from "@/features/auth/components/loading-button";
import { SuccessMessage } from "@/features/auth/components/success-message";
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/features/auth/schemas/forgot-password.schema";

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: ForgotPasswordInput) {
    forgotPasswordMutation.mutate({
      email: data.email,
    });
  }

  if (forgotPasswordMutation.isSuccess) {
    return (
      <AuthCard>
        <SuccessMessage
          title="Reset link sent"
          message={
            forgotPasswordMutation.data?.message ??
            "Check your inbox for a link to reset your password."
          }
        />
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex w-full h-10 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Reset your password"
        description="We'll send you an email with instructions to set a new password."
      />

      {/* Global mutation error banner */}
      {forgotPasswordMutation.isError && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{forgotPasswordMutation.error.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <FormField
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="name@organization.com"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Submit */}
        <LoadingButton
          isLoading={forgotPasswordMutation.isPending}
          className="mt-2"
        >
          Send Reset Link
        </LoadingButton>
      </form>

      <AuthFooter
        message="Remember your password?"
        linkText="Sign In"
        linkHref="/login"
      />
    </AuthCard>
  );
}
