"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ZoomIn, ZoomOut, MousePointer2,
  ArrowRight, Share2, Shield, Info, Activity, LayoutGrid, Network, Loader2
} from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useUIStore } from "@/store/useUIStore";

type SubStage = "zoning" | "single-line";

export default function PlanStage({ onNext }: { onNext?: () => void }) {
  const {
    floorPlan, selectedRoom, selectRoom,
    updateRoom, isGenerating
  } = usePlanStore();

  const { showNotification } = useUIStore();
  const { data: _onboardingData } = useOnboardingStore();

  const [activeSubStage, setActiveSubStage] = useState<SubStage>("zoning");
  const [zoom, setZoom] = useState(1);
  const [draggingRoomId, setDraggingRoomId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Spatial Hierarchy Logic (Stage 04)
  const getPrivacyLevel = (type: string) => {
    const privateTypes = ['bedroom', 'master', 'bath'];
    const serviceTypes = ['kitchen', 'utility', 'parking'];
    if (privateTypes.includes(type.toLowerCase())) return "Private";
    if (serviceTypes.includes(type.toLowerCase())) return "Service";
    return "Public";
  };

  const getPrivacyColor = (level: string) => {
    if (level === "Private") return "var(--violet)";
    if (level === "Service") return "var(--amber)";
    return "var(--accent)";
  };

  // Drag Interaction
  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    setDraggingRoomId(id);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRoomId || !floorPlan) return;
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    updateRoom(draggingRoomId, { x: Math.round(x / 20) * 20, y: Math.round(y / 20) * 20 });
  };

  const handlePointerUp = () => setDraggingRoomId(null);

  if (isGenerating || !floorPlan) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={32} className="spin" color="var(--accent)" style={{ marginBottom: "20px" }} />
          <h3 className="font-display">Generating Spatial Logic...</h3>
          <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>Zoning spaces based on lifestyle and circulation intelligence.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", background: "var(--bg)", overflow: "hidden" }}>
      
      {/* ── Main Canvas Area ─────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
        
        {/* Stage Sub-Tabs */}
        <div style={{ 
          position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1000,
          background: "var(--glass)", backdropFilter: "blur(20px)", padding: "4px", borderRadius: "100px",
          display: "flex", gap: "4px", border: "1px solid var(--border-hover)", boxShadow: "var(--shadow-lg)"
        }}>
          {[
            { id: "zoning", label: "Bubble Diagram (Zoning)", icon: Network },
            { id: "single-line", label: "Single-Line Plan", icon: LayoutGrid },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubStage(tab.id as SubStage)}
              style={{
                padding: "8px 20px", borderRadius: "100px", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600,
                background: activeSubStage === tab.id ? "var(--t-primary)" : "transparent",
                color: activeSubStage === tab.id ? "var(--bg)" : "var(--t-secondary)",
                transition: "all 0.2s"
              }}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 1000, display: "flex", gap: "8px" }}>
          <div className="glass" style={{ display: "flex", padding: "4px", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <button className="btn-icon" onClick={() => setZoom(z => Math.min(z + 0.1, 2))}><ZoomIn size={14} /></button>
            <button className="btn-icon" onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}><ZoomOut size={14} /></button>
          </div>
          <button className="btn-secondary" style={{ borderRadius: "12px" }} onClick={() => showNotification("info", "Circulation analysis optimized.")}>
            <Share2 size={14} /> Analyze Flow
          </button>
        </div>

        {/* The Canvas */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ 
            transform: `scale(${zoom})`, transition: "transform 0.1s ease-out",
            width: floorPlan.viewBoxW, height: floorPlan.viewBoxH,
            position: "relative", background: activeSubStage === "zoning" ? "transparent" : "var(--surface-1)",
            borderRadius: "8px", border: activeSubStage === "zoning" ? "none" : "1px solid var(--border)"
          }}>
            <svg 
              width="100%" height="100%" viewBox={`0 0 ${floorPlan.viewBoxW} ${floorPlan.viewBoxH}`}
              onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
              style={{ display: "block", overflow: "visible" }}
            >
              {/* Circulation Lines (Bubble Mode Only) */}
              {activeSubStage === "zoning" && floorPlan.rooms.map((room, i) => {
                const nextRoom = floorPlan.rooms[i + 1];
                if (!nextRoom) return null;
                return (
                  <line 
                    key={`line-${i}`} x1={room.x + room.w/2} y1={room.y + room.h/2} 
                    x2={nextRoom.x + nextRoom.w/2} y2={nextRoom.y + nextRoom.h/2}
                    stroke="var(--t-muted)" strokeWidth="1" strokeDasharray="4 4" style={{ opacity: 0.3 }}
                  />
                );
              })}

              {/* Rooms/Bubbles */}
              {floorPlan.rooms.map((room) => {
                const privacy = getPrivacyLevel(room.type || '');
                const color = getPrivacyColor(privacy);
                const isSelected = selectedRoom?.id === room.id;

                if (activeSubStage === "zoning") {
                  return (
                    <motion.g 
                      key={room.id} layout
                      onPointerDown={(e) => handlePointerDown(e, room.id)}
                      onClick={() => selectRoom(room)}
                      style={{ cursor: "grab" }}
                    >
                      <circle 
                        cx={room.x + room.w/2} cy={room.y + room.h/2} r={Math.min(room.w, room.h) / 2}
                        fill={color} fillOpacity="0.1" stroke={color} strokeWidth={isSelected ? "3" : "1.5"}
                      />
                      <text 
                        x={room.x + room.w/2} y={room.y + room.h/2} textAnchor="middle" dominantBaseline="middle"
                        fill="var(--t-primary)" fontSize="10" fontWeight="700" style={{ pointerEvents: "none" }}
                      >
                        {room.name.split(' ')[0]}
                      </text>
                    </motion.g>
                  );
                }

                return (
                  <motion.g 
                    key={room.id} layout
                    onPointerDown={(e) => handlePointerDown(e, room.id)}
                    onClick={() => selectRoom(room)}
                    style={{ cursor: "grab" }}
                  >
                    <rect 
                      x={room.x} y={room.y} width={room.w} height={room.h}
                      fill="var(--bg)" stroke={isSelected ? "var(--accent)" : "var(--t-muted)"} strokeWidth={isSelected ? "2" : "1"}
                    />
                    <text 
                      x={room.x + 8} y={room.y + 16} fill="var(--t-secondary)" fontSize="9" fontWeight="600"
                    >
                      {room.name.toUpperCase()}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* ── Side Intelligence Panel ────────────────────────────── */}
      <div style={{
        width: isMobile ? "100%" : "360px",
        background: "var(--surface-1)", borderLeft: isMobile ? "none" : "1px solid var(--border)",
        display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto", padding: "24px"
      }}>
        <div style={{ marginBottom: "24px" }}>
          <div className="badge badge-cyan" style={{ marginBottom: "12px" }}>
            <Activity size={10} /> Planning Intelligence
          </div>
          <h2 className="font-display" style={{ fontSize: "1.4rem", marginBottom: "8px" }}>Spatial Zoning</h2>
          <p style={{ fontSize: "12px", color: "var(--t-muted)", lineHeight: 1.6 }}>
            Process Stage 04: Optimizing spatial adjacency and circulation flow based on behavioral intent.
          </p>
        </div>

        {selectedRoom ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="card" style={{ padding: "16px", borderRadius: "12px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>{selectedRoom.name}</div>
              <div style={{ fontSize: "11px", color: "var(--t-muted)", marginBottom: "12px" }}>{selectedRoom.realW}&apos; × {selectedRoom.realH}&apos; · {selectedRoom.sqft} SF</div>
              
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <div className="badge" style={{ background: "var(--surface-2)", color: getPrivacyColor(getPrivacyLevel(selectedRoom.type || '')) }}>
                  {getPrivacyLevel(selectedRoom.type || '')} Zone
                </div>
              </div>

              <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px", color: "var(--t-muted)" }}>Spatial Adjacency</div>
              <p style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
                Directly connected to <strong>Circulation Path</strong>. Optimized for <strong>Natural Light</strong> from the {selectedRoom.windows?.[0]?.wall || "Primary"} flank.
              </p>
            </div>

            <div className="card" style={{ padding: "16px", borderRadius: "12px", background: "var(--glass)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={14} color="var(--emerald)" /> Planning Optimization
              </div>
              <ul style={{ fontSize: "11px", color: "var(--t-secondary)", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Minimized dead-space in circulation</li>
                <li>Strategic privacy buffering applied</li>
                <li>Optimal cross-ventilation corridor</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: "20px", textAlign: "center", borderRadius: "16px", border: "1px dashed var(--border)" }}>
            <MousePointer2 size={32} color="var(--t-muted)" style={{ marginBottom: "12px" }} />
            <p style={{ fontSize: "13px", color: "var(--t-muted)" }}>Select a spatial node to edit zoning properties.</p>
          </div>
        )}

        {/* Planning Logic Explanation */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "12px", color: "var(--t-primary)" }}>AI Planning Rationale</div>
          <div className="card" style={{ padding: "16px", borderRadius: "12px", background: "var(--surface-2)", fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
            <Info size={14} color="var(--accent)" style={{ marginBottom: "8px" }} />
            Layout generated using a <strong>Central Spine</strong> circulation model. Private zones are clustered for acoustic isolation, while Public zones maintain direct site-visual connectivity.
          </div>
        </div>

        <button className="btn-accent" onClick={onNext} style={{ width: "100%", padding: "16px", borderRadius: "100px", marginTop: "auto" }}>
          Lock Planning & Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
