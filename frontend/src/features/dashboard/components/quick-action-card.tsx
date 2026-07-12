"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  colorClass?: string;
  className?: string;
}

export function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  colorClass = "text-primary bg-primary/10",
  className,
}: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "rounded-xl border border-border bg-card/40 hover:bg-card shadow-2xs hover:shadow-xs transition-colors p-4 relative overflow-hidden group",
        className,
      )}
    >
      <Link
        href={href}
        className="flex items-center gap-4 text-left focus:outline-none"
      >
        {/* Action Icon */}
        <div
          className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-200 border border-transparent",
            colorClass,
          )}
        >
          <Icon size={18} />
        </div>

        {/* Text descriptions */}
        <div className="space-y-0.5 min-w-0">
          <h3 className="text-xs font-bold text-foreground truncate">
            {title}
          </h3>
          <p className="text-[10px] text-muted-foreground truncate max-w-[180px] sm:max-w-none">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
