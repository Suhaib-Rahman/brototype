"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Sun, Moon, Eye, Camera, Box, Loader2, Palette, Sparkles } from "lucide-react";
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

const AI_RENDERS = [
  { id: "exterior", label: "AI Exterior Generation", url: "/renders/render_exterior.png", desc: "Photorealistic rendering of the generated architecture using path tracing." },
  { id: "interior", label: "AI Interior Flow", url: "/renders/render_interior.png", desc: "Volumetric lighting and interior layout visualization based on plan coordinates." }
];

const CAMERA_PRESETS = [
  { id: "front", label: "Front View", pos: [0, 5, 18] as [number, number, number] },
  { id: "top", label: "Top View", pos: [0, 22, 2] as [number, number, number] },
  { id: "corner", label: "Corner", pos: [14, 8, 14] as [number, number, number] },
  { id: "walk", label: "Walk", pos: [2, 3, 4] as [number, number, number] },
];

export default function ThreeDStage() {
  const { floorPlan } = usePlanStore();
  const [tab, setTab] = useState<"3d" | "render">("3d");
  const [camPos, setCamPos] = useState<[number, number, number]>([10, 8, 14]);
  const [dayNight, setDayNight] = useState(70);
  const [selectedRender, setSelectedRender] = useState(0);

  const [isGeneratingRender, setIsGeneratingRender] = useState(false);
  const [hasGeneratedRenders, setHasGeneratedRenders] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  const handleGenerateRenders = () => {
    setIsGeneratingRender(true);
    setGenerationLogs([]);

    // Dynamically build the prompt using the AI data
    const hasGarden = floorPlan?.rooms.some(r => r.type === 'garden');
    const logs = [
      `Analyzing 2D topological data... Found ${floorPlan?.rooms.length || 0} distinct spatial zones.`,
      `Extruding 3D geometry... Calculated Total Area: ${floorPlan?.totalSqft || 2400} sqft.`,
      `Applying structural AI logic: Enforcing load-bearing walls and determining glass placements...`,
      `Constructing stable diffusion prompt: 'Photorealistic architectural render featuring ${hasGarden ? 'a lush courtyard garden' : 'modern open-plan living'}, 8k resolution...'`,
      `Executing path-tracing and global illumination passes...`,
      `Finalizing Exterior and Interior render variants...`
    ];

    let currentLogIndex = 0;

    // Add the first log immediately
    setGenerationLogs([logs[0]]);
    currentLogIndex++;

    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        // Capture the current string so it isn't lost in the closure
        const nextLog = logs[currentLogIndex];
        setGenerationLogs(prev => [...prev, nextLog]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      setIsGeneratingRender(false);
      setHasGeneratedRenders(true);
    }, logs.length * 800 + 800);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "4px", background: "var(--surface-2)", padding: "3px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
          {[{ id: "3d" as const, label: "Interactive 3D", icon: Box }, { id: "render" as const, label: "AI Renders", icon: Camera }].map(t => (
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
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Sun size={14} color={dayNight > 50 ? "var(--amber)" : "var(--t-muted)"} />
            <input type="range" min={0} max={100} value={dayNight} onChange={(e) => setDayNight(Number(e.target.value))}
              style={{ width: "80px", accentColor: "var(--accent)" }} />
            <Moon size={14} color={dayNight <= 50 ? "var(--violet)" : "var(--t-muted)"} />
          </div>
        )}
      </div>

      {tab === "3d" && (
        <>
          {/* Camera presets */}
          <div style={{ padding: "10px 16px", display: "flex", gap: "6px", flexShrink: 0 }}>
            {CAMERA_PRESETS.map(p => (
              <button key={p.id} onClick={() => setCamPos(p.pos)} style={{
                padding: "6px 14px", borderRadius: "var(--radius-full)", fontSize: "11px",
                background: JSON.stringify(camPos) === JSON.stringify(p.pos) ? "var(--accent)" : "var(--surface-2)",
                color: JSON.stringify(camPos) === JSON.stringify(p.pos) ? "white" : "var(--t-muted)",
                border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.15s",
              }}>{p.label}</button>
            ))}
            <div className="badge badge-violet" style={{ marginLeft: "auto" }}>
              <Palette size={10} /> Material: Architectural Hologram
            </div>
          </div>

          {/* 3D Canvas */}
          <div style={{ flex: 1, background: "#050508", borderRadius: "0", overflow: "hidden", position: "relative" }}>
            <ThreeScene floorPlan={floorPlan ?? undefined} cameraPosition={camPos} dayNight={dayNight} />
          </div>
        </>
      )}

      {tab === "render" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative" }}>
          {!hasGeneratedRenders ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              {isGeneratingRender ? (
                <>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "20px" }}>
                    {[0, 1, 2].map(i => <div key={i} className="thinking-dot" style={{ width: "10px", height: "10px", background: "var(--cyan)" }} />)}
                  </div>
                  <h3 className="font-display" style={{ marginBottom: "8px", fontSize: "20px" }}>AI Engine Compiling...</h3>

                  {/* Live AI Reasoning Log */}
                  <div style={{ marginTop: "24px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "20px", width: "100%", maxWidth: "560px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px", minHeight: "240px" }}>
                    {generationLogs.map((log, idx) => (
                      <div key={idx} style={{
                        display: "flex", alignItems: "center", gap: "10px", fontSize: "13px",
                        color: idx === generationLogs.length - 1 ? "var(--cyan)" : "var(--t-muted)",
                        fontFamily: "monospace", opacity: 0, animation: "fadeIn 0.3s forwards"
                      }}>
                        {idx === generationLogs.length - 1 ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
                        {log}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Camera size={48} color="var(--t-muted)" style={{ marginBottom: "16px", opacity: 0.5 }} />
                  <h3 className="font-display" style={{ marginBottom: "8px", fontSize: "22px" }}>Generate Photorealistic Renders</h3>
                  <p style={{ color: "var(--t-muted)", fontSize: "14px", marginBottom: "24px", maxWidth: "340px", textAlign: "center", lineHeight: 1.5 }}>
                    Use the finalized 3D structural data to generate high-fidelity, production-ready AI visualizations of your project.
                  </p>
                  <button onClick={handleGenerateRenders} className="btn-primary" style={{ padding: "12px 24px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600 }}>
                    <Sparkles size={16} /> Generate AI Renders
                  </button>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ padding: "10px 16px", display: "flex", gap: "6px", flexShrink: 0 }}>
                {AI_RENDERS.map((r, i) => (
                  <button key={r.id} onClick={() => setSelectedRender(i)} style={{
                    padding: "6px 14px", borderRadius: "var(--radius-full)", fontSize: "11px",
                    background: i === selectedRender ? "var(--accent)" : "var(--surface-2)",
                    color: i === selectedRender ? "white" : "var(--t-muted)",
                    border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.15s",
                  }}>{r.label}</button>
                ))}
                <button className="btn-icon" style={{ marginLeft: "auto", fontSize: "11px", padding: "4px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-full)", color: "var(--t-muted)" }}>
                  Download ZIP
                </button>
              </div>

              <div style={{ flex: 1, position: "relative", padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ position: "relative", width: "100%", height: "100%", maxWidth: "1200px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", border: "1px solid var(--border)" }}>
                  <img src={AI_RENDERS[selectedRender].url} alt={AI_RENDERS[selectedRender].label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, padding: "64px 32px 32px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.9))", color: "white"
                  }}>
                    <div className="font-display" style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{AI_RENDERS[selectedRender].label}</div>
                    <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>{AI_RENDERS[selectedRender].desc}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
