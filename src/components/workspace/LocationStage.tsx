"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Search, Sun, Wind, Thermometer, ArrowRight, Loader2,
  CheckCircle2, Image as ImageIcon, PenTool, ClipboardList,
  Shield, LayoutGrid
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { useUIStore } from "@/store/useUIStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { DEMO_ANALYSIS } from "@/data/demo-data";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapView"), {
  ssr: false, loading: () => (
    <div style={{ height: "100%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={24} className="spin" style={{ color: "var(--accent)" }} />
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

  // Requirement Intelligence State
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
      showNotification("success", "Site intelligence analyzed.");
    }, 1500);
  }, [searchValue, setAnalyzing, setCoordinates, setLocation, setAnalysis, showNotification]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (location && !location.startsWith("Custom Plot") && searchValue !== location) {
      const timer = setTimeout(() => setSearchValue(location), 0);
      return () => clearTimeout(timer);
    } else if (defaultSearch && !location && searchValue !== defaultSearch) {
      const timer = setTimeout(() => setSearchValue(defaultSearch), 0);
      return () => clearTimeout(timer);
    }
  }, [location, defaultSearch, searchValue]);

  const toggleReq = (id: string) => setRequirements(prev => ({ ...prev, [id]: !prev[id] }));

  const getRequirementChecklist = () => {
    const common = [
      { id: "parking", label: "Parking Requirements", desc: "Automated calculation for residents/visitors" },
      { id: "accessibility", label: "Universal Accessibility", desc: "Compliance with ADA/Local disabled access" },
      { id: "expansion", label: "Future Expansion Zone", desc: "Space allocated for vertical/horizontal growth" }
    ];

    if (projectType.includes("hospital")) return [
      ...common,
      { id: "er", label: "Emergency Circulation", desc: "Segregated ambulance & patient flow" },
      { id: "icu", label: "ICU Requirements", desc: "Controlled environment zoning" },
      { id: "service", label: "Medical Service Access", desc: "Specialized waste & equipment logistics" }
    ];
    if (projectType.includes("school")) return [
      ...common,
      { id: "security", label: "Security Zoning", desc: "Student safety perimeter & controlled entry" },
      { id: "play", label: "Play Area Allocation", desc: "Min 15% open space for physical activity" },
      { id: "labs", label: "Specialized Laboratories", desc: "Ventilation-heavy zones" }
    ];
    if (projectType.includes("airport")) return [
      ...common,
      { id: "terminal", label: "Terminal Flow", desc: "Passenger movement optimization" },
      { id: "baggage", label: "Baggage Systems", desc: "Automated logistics pathing" },
      { id: "security_z", label: "High-Security Segregation", desc: "Sterile zone logic" }
    ];
    return [
      ...common,
      { id: "utility", label: "Utility Spaces", desc: "Laundry, drying, and maintenance zones" },
      { id: "storage", label: "Storage Requirements", desc: "Calculated based on family size/habits" }
    ];
  };

  const checklist = getRequirementChecklist();

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden", background: "var(--bg)" }}>

      {/* ── Main Workspace — Interactive Stage ────────────────── */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>

        {/* Stage Sub-Tabs */}
        <div style={{
          position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1000,
          background: "var(--glass)", backdropFilter: "blur(20px)", padding: "4px", borderRadius: "100px",
          display: "flex", gap: "4px", border: "1px solid var(--border-hover)", boxShadow: "var(--shadow-lg)"
        }}>
          {[
            { id: "map", label: "Physical Site", icon: MapPin },
            { id: "sketches", label: "Site Sketches", icon: PenTool },
            { id: "requirements", label: "Functional Brief", icon: ClipboardList },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubStage(tab.id as SubStage)}
              style={{
                padding: "8px 20px", borderRadius: "100px", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600,
                background: activeSubStage === tab.id ? "var(--t-primary)" : "transparent",
                color: activeSubStage === tab.id ? "var(--bg)" : "var(--t-secondary)",
                transition: "all 0.2s"
              }}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <AnimatePresence mode="wait">
            {activeSubStage === "map" && (
              <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: "100%", position: "relative" }}>
                <div style={{ position: "absolute", top: "80px", left: "20px", right: "20px", zIndex: 1000, display: "flex", gap: "8px", maxWidth: "400px" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
                    <input className="input-field" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Enter Site Pincode/Location..." style={{ paddingLeft: "36px", background: "var(--glass)" }} />
                  </div>
                  <button className="btn-accent" onClick={handleAnalyze} disabled={isAnalyzing} style={{ padding: "8px 16px" }}>
                    {isAnalyzing ? <Loader2 size={14} className="spin" /> : <MapPin size={14} />}
                  </button>
                </div>
                <MapComponent />
              </motion.div>
            )}

            {activeSubStage === "sketches" && (
              <motion.div key="sketches" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ height: "100%", padding: "100px 40px 40px", display: "flex", gap: "24px" }}>
                <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed var(--border)", gap: "16px", borderRadius: "24px" }}>
                  <ImageIcon size={48} color="var(--t-muted)" />
                  <div style={{ textAlign: "center" }}>
                    <h3 className="font-display" style={{ fontSize: "18px", marginBottom: "8px" }}>Upload Site Sketches</h3>
                    <p style={{ fontSize: "13px", color: "var(--t-muted)" }}>Support for hand-drawn layouts, survey maps, and site photos.</p>
                  </div>
                  <button className="btn-secondary" style={{ borderRadius: "100px" }}>Browse Files</button>
                </div>
                <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid var(--accent-dim)", background: "var(--accent-glow)", gap: "16px", borderRadius: "24px" }}>
                  <PenTool size={48} color="var(--accent)" />
                  <div style={{ textAlign: "center" }}>
                    <h3 className="font-display" style={{ fontSize: "18px", marginBottom: "8px", color: "var(--accent)" }}>AI Site Sketcher</h3>
                    <p style={{ fontSize: "13px", color: "var(--t-muted)" }}>Generate a survey-grade site sketch based on requirements.</p>
                  </div>
                  <button className="btn-accent" style={{ borderRadius: "100px" }}>Generate with AI</button>
                </div>
              </motion.div>
            )}

            {activeSubStage === "requirements" && (
              <motion.div key="requirements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ height: "100%", padding: "100px 40px 40px", overflowY: "auto" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                  <div style={{ marginBottom: "32px" }}>
                    <h2 className="font-display" style={{ fontSize: "24px", marginBottom: "8px" }}>Requirement Intelligence Validation</h2>
                    <p style={{ fontSize: "14px", color: "var(--t-muted)" }}>Our AI has analyzed your project type ({projectType}) and suggests validating these critical functional requirements.</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {checklist.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleReq(item.id)}
                        className="card"
                        style={{
                          padding: "20px", borderRadius: "16px", cursor: "pointer",
                          background: requirements[item.id] ? "var(--accent-glow)" : "var(--surface-1)",
                          borderColor: requirements[item.id] ? "var(--accent)" : "var(--border)",
                          transition: "all 0.2s", display: "flex", alignItems: "center", gap: "20px"
                        }}
                      >
                        <div style={{
                          width: "24px", height: "24px", borderRadius: "6px", border: "2px solid var(--border)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: requirements[item.id] ? "var(--accent)" : "transparent",
                          borderColor: requirements[item.id] ? "var(--accent)" : "var(--border)"
                        }}>
                          {requirements[item.id] && <CheckCircle2 size={16} color="white" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "15px", fontWeight: 600, color: requirements[item.id] ? "var(--t-primary)" : "var(--t-secondary)" }}>{item.label}</div>
                          <div style={{ fontSize: "12px", color: "var(--t-muted)" }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card" style={{ marginTop: "32px", padding: "20px", borderRadius: "16px", background: "var(--surface-2)", border: "1px dashed var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--accent)" }}>
                      <Loader2 size={16} className="spin" />
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>AI is validating your functional brief...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Side Panel — Site Intelligence Profile ────────────── */}
      <div style={{
        width: isMobile ? "100%" : "400px",
        borderLeft: isMobile ? "none" : "1px solid var(--border)",
        background: "var(--surface-1)",
        overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "24px",
        flexShrink: 0,
      }}>
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: "12px" }}>
            <LayoutGrid size={10} /> Site Intelligence Profile
          </div>
          <h2 className="font-display" style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
            {location || "Site Analysis"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.6 }}>
            Process Stage 02: Transforming raw site data into architectural intelligence.
          </p>
        </div>

        {analyzed ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { icon: Sun, label: "Solar Exposure", value: "High", color: "var(--amber)" },
                { icon: Wind, label: "Wind Pattern", value: "SW Breeze", color: "var(--cyan)" },
                { icon: Thermometer, label: "Thermal Zone", value: "Tropical", color: "var(--rose)" },
                { icon: MapPin, label: "Topography", value: "Flat", color: "var(--emerald)" },
              ].map((ins, i) => (
                <div key={i} className="card" style={{ padding: "16px", borderRadius: "12px" }}>
                  <ins.icon size={16} color={ins.color} style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "11px", color: "var(--t-muted)" }}>{ins.label}</div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>{ins.value}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: "20px", borderRadius: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={14} color="var(--emerald)" /> Regulatory Compliance
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--t-muted)" }}>Max Floor Area Ratio</span>
                  <span style={{ fontWeight: 600 }}>2.25</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--t-muted)" }}>Ground Coverage</span>
                  <span style={{ fontWeight: 600 }}>60%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "var(--t-muted)" }}>Road Width</span>
                  <span style={{ fontWeight: 600 }}>12m (Primary)</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "20px", borderRadius: "16px", background: "var(--glass)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent)" }}>
                <CheckCircle2 size={14} /> Intelligence Ready
              </div>
              <p style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
                Site intelligence and functional requirements are synchronized. Ready for Stage 03: CAD Planning.
              </p>
            </div>

            <button className="btn-accent" onClick={onNext} style={{ width: "100%", padding: "16px", fontSize: "15px", marginTop: "auto", borderRadius: "100px" }}>
              Lock Intelligence & Continue <ArrowRight size={16} />
            </button>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px", opacity: 0.5, border: "1px dashed var(--border)", borderRadius: "24px" }}>
            <MapPin size={48} color="var(--t-muted)" />
            <p style={{ fontSize: "14px", color: "var(--t-muted)", textAlign: "center", padding: "0 40px" }}>
              Pin your location or upload a site sketch to generate the Intelligence Profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
