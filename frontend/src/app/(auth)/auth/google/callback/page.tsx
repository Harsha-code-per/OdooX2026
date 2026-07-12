"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { loginWithGoogle } from "@/services/auth.service";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state") || undefined;

    if (!code) {
      setError("No authorization code found from Google.");
      return;
    }

    const authCode = code;

    async function handleCallback() {
      try {
        const response = await loginWithGoogle(authCode, state);
        setUser(response.user);
        router.push("/dashboard");
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Google authentication failed.");
      }
    }

    handleCallback();
  }, [searchParams, setUser, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="text-xl font-bold text-destructive">
          Authentication Error
        </h1>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/95 transition-colors"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <h1 className="text-lg font-semibold text-foreground">
        Verifying credentials
      </h1>
      <p className="text-xs text-muted-foreground">
        Completing secure login with Google...
      </p>
    </div>
  );
}
