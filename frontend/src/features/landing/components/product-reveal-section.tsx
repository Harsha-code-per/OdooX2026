"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { HeroDashboardPreview } from "./hero-dashboard-preview";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProductRevealSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-reveal-header",
        { y: 22, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        ".animate-reveal-dashboard",
        { y: 42, opacity: 0, scale: 0.975 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: "power3.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="platform"
      className="scroll-mt-16 bg-background pb-28 pt-6 md:pb-36 md:pt-8"
      aria-labelledby="platform-reveal-title"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6">
        <div className="animate-reveal-header mx-auto max-w-3xl space-y-4 text-center opacity-100">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Platform Reveal
          </span>
          <h2
            id="platform-reveal-title"
            className="text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            A Unified ESG Workspace Built for Enterprise Velocity
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            From executive scorecards to team-level actions, EcoSphere brings
            environmental, social, and governance intelligence into one clear
            operating system.
          </p>
        </div>

        <div className="animate-reveal-dashboard opacity-100">
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}
