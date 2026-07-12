"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle2,
  Info,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeader } from "@/features/dashboard/components/section-header";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notification-store";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success";
  read: boolean;
  createdAt: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "LED lighting upgrade pending review",
    description:
      "Operations team has logged a new LED retrofitting energy-saving initiative.",
    type: "info",
    read: false,
    createdAt: "2 hours ago",
  },
  {
    id: "notif-2",
    title: "Supplier ESG Policy draft requires approval",
    description:
      "The Supplier requirements guidelines policy is awaiting compliance committee sign-off.",
    type: "warning",
    read: false,
    createdAt: "5 hours ago",
  },
  {
    id: "notif-3",
    title: "Q1 Environmental Audit completed",
    description:
      "Q1 ESG compliance review finalized successfully with 1 minor finding.",
    type: "success",
    read: true,
    createdAt: "1 day ago",
  },
  {
    id: "notif-4",
    title: "Welcome to EcoSphere Platform!",
    description:
      "Get started by checking out workspace members and configuring organization details.",
    type: "success",
    read: true,
    createdAt: "2 days ago",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { setUnreadCount } = useNotificationStore();

  // Sync unread count to global store
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications, setUnreadCount]);

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function deleteNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  return (
    <PageContainer className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="Notification Center"
        description="Monitor system alerts, compliance warnings, signed policies, and audit milestones."
        actions={
          notifications.some((n) => !n.read) && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <CheckCheck size={14} className="mr-1.5" />
              Mark all as read
            </button>
          )
        }
      />

      <div className="max-w-3xl mx-auto space-y-6 text-left">
        {/* TABS FILTERS */}
        <div
          className="flex gap-1.5 border-b border-border/60 pb-3"
          role="tablist"
          aria-label="Notification filters"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer",
              filter === "all"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
            )}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "unread"}
            onClick={() => setFilter("unread")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer",
              filter === "unread"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
            )}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        {/* NOTIFICATIONS LIST CONTAINER */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredNotifications.map((notif) => {
              const Icon =
                notif.type === "success"
                  ? CheckCircle2
                  : notif.type === "warning"
                    ? AlertTriangle
                    : Info;

              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "p-4 rounded-xl border flex items-start gap-4 shadow-2xs relative group",
                    notif.read
                      ? "bg-card/40 border-border/60"
                      : "bg-card border-primary/20 ring-1 ring-primary/5",
                  )}
                >
                  {/* Unread indicator circle dot */}
                  {!notif.read && (
                    <div className="absolute top-4 left-3 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-transparent",
                      notif.type === "success" && "text-success bg-success/10",
                      notif.type === "warning" && "text-warning bg-warning/10",
                      notif.type === "info" && "text-primary bg-primary/10",
                    )}
                  >
                    <Icon size={16} />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-bold text-foreground truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {notif.createdAt}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {notif.description}
                    </p>
                  </div>

                  {/* Actions (Mark read, Delete) */}
                  <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notif.id)}
                        className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* EMPTY STATE */}
          {filteredNotifications.length === 0 && (
            <div className="py-16 rounded-2xl border border-dashed border-border/80 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 mb-2">
                <Bell size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  All caught up!
                </p>
                <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                  You have no new {filter === "unread" ? "unread " : ""}
                  notifications.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
