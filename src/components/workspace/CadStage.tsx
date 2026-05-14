"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, ArrowRight, Layers, Sun, Move, Ruler,
  Info, CheckCircle2, Building2, Car, Flame
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";

type OverlayLayer = "setbacks" | "environmental" | "connectivity" | "zoning";

export default function CadStage({ onNext }: { onNext: () => void }) {
  const { analysis: _analysis } = useProjectStore();
  const [activeLayers, setActiveLayers] = useState<OverlayLayer[]>(["setbacks", "environmental"]);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const toggleLayer = (layer: OverlayLayer) => {
    setActiveLayers(prev => prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]);
  };

  const feasibilityStats = useMemo(() => ({
    maxBuiltUp: "5,400 sqft",
    maxHeight: "15m (G+3)",
    setbacks: { front: "3m", rear: "2m", side: "1.5m" },
    fsi: "2.25",
    coverage: "60%"
  }), []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden", background: "var(--bg)" }}>

      {/* ── Main Analysis Canvas ──────────────────────────────── */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", padding: "24px" }}>

        {/* Stage Header */}
        <div style={{ marginBottom: "24px" }}>
          <div className="badge badge-emerald" style={{ marginBottom: "12px" }}>
            <Shield size={10} /> Process Stage 03: Regulatory Intelligence
          </div>
          <h1 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "4px" }}>
            Site Feasibility & Analysis
          </h1>
          <p style={{ color: "var(--t-muted)", fontSize: "13px" }}>
            Vector-based intelligence overlay mapping legal boundaries and environmental behavior.
          </p>
        </div>

        {/* Intelligence Canvas */}
        <div style={{
          flex: 1, background: "var(--surface-1)", borderRadius: "24px", border: "1px solid var(--border)",
          position: "relative", overflow: "hidden", boxShadow: "inset 0 0 40px rgba(0,0,0,0.2)"
        }}>
          {/* SVG Site Overlay */}
          <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" style={{ background: "var(--surface-1)" }}>
            {/* Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Site Boundary */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              d="M 200,150 L 600,150 L 580,450 L 220,450 Z"
              fill="rgba(255,255,255,0.02)"
              stroke="var(--t-muted)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Setback Lines (Layer) */}
            <AnimatePresence>
              {activeLayers.includes("setbacks") && (
                <motion.path
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  d="M 240,190 L 560,190 L 545,410 L 255,410 Z"
                  fill="rgba(50, 215, 75, 0.1)"
                  stroke="var(--emerald)"
                  strokeWidth="2"
                />
              )}
            </AnimatePresence>

            {/* Sun Path (Layer) */}
            <AnimatePresence>
              {activeLayers.includes("environmental") && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <path d="M 100,300 A 300,100 0 0,1 700,300" fill="none" stroke="var(--amber)" strokeWidth="1" strokeDasharray="8 8" />
                  <circle cx="100" cy="300" r="10" fill="var(--amber)" />
                  <circle cx="700" cy="300" r="10" fill="var(--amber)" />
                  {/* Wind Arrow */}
                  <path d="M 50,50 L 150,150" stroke="var(--cyan)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Legend / Annotations */}
            <g style={{ fontSize: "10px", fill: "var(--t-muted)", fontWeight: 600 }}>
              <text x="220" y="140">Legal Property Line</text>
              <text x="260" y="180" fill="var(--emerald)">Buildable Envelope</text>
              <text x="50" y="40" fill="var(--cyan)">Primary Wind: SW</text>
            </g>
          </svg>

          {/* Canvas Controls Overlay */}
          <div style={{
            position: "absolute", bottom: "20px", left: "20px",
            background: "var(--glass)", padding: "8px", borderRadius: "12px", border: "1px solid var(--border)",
            display: "flex", gap: "8px"
          }}>
            {[
              { id: "setbacks", icon: Ruler, label: "Setbacks" },
              { id: "environmental", icon: Sun, label: "Eco-Analysis" },
              { id: "connectivity", icon: Move, label: "Connectivity" },
              { id: "zoning", icon: Layers, label: "Zoning" },
            ].map(layer => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id as OverlayLayer)}
                style={{
                  padding: "8px 12px", borderRadius: "8px", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600,
                  background: activeLayers.includes(layer.id as OverlayLayer) ? "var(--t-primary)" : "transparent",
                  color: activeLayers.includes(layer.id as OverlayLayer) ? "var(--bg)" : "var(--t-secondary)",
                  transition: "all 0.2s"
                }}
              >
                <layer.icon size={12} /> {layer.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Regulatory Sidebar ────────────────────────────────── */}
      <div style={{
        width: isMobile ? "100%" : "380px",
        borderLeft: isMobile ? "none" : "1px solid var(--border)",
        background: "var(--surface-1)",
        overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px",
        flexShrink: 0,
      }}>

        <div>
          <h3 className="font-display" style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Feasibility Report</h3>
          <p style={{ fontSize: "12px", color: "var(--t-muted)" }}>
            Municipal Authority: <strong>Kochi Development Authority</strong>
          </p>
        </div>

        {/* Key Feasibility Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { label: "Permissible FSI", value: feasibilityStats.fsi, icon: Building2 },
            { label: "Max Coverage", value: feasibilityStats.coverage, icon: Layers },
            { label: "Max Height", value: feasibilityStats.maxHeight, icon: Move },
            { label: "Max Built-up", value: feasibilityStats.maxBuiltUp, icon: Ruler },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: "12px", borderRadius: "10px" }}>
              <stat.icon size={14} color="var(--accent)" style={{ marginBottom: "6px" }} />
              <div style={{ fontSize: "10px", color: "var(--t-muted)" }}>{stat.label}</div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Setback Matrix */}
        <div className="card" style={{ padding: "16px", borderRadius: "12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Ruler size={14} color="var(--emerald)" /> Setback Regulations
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {Object.entries(feasibilityStats.setbacks).map(([side, val]) => (
              <div key={side} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "var(--t-muted)", textTransform: "capitalize" }}>{side} Setback</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Check */}
        <div className="card" style={{ padding: "16px", borderRadius: "12px", background: "var(--glass)" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={14} color="var(--emerald)" /> Infrastructure Compliance
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
              <Car size={12} color="var(--t-muted)" />
              <span>Parking Required: <strong>1.5 ECS / 100sqm</strong></span>
              <CheckCircle2 size={12} color="var(--emerald)" style={{ marginLeft: "auto" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
              <Flame size={12} color="var(--t-muted)" />
              <span>Fire Safety: <strong>Primary Exit 1.5m</strong></span>
              <CheckCircle2 size={12} color="var(--emerald)" style={{ marginLeft: "auto" }} />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <div style={{ padding: "12px", borderRadius: "12px", background: "var(--surface-2)", marginBottom: "12px", border: "1px dashed var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Info size={12} color="var(--accent)" />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)" }}>AI Feasibility Score: 94%</span>
            </div>
            <p style={{ fontSize: "10px", color: "var(--t-muted)" }}>Site potential is optimally aligned with local municipal norms.</p>
          </div>

          <button className="btn-primary" onClick={onNext} style={{ width: "100%", padding: "16px", borderRadius: "100px" }}>
            Validate Feasibility & Continue <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
