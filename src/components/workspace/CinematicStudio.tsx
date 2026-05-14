"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Camera, Sparkles, Loader2, Play, Download, Settings,
  Cloud, Sun, Moon, Wind, Map, Video, Layers, Check, MessageSquare, Box
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
        setIsGenerating(false);
        if (type === 'walkthrough' || type === 'reel') {
          setCinematic(true);
        }
      }
    }, 600);
  };

  useEffect(() => {
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)" }}>
      {/* Sidebar Controls */}
      <div style={{ width: "320px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <div className="badge badge-violet" style={{ marginBottom: "8px" }}>Stage 08</div>
          <h2 className="font-display" style={{ fontSize: "20px" }}>Cinematic Studio</h2>
          <p style={{ fontSize: "12px", color: "var(--t-muted)", marginTop: "4px" }}>Generate production-grade architectural experiences.</p>
        </div>

        <div style={{ padding: "20px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Environment Simulation */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--t-primary)", fontSize: "13px", fontWeight: 600 }}>
              <Cloud size={14} /> Environmental Intelligence
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
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
                    padding: "10px", borderRadius: "8px", border: "1px solid var(--border)",
                    background: environment === item.id ? "var(--surface-3)" : "var(--surface-2)",
                    color: environment === item.id ? "var(--cyan)" : "var(--t-muted)",
                    display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s", fontSize: "11px"
                  }}
                >
                  <item.icon size={14} /> {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cinematic Mode Toggle */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--t-primary)", fontSize: "13px", fontWeight: 600 }}>
              <Video size={14} /> Live Cinematic Experience
            </div>
            <button
              onClick={() => setCinematic(!isCinematic)}
              style={{
                width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)",
                background: isCinematic ? "rgba(34, 211, 238, 0.1)" : "var(--surface-2)",
                color: isCinematic ? "var(--cyan)" : "var(--t-muted)",
                display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transition: "all 0.2s", fontSize: "12px", fontWeight: 600
              }}
            >
              {isCinematic ? <Play size={14} fill="currentColor" /> : <Camera size={14} />}
              {isCinematic ? "Stop Cinematic Walkthrough" : "Start Live Walkthrough"}
            </button>
          </div>

          {/* Output Types */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--t-primary)", fontSize: "13px", fontWeight: 600 }}>
              <Layers size={14} /> Cinematic Output Layers
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { id: "exterior" as const, icon: Camera, label: "Exterior Master" },
                { id: "interior" as const, icon: Box, label: "Interior Focus" },
                { id: "reel" as const, icon: Video, label: "Architecture Reel (9:16)" },
                { id: "walkthrough" as const, icon: Play, label: "AI Walkthrough (4K)" },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border)",
                    background: activeTab === item.id ? "var(--accent)" : "var(--surface-2)",
                    color: activeTab === item.id ? "white" : "var(--t-primary)",
                    display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", transition: "all 0.2s", fontSize: "12px", textAlign: "left"
                  }}
                >
                  <item.icon size={16} /> {item.label}
                  {activeTab === item.id && <div style={{ marginLeft: "auto", width: "6px", height: "6px", background: "white", borderRadius: "50%" }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Area Selection Info */}
          <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(34, 211, 238, 0.05)", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--cyan)", fontSize: "12px", fontWeight: 600 }}>
              <Map size={14} /> Area Selection Intelligence
            </div>
            <p style={{ fontSize: "11px", color: "var(--t-muted)", lineHeight: 1.4 }}>
              Current Target: <span style={{ color: "var(--t-primary)", fontWeight: 600 }}>{selectedRoom?.name || "Global Project Architecture"}</span>
            </p>
          </div>

          <button
            disabled={isGenerating}
            onClick={() => handleGenerate(activeTab)}
            className="btn-primary"
            style={{ marginTop: "auto", padding: "14px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontWeight: 600 }}
          >
            {isGenerating ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />}
            {isGenerating ? "Synthesizing Experience..." : `Generate Cinematic ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {isGenerating ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#050508" }}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
              {[0, 1, 2].map(i => <div key={i} className="thinking-dot" style={{ width: "12px", height: "12px", background: "var(--cyan)" }} />)}
            </div>
            <h3 className="font-display" style={{ fontSize: "24px", color: "white" }}>Rendering Architectural Intelligence</h3>
            <div style={{ marginTop: "32px", width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {logs.map((log, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: i === logs.length - 1 ? "var(--cyan)" : "var(--t-muted)", fontSize: "13px", fontFamily: "monospace", animation: "fadeIn 0.3s forwards" }}>
                  {i === logs.length - 1 ? <Loader2 size={12} className="spin" /> : <Check size={12} />} {log}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Gallery / Viewer */}
            <div style={{ flex: 1, position: "relative", padding: "32px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ position: "relative", width: "100%", height: "100%", maxWidth: "1200px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 32px 64px rgba(0,0,0,0.6)", border: "1px solid var(--border)" }}>
                <Image
                  src={RENDERS.find(r => r.type === activeTab)?.url || RENDERS[0].url}
                  alt="Render Output"
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "10px" }}>
                  <button className="btn-icon" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px", borderRadius: "10px", color: "white" }}>
                    <Download size={18} />
                  </button>
                  <button className="btn-icon" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px", borderRadius: "10px", color: "white" }}>
                    <Settings size={18} />
                  </button>
                </div>

                {/* Overlay Info */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, padding: "80px 40px 40px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.95))", color: "white"
                }}>
                  <div className="badge badge-cyan" style={{ marginBottom: "12px" }}>Real-time Sync Active</div>
                  <h2 className="font-display" style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{RENDERS.find(r => r.type === activeTab)?.label}</h2>
                  <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", maxWidth: "800px" }}>{RENDERS.find(r => r.type === activeTab)?.desc}</p>
                </div>
              </div>
            </div>

            {/* Bottom Panels */}
            <div style={{ height: "240px", borderTop: "1px solid var(--border)", display: "flex", background: "var(--bg)" }}>
              {/* Reasoning Intelligence */}
              <div style={{ flex: 1, padding: "24px", borderRight: "1px solid var(--border)", overflowY: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "var(--t-primary)", fontSize: "14px", fontWeight: 600 }}>
                  <Sparkles size={16} color="var(--cyan)" /> Rendering Reasoning Intelligence
                </div>
                <p style={{ fontSize: "14px", color: "var(--t-muted)", lineHeight: 1.6 }}>
                  {RENDERS.find(r => r.type === activeTab)?.reasoning}
                </p>
                <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Global Illumination</div>
                    <div className="badge badge-cyan">Path Traced</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Sample Count</div>
                    <div className="badge badge-violet">2048 Spp</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Denoiser</div>
                    <div className="badge badge-cyan">AI-Enhanced</div>
                  </div>
                </div>
              </div>

              {/* Refinement Interaction */}
              <div style={{ width: "400px", padding: "24px", background: "var(--surface-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "var(--t-primary)", fontSize: "14px", fontWeight: 600 }}>
                  <MessageSquare size={16} /> Refine Visual Atmosphere
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "var(--t-muted)" }}>
                    &quot;Can we make the sunset lighting more dramatic and add some rain reflections to the facade?&quot;
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder="Discuss rendering refinements..."
                      style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", background: "var(--bg)", border: "1px solid var(--border)", fontSize: "13px", color: "var(--t-primary)" }}
                    />
                    <button style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "var(--accent)", color: "white", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                      Refine
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
