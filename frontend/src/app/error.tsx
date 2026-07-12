"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
        Something went wrong
      </h1>
      <p className="max-w-md text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
        An error occurred while loading this page. Please try refreshing or
        retrying. If the problem persists, contact your organization
        administrator.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-6 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
