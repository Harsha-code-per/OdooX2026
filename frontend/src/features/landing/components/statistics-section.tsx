"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatItemProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

function StatItem({ target, suffix = "", prefix = "", label }: StatItemProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    const obj = { value: 0 };
    const trigger = ScrollTrigger.create({
      trigger: elementRef.current,
      start: "top 85%",
      onEnter: () => {
        gsap.to(obj, {
          value: target,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            setCount(Math.floor(obj.value));
          },
        });
      },
      once: true,
    });

    return () => {
      trigger.kill();
    };
  }, [target]);

  return (
    <div
      ref={elementRef}
      className="text-center p-6 space-y-2 animate-stat-card opacity-100"
    >
      <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export function StatisticsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(".animate-stat-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-20 bg-card/10 border-y border-border overflow-hidden relative z-10"
      aria-label="Platform performance statistics"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x/0 sm:divide-x border-border/60">
          <StatItem target={98} suffix="%" label="Reporting Accuracy" />
          <StatItem target={250} suffix="+" label="Organizations Ready" />
          <StatItem target={18} suffix="%" label="Carbon Reduction" />
          {/* Custom special stat: 24/7 */}
          <div className="text-center p-6 space-y-2 animate-stat-card opacity-100">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              24/7
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Real-time Monitoring
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
