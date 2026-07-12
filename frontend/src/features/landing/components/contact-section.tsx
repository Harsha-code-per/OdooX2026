"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CalendarDays,
  Headset,
  Mail,
  MapPin,
  MessagesSquare,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ROUTES } from "@/constants/routes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CONTACT_CARDS = [
  {
    title: "Email",
    description: "Reach the EcoSphere team for general inquiries.",
    value: "hello@ecosphere.app",
    actionLabel: "Send Email",
    href: "mailto:hello@ecosphere.app",
    icon: Mail,
    iconClass: "text-primary bg-primary/10",
  },
  {
    title: "Support",
    description: "Get platform support and implementation guidance.",
    value: "support@ecosphere.app",
    actionLabel: "Contact Support",
    href: "mailto:support@ecosphere.app",
    icon: Headset,
    iconClass: "text-info bg-info/10",
  },
  {
    title: "Sales",
    description: "Talk to sales about enterprise rollout and pricing.",
    value: "sales@ecosphere.app",
    actionLabel: "Talk to Sales",
    href: "mailto:sales@ecosphere.app",
    icon: PhoneCall,
    iconClass: "text-success bg-success/10",
  },
  {
    title: "Demo Request",
    description: "Book a guided walkthrough tailored to your ESG goals.",
    value: "Live product session",
    actionLabel: "Book Demo",
    href: "mailto:sales@ecosphere.app?subject=EcoSphere%20Demo%20Request",
    icon: CalendarDays,
    iconClass: "text-warning bg-warning/10",
  },
  {
    title: "Location",
    description: "Serving enterprise teams globally from India.",
    value: "Hyderabad, Telangana",
    actionLabel: "Register to Connect",
    href: ROUTES.REGISTER,
    icon: MapPin,
    iconClass: "text-primary bg-primary/10",
  },
  {
    title: "Priority Contact",
    description: "Get started quickly with a dedicated onboarding flow.",
    value: "Fastest path to trial",
    actionLabel: "Start Now",
    href: ROUTES.REGISTER,
    icon: MessagesSquare,
    iconClass: "text-info bg-info/10",
  },
];

export function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-contact-header",
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
        ".animate-contact-card",
        { y: 18, opacity: 0 },
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
      id="contact"
      className="scroll-mt-24 bg-background py-24 md:py-28"
      aria-labelledby="contact-title"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6">
        <div className="animate-contact-header mx-auto max-w-3xl space-y-4 text-center opacity-100">
          <h2
            id="contact-title"
            className="text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            Contact EcoSphere
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Whether you need support, a product walkthrough, or an enterprise
            proposal, our team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="animate-contact-card flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-6 opacity-100 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconClass}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {card.value}
                    </p>
                  </div>
                </div>

                <Link
                  href={card.href}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-input px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {card.actionLabel}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
