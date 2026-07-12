import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
        Page not found
      </h1>
      <p className="max-w-md text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
        The page you are looking for doesn't exist or has been moved. Check the
        URL or return to the dashboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-6 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
