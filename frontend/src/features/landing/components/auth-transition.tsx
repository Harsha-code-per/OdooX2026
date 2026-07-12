"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ROUTES } from "@/constants/routes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AuthTransition() {
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
        ".animate-cta-title",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      )
        .fromTo(
          ".animate-cta-text",
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          ".animate-cta-buttons",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-32 bg-background overflow-hidden relative z-10"
      aria-label="Get Started call to action"
    >
      {/* Decorative gradient blur orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <h2 className="animate-cta-title opacity-100 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground max-w-2xl mx-auto leading-tight">
          Ready to transform your{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            ESG operations?
          </span>
        </h2>
        <p className="animate-cta-text opacity-100 text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Join leading organizations scaling compliance metrics, carbon
          accounting, and social impact tracking under a secure, modern
          architecture.
        </p>

        {/* CTA Buttons */}
        <div className="animate-cta-buttons opacity-100 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={ROUTES.REGISTER}
            className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 hover:shadow-primary/30 transition-all focus-visible:outline-2 focus-visible:outline-ring"
          >
            Get Started
            <ArrowRight size={16} className="ml-2" />
          </Link>
          <Link
            href="/#contact"
            className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all focus-visible:outline-2 focus-visible:outline-ring"
          >
            Book Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
