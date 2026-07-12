"use client";

import { useEffect, useState } from "react";
import { THEME } from "@/constants/theme";

type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

/**
 * useBreakpoint — Reactive current breakpoint.
 *
 * Breakpoints per 02-design-system.md:
 * - mobile: < 640px
 * - tablet: 640–1023px
 * - desktop: 1024–1279px
 * - wide: ≥ 1280px
 *
 * Usage:
 *   const { breakpoint, isMobile, isTablet } = useBreakpoint()
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    function getBreakpoint(): Breakpoint {
      const width = window.innerWidth;
      if (width < THEME.BREAKPOINTS.MOBILE) return "mobile";
      if (width < THEME.BREAKPOINTS.DESKTOP) return "tablet";
      if (width < THEME.BREAKPOINTS.WIDE) return "desktop";
      return "wide";
    }

    const observer = new ResizeObserver(() => {
      setBreakpoint(getBreakpoint());
    });

    observer.observe(document.documentElement);
    setBreakpoint(getBreakpoint());

    return () => observer.disconnect();
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop" || breakpoint === "wide",
    isWide: breakpoint === "wide",
  };
}
