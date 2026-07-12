import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  isLoading = false,
  children,
  className,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-2xs space-y-4 flex flex-col justify-between overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/40 pb-3 text-left">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center">
        {isLoading ? (
          <div className="w-full h-full space-y-2">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
