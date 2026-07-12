"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notification-store";
import { useUIStore } from "@/store/ui-store";

/**
 * Header — Global application header.
 *
 * Contains:
 * - Mobile menu toggle
 * - Breadcrumb (dynamic, route-aware)
 * - Global search trigger
 * - Notification bell
 * - Theme toggle
 * - Profile menu (Phase 4 — shell only in Phase 1)
 *
 * Remains sticky at the top of every authenticated page.
 */
export function Header() {
  const { setMobileSidebarOpen, setSearchOpen } = useUIStore();
  const { unreadCount, togglePanel } = useNotificationStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-20",
        "flex h-[60px] items-center gap-4 px-4 md:px-6",
        "bg-background/95 backdrop-blur-sm",
        "border-b border-border",
      )}
    >
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className={cn(
          "lg:hidden rounded-md p-1.5",
          "text-foreground/60 hover:bg-accent hover:text-foreground",
          "transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-ring",
        )}
        aria-label="Open navigation menu"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1">
        {/* Global search */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className={cn(
            "rounded-md p-2",
            "text-foreground/60 hover:bg-accent hover:text-foreground",
            "transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-ring",
          )}
          aria-label="Open search (Ctrl+K)"
          title="Search (Ctrl+K)"
        >
          <Search size={18} aria-hidden="true" />
        </button>

        {/* Notification bell */}
        <button
          type="button"
          onClick={togglePanel}
          className={cn(
            "relative rounded-md p-2",
            "text-foreground/60 hover:bg-accent hover:text-foreground",
            "transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-ring",
          )}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell size={18} aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute right-1.5 top-1.5",
                "flex h-4 w-4 items-center justify-center",
                "rounded-full bg-destructive text-destructive-foreground",
                "text-[10px] font-semibold",
              )}
              aria-hidden="true"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Profile — shell (full implementation in Phase 4) */}
        <button
          type="button"
          className={cn(
            "ml-1 h-8 w-8 rounded-full",
            "bg-primary/10 hover:bg-primary/20",
            "flex items-center justify-center",
            "text-primary text-xs font-semibold",
            "transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-ring",
          )}
          aria-label="Open profile menu"
        >
          ES
        </button>
      </div>
    </header>
  );
}
