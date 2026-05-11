"use client";
import { useState } from "react";
import { Download, Share2, Send, Sparkles } from "lucide-react";
import { useAIEngine } from "@/store/useAIEngine";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  "Structure", "Walls & Finishes", "Flooring", "Doors & Windows", 
  "Electrical", "Plumbing", "HVAC", "Furniture", "Exterior", "Hardware"
];

export function CostEngineView() {
  const [activeTab, setActiveTab] = useState("Cost Estimation");
  const [activeCategory, setActiveCategory] = useState("Flooring");
  
  const { rooms, totalCost, isAnalyzing, optimizeBudget, aiNotifications } = useAIEngine();

  // Generate dynamic table data based on AI Engine rooms
  const tableData = rooms.map(room => ({
    material: room.floorFinish,
    spec: `${room.name} Flooring`,
    unit: "m²",
    qty: (room.width * room.length).toFixed(2),
  }));

  // Add walls to the table data
  rooms.forEach(room => {
    tableData.push({
      material: room.wallFinish,
      spec: `${room.name} Walls`,
      unit: "m²",
      qty: ((room.width + room.length) * 2 * room.height).toFixed(2),
    });
  });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--t-primary)", position: "relative" }}>
      
      {/* Top Breadcrumb Bar */}
      <div style={{ height: "60px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", gap: "24px", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          {["01. Design", "02. Materials", "03. Estimate", "04. Summary"].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "24px", marginRight: "24px" }}>
              <span style={{ fontSize: "12px", color: step === "03. Estimate" ? "var(--t-primary)" : "var(--t-muted)", fontWeight: step === "03. Estimate" ? 600 : 400 }}>
                {step}
              </span>
              {i < 3 && <span style={{ color: "var(--border)", fontSize: "12px" }}>&gt;</span>}
            </div>
          ))}
        </div>

        {/* AI Processing Indicator */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)", fontSize: "13px", fontWeight: 600 }}>
              <Sparkles size={14} className="spin" /> AI Analyzing Bill of Quantities...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ padding: "32px 48px 0 48px" }}>
        {/* Segmented Control */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border)", marginBottom: "32px" }}>
          <div style={{ display: "flex", gap: "32px" }}>
            {["Material Specification", "Cost Estimation"].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                style={{ 
                  background: "transparent", border: "none", padding: "0 0 16px 0", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  color: activeTab === tab ? "var(--t-primary)" : "var(--t-muted)",
                  borderBottom: activeTab === tab ? "2px solid var(--t-primary)" : "2px solid transparent",
                  marginBottom: "-1px"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <button 
            onClick={optimizeBudget}
            disabled={isAnalyzing}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(198,176,138,0.1)", color: "var(--accent)", border: "1px solid var(--accent)", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", opacity: isAnalyzing ? 0.5 : 1 }}
          >
            <Sparkles size={16} /> AI Optimize Budget
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", padding: "0 48px 48px 48px", gap: "48px" }}>
        
        {/* Left Categories Sidebar */}
        <div style={{ width: "200px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: "transparent", border: "none", textAlign: "left", fontSize: "13px", cursor: "pointer",
                color: activeCategory === cat ? "var(--t-primary)" : "var(--t-muted)",
                fontWeight: activeCategory === cat ? 600 : 400
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              MATERIAL SPECIFICATION: {activeCategory.toUpperCase()}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", marginBottom: "32px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "16px 0", fontSize: "12px", color: "var(--t-muted)", fontWeight: 500 }}>Material</th>
                  <th style={{ padding: "16px 0", fontSize: "12px", color: "var(--t-muted)", fontWeight: 500 }}>Specification</th>
                  <th style={{ padding: "16px 0", fontSize: "12px", color: "var(--t-muted)", fontWeight: 500 }}>Unit</th>
                  <th style={{ padding: "16px 0", fontSize: "12px", color: "var(--t-muted)", fontWeight: 500 }}>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {tableData.map((row, i) => (
                    <motion.tr 
                      key={`${row.spec}-${row.material}`} 
                      initial={{ opacity: 0, backgroundColor: "rgba(198,176,138,0.2)" }} 
                      animate={{ opacity: 1, backgroundColor: "transparent" }}
                      transition={{ duration: 1 }}
                    >
                      <td style={{ padding: "16px 0", fontSize: "13px", borderBottom: "1px solid var(--border)" }}>{row.material}</td>
                      <td style={{ padding: "16px 0", fontSize: "13px", borderBottom: "1px solid var(--border)", color: "var(--t-muted)" }}>{row.spec}</td>
                      <td style={{ padding: "16px 0", fontSize: "13px", borderBottom: "1px solid var(--border)", color: "var(--t-muted)" }}>{row.unit}</td>
                      <td style={{ padding: "16px 0", fontSize: "13px", borderBottom: "1px solid var(--border)" }}>{row.qty}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* AI Insights & Cost Summary */}
          {aiNotifications.length > 0 && (
            <div style={{ marginBottom: "24px", padding: "16px", borderRadius: "8px", background: "rgba(198,176,138,0.1)", border: "1px solid var(--accent)", display: "flex", gap: "12px" }}>
              <Sparkles size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "13px", color: "var(--accent)", lineHeight: 1.5 }}>
                {aiNotifications[0].message}
              </div>
            </div>
          )}

          <div style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "16px" }}>
            COST SUMMARY
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface-1)" }}>
              <div style={{ fontSize: "12px", color: "var(--t-muted)", marginBottom: "8px" }}>Low Range</div>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>₹ {(totalCost * 0.8).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
            <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid var(--accent)", background: "var(--surface-1)", position: "relative", overflow: "hidden" }}>
              {isAnalyzing && <motion.div animate={{ left: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", top: 0, bottom: 0, width: "50%", background: "linear-gradient(90deg, transparent, rgba(198,176,138,0.2), transparent)", transform: "skewX(-20deg)" }} />}
              <div style={{ fontSize: "12px", color: "var(--t-muted)", marginBottom: "8px" }}>Market Estimate</div>
              <motion.div key={totalCost} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: "20px", fontWeight: 600, color: "var(--accent)" }}>
                ₹ {totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </motion.div>
            </div>
            <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface-1)" }}>
              <div style={{ fontSize: "12px", color: "var(--t-muted)", marginBottom: "8px" }}>Premium Estimate</div>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>₹ {(totalCost * 1.3).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid var(--border)", color: "var(--t-primary)", padding: "12px 24px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
              <Download size={16} /> Download BOQ
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid var(--border)", color: "var(--t-primary)", padding: "12px 24px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
              <Share2 size={16} /> Share Estimate
            </button>
            <button style={{ marginLeft: "auto", background: "rgba(198,176,138,0.15)", border: "1px solid var(--accent)", color: "var(--accent)", padding: "12px 32px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Send to Architect
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
