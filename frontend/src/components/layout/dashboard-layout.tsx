"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

/**
 * DashboardLayoutClient — Client-side dashboard shell.
 *
 * Composition:
 * ┌────────────────────────────────────────────┐
 * │ Header (sticky, full-width)                │
 * ├──────────────────────────────────────────┤
 * │ Sidebar │ Main Content Area               │
 * │         │                                 │
 * │         │                                 │
 * └─────────┴─────────────────────────────────┘
 *
 * Rules:
 * - This layout renders once and is never recreated per page
 * - Only the Main Content Area changes on navigation
 * - Sidebar collapse state is persisted via Zustand + localStorage
 */
export function DashboardLayoutClient({
  children,
}: DashboardLayoutClientProps) {
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const _pathname = usePathname();

  /* Close mobile drawer on route change */
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [setMobileSidebarOpen]);

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area (header + content) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        {/* Page content */}
        <main
          id="main-content"
          className={cn("flex-1 overflow-y-auto", "px-4 py-6 md:px-6 lg:px-8")}
        >
          {children}
        </main>
      </div>

      {/* Mobile overlay — closes drawer when clicking outside */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
