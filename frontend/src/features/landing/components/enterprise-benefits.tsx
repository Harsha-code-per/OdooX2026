"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ClipboardCheck,
  KeyRound,
  Lock,
  ScanSearch,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BENEFITS = [
  {
    title: "Role-based Access Control",
    description:
      "Granular access layers keep executive insights, manager workflows, and employee actions securely scoped.",
    icon: UserCog,
    colorClass: "bg-primary/10 text-primary",
  },
  {
    title: "Audit-ready Trail Visibility",
    description:
      "Track governance events with clear records that simplify internal reviews and regulatory audits.",
    icon: ClipboardCheck,
    colorClass: "bg-info/10 text-info",
  },
  {
    title: "Policy & Control Governance",
    description:
      "Standardize ESG controls across teams with consistent operational guardrails and approval chains.",
    icon: ShieldCheck,
    colorClass: "bg-success/10 text-success",
  },
  {
    title: "Encrypted Session Boundaries",
    description:
      "Secure authentication flows and protected session behavior help safeguard enterprise operations.",
    icon: Lock,
    colorClass: "bg-warning/10 text-warning",
  },
  {
    title: "Credential Security Posture",
    description:
      "Authentication controls are designed around least privilege and secure account lifecycle practices.",
    icon: KeyRound,
    colorClass: "bg-primary/10 text-primary",
  },
  {
    title: "Continuous Compliance Signals",
    description:
      "Identify policy deviations early with proactive governance alerts and risk-oriented monitoring.",
    icon: ScanSearch,
    colorClass: "bg-info/10 text-info",
  },
];

export function EnterpriseBenefits() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-benefit-card",
        { y: 20, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="security"
      className="py-24 bg-background relative z-10 scroll-mt-24"
      aria-labelledby="benefits-title"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2
            id="benefits-title"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Enterprise-grade Security for ESG Operations
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Build trust with robust access control, governance transparency, and
            compliance-first controls engineered for modern enterprise teams.
          </p>
        </div>

        {/* Benefits Grid (Horizontal Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className={cn(
                  "animate-benefit-card opacity-100 p-5 rounded-xl border border-border bg-card/50 flex gap-4",
                  "transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-xs",
                  "group relative overflow-hidden text-left",
                )}
              >
                {/* Icon box */}
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 border border-transparent transition-colors group-hover:border-primary/25",
                    benefit.colorClass,
                  )}
                >
                  <Icon size={20} />
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
