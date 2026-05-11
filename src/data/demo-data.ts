import { FloorPlan } from "@/types/plan";

// ── Pre-built demo floor plan (3BHK Kerala style) ─────────────
export const DEMO_FLOOR_PLAN: FloorPlan = {
  id: "demo-plan-1",
  templateId: "ai-generated",
  floors: 2,
  totalSqft: 2400,
  plotSqft: 2400,
  rooms: [
    { id: "living", name: "Living Room", type: "living_room", x: 20, y: 20, w: 180, h: 140, realX: 0, realY: 0, realW: 18, realH: 14, color: "rgba(59,130,246,0.15)", reasoning: "North-facing living room positioned at the front for welcoming natural light and guest accessibility. Large windows on the north wall ensure consistent, glare-free daylight.", sqft: 252, floor: 1, doors: [{ x: 8, y: 14, width: 3 }], windows: [{ wall: "north", size: 6 }, { wall: "east", size: 4 }] },
    { id: "dining", name: "Dining Room", type: "dining", x: 200, y: 20, w: 120, h: 100, realX: 18, realY: 0, realW: 12, realH: 10, color: "rgba(251,191,36,0.12)", reasoning: "Adjacent to both kitchen and living for seamless service flow. East-facing window captures morning light for pleasant breakfast ambience.", sqft: 120, floor: 1, doors: [{ x: 5, y: 10, width: 3 }], windows: [{ wall: "east", size: 3 }] },
    { id: "kitchen", name: "Kitchen", type: "kitchen", x: 200, y: 120, w: 120, h: 110, realX: 18, realY: 10, realW: 12, realH: 11, color: "rgba(16,185,129,0.15)", reasoning: "South-east placement per Vastu. Cross-ventilation achieved via south and east windows. Direct access to utility area and dining.", sqft: 132, floor: 1, doors: [{ x: 1, y: 0, width: 3 }], windows: [{ wall: "south", size: 4 }, { wall: "east", size: 3 }] },
    { id: "bed1", name: "Master Bedroom", type: "master_bedroom", x: 20, y: 160, w: 160, h: 130, realX: 0, realY: 14, realW: 16, realH: 13, color: "rgba(139,92,246,0.12)", reasoning: "East-facing master bedroom captures energising morning sunlight. Positioned away from public zone for maximum privacy. Attached bathroom with ventilation.", sqft: 208, floor: 1, doors: [{ x: 14, y: 0, width: 3 }], windows: [{ wall: "east", size: 5 }, { wall: "south", size: 4 }] },
    { id: "bath1", name: "Master Bath", type: "bathroom", x: 180, y: 230, w: 70, h: 60, realX: 16, realY: 21, realW: 7, realH: 6, color: "rgba(14,165,233,0.12)", reasoning: "Attached to master bedroom with proper drainage slope. Ventilation window on south wall.", sqft: 42, floor: 1, windows: [{ wall: "south", size: 2 }] },
    { id: "bed2", name: "Bedroom 2", type: "bedroom", x: 20, y: 300, w: 130, h: 110, realX: 0, realY: 27, realW: 13, realH: 11, color: "rgba(245,158,11,0.12)", reasoning: "West-facing bedroom shielded from afternoon sun by the corridor buffer. Privacy maintained with separation from living areas.", sqft: 143, floor: 1, doors: [{ x: 11, y: 0, width: 3 }], windows: [{ wall: "west", size: 4 }] },
    { id: "bed3", name: "Bedroom 3", type: "bedroom", x: 160, y: 300, w: 130, h: 110, realX: 14, realY: 27, realW: 13, realH: 11, color: "rgba(245,158,11,0.12)", reasoning: "South-east corner bedroom benefits from morning light and afternoon breeze. Ideal for children or home office conversion.", sqft: 143, floor: 1, doors: [{ x: 1, y: 0, width: 3 }], windows: [{ wall: "south", size: 4 }, { wall: "east", size: 3 }] },
    { id: "bath2", name: "Common Bath", type: "bathroom", x: 150, y: 250, w: 60, h: 50, realX: 13, realY: 23, realW: 6, realH: 5, color: "rgba(14,165,233,0.12)", reasoning: "Centrally located common bathroom accessible from corridor. Shared between Bedroom 2 and Bedroom 3.", sqft: 30, floor: 1, windows: [{ wall: "east", size: 2 }] },
    { id: "puja", name: "Puja Room", type: "puja_room", x: 250, y: 250, w: 70, h: 60, realX: 23, realY: 23, realW: 7, realH: 6, color: "rgba(251,146,60,0.12)", reasoning: "North-east corner placement (Ishan corner) per Vastu Shastra for spiritual harmony and positive energy.", sqft: 42, floor: 1, windows: [{ wall: "north", size: 2 }] },
    { id: "balcony", name: "Balcony", type: "balcony", x: 20, y: 410, w: 270, h: 40, realX: 0, realY: 38, realW: 27, realH: 4, color: "rgba(34,211,238,0.1)", reasoning: "Full-width south-facing balcony for outdoor relaxation and natural ventilation to bedrooms.", sqft: 108, floor: 1 },
  ],
  viewBoxW: 340,
  viewBoxH: 470,
  generatedAt: new Date().toISOString(),
  plotContext: { width: 30, height: 40, orientation: "north", location_context: "Tropical monsoon climate in Kochi requires maximised cross-ventilation, raised plinth design, and waterproofing considerations." },
  design_summary: { concept: "Open-plan tropical living with Vastu-aligned room placement and maximum cross-ventilation", zoning: "Public zone (front): Living + Dining. Service zone: Kitchen + Baths. Private zone (rear): Bedrooms", target_user: "Modern Kerala family seeking 3BHK with traditional spatial values" },
  circulation: { entry_point: "North-central main entrance into living room", movement_flow: "Entry → Living → Dining → Kitchen (service loop) | Entry → Corridor → Bedrooms (private loop)", efficiency_score: 8 },
  environmental_logic: { light: "North-facing living for consistent daylight. East-facing master bedroom for morning sun.", ventilation: "Cross-ventilation via south-east kitchen and north-facing living. All rooms have at least one external window.", climate_response: "Raised plinth design for monsoon protection. Deep overhangs on south for sun shading. Ventilation-first room orientation." },
  design_scores: { space_efficiency: 8, ventilation_quality: 9, cost_efficiency: 7 },
  ai_suggestions: [
    "Consider adding a utility room near the kitchen for washing and storage",
    "Upgrading to double-height living room ceiling would enhance spatial perception",
    "Solar panels on the south-facing roof could offset 40% of electricity costs",
    "Adding a courtyard between bedrooms would improve natural light penetration",
  ],
  cost_estimate: {
    total_area_sqft: 2400,
    cost_per_sqft: { economy: 1800, standard: 2200, premium: 2800, luxury: 4000 },
    total_cost: { economy: 4320000, standard: 5280000, premium: 6720000, luxury: 9600000 },
  },
  plan_score: { space_efficiency: 21, cost_efficiency: 19, climate_suitability: 24, compliance_safety: 22, total: 86 },
  confidence_score: 88,
  confidence_label: "High",
  assumptions: [
    "Soil type assumed as medium-density laterite (typical for Kochi region)",
    "Cost derived from Kerala average ₹1,800–₹2,800/sqft range (2024 rates)",
    "Flat terrain assumed — no slope compensation required",
    "Standard RCC frame construction with 230mm brick walls",
  ],
  constraints: [
    "GCDA building rules applied — max FAR 2.5, ground coverage 65%",
    "Front setback: 1.5m, Side setback: 1.0m, Rear setback: 2.0m",
    "All rooms maintain minimum 2.7m floor-to-ceiling height",
  ],
  risks: [
    "Coastal Regulation Zone (CRZ) buffer may apply — verify HTL distance",
    "Front setback compliance requires local authority verification",
    "Monsoon waterproofing costs may increase by 5-8% in coastal areas",
  ],
  improvement_insights: [
    "Users in Kerala frequently request larger kitchen — current size is adequate but expandable",
    "Adding a car porch would increase functionality for 85% of users in this segment",
  ],
};

// ── Demo chat responses ───────────────────────────────────────
export const DEMO_AI_RESPONSES = {
  greeting: "Hello! I'm your Architectural AI assistant. I'll help you design your ideal living space with intelligence-driven planning. Let's start with some key details about your project.",
  plotSize: "A 2,400 sqft plot gives us excellent room for a comfortable 3BHK layout. Based on local regulations, we can achieve approximately 1,560 sqft of built-up area per floor.",
  bedrooms: "3 bedrooms — perfect for a growing family. I'll optimise the master bedroom for privacy and morning light, with the secondary bedrooms positioned for flexibility.",
  style: "Modern design with clean lines and open spaces. I'll incorporate contemporary elements while respecting the tropical climate needs for ventilation and natural light.",
  budget: "With a premium budget range, we can achieve high-quality finishes including vitrified tiles, premium fixtures, and smart home pre-wiring. Let me factor this into the material specifications.",
  complete: "I have all the requirements needed to generate your floor plan. The structural and layout constraints have been established based on local building codes and climate data.",
  edit_privacy: "I've updated the layout to increase bedroom privacy. Bedrooms have been repositioned away from public zones with corridor buffers. Window placements adjusted to avoid direct sight lines.",
  edit_balcony: "A full-width south-facing balcony has been added, providing outdoor relaxation space and improved ventilation to the bedrooms. The overall plan score improved by 3 points.",
};

// ── Demo site analysis ────────────────────────────────────────
export const DEMO_ANALYSIS = {
  kochi: {
    location: "Kochi, Kerala",
    city: "kochi",
    climate: "Tropical monsoon. High humidity 65–90%. Heavy rain June–Aug. Prioritise waterproofing and raised plinth. Average temperature 24-32°C year-round.",
    plotShape: "Rectangular plot, north-south oriented. Good for cross-ventilation.",
    orientation: "North entrance — optimal for living room natural light. South-east kitchen per Vastu.",
    soilType: "Laterite soil with good bearing capacity. Raised plinth 600mm+ recommended for monsoon protection.",
    nearbyAmenities: ["Metro 800m", "School 400m", "Hospital 1.2km", "Market 300m", "Beach 2km"],
    sunPath: "East to West (slight southern tilt)",
    windDirection: "South-West (monsoon) / North-East (winter)",
    zoningRules: {
      cityName: "Kochi (Ernakulam)",
      authority: "GCDA / Kochi Corporation",
      maxFAR: 2.5,
      frontSetback: 1.5,
      sideSetback: 1,
      rearSetback: 2,
      maxHeight: 18,
      maxCoverage: 65,
      notes: [
        "CRZ buffer: 200m from HTL — verify before construction",
        "Kerala Panchayat Building Rules apply in rural zones",
        "Septic tank mandatory; underground drainage where available",
        "Traditional roof forms encouraged with height relaxation",
      ],
    },
  },
};

// ── Agent status simulation ───────────────────────────────────
export const DEMO_AGENTS = [
  { id: "intent", name: "User Intent AI", status: "done" as const, output: "3BHK residential, modern style, premium budget" },
  { id: "design", name: "Design Agent", status: "done" as const, output: "10 rooms generated, circulation score 8/10" },
  { id: "climate", name: "Climate Agent", status: "done" as const, output: "Tropical optimisations applied, cross-ventilation maximised" },
  { id: "cost", name: "Cost Agent", status: "done" as const, output: "4 tier estimates: ₹43.2L – ₹96L range" },
  { id: "compliance", name: "Compliance Agent", status: "done" as const, output: "GCDA rules applied, 1 warning (CRZ verification)" },
  { id: "optimization", name: "Optimization AI", status: "done" as const, output: "3 variants scored, Option B selected (score: 86)" },
];
