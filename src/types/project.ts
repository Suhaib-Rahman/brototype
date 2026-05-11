// ── Region Configuration (Global Scaling) ─────────────────────
export interface RegionConfig {
  country: string;
  city: string;
  units: "sqft" | "sqm";
  currency: string;
  currencySymbol: string;
  buildingCode: string;   // NBC, IBC, Eurocodes
  climateZone: string;
}

// ── Requirements ──────────────────────────────────────────────
export interface Requirements {
  bedrooms: number;
  bathrooms: number;
  budget: number;           // in lakhs INR
  style: "modern" | "traditional" | "contemporary" | "minimalist";
  floors: number;
  plotSqft: number;
  hasGarage: boolean;
  hasBalcony: boolean;
  hasStudy: boolean;
  hasPuja: boolean;
  specialRequests?: string;
}

// ── Site Analysis ─────────────────────────────────────────────
export interface SiteAnalysis {
  location: string;
  city: string;
  climate: string;
  zoningRules: ZoningRules;
  plotShape: string;
  orientation: string;
  soilType: string;
  topographySlope?: string;
  nearbyAmenities: string[];
  sunPath?: string;
  windDirection?: string;
}

// ── Zoning Rules ──────────────────────────────────────────────
export interface ZoningRules {
  cityName: string;
  authority: string;
  maxFAR: number;
  frontSetback: number;
  sideSetback: number;
  rearSetback: number;
  maxHeight: number;
  maxCoverage: number;
  notes: string[];
}

// ── Project ───────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  location: string;
  analysis?: SiteAnalysis;
  requirements?: Requirements;
  regionConfig: RegionConfig;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "analyzed" | "planned" | "completed";
}
