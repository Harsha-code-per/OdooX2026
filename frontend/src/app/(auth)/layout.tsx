import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | EcoSphere",
    default: "Sign In — EcoSphere",
  },
};

/**
 * Auth Layout
 *
 * Wraps all authentication pages: login, register, forgot-password, reset-password.
 * Features a centered card over a blurred dashboard preview background.
 * Uses Framer Motion for card entrance animations.
 *
 * Note: Redirect logic for already-authenticated users is handled
 * in Next.js middleware (Phase 12).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-background">
      {/* Background — subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Primary brand gradient orb — top left */}
      <div
        className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Secondary gradient orb — bottom right */}
      <div
        className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Auth content */}
      <div className="relative z-10 w-full max-w-md px-4 py-12">{children}</div>
    </div>
  );
}
