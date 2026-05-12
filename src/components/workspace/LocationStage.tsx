"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Sun, Wind, Thermometer, ArrowRight, Loader2, CheckCircle2, CloudRain, Sparkles, Map } from "lucide-react";
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

export default function LocationStage({ onNext }: { onNext: () => void }) {
  const { location, setLocation, setCoordinates, setAnalysis, analysis, isAnalyzing, setAnalyzing, coordinates } = useProjectStore();
  const { showNotification } = useUIStore();
  const { data } = useOnboardingStore();

  const defaultSearch = [data.property.location.city, data.property.location.pincode].filter(Boolean).join(", ");
  const [searchValue, setSearchValue] = useState(defaultSearch || location || "Kochi, Kerala");
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    if (location && !location.startsWith("Custom Plot")) {
      setSearchValue(location);
    } else if (defaultSearch) {
      setSearchValue(defaultSearch);
    }
  }, [location, defaultSearch]);

  // Auto-trace location based on collected onboarding data
  useEffect(() => {
    if (defaultSearch && !analyzed && !isAnalyzing && searchValue === defaultSearch) {
      handleAnalyze();
    }
  }, [defaultSearch, searchValue, analyzed]);

  const handleAnalyze = async () => {
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
      const currentState = useProjectStore.getState();
      const locName = currentState.location || demo.location;
      const coords = currentState.coordinates;

      const lat = coords?.lat || 9.9312;
      const isNorthernHemisphere = lat > 0;
      const isTropical = Math.abs(lat) < 23.5;

      const generatedClimate = isTropical
        ? "Tropical climate. High humidity. Prioritise cross-ventilation and sun shading."
        : "Temperate climate. Distinct seasons. Prioritise thermal insulation and heating efficiency.";

      const generatedAuthority = locName !== "Kochi, Kerala" && locName && !locName.startsWith("Custom")
        ? `${locName.split(',')[0]} Planning Authority`
        : demo.zoningRules.authority;

      setAnalysis({
        ...demo,
        location: locName,
        climate: generatedClimate,
        sunPath: isNorthernHemisphere ? "East → West (S tilt)" : "East → West (N tilt)",
        zoningRules: {
          ...demo.zoningRules,
          authority: generatedAuthority,
        }
      });
      setAnalyzing(false);
      setAnalyzed(true);
      showNotification("success", "Location analysed successfully");
    }, 1500);
  };


  const insights = analysis ? [
    { icon: Sun, label: "Sun Path", value: analysis.sunPath, color: "#F59E0B" },
    { icon: Thermometer, label: "Climate", value: analysis.climate.includes("Tropical") ? "Tropical" : "Temperate", color: "#F43F5E" },
    { icon: CloudRain, label: "Rainfall", value: analysis.climate.includes("Tropical") ? "High (Monsoon)" : "Moderate", color: "#22D3EE" },
    { icon: Wind, label: "Wind", value: analysis.windDirection, color: "#3B82F6" },
  ] : [];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden" }}>
      {/* Map Section */}
      <div style={{ flex: 1, position: "relative", minHeight: isMobile ? "300px" : "auto" }}>
        {/* Search Overlay */}
        <div style={{
          position: "absolute", top: isMobile ? "10px" : "20px", left: isMobile ? "10px" : "20px", right: isMobile ? "10px" : "20px", zIndex: 1000,
          display: "flex", gap: "8px",
        }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
            <input
              className="input-field"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search location..."
              style={{ paddingLeft: "36px", background: "var(--glass)", backdropFilter: "blur(20px)", border: "1px solid var(--border-hover)", fontSize: "13px" }}
            />
          </div>
          <button className="btn-accent" onClick={handleAnalyze} disabled={isAnalyzing} style={{ padding: "8px 16px", flexShrink: 0, fontSize: "13px" }}>
            {isAnalyzing ? <Loader2 size={14} className="spin" /> : <><MapPin size={14} /><span className="mobile-hidden"> Analyse</span></>}
          </button>
        </div>

        <MapComponent />
      </div>

      {/* Right Panel — Location Intelligence */}
      <div style={{
        width: isMobile ? "100%" : "360px", 
        borderLeft: isMobile ? "none" : "1px solid var(--border)",
        borderTop: isMobile ? "1px solid var(--border)" : "none",
        background: "var(--surface-1)",
        overflowY: "auto", padding: isMobile ? "20px" : "24px", display: "flex", flexDirection: "column", gap: "16px",
        flexShrink: 0,
      }}>
        <div>
          <div className="badge badge-blue" style={{ marginBottom: "8px" }}>
            <MapPin size={10} /> Location Intelligence
          </div>
          <h2 className="font-display" style={{ fontSize: "1.2rem", marginBottom: "4px" }}>
            {analyzed ? "Kochi, Kerala" : "Select Location"}
          </h2>
          <p style={{ fontSize: "12px", color: "var(--t-muted)" }}>
            {analyzed ? "9.9312° N, 76.2673° E" : "Pin your plot location to begin."}
          </p>
        </div>

        {analyzed && analysis && (
          <>
            {/* Climate Insights */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {insights.map((ins, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                  style={{ padding: "10px", borderRadius: "8px" }}
                >
                  <ins.icon size={14} color={ins.color} style={{ marginBottom: "6px" }} />
                  <div style={{ fontSize: "10px", color: "var(--t-muted)" }}>{ins.label}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600 }}>{ins.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Building Regs Card */}
            <div className="card" style={{ padding: "16px", borderRadius: "12px", fontSize: "12px" }}>
              <div style={{ fontWeight: 600, marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={12} color="var(--emerald)" /> Building Rules
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Max FAR</span><span style={{ fontWeight: 600 }}>{analysis.zoningRules.maxFAR}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Coverage</span><span style={{ fontWeight: 600 }}>{analysis.zoningRules.maxCoverage}%</span>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button className="btn-primary" onClick={onNext} style={{ width: "100%", padding: "12px", fontSize: "14px", marginTop: "auto" }}>
              Continue <ArrowRight size={14} />
            </button>
          </>
        )}

        {!analyzed && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", opacity: 0.5 }}>
            <MapPin size={48} color="var(--t-muted)" />
            <p style={{ fontSize: "14px", color: "var(--t-muted)", textAlign: "center" }}>
              Search and analyse a location to see climate data, building regulations, and AI insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
