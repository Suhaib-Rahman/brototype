"use client";
import { useState } from "react";
import { 
  Square, Minus, DoorOpen, LayoutTemplate, AlignVerticalSpaceAround, 
  Sofa, Ruler, Type, Upload, Undo2, Redo2, Maximize,
  ChevronDown, Sparkles, MinusCircle, PlusCircle
} from "lucide-react";
import { useAIEngine } from "@/store/useAIEngine";
import { motion, AnimatePresence } from "framer-motion";

const LEFT_TOOLS = [
  { id: "rooms", label: "Rooms", icon: Square },
  { id: "walls", label: "Walls", icon: Minus },
  { id: "doors", label: "Doors", icon: DoorOpen },
  { id: "windows", label: "Windows", icon: LayoutTemplate },
  { id: "stairs", label: "Stairs", icon: AlignVerticalSpaceAround },
  { id: "furniture", label: "Furniture", icon: Sofa },
  { id: "dimensions", label: "Dimensions", icon: Ruler },
  { id: "text", label: "Text", icon: Type },
  { id: "upload", label: "Upload", icon: Upload },
];

export function PlanEditorView() {
  const [activeTool, setActiveTool] = useState("rooms");
  const [viewMode, setViewMode] = useState<"2D" | "3D">("2D");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  const { rooms, updateRoom, isAnalyzing, aiNotifications } = useAIEngine();
  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // Pre-calculate room positions to avoid mutating variables during render
  const roomLayouts = rooms.reduce((acc, room) => {
    const lastRoom = acc[acc.length - 1];
    const w = room.width * 20;
    const h = room.length * 20;
    const x = 200 - w / 2;
    const y = lastRoom ? lastRoom.y + lastRoom.h + 2 : 0;
    acc.push({ ...room, x, y, w, h });
    return acc;
  }, [] as (typeof rooms[0] & { x: number, y: number, w: number, h: number })[]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--t-primary)", position: "relative" }}>
      
      {/* Top Breadcrumb Bar */}
      <div style={{ height: "60px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", gap: "24px", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          {["01. Requirements", "02. Floor Plan", "03. Design", "04. Visualize", "05. Estimate"].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "24px", marginRight: "24px" }}>
              <span style={{ fontSize: "12px", color: step === "02. Floor Plan" ? "var(--t-primary)" : "var(--t-muted)", fontWeight: step === "02. Floor Plan" ? 600 : 400 }}>
                {step}
              </span>
              {i < 4 && <span style={{ color: "var(--border)", fontSize: "12px" }}>&gt;</span>}
            </div>
          ))}
        </div>
        
        {/* AI Processing Indicator */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)", fontSize: "13px", fontWeight: 600 }}>
              <Sparkles size={14} className="spin" /> AI Analyzing Constraints...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Left Toolbar */}
        <div style={{ width: "80px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "24px 0", gap: "16px", alignItems: "center", background: "var(--surface-0)", flexShrink: 0 }}>
          {LEFT_TOOLS.map((tool) => (
            <button 
              key={tool.id} 
              onClick={() => setActiveTool(tool.id)}
              style={{ 
                display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                background: "transparent", border: "none", color: activeTool === tool.id ? "var(--t-primary)" : "var(--t-muted)",
                cursor: "pointer", transition: "color 0.2s"
              }}
            >
              <tool.icon size={20} />
              <span style={{ fontSize: "10px" }}>{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Dynamic SVG Floor Plan */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <svg viewBox="0 0 400 400" width="600" height="600" style={{ overflow: "visible" }}>
              {roomLayouts.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <g key={room.id} onClick={() => setSelectedRoomId(room.id)} style={{ cursor: "pointer" }} transform={`translate(${room.x}, ${room.y})`}>
                    <rect 
                      width={room.w} height={room.h} 
                      fill="var(--bg)" 
                      stroke={isSelected ? "var(--accent)" : "#333"} 
                      strokeWidth={isSelected ? 2 : 1} 
                      style={{ transition: "all 0.3s" }}
                    />
                    <text x={room.w/2} y={room.h/2} fill="var(--t-primary)" fontSize="10" textAnchor="middle" dominantBaseline="middle" letterSpacing="1">{room.name.toUpperCase()}</text>
                    <text x={room.w/2} y={room.h/2 + 14} fill="var(--t-muted)" fontSize="8" textAnchor="middle" dominantBaseline="middle">{room.width.toFixed(1)} x {room.length.toFixed(1)} m</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Controls */}
          <div style={{ position: "absolute", bottom: "24px", left: "24px", display: "flex", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--t-muted)" }}>Grid</span>
              <div style={{ width: "32px", height: "18px", background: "var(--accent)", borderRadius: "10px", position: "relative" }}>
                <div style={{ width: "14px", height: "14px", background: "var(--bg)", borderRadius: "50%", position: "absolute", right: "2px", top: "2px" }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--t-muted)" }}>Snapping</span>
              <div style={{ width: "32px", height: "18px", background: "var(--accent)", borderRadius: "10px", position: "relative" }}>
                <div style={{ width: "14px", height: "14px", background: "var(--bg)", borderRadius: "50%", position: "absolute", right: "2px", top: "2px" }} />
              </div>
            </div>
          </div>

          {/* Bottom Right Zoom */}
          <div style={{ position: "absolute", bottom: "24px", right: "24px", display: "flex", alignItems: "center", gap: "16px", background: "var(--surface-1)", padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <button className="btn-icon" style={{ border: "none", padding: 0 }}><Maximize size={16} color="var(--t-muted)" /></button>
            <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
            <button className="btn-icon" style={{ border: "none", padding: 0 }}><MinusCircle size={16} color="var(--t-muted)" /></button>
            <span style={{ fontSize: "12px" }}>100%</span>
            <button className="btn-icon" style={{ border: "none", padding: 0 }}><PlusCircle size={16} color="var(--t-muted)" /></button>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div style={{ width: "320px", borderLeft: "1px solid var(--border)", background: "var(--surface-0)", padding: "24px", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div style={{ display: "flex", background: "var(--surface-1)", borderRadius: "6px", border: "1px solid var(--border)", overflow: "hidden" }}>
              <button onClick={() => setViewMode("2D")} style={{ padding: "6px 16px", fontSize: "12px", fontWeight: 600, border: "none", background: viewMode === "2D" ? "var(--surface-3)" : "transparent", color: viewMode === "2D" ? "var(--t-primary)" : "var(--t-muted)", cursor: "pointer" }}>2D</button>
              <button onClick={() => setViewMode("3D")} style={{ padding: "6px 16px", fontSize: "12px", fontWeight: 600, border: "none", background: viewMode === "3D" ? "var(--surface-3)" : "transparent", color: viewMode === "3D" ? "var(--t-primary)" : "var(--t-muted)", cursor: "pointer" }}>3D</button>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-icon" style={{ border: "none", padding: 0 }}><Undo2 size={16} color="var(--t-muted)" /></button>
              <button className="btn-icon" style={{ border: "none", padding: 0 }}><Redo2 size={16} color="var(--t-muted)" /></button>
            </div>
          </div>

          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "24px" }}>Properties</div>

          {selectedRoom ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-1)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>{selectedRoom.name}</span>
                <ChevronDown size={16} color="var(--t-muted)" />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--t-muted)" }}>Width (m)</span>
                <input 
                  type="number" 
                  value={selectedRoom.width} 
                  onChange={(e) => updateRoom(selectedRoom.id, { width: parseFloat(e.target.value) || 0 })}
                  style={{ width: "60px", background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--t-primary)", padding: "4px 8px", borderRadius: "4px", fontSize: "13px", textAlign: "right", outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--t-muted)" }}>Length (m)</span>
                <input 
                  type="number" 
                  value={selectedRoom.length} 
                  onChange={(e) => updateRoom(selectedRoom.id, { length: parseFloat(e.target.value) || 0 })}
                  style={{ width: "60px", background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--t-primary)", padding: "4px 8px", borderRadius: "4px", fontSize: "13px", textAlign: "right", outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--t-muted)" }}>Height (m)</span>
                <input 
                  type="number" 
                  value={selectedRoom.height} 
                  onChange={(e) => updateRoom(selectedRoom.id, { height: parseFloat(e.target.value) || 0 })}
                  style={{ width: "60px", background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--t-primary)", padding: "4px 8px", borderRadius: "4px", fontSize: "13px", textAlign: "right", outline: "none" }}
                />
              </div>

              <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--t-muted)" }}>Floor Finish</span>
                <select 
                  value={selectedRoom.floorFinish}
                  onChange={(e) => updateRoom(selectedRoom.id, { floorFinish: e.target.value })}
                  style={{ background: "transparent", border: "none", color: "var(--t-primary)", fontSize: "13px", outline: "none", cursor: "pointer", textAlign: "right" }}
                >
                  <option value="Italian Marble">Italian Marble</option>
                  <option value="Hardwood">Hardwood</option>
                  <option value="Ceramic Tiles">Ceramic Tiles</option>
                  <option value="Concrete">Concrete</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--t-muted)" }}>Wall Finish</span>
                <select 
                  value={selectedRoom.wallFinish}
                  onChange={(e) => updateRoom(selectedRoom.id, { wallFinish: e.target.value })}
                  style={{ background: "transparent", border: "none", color: "var(--t-primary)", fontSize: "13px", outline: "none", cursor: "pointer", textAlign: "right" }}
                >
                  <option value="Off White Paint">Off White Paint</option>
                  <option value="Exposed Brick">Exposed Brick</option>
                  <option value="Ceramic Tiles">Ceramic Tiles</option>
                </select>
              </div>
            </motion.div>
          ) : (
            <div style={{ fontSize: "13px", color: "var(--t-muted)", textAlign: "center", marginTop: "40px" }}>
              Select a room to view and edit its properties.
            </div>
          )}

          <div style={{ marginTop: "auto", paddingTop: "24px" }}>
            <div style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px", fontWeight: 600 }}>AI Insights</div>
            {aiNotifications.length > 0 ? (
               <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                 {aiNotifications.slice(0, 2).map(n => (
                    <div key={n.id} style={{ padding: "12px", borderRadius: "8px", background: n.type === 'warning' ? "rgba(239,68,68,0.1)" : "rgba(198,176,138,0.1)", border: `1px solid ${n.type === 'warning' ? "rgba(239,68,68,0.2)" : "var(--border)"}`, fontSize: "12px", color: n.type === 'warning' ? "#ef4444" : "var(--accent)", lineHeight: 1.5 }}>
                       {n.message}
                    </div>
                 ))}
               </div>
            ) : (
               <div style={{ fontSize: "12px", color: "var(--t-secondary)" }}>Layout meets optimal architectural parameters.</div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
