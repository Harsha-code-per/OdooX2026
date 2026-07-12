import {
  Award,
  Building2,
  CheckCircle2,
  FileText,
  Info,
  UserPlus,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types/dashboard";

interface ActivityCardProps {
  activity: ActivityItem;
  className?: string;
}

export function ActivityCard({ activity, className }: ActivityCardProps) {
  const isApproval = activity.type === "approval";
  const isInvite = activity.type === "invitation";
  const isChallenge = activity.type === "challenge";
  const isReport = activity.type === "report";
  const isDept = activity.type === "department";

  const Icon = isApproval
    ? CheckCircle2
    : isInvite
      ? UserPlus
      : isChallenge
        ? Award
        : isReport
          ? FileText
          : isDept
            ? Building2
            : Info;

  return (
    <div
      className={cn(
        "flex items-start gap-3 py-3 border-b border-border/40 last:border-0 text-left text-xs leading-normal",
        className,
      )}
    >
      {/* Icon Badge */}
      <div
        className={cn(
          "h-7 w-7 rounded-lg flex items-center justify-center border flex-shrink-0 mt-0.5",
          isApproval && "text-success bg-success/5 border-success/15",
          isInvite && "text-info bg-info/5 border-info/15",
          isChallenge && "text-warning bg-warning/5 border-warning/15",
          isReport && "text-primary bg-primary/5 border-primary/15",
          isDept && "text-purple-500 bg-purple-500/5 border-purple-500/15",
          !isApproval &&
            !isInvite &&
            !isChallenge &&
            !isReport &&
            !isDept &&
            "text-muted-foreground bg-muted/5 border-border",
        )}
      >
        <Icon size={14} />
      </div>

      {/* Description & Metadata */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="font-medium text-foreground/90 truncate sm:whitespace-normal">
          {activity.title}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>By {activity.actor}</span>
          <span className="text-border/80">•</span>
          <span>{formatRelativeTime(activity.time)}</span>
        </div>
      </div>
    </div>
  );
}
