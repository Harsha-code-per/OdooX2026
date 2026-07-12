"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BrainCircuit,
  Compass,
  Eye,
  Flag,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ABOUT_CARDS = [
  {
    title: "Mission",
    description:
      "Help organizations turn ESG strategy into measurable action through clarity, accountability, and cross-team execution.",
    icon: Flag,
    iconClass: "text-primary bg-primary/10",
  },
  {
    title: "Vision",
    description:
      "Become the most trusted operating layer for enterprise sustainability, social impact, and governance leadership.",
    icon: Eye,
    iconClass: "text-info bg-info/10",
  },
  {
    title: "Why EcoSphere",
    description:
      "Traditional ESG programs are fragmented. EcoSphere unifies data, workflows, reporting, and decisions in a single experience.",
    icon: Compass,
    iconClass: "text-success bg-success/10",
  },
  {
    title: "Enterprise Focus",
    description:
      "Purpose-built for role-based teams, audit readiness, and executive visibility across departments and regions.",
    icon: ShieldCheck,
    iconClass: "text-warning bg-warning/10",
  },
  {
    title: "AI-driven ESG",
    description:
      "Surface risk signals, trend anomalies, and recommendation prompts so teams can act earlier with confidence.",
    icon: BrainCircuit,
    iconClass: "text-primary bg-primary/10",
  },
];

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-about-header",
        { y: 18, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 82%",
          },
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        ".animate-about-card",
        { y: 22, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 76%",
          },
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="scroll-mt-24 border-y border-border bg-card/20 py-24 md:py-28"
      aria-labelledby="about-title"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6">
        <div className="animate-about-header mx-auto max-w-3xl space-y-4 text-center opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles size={13} className="text-primary" />
            About EcoSphere
          </span>
          <h2
            id="about-title"
            className="text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            Purpose-built for high-trust sustainability leadership
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            EcoSphere helps enterprise teams align strategy, execution, and
            reporting with a premium product experience designed for trust.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ABOUT_CARDS.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="animate-about-card flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 opacity-100 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconClass}`}
                >
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
