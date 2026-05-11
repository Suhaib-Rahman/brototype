"use client";
import { motion } from "framer-motion";
import { FileText, Download, CheckCircle2, AlertTriangle, Lightbulb, Shield, TrendingUp, Award, Box } from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useChatStore } from "@/store/useChatStore";
import { useProjectStore } from "@/store/useProjectStore";
import { DEMO_AGENTS } from "@/data/demo-data";

export default function SummaryStage() {
  const { floorPlan } = usePlanStore();
  const { requirements } = useChatStore();
  const { location, analysis } = useProjectStore();

  const plan = floorPlan;
  const score = plan?.plan_score;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "32px 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "4px" }}>Project Summary</h2>
            <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>{location || "Kochi, Kerala"} · {plan?.totalSqft || 2400} sqft · {requirements?.bedrooms || 3}BHK</p>
          </div>
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Download size={14} /> Export PDF
          </button>
        </div>

        {/* Plan Score */}
        {score && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: "28px", borderRadius: "var(--radius-xl)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: `conic-gradient(var(--accent) ${score.total * 3.6}deg, var(--surface-3) 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%", background: "var(--surface-1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span className="font-display" style={{ fontSize: "1.3rem" }}>{score.total}</span>
                </div>
              </div>
              <div>
                <h3 className="font-display" style={{ fontSize: "1.2rem", marginBottom: "2px" }}>Plan Score</h3>
                <p style={{ color: "var(--t-muted)", fontSize: "13px" }}>Scored across 4 dimensions by the Decision Engine</p>
              </div>
              <div className="badge badge-emerald" style={{ marginLeft: "auto" }}>
                <Award size={10} /> {plan?.confidence_label || "High"} Confidence
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {[
                { label: "Space", value: score.space_efficiency, max: 25, color: "#3B82F6" },
                { label: "Cost", value: score.cost_efficiency, max: 25, color: "#10B981" },
                { label: "Climate", value: score.climate_suitability, max: 25, color: "#F59E0B" },
                { label: "Compliance", value: score.compliance_safety, max: 25, color: "#8B5CF6" },
              ].map(d => (
                <div key={d.label} style={{ textAlign: "center" }}>
                  <div className="font-display" style={{ fontSize: "1.4rem", color: d.color }}>{d.value}</div>
                  <div style={{ fontSize: "11px", color: "var(--t-muted)", marginBottom: "6px" }}>{d.label} /{d.max}</div>
                  <div style={{ height: "3px", background: "var(--surface-3)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${(d.value / d.max) * 100}%`, height: "100%", background: d.color, borderRadius: "2px" }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Design Reasoning */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: "24px", borderRadius: "var(--radius-xl)" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Lightbulb size={16} color="var(--amber)" /> Design Reasoning
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
            {floorPlan?.rooms.some(r => r.type === 'corridor') && (
               <div><strong style={{ color: "var(--t-primary)" }}>Path Generation Logic: </strong>A Central Circulation Path (hallway) was automatically generated to optimally separate the Public zone (Living/Kitchen) from the Private zone (Bedrooms/Bathrooms), ensuring high structural accuracy and flawless spatial flow.</div>
            )}
            <div><strong style={{ color: "var(--t-primary)" }}>Concept: </strong>{plan?.design_summary?.concept || "Modern layout optimized for natural lighting and efficient pathing."}</div>
            <div><strong style={{ color: "var(--t-primary)" }}>Zoning: </strong>{plan?.design_summary?.zoning || "Strictly demarcated public and private zones via centralized circulation paths."}</div>
            <div><strong style={{ color: "var(--t-primary)" }}>Target: </strong>{plan?.design_summary?.target_user || "Families prioritizing highly accurate architectural structure."}</div>
          </div>
        </motion.div>

        {/* Spatial Allocation & Dimensions Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ padding: "24px", borderRadius: "var(--radius-xl)" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Box size={16} color="var(--cyan)" /> Spatial Allocation & Dimensions
          </h3>
          <div style={{ background: "var(--surface-1)", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--t-muted)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 500 }}>Space / Zone</th>
                  <th style={{ padding: "12px 16px", fontWeight: 500 }}>Dimensions (W × D)</th>
                  <th style={{ padding: "12px 16px", fontWeight: 500, textAlign: "right" }}>Area (sqft)</th>
                </tr>
              </thead>
              <tbody>
                {floorPlan?.rooms.map((r, i) => (
                  <tr key={r.id} style={{ borderTop: "1px solid var(--border)", color: "var(--t-secondary)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: r.color || "var(--surface-3)" }} />
                        <span style={{ fontWeight: 500, color: "var(--t-primary)" }}>{r.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px" }}>
                      {Math.round(r.realW || 0)}' × {Math.round(r.realH || 0)}'
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "var(--t-primary)" }}>
                      {Math.round(r.sqft || 0)}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ borderTop: "2px solid var(--border)", background: "var(--surface-2)", color: "var(--t-primary)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }} colSpan={2}>Total Built-up Area</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "var(--accent)", fontSize: "14px" }}>
                    {floorPlan?.totalSqft || 0} sqft
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Assumptions & Risks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {plan?.assumptions && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <h4 style={{ fontWeight: 600, marginBottom: "12px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={14} color="var(--accent)" /> Assumptions
              </h4>
              <ul style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.7, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {plan.assumptions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </motion.div>
          )}
          {plan?.risks && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <h4 style={{ fontWeight: 600, marginBottom: "12px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={14} color="var(--amber)" /> Risks
              </h4>
              <ul style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.7, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {plan.risks.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Agent Orchestra */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: "24px", borderRadius: "var(--radius-xl)" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "16px", fontSize: "14px" }}>Multi-Agent Orchestration</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {DEMO_AGENTS.map((agent, i) => (
              <motion.div key={agent.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface-2)" }}>
                <CheckCircle2 size={14} color="var(--emerald)" />
                <span style={{ fontSize: "13px", fontWeight: 600, width: "140px" }}>{agent.name}</span>
                <span style={{ fontSize: "12px", color: "var(--t-muted)", flex: 1 }}>{agent.output}</span>
                <span className="badge badge-emerald" style={{ fontSize: "10px" }}>Done</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
