import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | EcoSphere",
    default: "EcoSphere — Enterprise ESG Intelligence Platform",
  },
};

/**
 * Marketing Layout
 *
 * Wraps all public marketing/landing pages.
 * Completely isolated from dashboard code.
 * Uses GSAP for animations (never Framer Motion).
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
