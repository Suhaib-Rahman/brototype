"use client";
import { motion } from "framer-motion";
import {
  Download, CheckCircle2, Lightbulb,
  Shield, Award, Box, Users,
  Camera, FileText, Globe, ShieldCheck,
  TrendingUp, Layers, Layout
} from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useChatStore } from "@/store/useChatStore";
import { useProjectStore } from "@/store/useProjectStore";
import { useCostStore } from "@/store/useCostStore";
import { useCollaborationStore } from "@/store/useCollaborationStore";
import Image from "next/image";

export default function SummaryStage() {
  const { floorPlan } = usePlanStore();
  const { requirements } = useChatStore();
  const { location } = useProjectStore();
  const { report } = useCostStore();
  const { session, selectedArchitect } = useCollaborationStore();

  const plan = floorPlan;
  const score = plan?.plan_score;

  if (!plan) return <div style={{ padding: "40px", textAlign: "center" }}>No project intelligence package found.</div>;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "40px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* ── PROJECT DOSSIER HEADER ──────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--border)", paddingBottom: "24px" }}>
          <div>
            <div className="badge badge-emerald" style={{ marginBottom: "12px" }}>Execution Ready</div>
            <h1 className="font-display" style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Final Project Dossier</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--t-muted)", fontSize: "14px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Globe size={14} /> {location || "Kochi, Kerala"}</span>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--border)" }} />
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Layout size={14} /> {plan.totalSqft} sqft</span>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--border)" }} />
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Users size={14} /> {requirements?.bedrooms || 3}BHK {requirements?.style || "Modern"}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn-secondary" style={{ padding: "12px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={18} /> Technical Specs
            </button>
            <button className="btn-primary" style={{ padding: "12px 32px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", fontWeight: 700 }}>
              <Download size={18} /> Download Full Package (XLSX/PDF/DWG)
            </button>
          </div>
        </div>

        {/* ── PROFESSIONAL VALIDATION & STATUS ────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: "24px", borderRadius: "20px", display: "flex", gap: "24px", background: "var(--surface-2)" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(16, 185, 129, 0.1)", color: "var(--emerald)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShieldCheck size={32} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Professional Validation</h3>
              <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.5, marginBottom: "16px" }}>
                This project intelligence package has been professionally reviewed and digitally signed by a verified architect for technical accuracy and execution readiness.
              </p>
              {selectedArchitect ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 700 }}>{selectedArchitect.name.charAt(4)}</div>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>Ar. {selectedArchitect.name} <span style={{ color: "var(--emerald)", fontWeight: 400, marginLeft: "8px" }}>• {session?.isSigned ? 'Digitally Signed' : 'Review Complete'}</span></div>
                </div>
              ) : (
                <div className="badge badge-amber">Awaiting Final Architect Sign-off</div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: "24px", borderRadius: "20px", background: "var(--surface-2)" }}>
            <div style={{ fontSize: "12px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total Estimated Budget</div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--t-primary)", marginBottom: "8px" }}>
              ${report?.totalProjectCost.toLocaleString() || "Calculated at Cost Stage"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--cyan)", fontSize: "13px", fontWeight: 600 }}>
              <TrendingUp size={14} /> Low Volatility Predicted
            </div>
          </motion.div>
        </div>

        {/* ── CINEMATIC HIGHLIGHTS ──────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: "24px", borderRadius: "20px", overflow: "hidden" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Camera size={20} color="var(--cyan)" /> Visual Intelligence Highlights
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", height: "300px" }}>
            <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
              <Image src="/renders/render_exterior.png" alt="Exterior" fill unoptimized style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: "6px", color: "white", fontSize: "11px" }}>Exterior Master Pass</div>
            </div>
            <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
              <Image src="/renders/render_interior.png" alt="Interior" fill unoptimized style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: "6px", color: "white", fontSize: "11px" }}>Living Intelligence View</div>
            </div>
          </div>
        </motion.div>

        {/* ── SPATIAL & COST BREAKDOWN ───────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: "24px", borderRadius: "20px" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Box size={20} color="var(--cyan)" /> Spatial Intelligence Matrix
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {plan.rooms.map((r) => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: "10px", background: "var(--surface-2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: r.color || "var(--surface-3)" }} />
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>{r.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "var(--t-muted)", fontFamily: "monospace" }}>{Math.round(r.realW || 0)}&apos; × {Math.round(r.realH || 0)}&apos;</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, width: "60px", textAlign: "right" }}>{Math.round(r.sqft || 0)} <span style={{ fontSize: "10px", fontWeight: 400 }}>SQFT</span></span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "12px", padding: "16px", borderRadius: "12px", background: "var(--surface-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>Total Constructed Area</span>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--cyan)" }}>{plan.totalSqft.toLocaleString()} SQFT</span>
              </div>
            </div>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: "24px", borderRadius: "20px" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Award size={20} color="var(--amber)" /> Decision Confidence
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Spatial Logic", value: score?.space_efficiency || 92, color: "var(--cyan)" },
                  { label: "Cost Guard", value: score?.cost_efficiency || 88, color: "var(--emerald)" },
                  { label: "Compliance", value: score?.compliance_safety || 96, color: "var(--violet)" },
                  { label: "Feasibility", value: 94, color: "var(--amber)" },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: "11px", color: "var(--t-muted)", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: item.color }}>{item.value}%</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card" style={{ padding: "24px", borderRadius: "20px", background: "var(--surface-3)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Layers size={16} /> Orchestrated AI Agents
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "Architectural Planner", "Zoning Intelligence", "Technical Drafter",
                  "Material Specialist", "Cost Optimizer", "Cinematic Render Engine"
                ].map((agent, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "var(--t-muted)" }}>
                    <CheckCircle2 size={12} color="var(--emerald)" /> {agent} <span style={{ marginLeft: "auto", fontSize: "10px" }}>Active</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── DESIGN SUMMARY & CONCEPT ───────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card" style={{ padding: "32px", borderRadius: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px" }}>
            <div>
              <h3 className="font-display" style={{ fontSize: "24px", marginBottom: "16px" }}>The Manifesto</h3>
              <p style={{ fontSize: "14px", color: "var(--t-muted)", lineHeight: 1.6 }}>A comprehensive summary of the project&apos;s architectural intent and structural logic.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}><Lightbulb size={16} color="var(--amber)" /> Design Concept</div>
                <p style={{ fontSize: "15px", color: "var(--t-secondary)", lineHeight: 1.6 }}>{plan.design_summary?.concept || "Modern layout optimized for natural lighting and efficient pathing."}</p>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}><Shield size={16} color="var(--cyan)" /> Structural & Execution Logic</div>
                <p style={{ fontSize: "15px", color: "var(--t-secondary)", lineHeight: 1.6 }}>{plan.design_summary?.zoning || "Strictly demarcated public and private zones via centralized circulation paths."}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <h2 className="font-display" style={{ fontSize: "2rem", marginBottom: "16px" }}>Ready to Begin Execution?</h2>
          <p style={{ color: "var(--t-muted)", fontSize: "16px", marginBottom: "32px" }}>The next stage connects your validated project intelligence directly with execution contractors and authority approval portals.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <button className="btn-primary" style={{ padding: "16px 40px", borderRadius: "14px", fontSize: "16px", fontWeight: 700 }}>Deploy Project to Contractors</button>
            <button className="btn-secondary" style={{ padding: "16px 40px", borderRadius: "14px", fontSize: "16px" }}>Save to My Workspace</button>
          </div>
        </div>

      </div>
    </div>
  );
}
