import { Leaf } from "lucide-react";
import Link from "next/link";

/**
 * Root marketing/landing page.
 *
 * Placed inside the (marketing) route group so it inherits the MarketingLayout.
 * During Phase 2, this will be fully replaced by the interactive GSAP marketing experience.
 */
export default function MarketingLandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Leaf size={16} className="text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">EcoSphere</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground bg-card shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Phase 1 Foundation Complete
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Enterprise ESG Intelligence Platform
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Modern sustainability management for organizations that care about
            measurable environmental, social, and governance impact. Ready for
            Phase 2 Landing Experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
            >
              Enter Dashboard
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Sign In Demo
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} EcoSphere. All rights reserved.
      </footer>
    </div>
  );
}
