"use client";
import { useState, useMemo } from "react";
import {
  Box, Search, Layers, Database,
  Info, Sparkles, RefreshCcw, Check, ShoppingBag, MapPin,
  Package, Hammer, Droplets, Zap, LucideIcon
} from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { MaterialSpec } from "@/types/plan";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Paint: Droplets,
  Flooring: Layers,
  Wall: Box,
  Sanitary: Hammer,
  Electrical: Zap,
  Hardware: Package,
  Glass: Box,
  Landscape: MapPin
};

export default function MaterialStage() {
  const { floorPlan, selectedRoom: _selectedRoom } = usePlanStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialSpec | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "by-room">("all");

  // Simulated material specification intelligence
  const materialSpecs: MaterialSpec[] = useMemo(() => {
    if (!floorPlan) return [];

    const specs: MaterialSpec[] = [];

    floorPlan.rooms.forEach(room => {
      const rw = room.realW || room.w / 10;
      const rh = room.realH || room.h / 10;
      const area = rw * rh;
      const wallArea = 2 * (rw + rh) * 3.2; // 3.2m height

      // Flooring
      specs.push({
        id: `floor-${room.id}`,
        name: room.floorMaterial || "Italian Marble",
        brand: room.floorMaterial === "Hardwood" ? "Pergo" : "Antolini",
        manufacturer: "Italy Exports Ltd.",
        category: "Flooring",
        finish: room.floorMaterial === "Hardwood" ? "Matte Oak" : "High Gloss Polished",
        quantity: area,
        unit: "sqft",
        location: room.name,
        installationInfo: "Thin-set mortar application with 2mm epoxy grout lines.",
        reasoning: {
          technical: "High durability and moisture resistance suitable for standard residential loading.",
          design: `The ${room.floorMaterial || 'Marble'} finish provides a premium aesthetic that reflects natural light, enhancing spatial volume.`
        },
        alternatives: [
          { id: "alt-1", name: "Premium Vitrified Tiles", brand: "Kajaria", priceImpact: "Lower" },
          { id: "alt-2", name: "Engineered Hardwood", brand: "BerryAlloc", priceImpact: "Same" }
        ]
      });

      // Wall Paint
      specs.push({
        id: `paint-${room.id}`,
        name: room.wallMaterial || "Premium Emulsion",
        brand: "Asian Paints",
        manufacturer: "Global Coatings",
        category: "Paint",
        finish: "Velvet Matte",
        color: "Off-White / Pebble Beach",
        quantity: wallArea / 10, // Rough liter calculation
        unit: "liters",
        location: room.name,
        installationInfo: "Two coats over one coat of acrylic primer. Sanding required between coats.",
        reasoning: {
          technical: "Low VOC content for better indoor air quality. Washable finish for easy maintenance.",
          design: "Neutral tone selection to maintain architectural continuity and highlight furniture elements."
        },
        alternatives: [
          { id: "alt-3", name: "Textured Finish", brand: "Dulux", priceImpact: "Higher" }
        ]
      });

      // Door Hardware (if room has doors)
      if (room.doors && room.doors.length > 0) {
        specs.push({
          id: `hardware-${room.id}`,
          name: "Satin Nickel Lever Handle",
          brand: "Yale",
          manufacturer: "ASSA ABLOY",
          category: "Hardware",
          finish: "Brushed Satin",
          quantity: room.doors.length,
          unit: "pcs",
          location: room.name,
          installationInfo: "Mortise lock installation. Includes 3 heavy-duty ball-bearing hinges per door.",
          reasoning: {
            technical: "Grade 2 security rating. Anti-corrosive finish with 100k cycle testing.",
            design: "Sleek, minimalist profile that complements the modern interior language."
          },
          alternatives: [
            { id: "alt-4", name: "Smart Digital Lock", brand: "Samsung", priceImpact: "Higher" }
          ]
        });
      }

      // Sanitary (for bathrooms)
      if (room.type === "bathroom") {
        specs.push({
          id: `fixture-${room.id}`,
          name: "Wall-Hung Intelligent Closet",
          brand: "Kohler",
          manufacturer: "Kohler Co.",
          category: "Sanitary",
          finish: "Alpine White",
          quantity: 1,
          unit: "pcs",
          location: room.name,
          installationInfo: "Concealed cistern mounting. Requires 4-inch drainage outlet.",
          reasoning: {
            technical: "Water-efficient dual flush system. Rimless design for superior hygiene.",
            design: "Space-saving wall-hung configuration creates a cleaner floor visual."
          },
          alternatives: [
            { id: "alt-5", name: "Floor Mounted Closet", brand: "Hindware", priceImpact: "Lower" }
          ]
        });
      }
    });

    return specs;
  }, [floorPlan]);

  const filteredSpecs = useMemo(() => {
    return materialSpecs.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase()) ||
        s.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [materialSpecs, search, selectedCategory]);

  const stats = useMemo(() => {
    const categories: Record<string, number> = {};
    materialSpecs.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1;
    });
    return { total: materialSpecs.length, categories };
  }, [materialSpecs]);

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)" }}>
      {/* Sidebar - Category Filter */}
      <div style={{ width: "240px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, background: "var(--surface-1)" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <div className="badge badge-cyan" style={{ marginBottom: "8px" }}>Stage 08</div>
          <h2 className="font-display" style={{ fontSize: "18px" }}>Material Intel</h2>
        </div>

        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: "10px 12px", borderRadius: "8px", border: "none",
              background: !selectedCategory ? "var(--surface-3)" : "transparent",
              color: !selectedCategory ? "var(--cyan)" : "var(--t-muted)",
              display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: !selectedCategory ? 600 : 400
            }}
          >
            <Database size={14} /> All Specifications
          </button>

          <div style={{ margin: "12px 0 8px 12px", fontSize: "10px", textTransform: "uppercase", color: "var(--t-muted)", fontWeight: 700, letterSpacing: "1px" }}>Categories</div>
          {Object.keys(stats.categories).map(cat => {
            const Icon = CATEGORY_ICONS[cat] || Box;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "10px 12px", borderRadius: "8px", border: "none",
                  background: selectedCategory === cat ? "var(--surface-3)" : "transparent",
                  color: selectedCategory === cat ? "var(--cyan)" : "var(--t-muted)",
                  display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: selectedCategory === cat ? 600 : 400
                }}
              >
                <Icon size={14} /> {cat}
                <span style={{ marginLeft: "auto", fontSize: "10px", opacity: 0.6 }}>{stats.categories[cat]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header Toolbar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)" }}>
          <div style={{ position: "relative", width: "400px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
            <input
              type="text"
              placeholder="Search products, brands, or rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 10px 10px 36px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", fontSize: "13px", color: "var(--t-primary)" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ display: "flex", background: "var(--surface-2)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <button
                onClick={() => setViewMode("all")}
                style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, border: "none", cursor: "pointer", background: viewMode === "all" ? "var(--bg)" : "transparent", color: viewMode === "all" ? "var(--t-primary)" : "var(--t-muted)", boxShadow: viewMode === "all" ? "var(--shadow-sm)" : "none" }}
              >
                Global List
              </button>
              <button
                onClick={() => setViewMode("by-room")}
                style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, border: "none", cursor: "pointer", background: viewMode === "by-room" ? "var(--bg)" : "transparent", color: viewMode === "by-room" ? "var(--t-primary)" : "var(--t-muted)", boxShadow: viewMode === "by-room" ? "var(--shadow-sm)" : "none" }}
              >
                Room Breakdown
              </button>
            </div>
            <button className="btn-icon" style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--t-primary)", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShoppingBag size={14} /> Export Specs
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ padding: "12px 24px", background: "var(--surface-1)", borderBottom: "1px solid var(--border)", display: "flex", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Unique SKUs</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--cyan)" }}>{stats.total}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Construction Ready</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--green)" }}>100%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
            <Sparkles size={14} color="var(--violet)" />
            <span style={{ fontSize: "11px", color: "var(--t-muted)" }}>AI Material Analysis Synchronized</span>
          </div>
        </div>

        {/* Table / Grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {filteredSpecs.map(spec => (
              <div
                key={spec.id}
                onClick={() => setSelectedMaterial(spec)}
                style={{
                  padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", background: selectedMaterial?.id === spec.id ? "var(--surface-3)" : "var(--bg)",
                  cursor: "pointer", transition: "all 0.2s", position: "relative",
                  boxShadow: selectedMaterial?.id === spec.id ? "0 4px 12px rgba(0,0,0,0.1)" : "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ padding: "8px", borderRadius: "8px", background: "rgba(34, 211, 238, 0.1)", color: "var(--cyan)" }}>
                      {(() => { const Icon = CATEGORY_ICONS[spec.category] || Box; return <Icon size={16} />; })()}
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase" }}>{spec.category}</div>
                      <div style={{ fontSize: "15px", fontWeight: 600 }}>{spec.name}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "4px", background: "var(--surface-2)", height: "fit-content" }}>
                    {spec.brand}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "9px", color: "var(--t-muted)", textTransform: "uppercase" }}>Quantity</div>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>{spec.quantity.toFixed(1)} {spec.unit}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "9px", color: "var(--t-muted)", textTransform: "uppercase" }}>Location</div>
                    <div style={{ fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={10} /> {spec.location}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <div className="badge" style={{ fontSize: "9px", padding: "2px 6px" }}>{spec.finish}</div>
                  {spec.color && <div className="badge badge-violet" style={{ fontSize: "9px", padding: "2px 6px" }}>{spec.color}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Intelligence Panel */}
      <div style={{ width: "360px", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, background: "var(--bg)" }}>
        {selectedMaterial ? (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(34, 211, 238, 0.1)", color: "var(--cyan)" }}>
                  {(() => { const Icon = CATEGORY_ICONS[selectedMaterial.category] || Box; return <Icon size={24} />; })()}
                </div>
                <button onClick={() => setSelectedMaterial(null)} style={{ border: "none", background: "transparent", color: "var(--t-muted)", cursor: "pointer" }}>✕</button>
              </div>
              <h3 className="font-display" style={{ fontSize: "22px", marginBottom: "4px" }}>{selectedMaterial.name}</h3>
              <p style={{ fontSize: "14px", color: "var(--t-muted)" }}>{selectedMaterial.brand} • {selectedMaterial.manufacturer}</p>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Technical Specs */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--t-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Info size={14} /> Product Intelligence
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--t-muted)" }}>Finish</span>
                    <span style={{ fontSize: "12px", fontWeight: 500 }}>{selectedMaterial.finish}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--t-muted)" }}>Total Qty</span>
                    <span style={{ fontSize: "12px", fontWeight: 500 }}>{selectedMaterial.quantity.toFixed(1)} {selectedMaterial.unit}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "12px", color: "var(--t-muted)" }}>Installation</span>
                    <span style={{ fontSize: "12px", background: "var(--surface-2)", padding: "10px", borderRadius: "8px", lineHeight: 1.4 }}>{selectedMaterial.installationInfo}</span>
                  </div>
                </div>
              </div>

              {/* AI Reasoning */}
              <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(167, 139, 250, 0.05)", border: "1px solid rgba(167, 139, 250, 0.2)" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--violet)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={14} /> Specification Reasoning
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Technical Logic</div>
                    <div style={{ fontSize: "12px", color: "var(--t-primary)", lineHeight: 1.5 }}>{selectedMaterial.reasoning.technical}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Design Logic</div>
                    <div style={{ fontSize: "12px", color: "var(--t-primary)", lineHeight: 1.5 }}>{selectedMaterial.reasoning.design}</div>
                  </div>
                </div>
              </div>

              {/* Alternatives */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--t-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <RefreshCcw size={14} /> Alternative Recommendations
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedMaterial.alternatives.map(alt => (
                    <div key={alt.id} style={{ padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600 }}>{alt.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--t-muted)" }}>{alt.brand}</div>
                      </div>
                      <div className={`badge ${alt.priceImpact === 'Lower' ? 'badge-green' : 'badge-violet'}`} style={{ fontSize: "10px" }}>
                        {alt.priceImpact} Cost
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "24px", borderTop: "1px solid var(--border)", display: "flex", gap: "10px" }}>
              <button className="btn-primary" style={{ flex: 1, padding: "12px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "13px" }}>
                <Check size={16} /> Confirm Spec
              </button>
              <button className="btn-icon" style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)" }}>
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px", textAlign: "center" }}>
            <Database size={48} color="var(--t-muted)" style={{ opacity: 0.2, marginBottom: "16px" }} />
            <h4 style={{ color: "var(--t-primary)", marginBottom: "8px" }}>Product Intelligence</h4>
            <p style={{ fontSize: "12px", color: "var(--t-muted)", lineHeight: 1.5 }}>Select a material from the list to view detailed specifications, technical reasoning, and alternative recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
