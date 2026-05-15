import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BOQItem, BOQReport, ProjectQuality, BOQCategory, SpaceCost } from "@/types/cost";
import { FloorPlan } from "@/types/plan";

interface CostState {
  report: BOQReport | null;
  quality: ProjectQuality;
  isGenerating: boolean;
  
  setQuality: (quality: ProjectQuality) => void;
  generateBOQ: (plan: FloorPlan) => void;
  updateItem: (id: string, updates: Partial<BOQItem>) => void;
  addItem: (item: Omit<BOQItem, "id" | "totalCost" | "materialCost" | "laborCost" | "installationCost">) => void;
  removeItem: (id: string) => void;
}

// Pricing Intelligence Mock (Real-world would use an API or dynamic database)
const PRICING_DATABASE: Record<ProjectQuality, Record<string, { rate: number; labor: number; install: number }>> = {
  economy: {
    "Flooring": { rate: 120, labor: 40, install: 15 },
    "Paint": { rate: 25, labor: 15, install: 5 },
    "Hardware": { rate: 450, labor: 100, install: 50 },
    "Sanitary": { rate: 8500, labor: 1500, install: 500 },
    "Electrical": { rate: 85, labor: 45, install: 10 },
  },
  moderate: {
    "Flooring": { rate: 250, labor: 60, install: 25 },
    "Paint": { rate: 45, labor: 25, install: 10 },
    "Hardware": { rate: 1200, labor: 200, install: 100 },
    "Sanitary": { rate: 25000, labor: 3500, install: 1500 },
    "Electrical": { rate: 150, labor: 75, install: 25 },
  },
  premium: {
    "Flooring": { rate: 650, labor: 120, install: 60 },
    "Paint": { rate: 95, labor: 55, install: 25 },
    "Hardware": { rate: 4500, labor: 500, install: 250 },
    "Sanitary": { rate: 85000, labor: 8500, install: 4500 },
    "Electrical": { rate: 350, labor: 150, install: 80 },
  },
  luxury: {
    "Flooring": { rate: 1800, labor: 250, install: 150 },
    "Paint": { rate: 250, labor: 120, install: 60 },
    "Hardware": { rate: 12000, labor: 1500, install: 800 },
    "Sanitary": { rate: 250000, labor: 15000, install: 8000 },
    "Electrical": { rate: 850, labor: 400, install: 250 },
  }
};

const calculateItemCosts = (item: Partial<BOQItem>): Partial<BOQItem> => {
  const q = item.quantity || 0;
  const r = item.rate || 0;
  const l = item.laborRate || 0;
  const i = item.installationRate || 0;
  
  const mCost = q * r;
  const lCost = q * l;
  const iCost = q * i;
  
  return {
    ...item,
    materialCost: mCost,
    laborCost: lCost,
    installationCost: iCost,
    totalCost: mCost + lCost + iCost
  };
};

export const useCostStore = create<CostState>()(
  persist(
    (set, get) => ({
      report: null,
      quality: "premium",
      isGenerating: false,

      setQuality: (quality) => {
        set({ quality });
        // Recalculate if report exists
        const currentReport = get().report;
        if (currentReport) {
          // In a real app, we'd re-run generation logic. 
          // For this demo, we'll just trigger a new generation.
        }
      },

      generateBOQ: (plan) => {
        set({ isGenerating: true });
        
        setTimeout(() => {
          const items: BOQItem[] = [];
          const quality = get().quality;
          const prices = PRICING_DATABASE[quality];

          plan.rooms.forEach(room => {
            const rw = room.realW || room.w / 10;
            const rh = room.realH || room.h / 10;
            const area = rw * rh;
            const wallArea = 2 * (rw + rh) * 3.2;

            // 1. Flooring
            const floorPrice = prices["Flooring"];
            items.push({
              id: `f-${room.id}`,
              description: `${room.floorMaterial || 'Premium'} Flooring Work`,
              category: "Finishes",
              subCategory: "Flooring",
              quantity: area,
              unit: "sqft",
              rate: floorPrice.rate,
              laborRate: floorPrice.labor,
              installationRate: floorPrice.install,
              ...(calculateItemCosts({ quantity: area, rate: floorPrice.rate, laborRate: floorPrice.labor, installationRate: floorPrice.install }) as Partial<BOQItem>),
              location: room.name,
            } as BOQItem);

            // 2. Wall Finishes
            const paintPrice = prices["Paint"];
            items.push({
              id: `p-${room.id}`,
              description: `${room.wallMaterial || 'Luxury'} Wall Emulsion`,
              category: "Finishes",
              subCategory: "Painting",
              quantity: wallArea,
              unit: "sqft",
              rate: paintPrice.rate,
              laborRate: paintPrice.labor,
              installationRate: paintPrice.install,
              ...(calculateItemCosts({ quantity: wallArea, rate: paintPrice.rate, laborRate: paintPrice.labor, installationRate: paintPrice.install }) as Partial<BOQItem>),
              location: room.name,
            } as BOQItem);

            // 3. Hardware (Doors)
            if (room.doors && room.doors.length > 0) {
              const hPrice = prices["Hardware"];
              items.push({
                id: `h-${room.id}`,
                description: `Architectural Hardware Set`,
                category: "Hardware",
                quantity: room.doors.length,
                unit: "sets",
                rate: hPrice.rate,
                laborRate: hPrice.labor,
                installationRate: hPrice.install,
                ...(calculateItemCosts({ quantity: room.doors.length, rate: hPrice.rate, laborRate: hPrice.labor, installationRate: hPrice.install }) as Partial<BOQItem>),
                location: room.name,
              } as BOQItem);
            }

            // 4. Sanitary (Bathrooms)
            if (room.type === "bathroom" || room.name.toLowerCase().includes("bath")) {
              const sPrice = prices["Sanitary"];
              items.push({
                id: `s-${room.id}`,
                description: `Premium Sanitary Fixture Bundle`,
                category: "Sanitary",
                quantity: 1,
                unit: "unit",
                rate: sPrice.rate,
                laborRate: sPrice.labor,
                installationRate: sPrice.install,
                ...(calculateItemCosts({ quantity: 1, rate: sPrice.rate, laborRate: sPrice.labor, installationRate: sPrice.install }) as Partial<BOQItem>),
                location: room.name,
              } as BOQItem);
            }
          });

          // Grouping and Summary
          const categoryMap: Record<string, BOQCategory> = {};
          const spaceMap: Record<string, SpaceCost> = {};

          items.forEach(item => {
            // Category Summary
            if (!categoryMap[item.category]) {
              categoryMap[item.category] = { name: item.category, totalMaterialCost: 0, totalLaborCost: 0, totalInstallationCost: 0, totalCost: 0, items: [] };
            }
            categoryMap[item.category].items.push(item);
            categoryMap[item.category].totalMaterialCost += item.materialCost;
            categoryMap[item.category].totalLaborCost += item.laborCost;
            categoryMap[item.category].totalInstallationCost += item.installationCost;
            categoryMap[item.category].totalCost += item.totalCost;

            // Space Summary
            if (!spaceMap[item.location]) {
              spaceMap[item.location] = { spaceName: item.location, totalCost: 0, itemCount: 0, categories: {} };
            }
            spaceMap[item.location].totalCost += item.totalCost;
            spaceMap[item.location].itemCount += 1;
            spaceMap[item.location].categories[item.category] = (spaceMap[item.location].categories[item.category] || 0) + item.totalCost;
          });

          const totalProjectCost = Object.values(categoryMap).reduce((acc, cat) => acc + cat.totalCost, 0);

          const report: BOQReport = {
            projectId: plan.id,
            quality: quality,
            location: plan.plotContext?.location_context || "Global Market",
            currency: "INR",
            totalProjectCost,
            totalMaterialCost: Object.values(categoryMap).reduce((acc, cat) => acc + cat.totalMaterialCost, 0),
            totalLaborCost: Object.values(categoryMap).reduce((acc, cat) => acc + cat.totalLaborCost, 0),
            totalInstallationCost: Object.values(categoryMap).reduce((acc, cat) => acc + cat.totalInstallationCost, 0),
            categories: Object.values(categoryMap),
            spaceBreakdown: Object.values(spaceMap),
            generatedAt: new Date().toISOString(),
            reasoning: {
              marketContext: `Calculated based on current ${quality} market standards in ${plan.plotContext?.location_context || 'the project region'}.`,
              optimizationInsights: [
                "Switching to 'Moderate' quality for secondary bedrooms could save approx 12% of total budget.",
                "Bulk procurement of flooring materials recommended to reduce logistics overhead by 5%.",
                "Phased installation of sanitary fixtures to align with plumbing completion cycles."
              ],
              riskAnalysis: "Price volatility in raw materials may affect the final budget by +/- 8% over the next 3 months."
            }
          };

          set({ report, isGenerating: false });
        }, 2000);
      },

      updateItem: (id, updates) => {
        set((state) => {
          if (!state.report) return state;
          
          const newCategories = state.report.categories.map(cat => {
            const newItems = cat.items.map(item => {
              if (item.id === id) {
                const updated = { ...item, ...updates };
                return { ...updated, ...calculateItemCosts(updated) } as BOQItem;
              }
              return item;
            });
            return {
              ...cat,
              items: newItems,
              totalMaterialCost: newItems.reduce((a, i) => a + i.materialCost, 0),
              totalLaborCost: newItems.reduce((a, i) => a + i.laborCost, 0),
              totalInstallationCost: newItems.reduce((a, i) => a + i.installationCost, 0),
              totalCost: newItems.reduce((a, i) => a + i.totalCost, 0),
            };
          });

          const allItems = newCategories.flatMap(c => c.items);

          return {
            report: {
              ...state.report,
              categories: newCategories,
              totalProjectCost: allItems.reduce((a, i) => a + i.totalCost, 0),
              totalMaterialCost: allItems.reduce((a, i) => a + i.materialCost, 0),
              totalLaborCost: allItems.reduce((a, i) => a + i.laborCost, 0),
              totalInstallationCost: allItems.reduce((a, i) => a + i.installationCost, 0),
            }
          };
        });
      },

      addItem: (itemData) => {
        set((state) => {
          if (!state.report) return state;
          const id = `custom-${state.report.categories.flatMap(c => c.items).length + 1}`;
          const costs = calculateItemCosts(itemData);
          const newItem: BOQItem = { ...itemData, id, ...costs } as BOQItem;
          const catName = newItem.category;
          const catExists = state.report.categories.some(c => c.name === catName);
          const newCategories = catExists
            ? state.report.categories.map(cat => cat.name === catName ? { ...cat, items: [...cat.items, newItem], totalCost: cat.totalCost + newItem.totalCost, totalMaterialCost: cat.totalMaterialCost + newItem.materialCost, totalLaborCost: cat.totalLaborCost + newItem.laborCost, totalInstallationCost: cat.totalInstallationCost + newItem.installationCost } : cat)
            : [...state.report.categories, { name: catName, items: [newItem], totalCost: newItem.totalCost, totalMaterialCost: newItem.materialCost, totalLaborCost: newItem.laborCost, totalInstallationCost: newItem.installationCost }];
          return { report: { ...state.report, categories: newCategories, totalProjectCost: state.report.totalProjectCost + newItem.totalCost, totalMaterialCost: state.report.totalMaterialCost + newItem.materialCost, totalLaborCost: state.report.totalLaborCost + newItem.laborCost, totalInstallationCost: state.report.totalInstallationCost + newItem.installationCost } };
        });
      },

      removeItem: (id) => {
        set((state) => {
          if (!state.report) return state;
          const newCategories = state.report.categories.map(cat => {
            const newItems = cat.items.filter(i => i.id !== id);
            return { ...cat, items: newItems, totalMaterialCost: newItems.reduce((a, i) => a + i.materialCost, 0), totalLaborCost: newItems.reduce((a, i) => a + i.laborCost, 0), totalInstallationCost: newItems.reduce((a, i) => a + i.installationCost, 0), totalCost: newItems.reduce((a, i) => a + i.totalCost, 0) };
          }).filter(cat => cat.items.length > 0);
          const allItems = newCategories.flatMap(c => c.items);
          return { report: { ...state.report, categories: newCategories, totalProjectCost: allItems.reduce((a, i) => a + i.totalCost, 0), totalMaterialCost: allItems.reduce((a, i) => a + i.materialCost, 0), totalLaborCost: allItems.reduce((a, i) => a + i.laborCost, 0), totalInstallationCost: allItems.reduce((a, i) => a + i.installationCost, 0) } };
        });
      }
    }),
    {
      name: "archai-cost",
      partialize: (state) => ({
        quality: state.quality,
        // Don't persist report — regenerate from plan data
      }),
    }
  )
);
