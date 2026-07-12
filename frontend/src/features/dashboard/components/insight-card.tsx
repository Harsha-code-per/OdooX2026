"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Insight } from "@/types/dashboard";

interface InsightCardProps {
  insight: Insight;
  className?: string;
}

export function InsightCard({ insight, className }: InsightCardProps) {
  const isWarning = insight.severity === "warning";
  const isCritical = insight.severity === "critical";
  const isSuccess = insight.severity === "success";

  const Icon = isSuccess
    ? CheckCircle2
    : isWarning
      ? AlertTriangle
      : isCritical
        ? AlertCircle
        : Info;

  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "p-4 rounded-xl border flex items-start gap-3.5 shadow-2xs text-left text-sm leading-normal",
        isSuccess && "bg-success/5 border-success/20 text-foreground",
        isWarning && "bg-warning/5 border-warning/20 text-foreground",
        isCritical && "bg-destructive/5 border-destructive/20 text-foreground",
        !isSuccess &&
          !isWarning &&
          !isCritical &&
          "bg-muted/10 border-border text-foreground",
        className,
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 mt-0.5",
          isSuccess && "text-success",
          isWarning && "text-warning",
          isCritical && "text-destructive",
          !isSuccess && !isWarning && !isCritical && "text-muted-foreground",
        )}
      >
        <Icon size={16} />
      </div>

      <div className="flex-1 space-y-1.5 min-w-0">
        <p className="text-xs sm:text-sm text-foreground/90 font-medium">
          {insight.message}
        </p>
        {insight.cta && insight.ctaHref && (
          <Link
            href={insight.ctaHref}
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
              isSuccess && "text-success hover:text-success/80",
              isWarning && "text-warning hover:text-warning/80",
              isCritical && "text-destructive hover:text-destructive/80",
              !isSuccess &&
                !isWarning &&
                !isCritical &&
                "text-primary hover:text-primary/80",
            )}
          >
            <span>{insight.cta}</span>
            <ArrowRight size={10} />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
