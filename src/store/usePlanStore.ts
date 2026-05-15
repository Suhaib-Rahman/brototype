"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FloorPlan, Room } from "@/types/plan";

interface PlanState {
  floorPlan: FloorPlan | null;
  selectedRoom: Room | null;
  editHistory: FloorPlan[];
  historyIndex: number;
  isGenerating: boolean;
  isEditing: boolean;

  setFloorPlan: (plan: FloorPlan) => void;
  selectRoom: (room: Room | null) => void;
  updateFloorPlan: (plan: FloorPlan) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  isCinematic: boolean;
  environment: 'day' | 'sunset' | 'night' | 'cloudy';
  setCinematic: (v: boolean) => void;
  setEnvironment: (env: 'day' | 'sunset' | 'night' | 'cloudy') => void;
  setGenerating: (v: boolean) => void;
  setEditing: (v: boolean) => void;
  undo: () => void;
  redo: () => void;
  resetPlan: () => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      floorPlan: null,
      selectedRoom: null,
      editHistory: [],
      historyIndex: -1,
      isGenerating: false,
      isEditing: false,

      setFloorPlan: (plan) =>
        set(() => ({
          floorPlan: plan,
          editHistory: [plan],
          historyIndex: 0,
          selectedRoom: null,
        })),

      selectRoom: (room) => set({ selectedRoom: room }),

      updateFloorPlan: (plan) =>
        set((state) => {
          const newHistory = [...state.editHistory.slice(0, state.historyIndex + 1), plan];
          return {
            floorPlan: plan,
            editHistory: newHistory.slice(-20),
            historyIndex: Math.min(newHistory.length - 1, 19),
          };
        }),

      updateRoom: (id, updates) =>
        set((state) => {
          if (!state.floorPlan) return state;
          const newRooms = state.floorPlan.rooms.map(r => 
            r.id === id ? { ...r, ...updates } : r
          );
          const newPlan = { ...state.floorPlan, rooms: newRooms };
          
          return {
            floorPlan: newPlan,
            selectedRoom: state.selectedRoom?.id === id ? { ...state.selectedRoom, ...updates } : state.selectedRoom
          };
        }),

      isCinematic: false,
      environment: 'sunset',
      setCinematic: (v) => set({ isCinematic: v }),
      setEnvironment: (env) => set({ environment: env }),

      setGenerating: (v) => set({ isGenerating: v }),
      setEditing: (v) => set({ isEditing: v }),

      undo: () =>
        set((state) => {
          if (state.historyIndex <= 0) return state;
          const newIndex = state.historyIndex - 1;
          return {
            floorPlan: state.editHistory[newIndex],
            historyIndex: newIndex,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.editHistory.length - 1) return state;
          const newIndex = state.historyIndex + 1;
          return {
            floorPlan: state.editHistory[newIndex],
            historyIndex: newIndex,
          };
        }),

      resetPlan: () => set({
        floorPlan: null,
        selectedRoom: null,
        editHistory: [],
        historyIndex: -1,
        isGenerating: false,
        isEditing: false,
      }),
    }),
    {
      name: "archai-plan",
      partialize: (state) => ({
        floorPlan: state.floorPlan,
        editHistory: state.editHistory.slice(-3), // Only persist last 3 to avoid localStorage overflow
        historyIndex: Math.min(state.historyIndex, 2),
      }),
    }
  )
);
