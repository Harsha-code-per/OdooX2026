"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { FormField } from "@/features/auth/components/form-field";
import { LoadingButton } from "@/features/auth/components/loading-button";
import { PasswordField } from "@/features/auth/components/password-field";
import { SocialButton } from "@/features/auth/components/social-button";
import { useLogin } from "@/features/auth/hooks/use-login";
import {
  type LoginInput,
  loginSchema,
} from "@/features/auth/schemas/login.schema";
import { getGoogleAuthUrl } from "@/services/auth.service";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const [successHint, setSuccessHint] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Check if routed after successful registration
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessHint("Account created successfully. Please sign in below.");
    }
  }, [searchParams]);

  async function handleGoogleLogin() {
    setIsSocialLoading(true);
    setGoogleError(null);
    try {
      const data = await getGoogleAuthUrl();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("Could not retrieve authorization URL");
      }
    } catch (err) {
      const error = err as Error;
      setIsSocialLoading(false);
      setGoogleError(error.message || "Failed to trigger Google login");
    }
  }

  function onSubmit(data: LoginInput) {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Welcome back"
        description="Enter your organizational email to sign in"
      />

      {/* Success hint banner */}
      {successHint && (
        <div className="mb-4 p-3 rounded-lg bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span>{successHint}</span>
        </div>
      )}

      {/* Global mutation error banner */}
      {(loginMutation.isError || googleError) && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{loginMutation.error?.message || googleError}</span>
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

        {/* Password */}
        <div className="space-y-1">
          <PasswordField
            label="Password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-input text-primary focus:ring-ring"
                {...register("rememberMe")}
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring rounded"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <LoadingButton isLoading={loginMutation.isPending} className="mt-2">
          Sign In
        </LoadingButton>
      </form>

      <AuthDivider />

      <SocialButton
        label="Continue with Google"
        isLoading={isSocialLoading}
        onClick={handleGoogleLogin}
      />

      <AuthFooter
        message="New to EcoSphere?"
        linkText="Create an account"
        linkHref="/register"
      />
    </AuthCard>
  );
}
