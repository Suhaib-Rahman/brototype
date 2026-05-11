import { create } from "zustand";

export interface FeasibilityData {
  lifestyle: {
    family_size: string;
    primary_activity: string;
    entertainment_freq: string;
  };
  property: {
    has_land: boolean | null;
    location: {
      coordinates: string;
      pincode: string;
      city: string;
    };
    land_size_sqft: number;
    site_features: string[];
    site_sketch_url: string;
  };
  financial: {
    budget_range: string;
    funding_type: string;
  };
  preferences: {
    style: string;
    spatial_feeling: string;
    natural_light: string;
    notes: string;
  };
  requirements: {
    bedrooms: number;
    bathrooms: number;
    floors: number;
    special_zones: string[];
  };
  feasibility_analysis: {
    recommended_project_type: string;
    suggested_area_sqft: string;
    estimated_cost_range: string;
    timeline_estimate: string;
    risks: string[];
    assumptions: string[];
    feasibility_score: number;
    confidence: string;
  } | null;
}

interface OnboardingState {
  data: FeasibilityData;
  updateSection: <K extends keyof FeasibilityData>(section: K, payload: Partial<FeasibilityData[K]>) => void;
  setFeasibility: (analysis: FeasibilityData["feasibility_analysis"]) => void;
}

const initialData: FeasibilityData = {
  lifestyle: { family_size: "", primary_activity: "", entertainment_freq: "" },
  property: {
    has_land: null,
    location: { coordinates: "", pincode: "", city: "" },
    land_size_sqft: 0,
    site_features: [],
    site_sketch_url: ""
  },
  financial: { budget_range: "", funding_type: "" },
  preferences: { style: "", spatial_feeling: "", natural_light: "", notes: "" },
  requirements: { bedrooms: 0, bathrooms: 0, floors: 0, special_zones: [] },
  feasibility_analysis: null
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  data: initialData,
  updateSection: (section, payload) => 
    set((state) => ({
      data: {
        ...state.data,
        [section]: {
          ...state.data[section],
          ...payload
        }
      }
    })),
  setFeasibility: (analysis) => 
    set((state) => ({
      data: {
        ...state.data,
        feasibility_analysis: analysis
      }
    }))
}));
