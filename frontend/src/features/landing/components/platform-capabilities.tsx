"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2,
  CheckSquare,
  FileText,
  Key,
  Leaf,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CAPABILITIES = [
  {
    title: "ESG Analytics",
    description:
      "Consolidated, real-time score indicators mapped across all core departments.",
    icon: TrendingUp,
    accentColor: "border-primary/10 hover:border-primary/30",
  },
  {
    title: "Department Management",
    description:
      "Create distinct departments, assign leaders, and target custom performance metrics.",
    icon: Building2,
    accentColor: "border-info/10 hover:border-info/30",
  },
  {
    title: "AI Insights",
    description:
      "Intelligent analytics detection pointing to anomalies or compliance risks instantly.",
    icon: Sparkles,
    accentColor: "border-success/10 hover:border-success/30",
  },
  {
    title: "Compliance Tracking",
    description:
      "Maintain historical transparency logs matching national regulatory audits.",
    icon: CheckSquare,
    accentColor: "border-warning/10 hover:border-warning/30",
  },
  {
    title: "Carbon Monitoring",
    description:
      "Document carbon savings, energy emissions, water utility usage profiles.",
    icon: Leaf,
    accentColor: "border-success/10 hover:border-success/30",
  },
  {
    title: "CSR Activities",
    description:
      "Track employee volunteer participation metrics, charity milestones, and event histories.",
    icon: Users,
    accentColor: "border-info/10 hover:border-info/30",
  },
  {
    title: "PDF & CSV Reports",
    description:
      "Generate print-ready compiled documentation matching governance formats.",
    icon: FileText,
    accentColor: "border-primary/10 hover:border-primary/30",
  },
  {
    title: "Role-Based Access",
    description:
      "Assign Owner, Admin, Manager, and Employee permissions to enforce data security.",
    icon: Key,
    accentColor: "border-warning/10 hover:border-warning/30",
  },
];

export function PlatformCapabilities() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".animate-capability-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 30,
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
      className="py-24 bg-card/20 border-t border-border overflow-hidden relative z-10"
      aria-labelledby="capabilities-title"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2
            id="capabilities-title"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Built for Enterprise Scale
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Discover the unified tools EcoSphere brings to manage, calculate,
            and share organization-wide ESG performance cleanly.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className={cn(
                  "animate-capability-card opacity-100 p-6 rounded-xl border bg-card shadow-2xs",
                  cap.accentColor,
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                  "group relative overflow-hidden flex flex-col justify-between",
                )}
              >
                {/* Visual hover background accent glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-sm font-semibold text-foreground">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
