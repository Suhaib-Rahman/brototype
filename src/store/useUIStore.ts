"use client";
import { create } from "zustand";

export type WorkspaceStage = "onboarding" | "location" | "cad" | "plan" | "3d" | "cost" | "summary";
export type CanvasTab = "2d" | "3d" | "render";

interface UIState {
  currentStage: WorkspaceStage;
  canvasTab: CanvasTab;
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;
  commandPaletteOpen: boolean;
  demoMode: boolean;
  notification: { type: "success" | "error" | "info"; message: string } | null;
  isGlobalLoading: boolean;
  loadingMessage: string;

  setStage: (stage: WorkspaceStage) => void;
  setCanvasTab: (tab: CanvasTab) => void;
  setSidebarCollapsed: (v: boolean) => void;
  setRightPanelOpen: (v: boolean) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setDemoMode: (v: boolean) => void;
  showNotification: (type: "success" | "error" | "info", message: string) => void;
  clearNotification: () => void;
  setGlobalLoading: (v: boolean, msg?: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentStage: "onboarding",
  canvasTab: "2d",
  sidebarCollapsed: false,
  rightPanelOpen: true,
  commandPaletteOpen: false,
  demoMode: true,
  notification: null,
  isGlobalLoading: false,
  loadingMessage: "AI is thinking...",

  setStage: (stage) => set({ currentStage: stage }),
  setCanvasTab: (tab) => set({ canvasTab: tab }),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setRightPanelOpen: (v) => set({ rightPanelOpen: v }),
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
  setDemoMode: (v) => set({ demoMode: v }),

  showNotification: (type, message) => {
    set({ notification: { type, message } });
    setTimeout(() => set({ notification: null }), 4000);
  },

  clearNotification: () => set({ notification: null }),
  setGlobalLoading: (v, msg = "AI is thinking...") => set({ isGlobalLoading: v, loadingMessage: msg }),
}));
