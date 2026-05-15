"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WorkspaceStage = "onboarding" | "location" | "cad" | "plan" | "drafting" | "3d" | "material" | "cinematic" | "cost" | "collaboration" | "summary";
export type CanvasTab = "2d" | "3d" | "render";
export type WorkspacePalette = "apple" | "classic";

interface UIState {
  currentStage: WorkspaceStage;
  canvasTab: CanvasTab;
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;
  commandPaletteOpen: boolean;
  demoMode: boolean;
  palette: WorkspacePalette;
  notification: { type: "success" | "error" | "info"; message: string } | null;
  isGlobalLoading: boolean;
  loadingMessage: string;

  setStage: (stage: WorkspaceStage) => void;
  setCanvasTab: (tab: CanvasTab) => void;
  setSidebarCollapsed: (v: boolean) => void;
  setRightPanelOpen: (v: boolean) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setDemoMode: (v: boolean) => void;
  setPalette: (p: WorkspacePalette) => void;
  showNotification: (type: "success" | "error" | "info", message: string) => void;
  clearNotification: () => void;
  setGlobalLoading: (v: boolean, msg?: string) => void;
}

let notificationTimer: ReturnType<typeof setTimeout> | null = null;

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      currentStage: "onboarding",
      canvasTab: "2d",
      sidebarCollapsed: false,
      rightPanelOpen: true,
      commandPaletteOpen: false,
      demoMode: true,
      palette: "apple",
      notification: null,
      isGlobalLoading: false,
      loadingMessage: "AI is thinking...",

      setStage: (stage) => set({ currentStage: stage }),
      setCanvasTab: (tab) => set({ canvasTab: tab }),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setRightPanelOpen: (v) => set({ rightPanelOpen: v }),
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
      setDemoMode: (v) => set({ demoMode: v }),
      setPalette: (p) => set({ palette: p }),

      showNotification: (type, message) => {
        if (notificationTimer) clearTimeout(notificationTimer);
        set({ notification: { type, message } });
        notificationTimer = setTimeout(() => {
          set({ notification: null });
          notificationTimer = null;
        }, 4000);
      },

      clearNotification: () => set({ notification: null }),
      setGlobalLoading: (v, msg = "AI is thinking...") => set({ isGlobalLoading: v, loadingMessage: msg }),
    }),
    {
      name: "arcova-ui-storage",
      partialize: (state) => ({ palette: state.palette, sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
