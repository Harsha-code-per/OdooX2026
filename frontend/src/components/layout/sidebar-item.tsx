"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isCollapsed: boolean;
  isActive: boolean;
}

/**
 * SidebarItem — A single navigation link in the sidebar.
 *
 * Supports:
 * - Collapsed mode (icon only with tooltip)
 * - Active state (highlighted with primary color)
 * - Keyboard navigation
 * - Focus ring
 */
export function SidebarItem({
  label,
  href,
  icon: Icon,
  isCollapsed,
  isActive,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2",
        "text-sm font-medium transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1",
        "select-none",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        isCollapsed && "justify-center px-2",
      )}
    >
      <Icon
        size={isCollapsed ? 20 : 18}
        className="flex-shrink-0"
        aria-hidden="true"
      />
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          className="truncate"
        >
          {label}
        </motion.span>
      )}
    </Link>
  );
}
