"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle — Cycles through Light / Dark / System themes.
 *
 * Uses a mounted guard to prevent hydration mismatch.
 */
export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  /* Prevent hydration mismatch — render placeholder until mounted */
  if (!mounted) {
    return <div className="h-9 w-9 rounded-md" aria-hidden="true" />;
  }

  function cycleTheme() {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const label =
    theme === "light"
      ? "Switch to dark mode"
      : theme === "dark"
        ? "Switch to system theme"
        : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn(
        "rounded-md p-2",
        "text-foreground/60 hover:bg-accent hover:text-foreground",
        "transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-ring",
      )}
      aria-label={label}
      title={label}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
