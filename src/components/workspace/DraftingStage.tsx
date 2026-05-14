"use client";
import { useState } from "react";
import {
  FileText, ArrowRight, Ruler,
  Building2, Armchair, Zap, Droplets, Grid,
  CheckCircle2,
  Settings2, Activity
} from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";

type TechnicalLayer = "architectural" | "furniture" | "structural" | "electrical" | "plumbing";

export default function DraftingStage({ onNext }: { onNext: () => void }) {
  const { floorPlan, selectedRoom, selectRoom } = usePlanStore();
  const [activeLayers, setActiveLayers] = useState<TechnicalLayer[]>(["architectural", "furniture"]);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const toggleLayer = (layer: TechnicalLayer) => {
    setActiveLayers(prev => prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]);
  };

  const layerConfigs = [
    { id: "architectural", label: "Architectural", icon: Building2, color: "var(--t-primary)" },
    { id: "furniture", label: "Furniture", icon: Armchair, color: "var(--accent)" },
    { id: "structural", label: "Structural", icon: Grid, color: "var(--violet)" },
    { id: "electrical", label: "Electrical", icon: Zap, color: "var(--amber)" },
    { id: "plumbing", label: "Plumbing", icon: Droplets, color: "var(--cyan)" },
  ];

  if (!floorPlan) return null;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", background: "var(--bg)", overflow: "hidden" }}>

      {/* ── Main Drafting Workspace ───────────────────────────── */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", padding: "24px" }}>

        {/* Stage Header */}
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="badge badge-blue" style={{ marginBottom: "12px" }}>
              <FileText size={10} /> Process Stage 05: Technical Drafting
            </div>
            <h1 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "4px" }}>
              Architectural Intelligence Drafting
            </h1>
            <p style={{ color: "var(--t-muted)", fontSize: "13px" }}>
              Precision-engineered plans with synchronized structural and MEP coordination.
            </p>
          </div>

          {/* Layer Control Bar */}
          <div style={{
            background: "var(--surface-2)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border)",
            display: "flex", gap: "2px"
          }}>
            {layerConfigs.map(layer => {
              const isActive = activeLayers.includes(layer.id as TechnicalLayer);
              return (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id as TechnicalLayer)}
                  style={{
                    padding: "8px 12px", borderRadius: "8px", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: 600,
                    background: isActive ? "var(--bg)" : "transparent",
                    color: isActive ? layer.color : "var(--t-muted)",
                    transition: "all 0.2s"
                  }}
                >
                  <layer.icon size={12} /> <span className="mobile-hidden">{layer.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CAD Canvas */}
        <div style={{
          flex: 1, background: "var(--surface-1)", borderRadius: "24px", border: "1px solid var(--border)",
          position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {/* Grid lines */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.1,
            backgroundImage: "linear-gradient(var(--t-muted) 1px, transparent 1px), linear-gradient(90deg, var(--t-muted) 1px, transparent 1px)",
            backgroundSize: "40px 40px", pointerEvents: "none"
          }} />

          <div style={{ width: floorPlan.viewBoxW, height: floorPlan.viewBoxH, position: "relative" }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${floorPlan.viewBoxW} ${floorPlan.viewBoxH}`}>
              {floorPlan.rooms.map((room) => {
                const _isSelected = selectedRoom?.id === room.id;

                return (
                  <g key={room.id} onClick={() => selectRoom(room)} style={{ cursor: "pointer" }}>
                    {/* Architectural Layer: Walls */}
                    {activeLayers.includes("architectural") && (
                      <>
                        <rect
                          x={room.x} y={room.y} width={room.w} height={room.h}
                          fill="var(--bg)" stroke="var(--t-primary)" strokeWidth="4"
                        />
                        <text x={room.x + 10} y={room.y + 20} fill="var(--t-secondary)" fontSize="9" fontWeight="700">
                          {room.name.toUpperCase()}
                        </text>
                        {/* Dimension Markers */}
                        <line x1={room.x} y1={room.y - 10} x2={room.x + room.w} y2={room.y - 10} stroke="var(--t-muted)" strokeWidth="0.5" />
                        <text x={room.x + room.w / 2} y={room.y - 15} textAnchor="middle" fill="var(--t-muted)" fontSize="8">{room.realW}&apos;</text>
                      </>
                    )}

                    {/* Furniture Layer: Visualization */}
                    {activeLayers.includes("furniture") && (
                      <g opacity="0.6">
                        {room.type === "bedroom" && (
                          <rect x={room.x + room.w / 4} y={room.y + room.h / 4} width={room.w / 2} height={room.h / 2} fill="none" stroke="var(--accent)" strokeWidth="1" rx="2" />
                        )}
                        {room.type === "living" && (
                          <rect x={room.x + 20} y={room.y + 20} width={room.w - 40} height={40} fill="none" stroke="var(--accent)" strokeWidth="1" rx="2" />
                        )}
                      </g>
                    )}

                    {/* Structural Layer: Columns */}
                    {activeLayers.includes("structural") && (
                      <g>
                        <rect x={room.x - 4} y={room.y - 4} width="8" height="8" fill="var(--violet)" />
                        <rect x={room.x + room.w - 4} y={room.y - 4} width="8" height="8" fill="var(--violet)" />
                        <rect x={room.x - 4} y={room.y + room.h - 4} width="8" height="8" fill="var(--violet)" />
                        <rect x={room.x + room.w - 4} y={room.y + room.h - 4} width="8" height="8" fill="var(--violet)" />
                      </g>
                    )}

                    {/* Electrical Layer: Lighting */}
                    {activeLayers.includes("electrical") && (
                      <circle cx={room.x + room.w / 2} cy={room.y + room.h / 2} r="4" fill="var(--amber)" fillOpacity="0.4" stroke="var(--amber)" strokeWidth="1" />
                    )}

                    {/* Plumbing Layer: Fixtures */}
                    {activeLayers.includes("plumbing") && (room.type === "bath" || room.type === "kitchen") && (
                      <path d={`M ${room.x + 10} ${room.y + 10} L ${room.x + 30} ${room.y + 30}`} stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Precision Snapping Indicator */}
          <div style={{ position: "absolute", top: "20px", right: "20px", background: "var(--glass)", padding: "8px 12px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--emerald)" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--t-secondary)" }}>Drafting Grid Active (10mm Snap)</span>
          </div>
        </div>
      </div>

      {/* ── Technical Intelligence Sidebar ────────────────────── */}
      <div style={{
        width: isMobile ? "100%" : "380px",
        background: "var(--surface-1)", borderLeft: isMobile ? "none" : "1px solid var(--border)",
        display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto", padding: "32px"
      }}>
        <div style={{ marginBottom: "24px" }}>
          <div className="badge badge-violet" style={{ marginBottom: "12px" }}>
            <Activity size={10} /> Technical Compliance
          </div>
          <h2 className="font-display" style={{ fontSize: "1.5rem", marginBottom: "8px" }}>System Intelligence</h2>
          <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.6 }}>
            Stage 05: Synchronizing structural loads, MEP coordination, and furniture ergonomics.
          </p>
        </div>

        {selectedRoom ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="card" style={{ padding: "20px", borderRadius: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700 }}>{selectedRoom.name} Specs</span>
                <Settings2 size={14} color="var(--t-muted)" />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--t-muted)" }}>Wall Thickness</span>
                  <span style={{ fontWeight: 600 }}>200mm (Load Bearing)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--t-muted)" }}>Clear Height</span>
                  <span style={{ fontWeight: 600 }}>3000mm</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--t-muted)" }}>Column Grid</span>
                  <span style={{ fontWeight: 600 }}>4500mm Span</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "20px", borderRadius: "16px", background: "var(--glass)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={14} color="var(--emerald)" /> Architectural Rationale
              </div>
              <p style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
                <strong>{selectedRoom.name}</strong> drafting optimized for <strong>Natural Light</strong> penetration. Furniture layout adheres to 1200mm primary circulation clearance standards.
              </p>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: "32px", textAlign: "center", borderRadius: "24px", border: "1px dashed var(--border)", opacity: 0.6 }}>
            <Ruler size={48} color="var(--t-muted)" style={{ marginBottom: "16px" }} />
            <p style={{ fontSize: "14px", color: "var(--t-muted)" }}>Select a room to view technical specifications and structural logic.</p>
          </div>
        )}

        {/* Coordinated Systems Status */}
        <div style={{ marginTop: "32px" }}>
          <h4 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "16px", color: "var(--t-muted)" }}>System Synchronization</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "Structural Grid", status: "Synchronized", color: "var(--emerald)" },
              { label: "Furniture Clearances", status: "Optimized", color: "var(--emerald)" },
              { label: "Electrical Load Mapping", status: "Active", color: "var(--amber)" },
              { label: "Plumbing Fixture Align", status: "Pending", color: "var(--t-muted)" },
            ].map((sys, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "var(--surface-2)", borderRadius: "10px", fontSize: "12px" }}>
                <span style={{ fontWeight: 500 }}>{sys.label}</span>
                <span style={{ color: sys.color, fontWeight: 700, fontSize: "10px" }}>{sys.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-accent" onClick={onNext} style={{ width: "100%", padding: "16px", borderRadius: "100px", marginTop: "auto" }}>
          Lock Technical Plan & Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
