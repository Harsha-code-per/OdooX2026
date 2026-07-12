"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Leaf, Shield, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PILLARS = [
  {
    title: "Environmental",
    icon: Leaf,
    colorClass: "text-success border-success/20 bg-success/5 shadow-success/10",
    description:
      "Track organizational footprint, monitor energy metrics, and manage carbon neutrality targets.",
    metrics: [
      { label: "Carbon Saved", value: "120 tonnes" },
      { label: "Energy Offset", value: "-18% YoY" },
    ],
  },
  {
    title: "Social",
    icon: Users,
    colorClass: "text-info border-info/20 bg-info/5 shadow-info/10",
    description:
      "Enable team volunteer programs, track engagement growth, and improve corporate CSR visibility.",
    metrics: [
      { label: "Participation", value: "81% Rate" },
      { label: "CSR Events", value: "12 Active" },
    ],
  },
  {
    title: "Governance",
    icon: Shield,
    colorClass: "text-warning border-warning/20 bg-warning/5 shadow-warning/10",
    description:
      "Verify compliance metrics, publish audit results, and configure role-based data visibility.",
    metrics: [
      { label: "Compliance Score", value: "94.8%" },
      { label: "Audit Findings", value: "0 Pending" },
    ],
  },
];

export function EsgPillars() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-pillar-card",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="solutions"
      className="py-24 bg-card/30 border-y border-border overflow-hidden relative z-10 scroll-mt-24"
      aria-labelledby="esg-pillars-title"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2
            id="esg-pillars-title"
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            The Three Pillars of Enterprise ESG
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Manage sustainability operations, social contribution metrics, and
            strict internal compliance in one unified solution.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={cn(
                  "animate-pillar-card opacity-100 flex flex-col justify-between p-6 rounded-2xl border border-border bg-card shadow-xs",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                  "group relative overflow-hidden",
                )}
              >
                {/* Visual glow on hover */}
                <div className="absolute inset-0 bg-radial from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  {/* Icon & Title */}
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center border shadow-xs",
                        pillar.colorClass,
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="text-muted-foreground/40 group-hover:text-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {/* Metrics Footer */}
                <div className="mt-8 pt-4 border-t border-border/60 grid grid-cols-2 gap-4 relative z-10">
                  {pillar.metrics.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                        {metric.label}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
