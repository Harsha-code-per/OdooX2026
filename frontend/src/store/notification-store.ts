import { create } from "zustand";

/**
 * Notification Store — Global notification UI state.
 *
 * Rules:
 * - Only UI state (unread count, panel open/closed)
 * - Actual notification data lives in React Query
 * - Never store notification content here
 */

interface NotificationState {
  /* Panel */
  isPanelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;

  /* Unread count (derived from RQ but cached here for header badge) */
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decrementUnread: () => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  isPanelOpen: false,
  setPanelOpen: (open) => set({ isPanelOpen: open }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnread: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  clearUnread: () => set({ unreadCount: 0 }),
}));
