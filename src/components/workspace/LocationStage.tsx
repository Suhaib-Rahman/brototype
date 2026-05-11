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

  return (
    <div style={{ height: "100%", display: "flex" }}>
      {/* Map Section */}
      <div style={{ flex: 1, position: "relative" }}>
        {/* Search Overlay */}
        <div style={{
          position: "absolute", top: "20px", left: "20px", right: "20px", zIndex: 1000,
          display: "flex", gap: "8px",
        }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
            <input
              className="input-field"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search location, pincode, or coordinates..."
              style={{ paddingLeft: "40px", background: "var(--glass)", backdropFilter: "blur(20px)", border: "1px solid var(--border-hover)" }}
            />
          </div>
          <button className="btn-accent" onClick={handleAnalyze} disabled={isAnalyzing} style={{ padding: "12px 24px", flexShrink: 0 }}>
            {isAnalyzing ? <Loader2 size={16} className="spin" /> : <><MapPin size={14} /> Analyse</>}
          </button>
        </div>

        <MapComponent />
      </div>

      {/* Right Panel — Location Intelligence */}
      <div style={{
        width: "360px", borderLeft: "1px solid var(--border)", background: "var(--surface-1)",
        overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px",
        flexShrink: 0,
      }}>
        <div>
          <div className="badge badge-blue" style={{ marginBottom: "12px" }}>
            <MapPin size={10} /> Location Intelligence
          </div>
          <h2 className="font-display" style={{ fontSize: "1.4rem", marginBottom: "4px" }}>
            {analyzed ? "Kochi, Kerala" : "Select Location"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--t-muted)" }}>
            {analyzed ? "9.9312° N, 76.2673° E · Elevation: 0–10m" : "Pin your plot location on the map to begin analysis."}
          </p>
        </div>

        {analyzed && analysis && (
          <>
            {/* Climate Insights */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {insights.map((ins, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card"
                  style={{ padding: "14px", borderRadius: "var(--radius-md)" }}
                >
                  <ins.icon size={16} color={ins.color} style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "11px", color: "var(--t-muted)", marginBottom: "2px" }}>{ins.label}</div>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{ins.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Zoning Rules */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={14} color="var(--emerald)" /> Building Regulations
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--t-secondary)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Authority</span><span style={{ fontWeight: 600, color: "var(--t-primary)" }}>{analysis.zoningRules.authority}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Max FAR</span><span style={{ fontWeight: 600, color: "var(--t-primary)" }}>{analysis.zoningRules.maxFAR}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Coverage</span><span style={{ fontWeight: 600, color: "var(--t-primary)" }}>{analysis.zoningRules.maxCoverage}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Setbacks (F/S/R)</span><span style={{ fontWeight: 600, color: "var(--t-primary)" }}>{analysis.zoningRules.frontSetback}/{analysis.zoningRules.sideSetback}/{analysis.zoningRules.rearSetback}m</span>
                </div>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{
              padding: "16px", borderRadius: "var(--radius-md)",
              background: "var(--gradient-glow)", border: "1px solid rgba(59,130,246,0.15)",
            }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <Sparkles size={14} color="var(--cyan)" style={{ marginTop: "2px", flexShrink: 0 }} />
                <div style={{ fontSize: "13px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--t-primary)" }}>AI Insight: </strong>
                  {analysis.climate.includes("Tropical")
                    ? "High humidity climate requires maximised cross-ventilation. Recommend raised plinth (600mm+) for monsoon protection with south-east kitchen orientation."
                    : "Temperate climate suggests maximising south-facing glazing for passive solar heating and high-grade thermal insulation on external walls."}
                </div>
              </div>
            </motion.div>

            {/* Land Sketch Upload */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{
              padding: "20px", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px",
              cursor: "pointer", background: "var(--surface-1)"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--surface-1)"}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                <Map size={20} color="var(--t-primary)" />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Upload Land Sketch</div>
                <div style={{ fontSize: "12px", color: "var(--t-muted)" }}>PNG, JPG, or PDF (Max 5MB)</div>
              </div>
            </motion.div>

            {/* Continue Button */}
            <button className="btn-primary" onClick={onNext} style={{ width: "100%", padding: "14px" }}>
              Continue to Requirements <ArrowRight size={16} />
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
