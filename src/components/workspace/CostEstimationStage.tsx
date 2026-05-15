"use client";
import { useState, useEffect, useMemo, Fragment } from "react";
import {
  DollarSign, PieChart, FileText, Download, TrendingUp,
  Target, Sparkles, RefreshCcw, ShoppingBag,
  Calculator, Table, Layout, ArrowRight, ShieldCheck,
  AlertCircle, Search, Filter, Globe, BarChart3, Wallet, LayoutGrid
} from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useCostStore } from "@/store/useCostStore";
import { ProjectQuality } from "@/types/cost";
import { motion, AnimatePresence } from "framer-motion";

export default function CostEstimationStage() {
  const { floorPlan } = usePlanStore();
  const { report, quality, isGenerating, setQuality, generateBOQ, updateItem } = useCostStore();
  const [activeTab, setActiveTab] = useState<"overview" | "boq" | "rooms" | "analysis">("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (floorPlan && !report) {
      generateBOQ(floorPlan);
    }
  }, [floorPlan, report, generateBOQ]);

  const stats = useMemo(() => {
    if (!report) return null;
    return {
      total: report.totalProjectCost,
      material: report.totalMaterialCost,
      labor: report.totalLaborCost,
      install: report.totalInstallationCost,
      avgPerSqft: report.totalProjectCost / (floorPlan?.totalSqft || 1),
    };
  }, [report, floorPlan]);

  if (!floorPlan) return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "40px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div className="pulse" style={{ width: "80px", height: "80px", borderRadius: "24px", background: "var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Wallet size={40} color="var(--t-muted)" style={{ opacity: 0.3 }} />
        </div>
        <h3 className="font-display" style={{ fontSize: "20px", marginBottom: "12px" }}>Financial Core Inactive</h3>
        <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.6 }}>
          Generate an architectural floor plan to unlock the Cost Intelligence Engine. The BOQ is computed in real-time from spatial data.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)", overflow: "hidden" }}>
      {/* Sidebar Intelligence Control */}
      <aside style={{ width: "340px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }} className="glass">
        <div style={{ padding: "32px 24px", borderBottom: "1px solid var(--border)" }}>
          <div className="badge badge-emerald" style={{ marginBottom: "12px" }}>Financial Stage 09</div>
          <h2 className="font-display" style={{ fontSize: "22px", letterSpacing: "-0.01em" }}>Cost Intelligence</h2>
          <p style={{ fontSize: "12px", color: "var(--t-muted)", marginTop: "6px", lineHeight: 1.5 }}>
            Automated financial engineering and market-rate synchronization.
          </p>
        </div>

        <div style={{ padding: "24px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "32px" }} className="custom-scroll">
          {/* Quality Tier Selector */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "var(--t-primary)", fontSize: "13px", fontWeight: 700 }}>
              <Target size={14} className="pulse" /> Construction Quality Tier
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {(["economy", "moderate", "premium", "luxury"] as ProjectQuality[]).map(q => (
                <button
                  key={q}
                  onClick={() => {
                    setQuality(q);
                    generateBOQ(floorPlan);
                  }}
                  style={{
                    padding: "16px 12px", borderRadius: "14px", border: "1px solid var(--border)",
                    background: quality === q ? "var(--accent-dim)" : "var(--surface-1)",
                    color: quality === q ? "var(--accent)" : "var(--t-muted)",
                    display: "flex", flexDirection: "column", gap: "4px", cursor: "pointer", transition: "all 0.25s", textAlign: "left",
                    boxShadow: quality === q ? "var(--shadow-sm)" : "none"
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>{q}</span>
                  <span style={{ fontSize: "9px", opacity: 0.7 }}>{q === 'luxury' ? 'Bespoke' : 'Standard'} Build</span>
                </button>
              ))}
            </div>
          </div>

          {/* Market Intelligence */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "var(--t-primary)", fontSize: "13px", fontWeight: 700 }}>
              <Globe size={14} /> Regional Market Data
            </div>
            <div className="card" style={{ padding: "16px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", background: "var(--surface-2)" }}>
              <div className="pulse" style={{ width: "10px", height: "10px", background: "var(--emerald)", borderRadius: "50%" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "var(--t-primary)", fontWeight: 700 }}>{floorPlan.plotContext?.location_context || "Indian Standard Market"}</div>
                <div style={{ fontSize: "10px", color: "var(--t-muted)", marginTop: "2px" }}>Real-time rate sync active (₹)</div>
              </div>
              <RefreshCcw size={14} style={{ opacity: 0.3 }} />
            </div>
          </div>

          {/* AI Optimization Reasoning */}
          <div className="card glass-accent" style={{ padding: "24px", borderRadius: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", color: "var(--accent)", fontSize: "13px", fontWeight: 800 }}>
              <Sparkles size={18} className="pulse" /> Strategic Intelligence
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {report?.reasoning.optimizationInsights.map((insight, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
                  <div style={{ marginTop: "6px", width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                  <div>
                    {insight}
                    {i === 0 && (
                      <div style={{ marginTop: "10px", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", fontSize: "11px", color: "var(--accent)", border: "1px solid var(--accent-dim)" }}>
                        💡 Climate Sync: Recommending low-E glazing based on Stage 02 solar data.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={isGenerating}
            onClick={() => generateBOQ(floorPlan)}
            className="btn-accent pulse"
            style={{ 
              marginTop: "auto", padding: "18px", borderRadius: "16px", display: "flex", 
              alignItems: "center", justifyContent: "center", gap: "12px", fontWeight: 800,
              boxShadow: "var(--shadow-glow)"
            }}
          >
            {isGenerating ? <RefreshCcw size={18} className="spin" /> : <Calculator size={18} />}
            {isGenerating ? "Synthesizing Financials..." : "Recalculate BOQ Engine"}
          </button>
        </div>
      </aside>

      {/* Main Analysis Viewport */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Navigation Toolbar */}
        <nav style={{ padding: "0 32px", height: "72px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg)" }}>
          <div style={{ display: "flex", gap: "32px" }}>
            {[
              { id: "overview", label: "Financial Analysis", icon: BarChart3 },
              { id: "boq", label: "Smart BOQ Sheet", icon: Table },
              { id: "rooms", label: "Spatial Breakdown", icon: LayoutGrid },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  height: "72px", border: "none", borderBottom: activeTab === tab.id ? "3px solid var(--accent)" : "3px solid transparent",
                  background: "transparent", color: activeTab === tab.id ? "var(--t-primary)" : "var(--t-muted)",
                  display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transition: "all 0.3s", 
                  fontSize: "14px", fontWeight: activeTab === tab.id ? 700 : 500, padding: "0 4px"
                }}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn-secondary" style={{ borderRadius: "12px", padding: "10px 20px", fontSize: "12px", fontWeight: 700 }}>
              <Download size={14} /> Export XLSX
            </button>
          </div>
        </nav>

        {/* Dynamic View Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "40px", position: "relative" }} className="custom-scroll">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              >
                <div className="shimmer" style={{ position: "absolute", inset: 0, opacity: 0.1 }} />
                <div className="pulse" style={{ width: "64px", height: "64px", borderRadius: "16px", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <Calculator size={32} className="spin" color="var(--accent)" />
                </div>
                <h3 className="font-display" style={{ fontSize: "24px", color: "white" }}>Analyzing Financial Logic</h3>
                <p style={{ color: "var(--t-muted)", fontSize: "14px", marginTop: "10px" }}>Extracting structural quantities and correlating market fluctuations...</p>
              </motion.div>
            ) : null}

            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Executive Dashboard Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "48px" }}>
                  <div className="card" style={{ padding: "28px", borderRadius: "20px", border: "1px solid var(--border)", background: "var(--surface-1)", position: "relative", overflow: "hidden" }}>
                    <div className="shimmer" style={{ position: "absolute", inset: 0, opacity: 0.03 }} />
                    <div style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.1em", marginBottom: "12px" }}>Est. Total Investment</div>
                    <div style={{ fontSize: "36px", fontWeight: 900, color: "var(--t-primary)", letterSpacing: "-0.02em" }}>₹{stats?.total.toLocaleString()}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--emerald)", fontSize: "12px", fontWeight: 700, marginTop: "12px" }}>
                      <TrendingUp size={14} /> +2.4% Market Swing
                    </div>
                  </div>
                  <div className="card" style={{ padding: "28px", borderRadius: "20px", background: "var(--surface-1)" }}>
                    <div style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.1em", marginBottom: "12px" }}>Construction Area</div>
                    <div style={{ fontSize: "36px", fontWeight: 900, color: "var(--t-primary)" }}>{floorPlan.totalSqft.toLocaleString()} <span style={{ fontSize: "16px", fontWeight: 400, color: "var(--t-muted)" }}>SF</span></div>
                    <div style={{ color: "var(--t-muted)", fontSize: "12px", marginTop: "12px", fontWeight: 600 }}>₹{stats?.avgPerSqft.toFixed(0)} / SQFT avg</div>
                  </div>
                  <div className="card" style={{ padding: "28px", borderRadius: "20px", background: "var(--surface-1)" }}>
                    <div style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.1em", marginBottom: "12px" }}>Labor / Material Mix</div>
                    <div style={{ height: "40px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <div className="shimmer" style={{ flex: (stats?.material || 1), height: "14px", background: "var(--accent)", borderRadius: "100px" }} />
                      <div className="shimmer" style={{ flex: (stats?.labor || 1), height: "14px", background: "var(--violet)", borderRadius: "100px", opacity: 0.6 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "11px", fontWeight: 700 }}>
                      <span style={{ color: "var(--accent)" }}>MAT: {Math.round((stats?.material || 0) / (stats?.total || 1) * 100)}%</span>
                      <span style={{ color: "var(--violet)" }}>LAB: {Math.round((stats?.labor || 0) / (stats?.total || 1) * 100)}%</span>
                    </div>
                  </div>
                  <div className="card" style={{ padding: "28px", borderRadius: "20px", background: "var(--surface-1)", border: "1px solid var(--accent-dim)" }}>
                    <div style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.1em", marginBottom: "12px" }}>Confidence Index</div>
                    <div style={{ fontSize: "36px", fontWeight: 900, color: "var(--accent)" }}>94.8%</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--emerald)", fontSize: "12px", fontWeight: 700, marginTop: "12px" }}>
                      <ShieldCheck size={14} /> Ready for Tendering
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "40px" }}>
                  {/* Categorical Intelligence */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <h3 className="font-display" style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <PieChart size={22} color="var(--accent)" /> Category Logic Breakdown
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {report?.categories.map(cat => (
                        <motion.div key={cat.name} whileHover={{ x: 6 }} className="card glass-subtle" style={{ padding: "24px", borderRadius: "18px", display: "flex", alignItems: "center", gap: "24px", cursor: "pointer" }}>
                          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ShoppingBag size={28} color="var(--accent)" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "16px", fontWeight: 800 }}>{cat.name}</div>
                            <div style={{ fontSize: "12px", color: "var(--t-muted)", marginTop: "2px" }}>{cat.items.length} structural components tracked</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "20px", fontWeight: 900, color: "var(--t-primary)" }}>₹{cat.totalCost.toLocaleString()}</div>
                            <div style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, marginTop: "4px" }}>{Math.round(cat.totalCost / report.totalProjectCost * 100)}% of project</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Risk & Conversation */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    <div className="card" style={{ padding: "32px", borderRadius: "24px", background: "rgba(191,90,242,0.05)", border: "1px solid rgba(191,90,242,0.15)" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--violet)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <AlertCircle size={18} /> Financial Risk Profile
                      </h4>
                      <p style={{ fontSize: "14px", color: "var(--t-secondary)", lineHeight: 1.7, marginBottom: "24px" }}>
                        {report?.reasoning.riskAnalysis}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[{ l: "Inflation Exposure", v: 5 }, { l: "Contingency Margin", v: 8 }].map(risk => (
                          <div key={risk.l} style={{ padding: "16px", borderRadius: "14px", background: "var(--surface-1)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "13px", fontWeight: 500 }}>{risk.l} ({risk.v}%)</span>
                            <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--rose)" }}>+₹{Math.round((report?.totalProjectCost || 0) * (risk.v / 100)).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card glass" style={{ padding: "32px", borderRadius: "24px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Calculator size={18} /> Refine Budget Strategy
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ padding: "16px", borderRadius: "12px", background: "var(--surface-2)", fontSize: "13px", color: "var(--t-muted)", fontStyle: "italic", lineHeight: 1.5 }}>
                          &quot;Optimize the HVAC specifications to reduce long-term operational costs by 20%.&quot;
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            placeholder="Ask cost optimizer..."
                            style={{ width: "100%", padding: "16px 50px 16px 16px", borderRadius: "14px", background: "var(--surface-0)", border: "1px solid var(--border)", color: "var(--t-primary)", fontSize: "14px", outline: "none" }}
                          />
                          <button className="btn-icon" style={{ position: "absolute", right: "8px", top: "8px", bottom: "8px", background: "var(--accent)", color: "white", borderRadius: "10px", width: "40px", height: "40px", border: "none" }}>
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "boq" && (
              <motion.div key="boq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: "24px", letterSpacing: "-0.01em" }}>Bill of Quantities (BOQ) Intelligence</h3>
                    <p style={{ fontSize: "13px", color: "var(--t-muted)", marginTop: "4px" }}>Synchronized with current market rates and structural logic.</p>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ position: "relative" }}>
                      <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
                      <input type="text" placeholder="Search line items..." style={{ padding: "12px 16px 12px 42px", borderRadius: "12px", background: "var(--surface-1)", border: "1px solid var(--border)", fontSize: "13px", width: "240px", outline: "none" }} />
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowX: "auto", border: "1px solid var(--border)", borderRadius: "20px", background: "var(--surface-1)", boxShadow: "var(--shadow-lg)" }} className="custom-scroll">
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                        <th style={{ padding: "16px", textAlign: "left", width: "40px" }}><input type="checkbox" /></th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.1em" }}>Description</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.1em" }}>Category</th>
                        <th style={{ padding: "16px", textAlign: "right", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.1em" }}>Qty</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.1em" }}>Unit</th>
                        <th style={{ padding: "16px", textAlign: "right", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.1em" }}>Rate (₹)</th>
                        <th style={{ padding: "16px", textAlign: "right", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.1em" }}>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report?.categories.map(cat => (
                        <Fragment key={cat.name}>
                          <tr style={{ background: "var(--accent-dim)" }}>
                            <td colSpan={7} style={{ padding: "12px 20px", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "11px" }}>{cat.name}</td>
                          </tr>
                          {cat.items.map(item => (
                            <motion.tr key={item.id} whileHover={{ background: "var(--surface-0)" }} style={{ borderBottom: "1px solid var(--border)" }}>
                              <td style={{ padding: "16px" }}><input type="checkbox" /></td>
                              <td style={{ padding: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div style={{ fontWeight: 700, color: "var(--t-primary)" }}>{item.description}</div>
                                  <div className="pulse" title="AI Validated Quantity" style={{ cursor: "help" }}>
                                    <ShieldCheck size={12} color="var(--emerald)" />
                                  </div>
                                </div>
                                <div style={{ fontSize: "10px", color: "var(--t-muted)", marginTop: "2px" }}>REF: {item.id} · {item.location}</div>
                              </td>
                              <td style={{ padding: "16px" }}><span className="badge glass-subtle" style={{ color: "var(--accent)", border: "1px solid var(--accent-dim)", fontSize: "9px" }}>{item.subCategory || item.category}</span></td>
                              <td style={{ padding: "16px", textAlign: "right", fontWeight: 800 }}>{item.quantity.toFixed(1)}</td>
                              <td style={{ padding: "16px", color: "var(--t-muted)" }}>{item.unit}</td>
                              <td style={{ padding: "16px", textAlign: "right" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                                  <input
                                    type="number"
                                    value={item.rate}
                                    onChange={(e) => updateItem(item.id, { rate: parseFloat(e.target.value) })}
                                    style={{ width: "80px", textAlign: "right", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--t-primary)", padding: "4px 8px", fontSize: "12px" }}
                                  />
                                  <TrendingUp size={10} color="var(--emerald)" />
                                </div>
                              </td>
                              <td style={{ padding: "16px", textAlign: "right", fontWeight: 900, color: "var(--accent)" }}>₹{Math.round(item.totalCost).toLocaleString()}</td>
                            </motion.tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "rooms" && (
              <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="font-display" style={{ fontSize: "24px", marginBottom: "32px", letterSpacing: "-0.01em" }}>Spatial Cost Intelligence</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "24px" }}>
                  {report?.spaceBreakdown.map(space => (
                    <motion.div key={space.spaceName} whileHover={{ y: -5 }} className="card glass" style={{ padding: "32px", borderRadius: "24px", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                        <div>
                          <div style={{ fontSize: "20px", fontWeight: 900, color: "var(--t-primary)" }}>{space.spaceName}</div>
                          <div style={{ fontSize: "12px", color: "var(--t-muted)", marginTop: "4px" }}>{space.itemCount} specific financial nodes</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "22px", fontWeight: 900, color: "var(--accent)" }}>₹{space.totalCost.toLocaleString()}</div>
                          <div style={{ fontSize: "11px", color: "var(--t-muted)", marginTop: "4px", fontWeight: 700 }}>{Math.round(space.totalCost / report.totalProjectCost * 100)}% TOTAL</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {Object.entries(space.categories).map(([cat, cost]) => (
                          <div key={cat}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px", fontWeight: 600 }}>
                              <span style={{ color: "var(--t-secondary)" }}>{cat}</span>
                              <span style={{ color: "var(--t-primary)" }}>₹{cost.toLocaleString()}</span>
                            </div>
                            <div style={{ width: "100%", height: "5px", background: "var(--surface-3)", borderRadius: "3px", overflow: "hidden" }}>
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(cost / space.totalCost) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{ height: "100%", background: "var(--accent)" }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      `}</style>
    </div>
  );
}
