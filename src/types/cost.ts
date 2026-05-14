// import { MaterialSpec } from "./plan";

export type ProjectQuality = "economy" | "moderate" | "premium" | "luxury";

export interface BOQItem {
  id: string;
  description: string;
  category: string;
  subCategory?: string;
  quantity: number;
  unit: string;
  rate: number;
  laborRate: number;
  installationRate: number;
  materialCost: number;
  laborCost: number;
  installationCost: number;
  totalCost: number;
  location: string; // Space/Room name
  specId?: string; // Link to MaterialSpec
  isCustom?: boolean;
}

export interface BOQCategory {
  name: string;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalInstallationCost: number;
  totalCost: number;
  items: BOQItem[];
}

export interface SpaceCost {
  spaceName: string;
  totalCost: number;
  itemCount: number;
  categories: Record<string, number>;
}

export interface BOQReport {
  projectId: string;
  quality: ProjectQuality;
  location: string;
  currency: string;
  totalProjectCost: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalInstallationCost: number;
  categories: BOQCategory[];
  spaceBreakdown: SpaceCost[];
  generatedAt: string;
  reasoning: {
    marketContext: string;
    optimizationInsights: string[];
    riskAnalysis: string;
  };
}
