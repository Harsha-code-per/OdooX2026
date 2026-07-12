"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/* ─── Route label map ─────────────────────────────────────────────────────── */
const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  environment: "Environmental",
  carbon: "Carbon Tracking",
  goals: "Goals",
  social: "Social",
  activities: "Activities",
  participation: "Participation",
  governance: "Governance",
  policies: "Policies",
  compliance: "Compliance",
  team: "Workspace",
  departments: "Departments",
  members: "Members",
  roles: "Roles",
  reports: "Reports",
  analytics: "Analytics",
  exports: "Exports",
  history: "History",
  settings: "Settings",
  profile: "Profile",
  notifications: "Notifications",
};

/**
 * Breadcrumb — Dynamic, route-aware breadcrumb navigation.
 *
 * Derives path segments from Next.js usePathname().
 * Every page shows its location to the user at a glance.
 */
export function Breadcrumb() {
  const pathname = usePathname();

  /* Skip the empty first segment */
  const segments = pathname.split("/").filter(Boolean);

  /* Build breadcrumb items */
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label =
      ROUTE_LABELS[segment] ??
      /* Dynamic route segments (e.g., IDs) — capitalize */
      segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="flex items-center gap-1 text-sm">
        {/* Home always shown */}
        <li>
          <Link
            href={ROUTES.DASHBOARD}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              "focus-visible:outline-2 focus-visible:outline-ring rounded",
            )}
            aria-label="Dashboard home"
          >
            <Home size={14} aria-hidden="true" />
          </Link>
        </li>

        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <ChevronRight
              size={12}
              className="text-muted-foreground/50"
              aria-hidden="true"
            />
            {crumb.isLast ? (
              <span
                className="font-medium text-foreground truncate max-w-[200px]"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px]",
                  "focus-visible:outline-2 focus-visible:outline-ring rounded",
                )}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
