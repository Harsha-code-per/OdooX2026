import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { AuthTransition } from "@/features/landing/components/auth-transition";
import { EnterpriseBenefits } from "@/features/landing/components/enterprise-benefits";
import { EsgPillars } from "@/features/landing/components/esg-pillars";
import { HeroSection } from "@/features/landing/components/hero-section";
import { PlatformCapabilities } from "@/features/landing/components/platform-capabilities";
import { StatisticsSection } from "@/features/landing/components/statistics-section";
import { UnifiedPlatform } from "@/features/landing/components/unified-platform";

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
        <EsgPillars />
        <UnifiedPlatform />
        <PlatformCapabilities />
        <EnterpriseBenefits />
        <StatisticsSection />
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
