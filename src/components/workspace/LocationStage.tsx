"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Search, Sun, Wind, Thermometer, ArrowRight, Loader2,
  CheckCircle2, Image as ImageIcon, PenTool, ClipboardList,
  Shield, LayoutGrid, Sparkles
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { useUIStore } from "@/store/useUIStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { DEMO_ANALYSIS } from "@/data/demo-data";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapView"), {
  ssr: false, loading: () => (
    <div style={{ height: "100%", background: "var(--surface-0)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
      <div className="shimmer" style={{ width: "100%", height: "100%", position: "absolute", opacity: 0.1 }} />
      <div className="pulse" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MapPin size={24} color="var(--accent)" />
      </div>
      <span style={{ fontSize: "13px", color: "var(--t-muted)", fontWeight: 500 }}>Initializing Satellite Sync...</span>
    </div>
  )
});

type SubStage = "map" | "sketches" | "requirements";

export default function LocationStage({ onNext }: { onNext: () => void }) {
  const { location, setLocation, setCoordinates, setAnalysis, isAnalyzing, setAnalyzing } = useProjectStore();
  const { showNotification } = useUIStore();
  const { data } = useOnboardingStore();

  const [activeSubStage, setActiveSubStage] = useState<SubStage>("map");
  const defaultSearch = [data?.property?.location?.city, data?.property?.location?.pincode].filter(Boolean).join(", ");
  const [searchValue, setSearchValue] = useState(defaultSearch || location || "Kochi, Kerala");
  const [analyzed, setAnalyzed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const projectType = (data?.property as Record<string, unknown>)?.type?.toString().toLowerCase() || "residential";
  const [requirements, setRequirements] = useState<Record<string, boolean>>({});

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCoordinates({ lat, lng });
        const nameParts = data[0].display_name.split(',');
        const shortName = nameParts.length > 1 ? `${nameParts[0].trim()}, ${nameParts[1].trim()}` : nameParts[0];
        setLocation(shortName);
        setSearchValue(shortName);
      } else {
        setLocation(searchValue);
      }
    } catch (e) {
      console.error(e);
      setLocation(searchValue);
    }

    setTimeout(() => {
      const demo = DEMO_ANALYSIS.kochi;
      setAnalysis({
        ...demo,
        location: useProjectStore.getState().location || demo.location,
        climate: "Tropical climate. Prioritize cross-ventilation.",
      });
      setAnalyzing(false);
      setAnalyzed(true);
      showNotification("success", "Site intelligence profiles generated.");
    }, 1500);
  }, [searchValue, setAnalyzing, setCoordinates, setLocation, setAnalysis, showNotification]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleReq = (id: string) => setRequirements(prev => ({ ...prev, [id]: !prev[id] }));

  const getRequirementChecklist = () => {
    const common = [
      { id: "parking", label: "Parking Requirements", desc: "Automated calculation for residents/visitors" },
      { id: "accessibility", label: "Universal Accessibility", desc: "Compliance with ADA/Local disabled access" },
      { id: "expansion", label: "Future Expansion Zone", desc: "Space allocated for vertical/horizontal growth" }
    ];

    if (projectType.includes("hospital")) return [...common, { id: "er", label: "Emergency Circulation", desc: "Segregated flow" }, { id: "icu", label: "ICU Requirements", desc: "Controlled environment" }];
    return [...common, { id: "utility", label: "Utility Spaces", desc: "Maintenance zones" }, { id: "storage", label: "Storage Capacity", desc: "Calculated based on family size" }];
  };

  const checklist = getRequirementChecklist();

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden", background: "var(--bg)" }}>
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
        
        {/* Floating Controls */}
        <div style={{
          position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 1000,
          background: "var(--glass)", backdropFilter: "blur(24px)", padding: "5px", borderRadius: "100px",
          display: "flex", gap: "5px", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)"
        }}>
          {[
            { id: "map", label: "Site Location", icon: MapPin },
            { id: "sketches", label: "Site Sketches", icon: PenTool },
            { id: "requirements", label: "Functional Brief", icon: ClipboardList },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubStage(tab.id as SubStage)}
              style={{
                padding: "10px 24px", borderRadius: "100px", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700,
                background: activeSubStage === tab.id ? "var(--t-primary)" : "transparent",
                color: activeSubStage === tab.id ? "var(--bg)" : "var(--t-secondary)",
                transition: "all 0.3s var(--ease-out)"
              }}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <AnimatePresence mode="wait">
            {activeSubStage === "map" && (
              <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: "100%", position: "relative" }}>
                <div style={{ position: "absolute", top: "100px", left: "32px", zIndex: 1000, display: "flex", gap: "12px", width: "420px", maxWidth: "90vw" }}>
                  <div className="glass" style={{ flex: 1, position: "relative", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-xl)" }}>
                    <Search size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
                    <input 
                      className="input-field" 
                      value={searchValue} 
                      onChange={(e) => setSearchValue(e.target.value)} 
                      placeholder="Enter Site Address / Coordinates..." 
                      style={{ paddingLeft: "48px", height: "54px", background: "transparent", border: "none", fontSize: "14px" }} 
                    />
                  </div>
                  <button className="btn-accent pulse" onClick={handleAnalyze} disabled={isAnalyzing} style={{ width: "54px", height: "54px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isAnalyzing ? <Loader2 size={20} className="spin" /> : <MapPin size={20} />}
                  </button>
                </div>
                <MapComponent />
              </motion.div>
            )}

            {activeSubStage === "sketches" && (
              <motion.div key="sketches" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ height: "100%", padding: "120px 40px 60px", display: "flex", gap: "32px" }}>
                <div className="card glass" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed var(--border)", gap: "24px", borderRadius: "32px" }}>
                  <div className="pulse" style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ImageIcon size={32} color="var(--t-muted)" />
                  </div>
                  <div style={{ textAlign: "center", maxWidth: "300px" }}>
                    <h3 className="font-display" style={{ fontSize: "20px", marginBottom: "12px" }}>Upload Site Data</h3>
                    <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.6 }}>Import survey maps, terrain data, or hand-drawn constraints.</p>
                  </div>
                  <button className="btn-secondary" style={{ borderRadius: "100px", padding: "12px 32px" }}>Select Files</button>
                </div>
                <div className="card glass-accent" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid var(--accent-dim)", gap: "24px", borderRadius: "32px" }}>
                  <div className="pulse" style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PenTool size={32} color="var(--accent)" />
                  </div>
                  <div style={{ textAlign: "center", maxWidth: "300px" }}>
                    <h3 className="font-display" style={{ fontSize: "20px", marginBottom: "12px", color: "var(--t-primary)" }}>AI Assisted Sketching</h3>
                    <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.6 }}>Describe your plot boundaries and let AI generate the technical survey.</p>
                  </div>
                  <button className="btn-accent" style={{ borderRadius: "100px", padding: "12px 32px", boxShadow: "var(--shadow-glow)" }}>Initialize AI Draft</button>
                </div>
              </motion.div>
            )}

            {activeSubStage === "requirements" && (
              <motion.div key="requirements" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ height: "100%", padding: "120px 40px 60px", overflowY: "auto" }} className="custom-scroll">
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                  <div style={{ marginBottom: "48px", textAlign: "center" }}>
                    <div className="badge badge-emerald" style={{ marginBottom: "16px" }}>Intelligence Sync Active</div>
                    <h2 className="font-display" style={{ fontSize: "32px", marginBottom: "12px", letterSpacing: "-0.03em" }}>Functional Intelligence Brief</h2>
                    <p style={{ fontSize: "15px", color: "var(--t-muted)", maxWidth: "600px", margin: "0 auto" }}>Review the automatically synthesized requirements based on your project profile.</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {checklist.map(item => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleReq(item.id)}
                        className="card glass"
                        style={{
                          padding: "24px", borderRadius: "20px", cursor: "pointer",
                          background: requirements[item.id] ? "var(--accent-dim)" : "var(--surface-1)",
                          borderColor: requirements[item.id] ? "var(--accent)" : "var(--border)",
                          display: "flex", alignItems: "center", gap: "24px"
                        }}
                      >
                        <div className="pulse" style={{
                          width: "28px", height: "28px", borderRadius: "8px", border: "2px solid var(--border)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: requirements[item.id] ? "var(--accent)" : "transparent",
                          borderColor: requirements[item.id] ? "var(--accent)" : "var(--border)"
                        }}>
                          {requirements[item.id] && <CheckCircle2 size={18} color="white" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--t-primary)" }}>{item.label}</div>
                          <div style={{ fontSize: "13px", color: "var(--t-muted)", marginTop: "4px" }}>{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Side Intelligence Profile */}
      <aside style={{ width: "400px", background: "var(--surface-1)", borderLeft: "1px solid var(--border)", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "32px", flexShrink: 0 }} className="glass">
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: "16px" }}>
            <Sparkles size={12} /> Site Intelligence Profile
          </div>
          <h2 className="font-display" style={{ fontSize: "24px", letterSpacing: "-0.01em" }}>{location || "Unidentified Site"}</h2>
          <p style={{ fontSize: "13px", color: "var(--t-muted)", marginTop: "8px", lineHeight: 1.6 }}>Stage 02: Correlating geographic constraints with architectural intent.</p>
        </div>

        {analyzed ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { icon: Sun, label: "Solar", value: "High", color: "var(--amber)" },
                { icon: Wind, label: "Wind", value: "SW Breeze", color: "var(--cyan)" },
                { icon: Thermometer, label: "Thermal", value: "Tropical", color: "var(--rose)" },
                { icon: MapPin, label: "Terrain", value: "Flat", color: "var(--emerald)" },
              ].map((ins, i) => (
                <div key={i} className="card glass-subtle" style={{ padding: "16px", borderRadius: "14px" }}>
                  <ins.icon size={16} color={ins.color} style={{ marginBottom: "10px" }} />
                  <div style={{ fontSize: "10px", color: "var(--t-muted)", fontWeight: 700, textTransform: "uppercase" }}>{ins.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>{ins.value}</div>
                </div>
              ))}
            </div>

            <div className="card glass-subtle" style={{ padding: "24px", borderRadius: "20px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Shield size={16} color="var(--emerald)" /> Regulatory Sync
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[{ l: "Max FAR", v: "2.25" }, { l: "Ground Coverage", v: "60%" }, { l: "Min Road Width", v: "12.0m" }].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--t-muted)" }}>{r.l}</span>
                    <span style={{ fontWeight: 700 }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onNext} className="btn-accent pulse" style={{ width: "100%", padding: "18px", borderRadius: "100px", marginTop: "auto", fontWeight: 800, fontSize: "15px", boxShadow: "var(--shadow-glow)" }}>
              Synchronize Site <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", border: "1px dashed var(--border)", borderRadius: "32px", opacity: 0.6 }}>
            <div className="pulse" style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={32} color="var(--t-muted)" />
            </div>
            <p style={{ fontSize: "14px", color: "var(--t-muted)", textAlign: "center", padding: "0 40px", lineHeight: 1.6 }}> Pin your site location to initialize the <br/>Intelligence Profile generator. </p>
          </div>
        )}
      </aside>
      
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      `}</style>
    </div>
  );
}
