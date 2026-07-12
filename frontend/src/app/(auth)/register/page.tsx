"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { FormError } from "@/features/auth/components/form-error";
import { FormField } from "@/features/auth/components/form-field";
import { LoadingButton } from "@/features/auth/components/loading-button";
import { PasswordField } from "@/features/auth/components/password-field";
import { SocialButton } from "@/features/auth/components/social-button";
import { useRegister } from "@/features/auth/hooks/use-register";
import {
  type RegisterInput,
  registerSchema,
} from "@/features/auth/schemas/register.schema";

export default function RegisterPage() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

  function onSubmit(data: RegisterInput) {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Create an account"
        description="Get started with the platform today"
      />

      {/* Global mutation error banner */}
      {registerMutation.isError && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{registerMutation.error.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <FormField
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="First Last"
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Email */}
        <FormField
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="name@organization.com"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password */}
        <PasswordField
          label="Password"
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

        {/* Terms and Conditions Checkbox */}
        <div className="space-y-1 text-left">
          <label className="flex items-start gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded border-input text-primary focus:ring-ring mt-0.5"
              {...register("terms")}
            />
            <span>
              I accept the{" "}
              <a
                href="/terms"
                className="font-semibold text-primary hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-semibold text-primary hover:underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>
          <FormError message={errors.terms?.message} />
        </div>

        {/* Submit */}
        <LoadingButton isLoading={registerMutation.isPending} className="mt-2">
          Create Account
        </LoadingButton>
      </form>

      <AuthDivider />

      <SocialButton
        label="Sign Up with Google"
        onClick={() => console.info("[Mock] Google SignUp Triggered")}
      />

      <AuthFooter
        message="Already have an account?"
        linkText="Sign In"
        linkHref="/login"
      />
    </AuthCard>
  );
}
