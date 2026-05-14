"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Sun, Moon, Camera, Box, Sparkles } from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";

const ThreeScene = dynamic(() => import("./ThreeScene"), {
  ssr: false, loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map(i => <div key={i} className="thinking-dot" style={{ width: "10px", height: "10px", background: "var(--cyan)" }} />)}
      </div>
      <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>Loading 3D engine...</p>
    </div>
  )
});

const CAMERA_PRESETS = [
  { id: "front", label: "Front View", pos: [0, 5, 18] as [number, number, number] },
  { id: "top", label: "Top View", pos: [0, 22, 2] as [number, number, number] },
  { id: "corner", label: "Corner", pos: [14, 8, 14] as [number, number, number] },
  { id: "walk", label: "Walk", pos: [2, 3, 4] as [number, number, number] },
];

import VisualIntelligencePanel from "./VisualIntelligencePanel";
import CinematicStudio from "./CinematicStudio";

export default function ThreeDStage() {
  const { floorPlan } = usePlanStore();
  const [tab, setTab] = useState<"3d" | "render">("3d");
  const [camPos, setCamPos] = useState<[number, number, number]>([10, 8, 14]);
  const [dayNight, setDayNight] = useState(70);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, background: "var(--bg)" }}>
        <div style={{ display: "flex", gap: "4px", background: "var(--surface-2)", padding: "3px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
          {[
            { id: "3d" as const, label: "Interactive 3D", icon: Box },
            { id: "render" as const, label: "Cinematic Studio", icon: Camera }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "5px 16px", borderRadius: "var(--radius-full)", fontSize: "12px", fontWeight: 500,
              background: tab === t.id ? "var(--bg)" : "transparent",
              color: tab === t.id ? "var(--t-primary)" : "var(--t-muted)",
              border: "none", cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: "6px",
              boxShadow: tab === t.id ? "var(--shadow-sm)" : "none",
            }}><t.icon size={12} />{t.label}</button>
          ))}
        </div>

        {tab === "3d" && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Sun size={14} color={dayNight > 50 ? "var(--amber)" : "var(--t-muted)"} />
            <input
              type="range"
              min={0}
              max={100}
              value={dayNight}
              onChange={(e) => setDayNight(Number(e.target.value))}
              style={{ width: "100px", accentColor: "var(--accent)", cursor: "pointer" }}
            />
            <Moon size={14} color={dayNight <= 50 ? "var(--violet)" : "var(--t-muted)"} />
          </div>
        )}
      </div>

      {tab === "3d" && (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)" }}>
            {/* Camera presets */}
            <div style={{ padding: "10px 16px", display: "flex", gap: "8px", flexShrink: 0, background: "var(--bg)" }}>
              {CAMERA_PRESETS.map(p => {
                const isActive = JSON.stringify(camPos) === JSON.stringify(p.pos);
                return (
                  <button key={p.id} onClick={() => setCamPos(p.pos)} style={{
                    padding: "6px 16px", borderRadius: "var(--radius-full)", fontSize: "11px", fontWeight: 600,
                    background: isActive ? "var(--accent)" : "var(--surface-2)",
                    color: isActive ? "white" : "var(--t-muted)",
                    border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.2s",
                  }}>{p.label}</button>
                );
              })}
              <div className="badge badge-cyan" style={{ marginLeft: "auto", borderRadius: "8px", fontSize: "10px" }}>
                <Sparkles size={10} /> Live Raytracing Mode
              </div>
            </div>

            {/* 3D Canvas */}
            <div style={{ flex: 1, background: "#050508", position: "relative", height: "100%" }}>
              <ThreeScene floorPlan={floorPlan ?? undefined} cameraPosition={camPos} dayNight={dayNight} />

              {/* Overlay HUD */}
              <div style={{ position: "absolute", bottom: "24px", left: "24px", pointerEvents: "none" }}>
                <div style={{ background: "rgba(5, 5, 8, 0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px 20px", color: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--cyan)", fontWeight: 800, marginBottom: "6px", letterSpacing: "1px" }}>Workspace Engine</div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>Interactive Spatial Optimization</div>
                  <div style={{ fontSize: "11px", color: "var(--t-muted)", marginTop: "4px" }}>Click rooms to analyze spatial intelligence.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div style={{ width: "340px", flexShrink: 0, background: "var(--surface-1)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
            <VisualIntelligencePanel />
          </div>
        </div>
      )}

      {tab === "render" && <CinematicStudio />}
    </div>
  );
}
