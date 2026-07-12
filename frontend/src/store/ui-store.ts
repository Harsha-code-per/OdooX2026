import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/storage";

/**
 * UI Store — Global UI state management via Zustand.
 *
 * Rules (per AGENTS.md):
 * - Only UI state belongs here (never server/API data)
 * - Server state lives in React Query
 *
 * Persisted state: sidebar collapse preference
 */

interface UIState {
  /* Sidebar */
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  /* Mobile sidebar drawer */
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  /* Global search */
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  /* Command palette (future) */
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      /* Sidebar */
      isSidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ isSidebarCollapsed: collapsed }),

      /* Mobile drawer — not persisted (handled by middleware) */
      isMobileSidebarOpen: false,
      setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),

      /* Global search */
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),

      /* Command palette */
      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
    }),
    {
      name: STORAGE_KEYS.SIDEBAR_COLLAPSED,
      /* Only persist sidebar state, not modal/overlay states */
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    },
  ),
);
