"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project, SiteAnalysis, RegionConfig } from "@/types/project";

const DEFAULT_REGION: RegionConfig = {
  country: "India",
  city: "Kochi",
  units: "sqft",
  currency: "INR",
  currencySymbol: "₹",
  buildingCode: "NBC",
  climateZone: "tropical",
};

interface ProjectState {
  currentProject: Project | null;
  location: string;
  coordinates: { lat: number; lng: number } | null;
  analysis: SiteAnalysis | null;
  regionConfig: RegionConfig;
  isAnalyzing: boolean;

  setLocation: (loc: string) => void;
  setCoordinates: (coords: { lat: number; lng: number } | null) => void;
  setAnalysis: (analysis: SiteAnalysis) => void;
  setRegionConfig: (config: Partial<RegionConfig>) => void;
  setAnalyzing: (v: boolean) => void;
  createProject: (name: string) => void;
  resetProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      location: "",
      coordinates: null,
      analysis: null,
      regionConfig: DEFAULT_REGION,
      isAnalyzing: false,

      setLocation: (loc) => set({ location: loc }),
      setCoordinates: (coords) => set({ coordinates: coords }),
      setAnalysis: (analysis) => set({ analysis }),
      setRegionConfig: (config) => set((s) => ({ regionConfig: { ...s.regionConfig, ...config } })),
      setAnalyzing: (v) => set({ isAnalyzing: v }),

      createProject: (name) => {
        const { location, analysis, regionConfig } = get();
        const project: Project = {
          id: `proj-${Date.now()}`,
          name,
          location,
          analysis: analysis || undefined,
          regionConfig,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "analyzed",
        };
        set({ currentProject: project });
      },

      resetProject: () => set({
        currentProject: null,
        location: "",
        coordinates: null,
        analysis: null,
        regionConfig: DEFAULT_REGION,
        isAnalyzing: false,
      }),
    }),
    {
      name: "archai-project",
      partialize: (state) => ({
        currentProject: state.currentProject,
        location: state.location,
        coordinates: state.coordinates,
        analysis: state.analysis,
        regionConfig: state.regionConfig,
      }),
    }
  )
);
