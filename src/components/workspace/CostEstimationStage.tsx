"use client";
import { useState, useEffect, useMemo } from "react";
import {
  DollarSign, PieChart, FileText, Download, TrendingUp,
  Target, Sparkles, RefreshCcw, ShoppingBag,
  Calculator, Table, Layout, ArrowRight, ShieldCheck,
  AlertCircle, Search, Filter, Globe
} from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useCostStore } from "@/store/useCostStore";
import { ProjectQuality } from "@/types/cost";
import { motion, AnimatePresence } from "framer-motion";

export default function CostEstimationStage() {
  const { floorPlan } = usePlanStore();
  const { report, quality, isGenerating, setQuality, generateBOQ, updateItem } = useCostStore();
  const [activeTab, setActiveTab] = useState<"overview" | "boq" | "rooms" | "analysis">("overview");
  const [_search, _setSearch] = useState("");

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

  if (!floorPlan) return <div>No plan loaded</div>;

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)", overflow: "hidden" }}>
      {/* Sidebar - Control Intelligence */}
      <div style={{ width: "320px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, background: "var(--surface-1)" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <div className="badge badge-cyan" style={{ marginBottom: "8px" }}>Stage 09</div>
          <h2 className="font-display" style={{ fontSize: "20px" }}>Cost Intelligence</h2>
          <p style={{ fontSize: "12px", color: "var(--t-muted)", marginTop: "4px" }}>Financial engineering & BOQ synchronization.</p>
        </div>

        <div style={{ padding: "20px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Quality Tier Selection */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--t-primary)", fontSize: "13px", fontWeight: 600 }}>
              <Target size={14} /> Quality Specification Tier
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {(["economy", "moderate", "premium", "luxury"] as ProjectQuality[]).map(q => (
                <button
                  key={q}
                  onClick={() => {
                    setQuality(q);
                    generateBOQ(floorPlan);
                  }}
                  style={{
                    padding: "12px", borderRadius: "10px", border: "1px solid var(--border)",
                    background: quality === q ? "var(--surface-3)" : "var(--surface-2)",
                    color: quality === q ? "var(--cyan)" : "var(--t-muted)",
                    display: "flex", flexDirection: "column", gap: "4px", cursor: "pointer", transition: "all 0.2s", textAlign: "left"
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{q}</span>
                  <span style={{ fontSize: "9px", opacity: 0.7 }}>{q === 'luxury' ? 'Concierge' : 'Standard'} Build</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Context */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--t-primary)", fontSize: "13px", fontWeight: 600 }}>
              <Globe size={14} /> Market Context
            </div>
            <div style={{ padding: "12px", borderRadius: "10px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", background: "var(--green)", borderRadius: "50%" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "var(--t-primary)", fontWeight: 500 }}>{floorPlan.plotContext?.location_context || "Global Market"}</div>
                <div style={{ fontSize: "10px", color: "var(--t-muted)" }}>Live Rate Synchronization Active</div>
              </div>
              <RefreshCcw size={12} style={{ opacity: 0.5 }} />
            </div>
          </div>

          {/* AI Optimization Reasoning */}
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(34, 211, 238, 0.05)", border: "1px solid rgba(34, 211, 238, 0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--cyan)", fontSize: "12px", fontWeight: 600 }}>
              <Sparkles size={14} /> Budget Optimization Logic
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {report?.reasoning.optimizationInsights.map((insight, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", fontSize: "11px", color: "var(--t-muted)", lineHeight: 1.4 }}>
                  <div style={{ marginTop: "3px", width: "4px", height: "4px", borderRadius: "50%", background: "var(--cyan)", flexShrink: 0 }} />
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={isGenerating}
            onClick={() => generateBOQ(floorPlan)}
            className="btn-primary"
            style={{ marginTop: "auto", padding: "14px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontWeight: 600 }}
          >
            {isGenerating ? <RefreshCcw size={16} className="spin" /> : <Calculator size={16} />}
            {isGenerating ? "Recalculating Quantities..." : "Recalculate BOQ"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Stage Header Toolbar */}
        <div style={{ padding: "0 24px", height: "64px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg)" }}>
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { id: "overview", label: "Financial Overview", icon: Layout },
              { id: "boq", label: "Editable BOQ Sheet", icon: Table },
              { id: "rooms", label: "Space Breakdown", icon: Layout },
              { id: "analysis", label: "Market Analysis", icon: TrendingUp },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "boq" | "rooms" | "analysis")}
                style={{
                  height: "64px", border: "none", borderBottom: activeTab === tab.id ? "2px solid var(--cyan)" : "2px solid transparent",
                  background: "transparent", color: activeTab === tab.id ? "var(--cyan)" : "var(--t-muted)",
                  display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "all 0.2s", fontSize: "13px", fontWeight: activeTab === tab.id ? 600 : 500, padding: "0 4px"
                }}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-icon" style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--t-primary)", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Download size={14} /> Export Excel (XLSX)
            </button>
            <button className="btn-icon" style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--t-primary)", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={14} /> View Report
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px", position: "relative" }}>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ position: "absolute", inset: 0, background: "rgba(5, 5, 8, 0.8)", backdropFilter: "blur(4px)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
            >
              <div className="spin" style={{ width: "40px", height: "40px", border: "3px solid var(--cyan)", borderTopColor: "transparent", borderRadius: "50%", marginBottom: "20px" }} />
              <h3 className="font-display" style={{ fontSize: "20px" }}>Synchronizing Financial Intelligence</h3>
              <p style={{ color: "var(--t-muted)", fontSize: "14px", marginTop: "8px" }}>Extracting quantities from 3D model and mapping market rates...</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                {/* Executive Summary Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "40px" }}>
                  <div style={{ padding: "24px", borderRadius: "16px", background: "var(--surface-2)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.05 }}><DollarSign size={120} /></div>
                    <div style={{ fontSize: "12px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total Est. Budget</div>
                    <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--t-primary)" }}>${stats?.total.toLocaleString()}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--green)", fontSize: "11px", marginTop: "8px" }}>
                      <TrendingUp size={12} /> Live Market Rate
                    </div>
                  </div>
                  <div style={{ padding: "24px", borderRadius: "16px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "12px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Construction Area</div>
                    <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--t-primary)" }}>{floorPlan.totalSqft.toLocaleString()} <span style={{ fontSize: "14px", fontWeight: 400 }}>SQFT</span></div>
                    <div style={{ color: "var(--t-muted)", fontSize: "11px", marginTop: "8px" }}>${stats?.avgPerSqft.toFixed(2)} / SQFT</div>
                  </div>
                  <div style={{ padding: "24px", borderRadius: "16px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "12px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Material / Labor Split</div>
                    <div style={{ height: "40px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ flex: (stats?.material || 1), height: "12px", background: "var(--cyan)", borderRadius: "6px" }} />
                      <div style={{ flex: (stats?.labor || 1), height: "12px", background: "var(--violet)", borderRadius: "6px" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11px" }}>
                      <span style={{ color: "var(--cyan)" }}>Mat: {Math.round((stats?.material || 0) / (stats?.total || 1) * 100)}%</span>
                      <span style={{ color: "var(--violet)" }}>Lab: {Math.round((stats?.labor || 0) / (stats?.total || 1) * 100)}%</span>
                    </div>
                  </div>
                  <div style={{ padding: "24px", borderRadius: "16px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "12px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Confidence Score</div>
                    <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--cyan)" }}>94%</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--t-muted)", fontSize: "11px", marginTop: "8px" }}>
                      <ShieldCheck size={12} color="var(--green)" /> Execution Ready
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px" }}>
                  {/* Category Breakdown */}
                  <div>
                    <h3 className="font-display" style={{ fontSize: "20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <PieChart size={20} color="var(--cyan)" /> Category Intelligence Breakdown
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {report?.categories.map(cat => (
                        <div key={cat.name} style={{ padding: "20px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "20px" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "rgba(34, 211, 238, 0.1)", color: "var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ShoppingBag size={24} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "15px", fontWeight: 600 }}>{cat.name}</div>
                            <div style={{ fontSize: "12px", color: "var(--t-muted)" }}>{cat.items.length} items estimated</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "18px", fontWeight: 700 }}>${cat.totalCost.toLocaleString()}</div>
                            <div style={{ fontSize: "11px", color: "var(--t-muted)" }}>{Math.round(cat.totalCost / report.totalProjectCost * 100)}% of budget</div>
                          </div>
                          <ArrowRight size={16} color="var(--t-muted)" style={{ opacity: 0.3 }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Risk & Optimization */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ padding: "24px", borderRadius: "16px", background: "rgba(167, 139, 250, 0.05)", border: "1px solid rgba(167, 139, 250, 0.2)" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--violet)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <AlertCircle size={16} /> Risk Analysis Intelligence
                      </h4>
                      <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.6, marginBottom: "20px" }}>
                        {report?.reasoning.riskAnalysis}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ padding: "12px", borderRadius: "8px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px" }}>Inflation Buffer (5%)</span>
                          <span style={{ fontSize: "12px", fontWeight: 600 }}>+${Math.round((report?.totalProjectCost || 0) * 0.05).toLocaleString()}</span>
                        </div>
                        <div style={{ padding: "12px", borderRadius: "8px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px" }}>Contingency Fund (8%)</span>
                          <span style={{ fontSize: "12px", fontWeight: 600 }}>+${Math.round((report?.totalProjectCost || 0) * 0.08).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: "24px", borderRadius: "16px", background: "var(--surface-3)", border: "1px solid var(--border)" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--t-primary)", marginBottom: "16px" }}>Financial Decisions Interaction</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ padding: "12px", borderRadius: "8px", background: "var(--bg)", border: "1px solid var(--border)", fontSize: "12px", color: "var(--t-muted)" }}>
                          &quot;How can we reduce the flooring cost by 15% without switching to economy grade?&quot;
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            placeholder="Ask cost optimizer..."
                            style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", background: "var(--bg)", border: "1px solid var(--border)", fontSize: "13px" }}
                          />
                          <button style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "var(--cyan)", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", fontWeight: 600 }}>Ask</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "boq" && (
              <motion.div key="boq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 className="font-display" style={{ fontSize: "20px" }}>Detailed Bill of Quantities (BOQ)</h3>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ position: "relative" }}>
                      <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
                      <input type="text" placeholder="Search items..." style={{ padding: "8px 12px 8px 32px", borderRadius: "6px", background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: "12px" }} />
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "6px", background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: "12px" }}>
                      <Filter size={14} /> Filter Categories
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, overflowX: "auto", border: "1px solid var(--border)", borderRadius: "12px", background: "var(--surface-1)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                        <th style={{ padding: "12px", textAlign: "left", width: "40px" }}><input type="checkbox" /></th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Description</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
                        <th style={{ padding: "12px", textAlign: "right" }}>Qty</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Unit</th>
                        <th style={{ padding: "12px", textAlign: "right" }}>Rate</th>
                        <th style={{ padding: "12px", textAlign: "right" }}>Labor</th>
                        <th style={{ padding: "12px", textAlign: "right" }}>Total</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Space</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report?.categories.map(cat => (
                        <Fragment key={cat.name}>
                          <tr style={{ background: "rgba(34, 211, 238, 0.05)" }}>
                            <td colSpan={9} style={{ padding: "10px 16px", fontWeight: 700, color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "1px", fontSize: "10px" }}>{cat.name}</td>
                          </tr>
                          {cat.items.map(item => (
                            <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                              <td style={{ padding: "12px" }}><input type="checkbox" /></td>
                              <td style={{ padding: "12px" }}>
                                <div style={{ fontWeight: 500 }}>{item.description}</div>
                                <div style={{ fontSize: "10px", color: "var(--t-muted)" }}>ID: {item.id}</div>
                              </td>
                              <td style={{ padding: "12px" }}><span className="badge">{item.subCategory || item.category}</span></td>
                              <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{item.quantity.toFixed(1)}</td>
                              <td style={{ padding: "12px" }}>{item.unit}</td>
                              <td style={{ padding: "12px", textAlign: "right" }}>
                                <input
                                  type="number"
                                  value={item.rate}
                                  onChange={(e) => updateItem(item.id, { rate: parseFloat(e.target.value) })}
                                  style={{ width: "80px", textAlign: "right", background: "transparent", border: "1px solid transparent", borderBottom: "1px solid var(--border)", color: "var(--t-primary)" }}
                                />
                              </td>
                              <td style={{ padding: "12px", textAlign: "right" }}>${item.laborRate.toFixed(0)}</td>
                              <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "var(--cyan)" }}>${Math.round(item.totalCost).toLocaleString()}</td>
                              <td style={{ padding: "12px" }}>{item.location}</td>
                            </tr>
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
                <h3 className="font-display" style={{ fontSize: "20px", marginBottom: "20px" }}>Space-Wise Cost Intelligence</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
                  {report?.spaceBreakdown.map(space => (
                    <div key={space.spaceName} style={{ padding: "24px", borderRadius: "16px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                        <div>
                          <div style={{ fontSize: "18px", fontWeight: 700 }}>{space.spaceName}</div>
                          <div style={{ fontSize: "12px", color: "var(--t-muted)" }}>{space.itemCount} estimation components</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--cyan)" }}>${space.totalCost.toLocaleString()}</div>
                          <div style={{ fontSize: "11px", color: "var(--t-muted)" }}>{Math.round(space.totalCost / report.totalProjectCost * 100)}% of project</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {Object.entries(space.categories).map(([cat, cost]) => (
                          <div key={cat}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                              <span>{cat}</span>
                              <span style={{ fontWeight: 600 }}>${cost.toLocaleString()}</span>
                            </div>
                            <div style={{ width: "100%", height: "4px", background: "var(--surface-3)", borderRadius: "2px", overflow: "hidden" }}>
                              <div style={{ width: `${(cost / space.totalCost) * 100}%`, height: "100%", background: "var(--cyan)" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Fragment({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
