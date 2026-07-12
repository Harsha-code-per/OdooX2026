"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  type LucideIcon,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColorClass?: string;
  change?: string | number;
  trend?: "up" | "down" | "stable";
  subtext?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColorClass = "text-primary bg-primary/10",
  change,
  trend,
  subtext,
  className,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-2xs space-y-4 flex flex-col justify-between select-none relative overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
          {title}
        </span>
        <div
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center border border-transparent",
            iconColorClass,
          )}
        >
          <Icon size={16} />
        </div>
      </div>

      <div className="space-y-1.5 text-left">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </span>

          {change !== undefined && (
            <span
              className={cn(
                "text-xs font-semibold flex items-center gap-0.5",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "stable" && "text-muted-foreground",
              )}
            >
              {trend === "up" && <ArrowUpRight size={12} />}
              {trend === "down" && <ArrowDownRight size={12} />}
              {trend === "stable" && <Minus size={12} />}
              {change}
            </span>
          )}
        </div>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>
    </motion.div>
  );
}
