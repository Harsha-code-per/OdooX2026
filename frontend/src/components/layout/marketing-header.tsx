"use client";

import { Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Platform", href: "/#platform", targetId: "platform" },
  { label: "Solutions", href: "/#solutions", targetId: "solutions" },
  { label: "Security", href: "/#security", targetId: "security" },
  { label: "About", href: "/#about", targetId: "about" },
  { label: "Contact", href: "/#contact", targetId: "contact" },
];

export function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionIds = [
      "platform",
      "solutions",
      "security",
      "about",
      "contact",
    ];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: 0.1,
      },
    );

    for (const el of elements) {
      if (el) observer.observe(el);
    }

    return () => {
      for (const el of elements) {
        if (el) observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-6 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-xs"
            : "bg-transparent border-b border-transparent",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-ring rounded-lg"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <Leaf size={16} className="text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground tracking-tight text-lg">
            EcoSphere
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.targetId;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors duration-250 focus-visible:outline-2 focus-visible:outline-ring rounded-md px-1.5 py-0.5 relative group",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute bottom-0 left-1.5 right-1.5 h-[2px] bg-primary scale-x-0 origin-left transition-transform duration-250 ease-out",
                    isActive ? "scale-x-100" : "group-hover:scale-x-50",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions (Sign In, Get Started, Theme Toggle) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href={ROUTES.LOGIN}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring rounded-md px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 focus-visible:outline-2 focus-visible:outline-ring"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-md p-1.5 text-foreground/60 hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile drawer menu */}
      {isDrawerOpen && (
        /* biome-ignore lint/a11y/noStaticElementInteractions: convenient click-to-close overlay */
        /* biome-ignore lint/a11y/useKeyWithClickEvents: handled by close button inside */
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation wrapper has no user interaction */}
          <div
            className="fixed inset-y-0 right-0 w-full max-w-[280px] bg-background border-l border-border p-6 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <Leaf size={16} className="text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-foreground">
                    EcoSphere
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-md p-1.5 text-foreground/60 hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav
                className="flex flex-col gap-4"
                aria-label="Mobile Navigation Drawer"
              >
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.targetId;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className={cn(
                        "text-base font-medium transition-colors py-2 block focus-visible:outline-2 focus-visible:outline-ring rounded-md relative",
                        isActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setIsDrawerOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-lg border border-input text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={ROUTES.REGISTER}
                onClick={() => setIsDrawerOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-base font-medium text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
