"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { ROUTES } from "@/constants/routes";
import { AuthVisualStage } from "@/features/auth/components/auth-visual-stage";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const visualMode =
    pathname === ROUTES.LOGIN
      ? "login"
      : pathname === ROUTES.REGISTER
        ? "register"
        : "default";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background selection:bg-primary/20">
      {/* Background grid and lighting */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:34px_34px] opacity-[0.02] dark:opacity-[0.04]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 z-0 h-[520px] w-[520px] rounded-full bg-primary/6 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[420px] w-[420px] rounded-full bg-blue-500/6 blur-3xl"
        aria-hidden="true"
      />

      {/* Brand */}
      <header className="absolute left-6 top-6 z-30 md:left-12 md:top-10">
        <div className="animate-fade-in text-left">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-ring rounded-lg w-fit"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <Leaf size={16} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground tracking-tight text-lg">
              EcoSphere
            </span>
          </Link>
        </div>
      </header>

      {/* Desktop: full-viewport stage with right-corner auth card */}
      <div className="relative z-10 mx-auto hidden min-h-dvh w-full max-w-[1600px] px-10 pb-10 pt-24 lg:block">
        <div className="relative flex min-h-[calc(100dvh-8.5rem)] items-center">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full w-full overflow-hidden"
            aria-label="EcoSphere authentication experience"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/10 via-transparent to-background/45"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-background/10"
              aria-hidden="true"
            />
            <div className="h-full pr-[28rem] xl:pr-[30rem] 2xl:pr-[32rem]">
              <AuthVisualStage mode={visualMode} />
            </div>
          </motion.section>

          <aside className="pointer-events-none absolute right-0 top-0 z-20 flex h-full w-full justify-end">
            <div className="pointer-events-auto w-full max-w-[430px] pt-4">
              <main className="max-h-[calc(100dvh-10rem)] overflow-y-auto pr-1">
                {children}
              </main>
            </div>
          </aside>
        </div>

        <div className="mt-5 animate-fade-in space-y-1.5 pl-1 text-left">
          <h2 className="text-sm font-semibold text-foreground">
            Enterprise-ready onboarding
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Sign in securely or create a new workspace to activate connected ESG
            operations across your organization.
          </p>
        </div>
      </div>

      {/* Mobile / Tablet: centered form-only layout */}
      <div className="relative z-20 flex min-h-dvh items-center justify-center px-5 py-24 lg:hidden">
        <div className="w-full max-w-md">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-ring rounded-lg"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <Leaf size={16} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground tracking-tight text-lg">
              EcoSphere
            </span>
          </Link>
          <main className="mt-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
