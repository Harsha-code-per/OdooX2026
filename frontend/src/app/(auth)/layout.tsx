"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { HeroDashboardPreview } from "@/features/landing/components/hero-dashboard-preview";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh flex bg-background overflow-hidden selection:bg-primary/20">
      {/* BACKGROUND DECORATIONS (Radial Blurs and Grid) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* LEFT COLUMN: Premium Platform Preview (Desktop Only) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-muted/20 border-r border-border/80 relative z-10 overflow-hidden">
        {/* Brand Header */}
        <div className="animate-fade-in text-left">
          <Link
            href="/"
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

        {/* Dashboard 3D preview illustration area */}
        <div className="relative w-full max-w-xl mx-auto flex items-center justify-center my-auto">
          {/* Subtle gradient backdrop behind preview */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 via-emerald-500/5 to-transparent rounded-2xl blur-2xl opacity-70" />

          <motion.div
            initial={{ opacity: 0, y: 30, rotateY: -10, rotateX: 6 }}
            animate={{ opacity: 1, y: 0, rotateY: -12, rotateX: 8 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-full transform shadow-2xl scale-[0.88] hover:scale-[0.92] transition-transform duration-700 pointer-events-none relative z-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Visual cover layer adding subtle reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 dark:to-white/2 pointer-events-none rounded-2xl z-20 mix-blend-overlay" />
            <HeroDashboardPreview />
          </motion.div>
        </div>

        {/* Bottom Tagline */}
        <div className="text-left space-y-1.5 animate-fade-in">
          <h2 className="text-sm font-semibold text-foreground">
            Complete ESG Visibility
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Enter the central intelligence platform processing data streams
            across environment, social and governance metrics.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Centered Forms Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 w-full max-w-lg mx-auto lg:max-w-none">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex items-center justify-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-ring rounded-lg"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <Leaf size={16} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground tracking-tight text-lg">
              EcoSphere
            </span>
          </Link>
        </div>

        {/* Form area */}
        <main className="w-full max-w-[400px] flex flex-col justify-center">
          {children}
        </main>
      </div>
    </div>
  );
}
