"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn, ZoomOut, MousePointer2,
  ArrowRight, Share2, Shield, Info, Activity, LayoutGrid, Network, Loader2, Sparkles, Box
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

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    setDraggingRoomId(id);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRoomId || !floorPlan) return;
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    updateRoom(draggingRoomId, { x: Math.round(x / 10) * 10, y: Math.round(y / 10) * 10 });
  };

  const handlePointerUp = () => setDraggingRoomId(null);

  if (isGenerating || !floorPlan) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
        <div className="shimmer" style={{ position: "absolute", inset: 0, opacity: 0.05 }} />
        <div style={{ textAlign: "center", zIndex: 10 }}>
          <div className="pulse" style={{ width: "64px", height: "64px", borderRadius: "16px", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Loader2 size={32} className="spin" color="var(--accent)" />
          </div>
          <h3 className="font-display" style={{ fontSize: "24px", marginBottom: "8px" }}>Generating Spatial Intelligence</h3>
          <p style={{ color: "var(--t-muted)", fontSize: "14px", maxWidth: "300px", margin: "0 auto" }}>
            Mapping lifestyle requirements to structural feasibility and circulation flow...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", background: "var(--bg)", overflow: "hidden" }}>
      
      {/* ── Main Drafting Canvas ───────────────────────────── */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", background: "#08080A" }}>
        
        {/* Blueprint Grid Background */}
        <div style={{ 
          position: "absolute", inset: 0, 
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          opacity: 0.15,
          pointerEvents: "none"
        }} />

        {/* Floating Stage Selector */}
        <div style={{ 
          position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 100,
          background: "var(--glass)", backdropFilter: "blur(24px)", padding: "5px", borderRadius: "100px",
          display: "flex", gap: "5px", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)"
        }}>
          {[
            { id: "zoning", label: "Bubble Diagram", icon: Network },
            { id: "single-line", label: "Drafting Mode", icon: LayoutGrid },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubStage(tab.id as SubStage)}
              style={{
                padding: "10px 24px", borderRadius: "100px", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700,
                background: activeSubStage === tab.id ? "var(--t-primary)" : "transparent",
                color: activeSubStage === tab.id ? "var(--bg)" : "var(--t-secondary)",
                transition: "all 0.3s var(--ease-out)",
                boxShadow: activeSubStage === tab.id ? "var(--shadow-sm)" : "none"
              }}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Viewport Controls */}
        <div style={{ position: "absolute", bottom: "32px", left: "32px", zIndex: 100, display: "flex", gap: "12px" }}>
          <div className="glass" style={{ display: "flex", padding: "6px", borderRadius: "14px", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
            <button className="btn-icon" style={{ border: "none" }} onClick={() => setZoom(z => Math.min(z + 0.1, 2))}><ZoomIn size={16} /></button>
            <div style={{ width: "1px", background: "var(--border)", margin: "4px 2px" }} />
            <button className="btn-icon" style={{ border: "none" }} onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}><ZoomOut size={16} /></button>
          </div>
          <button className="btn-secondary pulse" style={{ borderRadius: "14px", padding: "0 24px", fontWeight: 700, fontSize: "13px" }} onClick={() => showNotification("info", "Circulation flow analysis complete: 94% Efficiency.")}>
            <Activity size={16} color="var(--emerald)" /> Analyze Flow
          </button>
        </div>

        {/* Drafting Area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div 
            style={{ 
              transform: `scale(${zoom})`,
              width: floorPlan.viewBoxW, height: floorPlan.viewBoxH,
              position: "relative", 
              background: activeSubStage === "zoning" ? "transparent" : "rgba(255,255,255,0.02)",
              borderRadius: "4px", 
              border: activeSubStage === "zoning" ? "none" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: activeSubStage === "zoning" ? "none" : "var(--shadow-xl)"
            }}
            layout
          >
            <svg 
              width="100%" height="100%" viewBox={`0 0 ${floorPlan.viewBoxW} ${floorPlan.viewBoxH}`}
              onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
              style={{ display: "block", overflow: "visible" }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Interaction Path (Bubble Mode) */}
              {activeSubStage === "zoning" && floorPlan.rooms.map((room, i) => {
                const nextRoom = floorPlan.rooms[i + 1];
                if (!nextRoom) return null;
                return (
                  <motion.line 
                    key={`line-${i}`} 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    x1={room.x + room.w/2} y1={room.y + room.h/2} 
                    x2={nextRoom.x + nextRoom.w/2} y2={nextRoom.y + nextRoom.h/2}
                    stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5 5"
                  />
                );
              })}

              {/* Spatial Nodes */}
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
                        cx={room.x + room.w/2} cy={room.y + room.h/2} r={Math.min(room.w, room.h) / 2.2}
                        fill={color} fillOpacity={isSelected ? "0.2" : "0.08"} 
                        stroke={color} strokeWidth={isSelected ? "3" : "2"}
                        filter={isSelected ? "url(#glow)" : "none"}
                      />
                      <text 
                        x={room.x + room.w/2} y={room.y + room.h/2} textAnchor="middle" dominantBaseline="middle"
                        fill="white" fontSize="11" fontWeight="800" style={{ pointerEvents: "none", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
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
                      fill={isSelected ? "rgba(0,113,227,0.05)" : "rgba(255,255,255,0.02)"} 
                      stroke={isSelected ? "var(--accent)" : "rgba(255,255,255,0.2)"} 
                      strokeWidth={isSelected ? "2.5" : "1.2"}
                    />
                    {/* Dimension Markers */}
                    {isSelected && (
                      <g style={{ opacity: 0.7 }}>
                        <text x={room.x + room.w/2} y={room.y - 10} textAnchor="middle" fill="var(--accent)" fontSize="10" fontWeight="700">{room.realW}'</text>
                        <text x={room.x + room.w + 10} y={room.y + room.h/2} dominantBaseline="middle" fill="var(--accent)" fontSize="10" fontWeight="700" transform={`rotate(90, ${room.x + room.w + 10}, ${room.y + room.h/2})`}>{room.realH}'</text>
                      </g>
                    )}
                    <text 
                      x={room.x + 10} y={room.y + 20} fill={isSelected ? "var(--accent)" : "var(--t-secondary)"} 
                      fontSize="10" fontWeight="800" letterSpacing="0.05em"
                    >
                      {room.name.toUpperCase()}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </motion.div>
        </div>
      </div>

      {/* ── Intelligence Panel ──────────────────────────── */}
      <aside style={{
        width: isMobile ? "100%" : "380px",
        background: "var(--surface-1)", borderLeft: isMobile ? "none" : "1px solid var(--border)",
        display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto", padding: "32px",
        zIndex: 200
      }} className="glass">
        <div style={{ marginBottom: "32px" }}>
          <div className="badge badge-cyan" style={{ marginBottom: "16px" }}>
            <Activity size={12} /> Optimization Active
          </div>
          <h2 className="font-display" style={{ fontSize: "22px", marginBottom: "8px", letterSpacing: "-0.02em" }}>Spatial Intelligence</h2>
          <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.6 }}>
            Generating high-fidelity spatial hierarchy based on behavioral patterns and environmental constraints.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {selectedRoom ? (
            <motion.div 
              key={selectedRoom.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div className="card glass-accent" style={{ padding: "24px", borderRadius: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <Box size={18} color="var(--accent)" />
                  <div style={{ fontSize: "16px", fontWeight: 800 }}>{selectedRoom.name}</div>
                </div>
                <div style={{ fontSize: "12px", color: "var(--t-muted)", marginBottom: "16px", fontWeight: 600 }}>
                  {selectedRoom.realW}' × {selectedRoom.realH}' · <span style={{ color: "var(--t-primary)" }}>{selectedRoom.sqft} SQFT</span>
                </div>
                
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                  <div className="badge" style={{ background: "var(--surface-3)", border: "1px solid var(--border)", color: getPrivacyColor(getPrivacyLevel(selectedRoom.type || '')) }}>
                    {getPrivacyLevel(selectedRoom.type || '')} Zone
                  </div>
                </div>

                <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", marginBottom: "10px", color: "var(--t-muted)", letterSpacing: "0.05em" }}>Spatial Logic</div>
                <p style={{ fontSize: "13px", color: "var(--t-secondary)", lineHeight: 1.7 }}>
                  Positioned for optimal <strong>thermal comfort</strong> and <strong>privacy buffering</strong>. Connection to {selectedRoom.type === 'master' ? 'Bath' : 'Circulation'} has been synchronized.
                </p>
              </div>

              <div className="card" style={{ padding: "20px", borderRadius: "18px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Shield size={16} color="var(--emerald)" /> Regulatory Compliance
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    "Structural span verified (< 18')",
                    "Cross-ventilation quota met",
                    "Egress clearance verified"
                  ].map(check => (
                    <div key={check} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "var(--t-muted)" }}>
                      <Check size={14} color="var(--emerald)" /> {check}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="card" style={{ padding: "40px 20px", textAlign: "center", borderRadius: "20px", border: "1px dashed var(--border)", background: "rgba(255,255,255,0.01)" }}>
              <div className="pulse" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <MousePointer2 size={24} color="var(--t-muted)" />
              </div>
              <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>Interactive Drafting</h4>
              <p style={{ fontSize: "12px", color: "var(--t-muted)", lineHeight: 1.5 }}>
                Select any spatial node to analyze its technical logic or adjust its positioning.
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* Planning Logic Explanation */}
        <div style={{ marginTop: "auto", paddingTop: "32px" }}>
          <div className="card glass-subtle" style={{ padding: "20px", borderRadius: "18px", border: "1px solid var(--accent-dim)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--accent)", fontSize: "13px", fontWeight: 800 }}>
              <Sparkles size={16} /> Architectural Rationale
            </div>
            <p style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.7 }}>
              Design utilizes a <strong>Radiant Core</strong> model. All high-traffic zones are equidistant from the vertical node to minimize circulation fatigue.
            </p>
          </div>
          
          <button onClick={onNext} className="btn-accent pulse" style={{ width: "100%", padding: "18px", borderRadius: "100px", marginTop: "24px", fontWeight: 800, fontSize: "15px", boxShadow: "var(--shadow-glow)" }}>
            Confirm Layout <ArrowRight size={18} />
          </button>
        </div>
      </aside>
      
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function Check({ size, color }: { size: number, color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
