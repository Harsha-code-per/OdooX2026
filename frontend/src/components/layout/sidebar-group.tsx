"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SubItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarGroupProps {
  label: string;
  icon: LucideIcon;
  items: SubItem[];
  isCollapsed: boolean;
  pathname: string;
}

/**
 * SidebarGroup — A collapsible group of navigation items.
 *
 * Auto-expands when any child route is active.
 */
export function SidebarGroup({
  label,
  icon: Icon,
  items,
  isCollapsed,
  pathname,
}: SidebarGroupProps) {
  const isAnyChildActive = items.some((item) => pathname.startsWith(item.href));
  const [isExpanded, setIsExpanded] = useState(isAnyChildActive);

  /* In collapsed mode, render just the group icon */
  if (isCollapsed) {
    return (
      <div className="py-1">
        <div
          className="flex items-center justify-center rounded-lg px-2 py-2 text-sidebar-foreground/50"
          title={label}
        >
          <Icon size={20} aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2",
          "text-sm font-medium transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1",
          "select-none",
          isAnyChildActive
            ? "text-sidebar-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        )}
      >
        <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-left">{label}</span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="group-items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-6 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5",
                      "text-sm transition-colors duration-150",
                      "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1",
                      isActive
                        ? "text-primary font-medium"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon size={14} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
