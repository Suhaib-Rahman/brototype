"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Sparkles, Loader2, Play, Download, Settings,
  Cloud, Sun, Moon, Wind, Map, Video, Layers, Check, MessageSquare, Box, Send
} from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";

type RenderType = "exterior" | "interior" | "section" | "reel" | "walkthrough";

interface RenderOutput {
  id: string;
  type: RenderType;
  label: string;
  url: string;
  desc: string;
  reasoning: string;
}

const RENDERS: RenderOutput[] = [
  {
    id: "ext_1", type: "exterior", label: "Front Perspective",
    url: "/renders/render_exterior.png",
    desc: "Main architectural facade with ray-traced global illumination.",
    reasoning: "Selected a 35mm focal length to emphasize the structural rhythm while maintaining environmental context. Lighting is set to Golden Hour to highlight material textures."
  },
  {
    id: "int_1", type: "interior", label: "Living Intelligence",
    url: "/renders/render_interior.png",
    desc: "Volumetric lighting pass for the primary social zone.",
    reasoning: "Utilized soft area lighting from window placements to create a calm, breathable atmosphere. Shadow softness was increased to enhance the feeling of spatial depth."
  },
  {
    id: "sec_1", type: "section", label: "Transverse Section",
    url: "/renders/render_exterior.png", // placeholder
    desc: "Cinematic cut-through showing spatial hierarchy.",
    reasoning: "Revealing the vertical circulation logic and material transitions between floors. The section plane is optimized to show the relationship between the double-height void and private zones."
  },
  {
    id: "reel_1", type: "reel", label: "Social Media Reel",
    url: "/renders/render_interior.png", // placeholder
    desc: "Fast-paced 9:16 cinematic sequence.",
    reasoning: "Curated a sequence of close-up material details and wide-angle spatial reveals optimized for vertical viewing and high-impact architectural storytelling."
  }
];

export default function CinematicStudio() {
  const { floorPlan, selectedRoom, isCinematic, environment, setCinematic, setEnvironment } = usePlanStore();
  const [activeTab, setActiveTab] = useState<RenderType>("exterior");
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [refinement, setRefinement] = useState("");

  const handleGenerate = (type: RenderType) => {
    setIsGenerating(true);
    setLogs([]);
    const roomName = selectedRoom?.name || "Global";
    const newLogs = [
      `Initializing Cinematic Engine v4.2...`,
      `Syncing with architectural geometry [${floorPlan?.rooms.length || 0} zones]...`,
      `Setting environment to ${environment.toUpperCase()} simulation...`,
      `Calculating global illumination and ray-traced reflections...`,
      `Processing ${type === 'reel' ? '120 frames for vertical reel' : '4K high-fidelity still'}...`,
      `Applying AI-driven post-processing and color grading...`,
      `Finalizing cinematic output for ${roomName}...`
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < newLogs.length) {
        setLogs(prev => [...prev, newLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsGenerating(false), 800);
        if (type === 'walkthrough' || type === 'reel') {
          setCinematic(true);
        }
      }
    }, 500);
  };

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)" }}>
      {/* Sidebar Controls */}
      <aside style={{ width: "320px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }} className="glass">
        <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
          <div className="badge badge-violet" style={{ marginBottom: "12px" }}>Stage 08</div>
          <h2 className="font-display" style={{ fontSize: "20px", letterSpacing: "-0.01em" }}>Cinematic Studio</h2>
          <p style={{ fontSize: "12px", color: "var(--t-muted)", marginTop: "6px", lineHeight: 1.5 }}>
            Synthesize high-fidelity architectural narratives and visual intelligence.
          </p>
        </div>

        <div style={{ padding: "24px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "32px" }} className="custom-scroll">
          {/* Environment Simulation */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "var(--t-primary)", fontSize: "13px", fontWeight: 700 }}>
              <Sun size={14} className="pulse" /> Lighting Atmosphere
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {[
                { id: "day" as const, icon: Sun, label: "Mid-day" },
                { id: "sunset" as const, icon: Wind, label: "Golden Hour" },
                { id: "night" as const, icon: Moon, label: "Midnight" },
                { id: "cloudy" as const, icon: Cloud, label: "Overcast" },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setEnvironment(item.id)}
                  style={{
                    padding: "12px 8px", borderRadius: "12px", border: "1px solid var(--border)",
                    background: environment === item.id ? "var(--accent-dim)" : "var(--surface-1)",
                    color: environment === item.id ? "var(--accent)" : "var(--t-muted)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s", fontSize: "11px", fontWeight: 600
                  }}
                  className={environment === item.id ? "pulse" : ""}
                >
                  <item.icon size={16} /> {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output Layers */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "var(--t-primary)", fontSize: "13px", fontWeight: 700 }}>
              <Layers size={14} /> Production Layers
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { id: "exterior" as const, icon: Camera, label: "Exterior Master" },
                { id: "interior" as const, icon: Box, label: "Interior Focus" },
                { id: "reel" as const, icon: Video, label: "Vertical Reel (9:16)" },
                { id: "walkthrough" as const, icon: Play, label: "4K AI Walkthrough" },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--border)",
                    background: activeTab === item.id ? "var(--accent)" : "var(--surface-1)",
                    color: activeTab === item.id ? "white" : "var(--t-primary)",
                    display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", transition: "all 0.25s", fontSize: "13px", fontWeight: 500, textAlign: "left",
                    boxShadow: activeTab === item.id ? "var(--shadow-accent)" : "none"
                  }}
                >
                  <item.icon size={16} /> {item.label}
                  {activeTab === item.id && (
                    <motion.div layoutId="active-dot" style={{ marginLeft: "auto", width: "6px", height: "6px", background: "white", borderRadius: "50%" }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Area Context */}
          <div style={{ padding: "16px", borderRadius: "14px", background: "var(--accent-dim)", border: "1px solid var(--border-focus)" }} className="glass-subtle">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: "var(--accent)", fontSize: "12px", fontWeight: 700 }}>
              <Map size={14} /> Spatial Intelligence
            </div>
            <p style={{ fontSize: "12px", color: "var(--t-primary)", fontWeight: 500 }}>
              Focus: <span className="gradient-text">{selectedRoom?.name || "Global Architecture"}</span>
            </p>
          </div>

          <button
            disabled={isGenerating}
            onClick={() => handleGenerate(activeTab)}
            className="btn-accent"
            style={{ 
              marginTop: "auto", padding: "16px", borderRadius: "14px", display: "flex", 
              alignItems: "center", justifyContent: "center", gap: "12px", fontWeight: 700,
              boxShadow: "var(--shadow-glow)"
            }}
          >
            {isGenerating ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
            {isGenerating ? "Synthesizing Experience..." : `Generate Cinematic ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        </div>
      </aside>

      {/* Main Studio Viewport */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#050508", position: "relative" }}
            >
              <div className="shimmer" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
              
              <div style={{ zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "600px", width: "100%" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent)" }}
                    />
                  ))}
                </div>
                
                <h3 className="font-display" style={{ fontSize: "24px", color: "white", marginBottom: "40px" }}>
                  Rendering Architectural Intelligence
                </h3>

                <div style={{ width: "100%", background: "var(--surface-1)", borderRadius: "16px", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "var(--shadow-lg)" }}>
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ display: "flex", alignItems: "center", gap: "12px", color: i === logs.length - 1 ? "var(--accent)" : "var(--t-muted)", fontSize: "13px", fontFamily: "var(--font-mono, monospace)" }}
                    >
                      {i === logs.length - 1 ? <Loader2 size={14} className="spin" /> : <Check size={14} color="var(--emerald)" />} 
                      <span style={{ fontWeight: i === logs.length - 1 ? 600 : 400 }}>{log}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="output"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {/* High-Fidelity Viewer */}
              <div style={{ flex: 1, position: "relative", padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", background: "radial-gradient(circle at center, var(--surface-1) 0%, var(--bg) 100%)" }}>
                <div style={{ position: "relative", width: "100%", height: "100%", maxWidth: "1200px", borderRadius: "24px", overflow: "hidden", boxShadow: "var(--shadow-xl)", border: "1px solid var(--border)" }}>
                  <Image
                    src={RENDERS.find(r => r.type === activeTab)?.url || RENDERS[0].url}
                    alt="Cinematic Render"
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                    className="animate-slide-up"
                  />
                  
                  {/* Studio Toolbar Overlay */}
                  <div style={{ position: "absolute", top: "24px", right: "24px", display: "flex", gap: "12px" }}>
                    <button className="btn-icon glass" style={{ color: "white", width: "42px", height: "42px" }}>
                      <Download size={20} />
                    </button>
                    <button className="btn-icon glass" style={{ color: "white", width: "42px", height: "42px" }}>
                      <Settings size={20} />
                    </button>
                  </div>

                  {/* Cinematic Details Overlay */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, padding: "100px 48px 48px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.9))", color: "white"
                  }}>
                    <div className="badge badge-emerald" style={{ marginBottom: "16px", border: "1px solid rgba(50,215,75,0.3)" }}>
                      <Sparkles size={10} /> Real-time Sync Active
                    </div>
                    <h2 className="font-display" style={{ fontSize: "3rem", marginBottom: "12px", letterSpacing: "-0.03em" }}>
                      {RENDERS.find(r => r.type === activeTab)?.label}
                    </h2>
                    <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", maxWidth: "800px", lineHeight: 1.6 }}>
                      {RENDERS.find(r => r.type === activeTab)?.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interaction Intelligence Panel */}
              <div style={{ height: "260px", borderTop: "1px solid var(--border)", display: "flex", background: "var(--surface-0)" }} className="glass">
                {/* Visual Analysis Reasoning */}
                <div style={{ flex: 1, padding: "32px", borderRight: "1px solid var(--border)", overflowY: "auto" }} className="custom-scroll">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", color: "var(--t-primary)", fontSize: "15px", fontWeight: 700 }}>
                    <Sparkles size={18} color="var(--violet)" /> Visual Strategy Intelligence
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--t-muted)", lineHeight: 1.7, maxWidth: "90%" }}>
                    {RENDERS.find(r => r.type === activeTab)?.reasoning}
                  </p>
                  <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
                    {[
                      { label: "Rendering", val: "Path Traced", color: "cyan" },
                      { label: "Samples", val: "4096 SPP", color: "violet" },
                      { label: "Denoising", val: "AI-Enhanced", color: "emerald" },
                    ].map(stat => (
                      <div key={stat.label}>
                        <div style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px", letterSpacing: "0.05em" }}>{stat.label}</div>
                        <div className={`badge badge-${stat.color}`} style={{ padding: "4px 12px" }}>{stat.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Atmospheric Refinement Chat */}
                <div style={{ width: "420px", padding: "32px", background: "var(--surface-1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", color: "var(--t-primary)", fontSize: "15px", fontWeight: 700 }}>
                    <MessageSquare size={18} /> Refine Atmosphere
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", fontSize: "13px", color: "var(--t-muted)", fontStyle: "italic", lineHeight: 1.5 }}>
                      &quot;Adjust the chromatic aberration and increase the bloom on the interior lighting fixtures.&quot;
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={refinement}
                        onChange={(e) => setRefinement(e.target.value)}
                        placeholder="Request specific refinements..."
                        style={{ 
                          width: "100%", padding: "16px 50px 16px 16px", borderRadius: "14px", 
                          background: "var(--surface-0)", border: "1px solid var(--border)", 
                          fontSize: "14px", color: "var(--t-primary)", outline: "none",
                          boxShadow: "var(--shadow-sm)"
                        }}
                      />
                      <button 
                        style={{ 
                          position: "absolute", right: "8px", top: "8px", bottom: "8px", 
                          width: "36px", background: refinement.trim() ? "var(--accent)" : "var(--surface-2)", 
                          color: refinement.trim() ? "white" : "var(--t-muted)", border: "none", 
                          borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", 
                          cursor: refinement.trim() ? "pointer" : "default", transition: "all 0.2s" 
                        }}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
