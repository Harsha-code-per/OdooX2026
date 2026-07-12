"use client";

import gsap from "gsap";
import { ArrowRight, ChevronDown, Leaf, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { HeroDashboardPreview } from "./hero-dashboard-preview";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Just fade in everything instantly or let styles handle it
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".animate-hero-badge", {
        y: -20,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          ".animate-hero-title",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.4",
        )
        .from(
          ".animate-hero-text",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6",
        )
        .from(
          ".animate-hero-cta",
          {
            y: 15,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.5",
        )
        .from(
          ".animate-hero-preview",
          {
            y: 40,
            opacity: 0,
            duration: 1.0,
          },
          "-=0.4",
        )
        .from(
          ".animate-hero-card",
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
          },
          "-=0.6",
        )
        .from(
          ".animate-hero-scroll",
          {
            opacity: 0,
            y: -10,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          },
          "-=0.2",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-dvh flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden bg-background"
      aria-label="Hero Introduction"
    >
      {/* Premium Background Grid and Lighting Effects */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Lighting orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl z-0"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 left-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/5 dark:bg-blue-500/3 blur-3xl z-0"
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-8">
        {/* Announcement Badge */}
        <div className="animate-hero-badge opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1 text-xs font-medium text-foreground bg-card shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            EcoSphere 1.0 has launched
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-hero-title opacity-100 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1]">
          Enterprise ESG Intelligence for{" "}
          <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[size:200%_auto] animate-shimmer bg-clip-text text-transparent">
            Sustainable Organizations
          </span>
        </h1>

        {/* Supporting paragraph */}
        <p className="animate-hero-text opacity-100 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Centralize carbon accounting, track CSR impact, and manage regulatory
          compliance within a unified, premium software architecture.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Link
            href="/register"
            className="animate-hero-cta opacity-100 w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 hover:shadow-primary/30 transition-all focus-visible:outline-2 focus-visible:outline-ring"
          >
            Get Started
            <ArrowRight size={16} className="ml-2" />
          </Link>
          <Link
            href="/login"
            className="animate-hero-cta opacity-100 w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all focus-visible:outline-2 focus-visible:outline-ring"
          >
            Explore Platform
          </Link>
        </div>

        {/* Preview Wrapper with Floating ESG widgets */}
        <div className="relative w-full max-w-5xl mt-12 animate-hero-preview opacity-100">
          {/* Floating Widget 1: Carbon reduction */}
          <div className="animate-hero-card opacity-100 hidden xl:flex absolute -left-20 top-20 z-20 p-3.5 rounded-xl border border-border bg-card/90 backdrop-blur-md shadow-lg shadow-success/5 dark:shadow-success/10 items-center gap-3 w-48">
            <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <Leaf size={16} />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-muted-foreground font-semibold block uppercase">
                Carbon Savings
              </span>
              <span className="text-sm font-bold">+12.4% offset</span>
            </div>
          </div>

          {/* Floating Widget 2: Governance Compliance */}
          <div className="animate-hero-card opacity-100 hidden xl:flex absolute -right-20 top-40 z-20 p-3.5 rounded-xl border border-border bg-card/90 backdrop-blur-md shadow-lg shadow-primary/5 dark:shadow-primary/10 items-center gap-3 w-48">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Shield size={16} />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-muted-foreground font-semibold block uppercase">
                Compliance
              </span>
              <span className="text-sm font-bold">94.8% Score</span>
            </div>
          </div>

          {/* Floating Widget 3: Social CSR */}
          <div className="animate-hero-card opacity-100 hidden xl:flex absolute -left-12 bottom-20 z-20 p-3.5 rounded-xl border border-border bg-card/90 backdrop-blur-md shadow-lg shadow-info/5 dark:shadow-info/10 items-center gap-3 w-48">
            <div className="h-8 w-8 rounded-lg bg-info/10 flex items-center justify-center text-info">
              <Users size={16} />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-muted-foreground font-semibold block uppercase">
                Participation
              </span>
              <span className="text-sm font-bold">145 Active</span>
            </div>
          </div>

          {/* Dashboard static mockup preview */}
          <HeroDashboardPreview />
        </div>

        {/* Scroll Indicator */}
        <div
          className="animate-hero-scroll opacity-100 pt-8"
          aria-hidden="true"
        >
          <ChevronDown size={24} className="text-muted-foreground/60" />
        </div>
      </div>
    </section>
  );
}
