"use client";
import { usePlanStore } from "@/store/usePlanStore";
import { Palette, Box, Check, Sparkles, Info, MessageSquare } from "lucide-react";

const MATERIALS = [
  { id: "Italian Marble", name: "Italian Marble", category: "Floor", color: "#f8fafc" },
  { id: "Hardwood", name: "Hardwood", category: "Floor", color: "#451a03" },
  { id: "Ceramic Tiles", name: "Ceramic Tiles", category: "Floor", color: "#cbd5e1" },
  { id: "Oak Wood", name: "Oak Wood", category: "Floor", color: "#b45309" },
  { id: "Polished Concrete", name: "Polished Concrete", category: "Floor", color: "#64748b" },
  { id: "Velvet Navy", name: "Velvet Navy", category: "Wall", color: "#1e3a8a" },
  { id: "Warm Plaster", name: "Warm Plaster", category: "Wall", color: "#fef3c7" },
];

export default function VisualIntelligencePanel() {
  const { selectedRoom, updateRoom } = usePlanStore();

  if (!selectedRoom) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--t-muted)" }}>
        <Box size={32} style={{ marginBottom: "16px", opacity: 0.3 }} />
        <p style={{ fontSize: "14px" }}>Select a zone in the 3D scene to edit its visual intelligence.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
        <div className="badge badge-cyan" style={{ marginBottom: "8px" }}>Selected Zone</div>
        <h3 className="font-display" style={{ fontSize: "20px" }}>{selectedRoom.name}</h3>
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Material Selection */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--t-primary)", fontSize: "14px", fontWeight: 600 }}>
            <Palette size={16} /> Material Intelligence
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                onClick={() => updateRoom(selectedRoom.id, { floorMaterial: m.id })}
                style={{
                  padding: "10px", borderRadius: "8px", border: "1px solid var(--border)",
                  background: selectedRoom.floorMaterial === m.id ? "var(--surface-3)" : "var(--surface-2)",
                  display: "flex", flexDirection: "column", gap: "6px", cursor: "pointer", transition: "all 0.2s",
                  textAlign: "left", position: "relative"
                }}
              >
                <div style={{ width: "100%", height: "40px", borderRadius: "4px", background: m.color, border: "1px solid rgba(255,255,255,0.1)" }} />
                <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--t-primary)" }}>{m.name}</span>
                {selectedRoom.floorMaterial === m.id && (
                  <div style={{ position: "absolute", top: "6px", right: "6px", width: "16px", height: "16px", background: "var(--cyan)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={10} color="black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AI Reasoning */}
        <div style={{ background: "rgba(34, 211, 238, 0.05)", borderRadius: "12px", padding: "16px", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "var(--cyan)", fontSize: "13px", fontWeight: 600 }}>
            <Sparkles size={14} /> AI Visualization Logic
          </div>
          <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.5 }}>
            Based on the <span style={{ color: "var(--t-primary)" }}>{selectedRoom.name}</span>&apos;s spatial context and lighting orientation, 
            I recommend using <span style={{ color: "var(--cyan)" }}>{selectedRoom.floorMaterial || "Standard Polished Concrete"}</span>. 
            This material optimizes light bounce while maintaining the project&apos;s minimalist aesthetic.
          </p>
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(34, 211, 238, 0.1)", display: "flex", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase" }}>Reflectivity</span>
              <div style={{ width: "60px", height: "4px", background: "var(--surface-3)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: "70%", height: "100%", background: "var(--cyan)" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase" }}>Durability</span>
              <div style={{ width: "60px", height: "4px", background: "var(--surface-3)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: "90%", height: "100%", background: "var(--cyan)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Sync Status */}
        <div style={{ padding: "12px", borderRadius: "8px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "8px", background: "var(--green)", borderRadius: "50%" }} />
          <span style={{ fontSize: "12px", color: "var(--t-muted)" }}>Synchronized with Floor Plan</span>
          <Info size={12} style={{ marginLeft: "auto", opacity: 0.5 }} />
        </div>

        {/* AI Chat Interaction */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--t-primary)", fontSize: "14px", fontWeight: 600 }}>
            <MessageSquare size={16} /> Refine with AI
          </div>
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              placeholder="e.g. Make the walls darker..." 
              style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: "13px", color: "var(--t-primary)" }}
            />
            <button style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "var(--cyan)", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
