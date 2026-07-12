"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Department } from "@/types/department";

interface DepartmentCardProps {
  department: Department;
  className?: string;
}

export function DepartmentCard({ department, className }: DepartmentCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-2xs space-y-5 flex flex-col justify-between select-none relative overflow-hidden",
        className,
      )}
    >
      {/* Visual header */}
      <div className="flex items-start justify-between border-b border-border/40 pb-3 text-left">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-foreground truncate max-w-[150px]">
            {department.name}
          </h3>
          <p className="text-[10px] text-muted-foreground truncate">
            Manager: {department.manager}
          </p>
        </div>
        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
          <Shield size={14} />
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-3 gap-2 text-left relative z-10">
        {/* Metric 1 */}
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1">
            <Shield size={10} /> Score
          </span>
          <span className="text-sm font-bold text-foreground block">
            {department.esg_score}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1">
            <TrendingUp size={10} /> Rate
          </span>
          <span className="text-sm font-bold text-foreground block">
            {department.participation}%
          </span>
        </div>

        {/* Metric 3 */}
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1">
            <Users size={10} /> Members
          </span>
          <span className="text-sm font-bold text-foreground block">
            {department.employees}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
