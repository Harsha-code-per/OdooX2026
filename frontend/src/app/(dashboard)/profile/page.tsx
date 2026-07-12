"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Laptop } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageContainer } from "@/components/layout/page-container";
import { FormField } from "@/features/auth/components/form-field";
import { LoadingButton } from "@/features/auth/components/loading-button";
import { PasswordField } from "@/features/auth/components/password-field";
import { SectionHeader } from "@/features/dashboard/components/section-header";
import { useAuth } from "@/hooks/use-auth";

const profileDetailsSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

type ProfileDetailsInput = z.infer<typeof profileDetailsSchema>;

const profilePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfilePasswordInput = z.infer<typeof profilePasswordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [successDetailsMsg, setSuccessDetailsMsg] = useState<string | null>(
    null,
  );
  const [successPasswordMsg, setSuccessPasswordMsg] = useState<string | null>(
    null,
  );

  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    formState: { errors: detailsErrors },
  } = useForm<ProfileDetailsInput>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      name: user?.name || "Harshavardhan Reddy",
      email: user?.email || "harsha@ecosphere.io",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<ProfilePasswordInput>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watchPassword("password", "");

  async function onSubmitDetails(_data: ProfileDetailsInput) {
    setIsUpdatingDetails(true);
    setSuccessDetailsMsg(null);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsUpdatingDetails(false);
    setSuccessDetailsMsg("Profile details updated successfully.");
  }

  async function onSubmitPassword(_data: ProfilePasswordInput) {
    setIsUpdatingPassword(true);
    setSuccessPasswordMsg(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsUpdatingPassword(false);
    setSuccessPasswordMsg("Password updated successfully.");
    resetPassword();
  }

  return (
    <PageContainer className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="My Profile"
        description="Configure account details, update credentials, connect identity integrations, and review sessions logs."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {/* LEFT COLUMN: Profile and Password */}
        <div className="space-y-6">
          {/* ACCOUNT DETAILS */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-6">
            <div className="flex items-center gap-4 border-b border-border/40 pb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/10">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-foreground">
                  {user?.name || "User Name"}
                </h3>
                <p className="text-[10px] text-muted-foreground capitalize">
                  Access Level: {user?.role || "Employee"} •{" "}
                  {user?.department || "Operations"}
                </p>
              </div>
            </div>

            {successDetailsMsg && (
              <div className="p-3 rounded-lg bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2 animate-fade-in font-medium">
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span>{successDetailsMsg}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmitDetails(onSubmitDetails)}
              className="space-y-4"
              noValidate
            >
              <FormField
                label="Full Name"
                type="text"
                error={detailsErrors.name?.message}
                {...registerDetails("name")}
              />

              <FormField
                label="Email Address"
                type="email"
                error={detailsErrors.email?.message}
                {...registerDetails("email")}
              />

              <div className="pt-2 text-right">
                <LoadingButton
                  isLoading={isUpdatingDetails}
                  className="w-auto px-6"
                >
                  Update Account
                </LoadingButton>
              </div>
            </form>
          </div>

          {/* PASSWORD UPDATE */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Update Password
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Set a secure, complex password for your EcoSphere profile.
              </p>
            </div>

            {successPasswordMsg && (
              <div className="p-3 rounded-lg bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2 animate-fade-in font-medium">
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span>{successPasswordMsg}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmitPassword(onSubmitPassword)}
              className="space-y-4"
              noValidate
            >
              <PasswordField
                label="Current Password"
                placeholder="••••••••"
                error={passwordErrors.currentPassword?.message}
                {...registerPassword("currentPassword")}
              />

              <PasswordField
                label="New Password"
                placeholder="••••••••"
                showStrength
                value={passwordValue}
                error={passwordErrors.password?.message}
                {...registerPassword("password")}
              />

              <PasswordField
                label="Confirm New Password"
                placeholder="••••••••"
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword("confirmPassword")}
              />

              <div className="pt-2 text-right">
                <LoadingButton
                  isLoading={isUpdatingPassword}
                  className="w-auto px-6"
                >
                  Change Password
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Connected Accounts and Sessions */}
        <div className="space-y-6">
          {/* CONNECTED ACCOUNTS */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Connected Integrations
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Authenticate with external third-party login providers.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Google */}
              <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">
                      Google Cloud Authentication
                    </span>
                    <p className="text-[10px] text-success">
                      Linked to {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="h-7 px-3 rounded border border-border bg-background hover:bg-accent text-[10px] font-semibold text-foreground transition-colors"
                >
                  Disconnect
                </button>
              </div>

              {/* GitHub */}
              <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-left">
                  <div className="text-foreground">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">
                      GitHub Integration
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Access repository telemetry codes
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="h-7 px-3 rounded border border-border bg-background hover:bg-accent text-[10px] font-semibold text-foreground transition-colors"
                >
                  Link Profile
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE SESSIONS */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Active Workstation Sessions
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Review devices currently logged into your EcoSphere profile.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  device: "Linux Workstation",
                  browser: "Google Chrome",
                  location: "Hyderabad, IN (Current)",
                  status: "current",
                },
                {
                  device: "MacBook Pro",
                  browser: "Safari Browser",
                  location: "Mumbai, IN",
                  status: "active",
                },
              ].map((sess) => (
                <div
                  key={sess.device}
                  className="p-3 rounded-xl border border-border bg-card flex items-start gap-3.5 text-xs text-left"
                >
                  <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Laptop size={14} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        {sess.device}
                      </span>
                      {sess.status === "current" ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success/15 text-success border border-success/20 font-semibold uppercase tracking-wider">
                          Current
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-semibold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      {sess.browser} • {sess.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
