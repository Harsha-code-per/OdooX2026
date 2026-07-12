"use client";

import gsap from "gsap";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Leaf,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ROUTES } from "@/constants/routes";

const HERO_MOTION = {
  badgeDuration: 0.45,
  signalDuration: 0.42,
  connectorDuration: 0.38,
  transitionDuration: 0.7,
  revealDuration: 0.72,
  staggerFast: 0.12,
} as const;

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(".hero-prelude", { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(
        [
          ".hero-final",
          ".hero-headline",
          ".hero-subtitle",
          ".hero-cta",
          ".hero-scroll",
          ".animate-hero-highlight",
        ],
        {
          autoAlpha: 1,
          y: 0,
        },
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".animate-stage-badge",
        { y: -10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: HERO_MOTION.badgeDuration },
      )
        .fromTo(
          ".animate-stage-prep",
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: HERO_MOTION.badgeDuration },
          "-=0.2",
        )
        .fromTo(
          ".animate-signal-environmental",
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: HERO_MOTION.signalDuration,
          },
        )
        .fromTo(
          ".animate-signal-social",
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: HERO_MOTION.signalDuration,
          },
          "+=0.06",
        )
        .fromTo(
          ".animate-signal-governance",
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: HERO_MOTION.signalDuration,
          },
          "+=0.06",
        )
        .fromTo(
          [".animate-node-env", ".animate-node-social"],
          { scale: 0, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.25,
            stagger: HERO_MOTION.staggerFast,
          },
          "+=0.08",
        );

      tl.fromTo(
        ".animate-connector-env",
        { scaleY: 0, autoAlpha: 0 },
        {
          scaleY: 1,
          autoAlpha: 1,
          transformOrigin: "top center",
          duration: HERO_MOTION.connectorDuration,
        },
      )
        .fromTo(
          ".animate-connector-social",
          { scaleY: 0, autoAlpha: 0 },
          {
            scaleY: 1,
            autoAlpha: 1,
            transformOrigin: "top center",
            duration: HERO_MOTION.connectorDuration,
          },
          "-=0.12",
        )
        .fromTo(
          ".animate-stage-merge",
          { y: 8, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.35,
          },
          "-=0.1",
        )
        .to(".hero-prelude", {
          y: -10,
          autoAlpha: 0,
          duration: HERO_MOTION.transitionDuration,
          ease: "power3.inOut",
          pointerEvents: "none",
        })
        .fromTo(
          ".hero-final",
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: HERO_MOTION.revealDuration,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .fromTo(
          ".hero-headline",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          ".animate-hero-highlight",
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.45 },
          "-=0.35",
        )
        .fromTo(
          ".hero-subtitle",
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
          },
          "-=0.18",
        )
        .fromTo(
          ".hero-cta",
          { y: 10, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: HERO_MOTION.staggerFast,
            duration: 0.4,
          },
          "-=0.15",
        )
        .fromTo(
          ".hero-scroll",
          { y: -8, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.35,
          },
          "-=0.1",
        );

      tl.add(() => {
        gsap.to(".animate-hero-scroll-icon", {
          y: 6,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[94dvh] flex-col items-center justify-center overflow-hidden bg-background pb-20 pt-28 md:min-h-[96dvh]"
      aria-label="Hero Introduction"
    >
      <div
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.03] dark:opacity-[0.05]"
        aria-hidden="true"
      />

      <div
        className="absolute left-1/2 top-1/3 z-0 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl md:h-[420px] md:w-[420px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center">
        <div className="relative flex min-h-[36rem] w-full items-center justify-center md:min-h-[38rem]">
          {/* Stage 1-3: Quiet setup and ESG signal assembly */}
          <div className="hero-prelude absolute inset-x-0 top-0 mx-auto flex w-full max-w-2xl flex-col items-center">
            <div className="animate-stage-badge opacity-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-foreground shadow-xs">
                <span className="h-2 w-2 rounded-full bg-primary" />
                EcoSphere 1.0 has launched
              </span>
            </div>

            <p className="animate-stage-prep mt-6 text-2xl font-medium tracking-tight text-foreground/90 opacity-0 md:text-3xl">
              Collecting ESG Signals...
            </p>

            <div className="mt-10 flex w-full max-w-md flex-col items-center">
              <div className="animate-signal-environmental flex w-full items-center justify-between rounded-xl border border-border bg-card/90 px-4 py-3 opacity-0 backdrop-blur-sm">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground md:text-base">
                  <Leaf size={16} className="text-success" />
                  Environmental
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-success">
                  <Check size={14} />
                  Verified
                </span>
              </div>

              <div className="mt-2 flex flex-col items-center">
                <span className="animate-node-env h-1.5 w-1.5 rounded-full bg-success/80 opacity-0" />
                <span className="animate-connector-env mt-1 block h-10 w-px origin-top scale-y-0 bg-gradient-to-b from-success/70 to-info/70 opacity-0" />
              </div>

              <div className="animate-signal-social flex w-full items-center justify-between rounded-xl border border-border bg-card/90 px-4 py-3 opacity-0 backdrop-blur-sm">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground md:text-base">
                  <Users size={16} className="text-info" />
                  Social
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-info">
                  <Check size={14} />
                  Verified
                </span>
              </div>

              <div className="mt-2 flex flex-col items-center">
                <span className="animate-node-social h-1.5 w-1.5 rounded-full bg-info/80 opacity-0" />
                <span className="animate-connector-social mt-1 block h-10 w-px origin-top scale-y-0 bg-gradient-to-b from-info/70 to-warning/70 opacity-0" />
              </div>

              <div className="animate-signal-governance flex w-full items-center justify-between rounded-xl border border-border bg-card/90 px-4 py-3 opacity-0 backdrop-blur-sm">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground md:text-base">
                  <Shield size={16} className="text-warning" />
                  Governance
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-warning">
                  <Check size={14} />
                  Verified
                </span>
              </div>
            </div>

            <p className="animate-stage-merge mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground opacity-0">
              Building connected intelligence
            </p>
          </div>

          {/* Stage 4-5: Final messaging and conversion */}
          <div className="hero-final absolute inset-0 flex items-center justify-center px-6 opacity-0">
            <div className="w-full max-w-5xl space-y-8 text-center md:space-y-10">
              <h1 className="hero-headline mx-auto max-w-5xl text-4xl font-bold leading-[1.03] tracking-tight text-foreground opacity-0 sm:text-5xl md:text-6xl lg:text-7xl">
                Enterprise ESG Intelligence for{" "}
                <span className="animate-hero-highlight inline-block bg-gradient-to-r from-success via-info to-warning bg-clip-text text-transparent opacity-0">
                  Sustainable Organizations
                </span>
              </h1>

              <p className="hero-subtitle mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground opacity-0 sm:text-lg md:text-xl">
                EcoSphere transforms raw environmental, social, and governance
                signals into one intelligent operating layer for enterprise
                teams.
              </p>

              <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={ROUTES.REGISTER}
                  className="hero-cta inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground opacity-0 shadow-lg shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-ring sm:w-auto"
                >
                  Get Started
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link
                  href="/#platform"
                  className="hero-cta inline-flex h-11 w-full items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium opacity-0 transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring sm:w-auto"
                >
                  Explore Platform
                </Link>
              </div>

              <Link
                href="/#platform"
                className="hero-scroll inline-flex items-center justify-center rounded-md px-2 py-1 opacity-0 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                aria-label="Scroll to platform reveal"
              >
                <ChevronDown
                  size={24}
                  className="animate-hero-scroll-icon text-muted-foreground/60"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
