import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { AboutSection } from "@/features/landing/components/about-section";
import { AuthTransition } from "@/features/landing/components/auth-transition";
import { ContactSection } from "@/features/landing/components/contact-section";
import { EnterpriseBenefits } from "@/features/landing/components/enterprise-benefits";
import { EsgPillars } from "@/features/landing/components/esg-pillars";
import { HeroSection } from "@/features/landing/components/hero-section";
import { ProductRevealSection } from "@/features/landing/components/product-reveal-section";

/**
 * Root marketing/landing page.
 * Composes the layout-independent marketing header and the hero section.
 */
export default function MarketingLandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background selection:bg-primary/20">
      {/* Navigation */}
      <MarketingHeader />

      {/* Main Section */}
      <main className="flex-1">
        <HeroSection />
        <div className="h-20 bg-background md:h-32" aria-hidden="true" />
        <ProductRevealSection />
        <EsgPillars />
        <EnterpriseBenefits />
        <AboutSection />
        <ContactSection />
        <AuthTransition />
      </main>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}
export const metadata = {
  title: "EcoSphere — Enterprise ESG Intelligence Platform",
  description:
    "Modern sustainability management for organizations that care about measurable environmental, social, and governance impact.",
};
