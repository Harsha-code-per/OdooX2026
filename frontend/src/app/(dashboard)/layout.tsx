import type { Metadata } from "next";
import { DashboardLayoutClient } from "@/components/layout/dashboard-layout";

export const metadata: Metadata = {
  title: {
    template: "%s | EcoSphere",
    default: "Dashboard — EcoSphere",
  },
};

/**
 * Dashboard Layout (Server Component wrapper)
 *
 * This is the server-side entry point for the dashboard route group.
 * It delegates rendering to DashboardLayoutClient (client component)
 * which manages Sidebar + Header + content area with Zustand state.
 *
 * Authentication guard is implemented in middleware.ts (Phase 12).
 * Until then, the layout renders without auth protection during development.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
