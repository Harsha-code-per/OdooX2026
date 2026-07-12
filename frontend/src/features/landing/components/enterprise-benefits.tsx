"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckSquare,
  Eye,
  HelpCircle,
  Hourglass,
  Layers,
  Shield,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BENEFITS = [
  {
    title: "Faster ESG Reporting",
    description:
      "Export audited compliance reports in PDF and CSV format within minutes instead of weeks.",
    icon: Hourglass,
    colorClass: "bg-success/10 text-success",
  },
  {
    title: "Better Compliance",
    description:
      "Automatically align operations with leading frameworks using our integrated policy builder.",
    icon: CheckSquare,
    colorClass: "bg-primary/10 text-primary",
  },
  {
    title: "Centralized Operations",
    description:
      "Eliminate scattered tracking lists and combine ESG tracking into one central system.",
    icon: Layers,
    colorClass: "bg-info/10 text-info",
  },
  {
    title: "Actionable Insights",
    description:
      "Receive immediate notifications mapping scores drop or active challenge updates.",
    icon: HelpCircle,
    colorClass: "bg-warning/10 text-warning",
  },
  {
    title: "Role-Based Management",
    description:
      "Configure permission levels for different users based on their corporate hierarchy.",
    icon: Shield,
    colorClass: "bg-primary/10 text-primary",
  },
  {
    title: "Real-time Visibility",
    description:
      "Monitor changes to organizational ESG and participation metrics instantly.",
    icon: Eye,
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
      gsap.from(".animate-benefit-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-background relative z-10"
      aria-labelledby="benefits-title"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2
            id="benefits-title"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Empowering Your Sustainability Strategy
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Drive business value, minimize regulatory liabilities, and
            strengthen corporate governance with our unified platform.
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
