import type React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageContainer — Standard page wrapper.
 * Max width: 1440px
 * Content width: 1280px (max-w-7xl)
 * Centered always.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-(--breakpoint-xl) animate-fade-in",
        className,
      )}
    >
      {children}
    </div>
  );
}
