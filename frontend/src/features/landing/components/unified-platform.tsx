"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  FileText,
  Leaf,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function UnifiedPlatform() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      tl.fromTo(
        ".animate-platform-header",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      )
        .fromTo(
          ".animate-platform-source",
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
          "-=0.3",
        )
        .fromTo(
          ".animate-platform-connector",
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            transformOrigin: "left center",
            duration: 0.6,
          },
          "-=0.3",
        )
        .fromTo(
          ".animate-platform-hub",
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, stagger: 0.2 },
          "-=0.4",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="platform"
      className="py-24 bg-background relative z-10 overflow-hidden scroll-mt-24"
      aria-labelledby="unified-platform-title"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="animate-platform-header opacity-100 text-center max-w-2xl mx-auto space-y-4">
          <h2
            id="unified-platform-title"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            One Platform. <br />
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Complete ESG Visibility.
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Consolidate environmental saving metrics, employee volunteer
            actions, and regulatory policy controls in a single, high-fidelity
            analytics ecosystem.
          </p>
        </div>

        {/* CSS Unified Pipeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1.2fr] items-center gap-8 lg:gap-4 max-w-5xl mx-auto">
          {/* Column 1: Core ESG Input Modules */}
          <div className="flex flex-col gap-6 w-full">
            {/* Environmental Module Card */}
            <div className="animate-platform-source opacity-100 p-5 rounded-xl border border-border bg-card shadow-xs flex items-center gap-4 hover:border-success/30 hover:shadow-lg hover:shadow-success/5 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center flex-shrink-0">
                <Leaf size={20} />
              </div>
              <div className="text-left space-y-0.5">
                <h3 className="text-sm font-semibold">Environmental Module</h3>
                <p className="text-xs text-muted-foreground">
                  Carbon accounting, energy monitoring, water metrics
                </p>
              </div>
            </div>

            {/* Social Module Card */}
            <div className="animate-platform-source opacity-100 p-5 rounded-xl border border-border bg-card shadow-xs flex items-center gap-4 hover:border-info/30 hover:shadow-lg hover:shadow-info/5 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-info/10 text-info flex items-center justify-center flex-shrink-0">
                <Users size={20} />
              </div>
              <div className="text-left space-y-0.5">
                <h3 className="text-sm font-semibold">Social Module</h3>
                <p className="text-xs text-muted-foreground">
                  Volunteer tracking, program rates, CSR events
                </p>
              </div>
            </div>

            {/* Governance Module Card */}
            <div className="animate-platform-source opacity-100 p-5 rounded-xl border border-border bg-card shadow-xs flex items-center gap-4 hover:border-warning/30 hover:shadow-lg hover:shadow-warning/5 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center flex-shrink-0">
                <Shield size={20} />
              </div>
              <div className="text-left space-y-0.5">
                <h3 className="text-sm font-semibold">Governance Module</h3>
                <p className="text-xs text-muted-foreground">
                  Compliance policies, pending audits, approvals log
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Visual Connectors (Arrows/Lines) */}
          <div className="flex lg:flex-col items-center justify-center h-full w-full">
            {/* Desktop Connectors (Horizontal line with right arrow) */}
            <div className="hidden lg:flex items-center justify-center w-full animate-platform-connector opacity-100 text-primary/40">
              <div className="h-[2px] w-12 bg-border relative">
                <ArrowRight
                  size={18}
                  className="absolute right-0 -top-[8px] text-primary"
                />
              </div>
            </div>
            {/* Mobile Connectors (Vertical down arrows) */}
            <div className="flex lg:hidden items-center justify-center py-2 animate-platform-connector opacity-100 text-primary">
              <ArrowDown size={20} />
            </div>
          </div>

          {/* Column 3: Centralized Analytics Hub & Outputs */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-md space-y-6 relative overflow-hidden animate-platform-hub opacity-100">
            {/* Hub Header decoration */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-emerald-400" />

            <div className="text-left space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                Central EcoSphere Core
              </span>
              <h3 className="text-base font-bold">
                Consolidated Processing Center
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Analytics Node */}
              <div className="p-4 rounded-xl border border-border bg-background flex items-center gap-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={16} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-semibold">
                    Consolidated Analytics
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Instant cross-module metrics parsing
                  </p>
                </div>
              </div>

              {/* Reports Node */}
              <div className="p-4 rounded-xl border border-border bg-background flex items-center gap-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <FileText size={16} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-semibold">Q2 Report Generator</h4>
                  <p className="text-[10px] text-muted-foreground">
                    Auto-compiles compliant ESG audits
                  </p>
                </div>
              </div>

              {/* Insights Node */}
              <div className="p-4 rounded-xl border border-border bg-background flex items-center gap-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-semibold">
                    EcoSphere Intelligence
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Heuristics-driven compliance risk suggestions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
