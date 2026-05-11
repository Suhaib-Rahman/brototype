"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useChatStore } from "@/store/useChatStore";

const TIERS = [
  { id: "economy", name: "Economy", desc: "Functional & buildable", pricePerSqft: 1800, quality: "Fly ash bricks · TMT Fe415 · Emulsion paint", longevity: "25–30 yrs", color: "#64748b", badge: null },
  { id: "standard", name: "Standard", desc: "Most popular choice", pricePerSqft: 2200, quality: "AAC blocks · Fe500D · Vitrified tiles · Aluminium", longevity: "35–40 yrs", color: "#3B82F6", badge: "Popular" },
  { id: "premium", name: "Premium", desc: "High durability, smart home", pricePerSqft: 2800, quality: "Porotherm · Fe500D · Italian marble · Smart wiring", longevity: "50–60 yrs", color: "#22D3EE", badge: "Recommended" },
  { id: "luxury", name: "Luxury", desc: "World-class materials", pricePerSqft: 4000, quality: "Imported stone · German fixtures · Full automation", longevity: "70+ yrs", color: "#8B5CF6", badge: null },
];

export default function CostStage() {
  const { floorPlan } = usePlanStore();
  const { requirements } = useChatStore();
  const [selectedTier, setSelectedTier] = useState("premium");
  const sqft = floorPlan?.totalSqft || requirements?.plotSqft || 2400;
  const activeTier = TIERS.find(t => t.id === selectedTier) || TIERS[2];
  const totalCost = (sqft * activeTier.pricePerSqft);

  const formatINR = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "32px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Header */}
        <div>
          <h2 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "4px" }}>Cost Estimation</h2>
          <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>Calculated for {sqft.toLocaleString()} sqft · {requirements?.bedrooms || 3}BHK · {requirements?.style || "Modern"}</p>
        </div>

        {/* AI Insight */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: "16px 20px", borderRadius: "var(--radius-md)",
          background: "var(--gradient-glow)", border: "1px solid rgba(59,130,246,0.15)",
          display: "flex", gap: "10px", alignItems: "flex-start",
        }}>
          <Sparkles size={16} color="var(--cyan)" style={{ marginTop: "2px", flexShrink: 0 }} />
          <span style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--t-secondary)" }}>
            <strong style={{ color: "var(--t-primary)" }}>AI Cost Logic: </strong>
            {floorPlan?.rooms.filter(r => r.type === 'bathroom').length && floorPlan.rooms.filter(r => r.type === 'bathroom').length > 2 
              ? `We detected ${floorPlan.rooms.filter(r => r.type === 'bathroom').length} wet areas in your 3D layout. Upgrading to Premium is recommended for advanced waterproofing and plumbing durability.`
              : floorPlan?.rooms.some(r => r.type === 'garden') 
              ? `Your architectural layout includes a Courtyard. The Premium tier automatically allocates allowances for automated irrigation and premium landscaping materials.`
              : `Upgrading from Standard to Premium increases overall structural longevity by ~30% with only a ~27% cost increase. Recommended for long-term value.`}
          </span>
        </motion.div>

        {/* Tier Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
          {TIERS.map((tier, i) => {
            const cost = sqft * tier.pricePerSqft;
            const isActive = selectedTier === tier.id;
            return (
              <motion.button
                key={tier.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedTier(tier.id)}
                className="card"
                style={{
                  textAlign: "left", padding: "24px", cursor: "pointer", position: "relative",
                  background: isActive ? "var(--t-primary)" : "var(--surface-1)",
                  color: isActive ? "var(--bg)" : "var(--t-primary)",
                  borderColor: isActive ? "transparent" : "var(--border)",
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                }}
              >
                {tier.badge && (
                  <div style={{
                    position: "absolute", top: "16px", right: "16px",
                    background: isActive ? "var(--bg)" : tier.color,
                    color: isActive ? "var(--t-primary)" : "white",
                    fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "var(--radius-full)",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>{tier.badge}</div>
                )}
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>{tier.name}</div>
                <div style={{ fontSize: "12px", color: isActive ? "rgba(0,0,0,0.6)" : "var(--t-muted)", marginBottom: "20px" }}>{tier.desc}</div>
                <div className="font-display" style={{ fontSize: "2rem", marginBottom: "4px" }}>{formatINR(cost)}</div>
                <div style={{ fontSize: "12px", color: isActive ? "rgba(0,0,0,0.5)" : "var(--t-muted)", marginBottom: "16px" }}>₹{tier.pricePerSqft.toLocaleString()}/sqft</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: isActive ? "rgba(0,0,0,0.6)" : "var(--t-muted)" }}>
                  <Clock size={12} /> {tier.longevity}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected tier details */}
        <div className="card" style={{ padding: "28px", borderRadius: "var(--radius-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <h3 className="font-display" style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{activeTier.name} Tier Summary</h3>
              <p style={{ fontSize: "13px", color: "var(--t-muted)" }}>Calculated exactly for your {sqft.toLocaleString()} sqft 3D topology</p>
            </div>
            <div className="font-display" style={{ fontSize: "2.2rem", color: "var(--accent)" }}>{formatINR(totalCost)}</div>
          </div>
          <div style={{ fontSize: "13px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--t-primary)" }}>Materials: </strong>{activeTier.quality}
          </div>

          {/* Breakdown bars */}
          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { cat: "Structure & Civil", pct: floorPlan?.rooms.some(r => r.type === 'garden') ? 38 : 42 },
              { cat: "Finishing & Interiors", pct: (floorPlan?.rooms.filter(r => r.type === 'bathroom').length || 0) > 2 ? 32 : 28 },
              ...(floorPlan?.rooms.some(r => r.type === 'garden') ? [{ cat: "Landscaping", pct: 6 }] : []),
              { cat: "Labour", pct: 18 },
              { cat: "Overheads", pct: 10 },
            ].map((item) => (
              <div key={item.cat}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "12px" }}>
                  <span style={{ color: "var(--t-secondary)" }}>{item.cat}</span>
                  <span style={{ fontWeight: 600 }}>{formatINR(totalCost * item.pct / 100)}</span>
                </div>
                <div style={{ height: "4px", background: "var(--surface-3)", borderRadius: "2px", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ height: "100%", background: activeTier.color, borderRadius: "2px" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
