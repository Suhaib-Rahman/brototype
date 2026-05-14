// ── Door and Window sub-types ─────────────────────────────────
export interface RoomDoor {
  x: number;
  y: number;
  width: number;
}

export interface RoomWindow {
  wall: "north" | "south" | "east" | "west";
  size: number;
}

// ── Core Room ─────────────────────────────────────────────────
export interface Room {
  id: string;
  name: string;
  type?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  realX?: number;
  realY?: number;
  realW?: number;
  realH?: number;
  color: string;
  reasoning?: string;
  reason?: string;
  sqft?: number;
  floor?: number;
  doors?: RoomDoor[];
  windows?: RoomWindow[];
  floorMaterial?: string;
  wallMaterial?: string;
  ceilingMaterial?: string;
  furniture?: { id: string; type: string; x: number; y: number; rotation: number }[];
}

// ── Design sub-types ──────────────────────────────────────────
export interface Circulation {
  entry_point: string;
  movement_flow: string;
  efficiency_score: number;
}

export interface EnvironmentalLogic {
  light: string;
  ventilation: string;
  climate_response: string;
}

export interface DesignScores {
  space_efficiency: number;
  ventilation_quality: number;
  cost_efficiency: number;
}

export interface DesignSummary {
  concept: string;
  zoning: string;
  target_user: string;
}

export interface PlotContext {
  width: number;
  height: number;
  orientation: string;
  location_context: string;
}

// ── Plan Score (Decision Engine) ──────────────────────────────
export interface PlanScore {
  space_efficiency: number;      // 0–25
  cost_efficiency: number;       // 0–25
  climate_suitability: number;   // 0–25
  compliance_safety: number;     // 0–25
  total: number;                 // 0–100
}

// ── Main FloorPlan ────────────────────────────────────────────
export interface FloorPlan {
  id: string;
  templateId: string;
  floors: number;
  totalSqft: number;
  plotSqft: number;
  rooms: Room[];
  viewBoxW: number;
  viewBoxH: number;
  generatedAt: string;
  plotContext?: PlotContext;
  design_summary?: DesignSummary;
  circulation?: Circulation;
  environmental_logic?: EnvironmentalLogic;
  design_scores?: DesignScores;
  ai_suggestions?: string[];
  cost_estimate?: {
    total_area_sqft: number;
    cost_per_sqft: { economy: number; standard: number; premium: number; luxury: number };
    total_cost: { economy: number; standard: number; premium: number; luxury: number };
  };
  plan_score?: PlanScore;
  confidence_score?: number;
  confidence_label?: "Low" | "Medium" | "High";
  assumptions?: string[];
  constraints?: string[];
  risks?: string[];
  improvement_insights?: string[];
}

// ── Layout Template ───────────────────────────────────────────
export interface LayoutTemplate {
  id: string;
  name: string;
  category: string;
  floors: number;
  sqft: number;
  rooms: Room[];
  viewBoxW: number;
  viewBoxH: number;
}

// ── AI Architect Types ────────────────────────────────────────
export interface ArchitectRawRoom {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  doors?: RoomDoor[];
  windows?: RoomWindow[];
  reason: string;
}

export interface ArchitectOutput {
  plot: PlotContext;
  design_summary: DesignSummary;
  rooms: ArchitectRawRoom[];
  circulation: Circulation;
  environmental_logic: EnvironmentalLogic;
  cost_estimate: FloorPlan["cost_estimate"];
  design_scores: DesignScores;
  ai_suggestions: string[];
}

export interface MaterialSpec {
  id: string;
  name: string;
  brand: string;
  manufacturer: string;
  category: "Paint" | "Flooring" | "Wall" | "Sanitary" | "Electrical" | "Hardware" | "Glass" | "Landscape";
  finish: string;
  dimensions?: string;
  texture?: string;
  color?: string;
  quantity: number;
  unit: "sqft" | "pcs" | "liters" | "m" | "kg";
  location: string;
  installationInfo: string;
  reasoning: {
    technical: string;
    design: string;
  };
  alternatives: { id: string; name: string; brand: string; priceImpact: "Lower" | "Same" | "Higher" }[];
}

export interface MaterialReport {
  totalMaterials: number;
  categories: Record<string, number>;
  roomMaterials: Record<string, MaterialSpec[]>;
}
