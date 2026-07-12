"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Leaf,
  Settings,
  Shield,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarGroup } from "@/components/layout/sidebar-group";
import { SidebarItem } from "@/components/layout/sidebar-item";
import { ROUTES } from "@/constants/routes";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

/* ─── Navigation Config ─────────────────────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

type NavEntry = NavItem | (NavGroup & { type: "group" });

const NAV_ITEMS: NavEntry[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    type: "group",
    label: "Workspace",
    icon: Building2,
    items: [
      { label: "Departments", href: ROUTES.TEAM_DEPARTMENTS, icon: Building2 },
      { label: "Members", href: ROUTES.TEAM_MEMBERS, icon: Users },
      { label: "Roles", href: ROUTES.TEAM_ROLES, icon: Shield },
    ],
  },
  {
    type: "group",
    label: "Environmental",
    icon: Leaf,
    items: [
      { label: "Overview", href: ROUTES.ENVIRONMENT, icon: Leaf },
      {
        label: "Carbon Tracking",
        href: ROUTES.ENVIRONMENT_CARBON,
        icon: TrendingUp,
      },
      { label: "Goals", href: ROUTES.ENVIRONMENT_GOALS, icon: TrendingUp },
    ],
  },
  {
    type: "group",
    label: "Social",
    icon: Users,
    items: [
      { label: "CSR Activities", href: ROUTES.SOCIAL, icon: Users },
      {
        label: "Participation",
        href: ROUTES.SOCIAL_PARTICIPATION,
        icon: TrendingUp,
      },
    ],
  },
  {
    type: "group",
    label: "Governance",
    icon: Shield,
    items: [
      { label: "Policies", href: ROUTES.GOVERNANCE_POLICIES, icon: Shield },
      {
        label: "Compliance",
        href: ROUTES.GOVERNANCE_COMPLIANCE,
        icon: TrendingUp,
      },
    ],
  },
  {
    label: "Reports",
    href: ROUTES.REPORTS,
    icon: FileText,
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
  {
    label: "Profile",
    href: ROUTES.PROFILE,
    icon: User,
  },
];

/* ─── Sidebar Component ─────────────────────────────────────────────────────── */
export function Sidebar() {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
  } = useUIStore();
  const { isMobile, isTablet } = useBreakpoint();
  const pathname = usePathname();

  const isCollapsed = isSidebarCollapsed && !isMobile && !isTablet;

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <motion.aside
        className={cn(
          "hidden lg:flex flex-col",
          "bg-sidebar border-r border-sidebar-border",
          "relative z-30 flex-shrink-0",
          "transition-none" /* Framer Motion handles transitions */,
        )}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        aria-label="Main navigation"
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          pathname={pathname}
          onToggleCollapse={toggleSidebar}
        />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            className={cn(
              "fixed left-0 top-0 z-50 h-full w-64 lg:hidden",
              "flex flex-col",
              "bg-sidebar border-r border-sidebar-border",
            )}
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
              <span className="text-sm font-semibold text-sidebar-foreground">
                EcoSphere
              </span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent
              isCollapsed={false}
              pathname={pathname}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              isMobile
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Sidebar Content ───────────────────────────────────────────────────────── */
interface SidebarContentProps {
  isCollapsed: boolean;
  pathname: string;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

function SidebarContent({
  isCollapsed,
  pathname,
  onToggleCollapse,
  isMobile,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border",
          "px-4 py-4 min-h-[60px]",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              {/* Logo mark */}
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Leaf size={14} className="text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
                EcoSphere
              </span>
            </motion.div>
          )}
          {isCollapsed && (
            <motion.div
              key="logo-mark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center"
            >
              <Leaf size={14} className="text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "rounded-md p-1 text-sidebar-foreground/50",
              "hover:bg-sidebar-accent hover:text-sidebar-foreground",
              "transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-ring",
              isCollapsed &&
                "absolute right-0 translate-x-1/2 bg-sidebar border border-sidebar-border shadow-sm",
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5"
        aria-label="Application navigation"
      >
        {NAV_ITEMS.map((entry) => {
          if ("type" in entry && entry.type === "group") {
            return (
              <SidebarGroup
                key={entry.label}
                label={entry.label}
                icon={entry.icon}
                items={entry.items}
                isCollapsed={isCollapsed}
                pathname={pathname}
              />
            );
          }

          const item = entry as NavItem;
          return (
            <SidebarItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isCollapsed={isCollapsed}
              isActive={pathname === item.href}
            />
          );
        })}
      </nav>
    </div>
  );
}
