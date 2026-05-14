"use client";
import { useState, useEffect } from "react";
import {
  Users, MessageCircle, Star, MapPin,
  ShieldCheck, Filter, Search, Award,
  CheckCircle, Clock, AlertTriangle,
  Edit3, PenTool, ExternalLink, ChevronRight,
  UserPlus, Calendar, RefreshCcw, Eye
} from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useCollaborationStore } from "@/store/useCollaborationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function CollaborationStage() {
  const { floorPlan } = usePlanStore();
  const { session, selectedArchitect, availableArchitects, startSession, selectArchitect, addFeedback, updateFeedbackStatus, setSessionStatus, signProject } = useCollaborationStore();

  const [viewOverride, setViewOverride] = useState<"marketplace" | "session" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  const activeView = viewOverride || (selectedArchitect ? "session" : "marketplace");

  useEffect(() => {
    if (floorPlan && !session) {
      startSession(floorPlan.id);
    }
  }, [floorPlan, session, startSession]);

  const filteredArchitects = availableArchitects.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!floorPlan) return <div>No project loaded</div>;

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)", overflow: "hidden" }}>
      {/* ── Sidebar: Collaboration Intelligence ────────────────── */}
      <div style={{ width: "320px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, background: "var(--surface-1)" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <div className="badge badge-emerald" style={{ marginBottom: "8px" }}>Stage 10</div>
          <h2 className="font-display" style={{ fontSize: "20px" }}>Architect Collaboration</h2>
          <p style={{ fontSize: "12px", color: "var(--t-muted)", marginTop: "4px" }}>Human intelligence & professional validation.</p>
        </div>

        <div style={{ padding: "20px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Status Tracker */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Collaboration Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { id: "matching", label: "Professional Matching", icon: Search },
                { id: "reviewing", label: "Architectural Review", icon: Eye },
                { id: "refining", label: "Intelligence Refinement", icon: Edit3 },
                { id: "approved", label: "Professional Approval", icon: ShieldCheck },
              ].map((step, i) => {
                const isActive = session?.status === step.id;
                const isDone = ["matching", "consulting", "reviewing", "refining", "approved"].indexOf(session?.status || "") > i;
                return (
                  <div key={step.id} style={{ display: "flex", alignItems: "center", gap: "12px", opacity: isDone || isActive ? 1 : 0.4 }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "50%",
                      background: isDone ? "var(--emerald)" : isActive ? "var(--cyan)" : "var(--surface-3)",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "white"
                    }}>
                      {isDone ? <CheckCircle size={14} /> : <step.icon size={12} />}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400, color: isActive ? "var(--t-primary)" : "var(--t-muted)" }}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Architect Card */}
          {selectedArchitect && (
            <div className="card" style={{ padding: "16px", borderRadius: "12px", background: "var(--surface-2)" }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", fontWeight: 700 }}>
                  {selectedArchitect.name.charAt(4)}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>{selectedArchitect.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--t-muted)" }}>Verified Professional</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn-icon" style={{ flex: 1, fontSize: "11px", padding: "8px" }}><MessageCircle size={14} /> Chat</button>
                <button className="btn-icon" style={{ flex: 1, fontSize: "11px", padding: "8px" }}><Calendar size={14} /> Call</button>
              </div>
            </div>
          )}

          {/* System Sync Intelligence */}
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--emerald)", fontSize: "12px", fontWeight: 600 }}>
              <RefreshCcw size={14} /> Global Sync Active
            </div>
            <p style={{ fontSize: "11px", color: "var(--t-muted)", lineHeight: 1.4 }}>
              All architect modifications are synchronized across Plans, 3D Models, and BOQ estimations in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content: Marketplace or Session ──────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AnimatePresence mode="wait">
          {activeView === "marketplace" ? (
            <motion.div key="market" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflowY: "auto", padding: "40px" }}>
              <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <div style={{ marginBottom: "40px" }}>
                  <h1 className="font-display" style={{ fontSize: "32px", marginBottom: "12px" }}>Professional Architect Matching</h1>
                  <p style={{ color: "var(--t-secondary)", fontSize: "16px" }}>Connect with elite architects who align with your project&apos;s style and technical requirements.</p>
                </div>

                {/* Filters & Search */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
                    <input
                      type="text"
                      placeholder="Search by name, specialization, or style..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: "100%", padding: "14px 16px 14px 48px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: "15px" }}
                    />
                  </div>
                  <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 24px", borderRadius: "12px" }}>
                    <Filter size={18} /> Filters
                  </button>
                </div>

                {/* Architect Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))", gap: "24px" }}>
                  {filteredArchitects.map((arch) => (
                    <motion.div
                      key={arch.id}
                      whileHover={{ y: -4 }}
                      className="card"
                      style={{ padding: "24px", borderRadius: "20px", display: "flex", gap: "24px" }}
                    >
                      <div style={{ width: "100px", height: "100px", borderRadius: "16px", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                        <Users size={40} color="var(--t-muted)" />
                        {arch.verified && (
                          <div style={{ position: "absolute", bottom: "-6px", right: "-6px", background: "var(--cyan)", color: "white", padding: "4px", borderRadius: "50%", boxShadow: "0 4px 10px rgba(34, 211, 238, 0.4)" }}>
                            <ShieldCheck size={12} />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <div>
                            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>{arch.name}</h3>
                            <div style={{ fontSize: "13px", color: "var(--cyan)", fontWeight: 600 }}>{arch.title}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: 700 }}>
                              <Star size={14} fill="var(--amber)" color="var(--amber)" /> {arch.rating}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--t-muted)" }}>{arch.reviewCount} reviews</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px", margin: "16px 0", fontSize: "12px", color: "var(--t-muted)" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={12} /> {arch.locality}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Award size={12} /> {arch.experienceYears}yr Exp</span>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                          {arch.specialization.map(s => (
                            <span key={s} className="badge" style={{ fontSize: "10px" }}>{s}</span>
                          ))}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                          <div>
                            <div style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase" }}>Consultation Fee</div>
                            <div style={{ fontSize: "16px", fontWeight: 700 }}>₹{arch.consultationFee.toLocaleString()}</div>
                          </div>
                          <button
                            onClick={() => {
                              selectArchitect(arch);
                              setViewOverride("session");
                            }}
                            className="btn-primary"
                            style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}
                          >
                            <UserPlus size={16} /> Request Consultation
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Session Header */}
              <div style={{ padding: "24px 40px", borderBottom: "1px solid var(--border)", background: "var(--bg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <button onClick={() => setViewOverride("marketplace")} className="btn-icon" style={{ padding: "8px" }}><ChevronRight size={18} style={{ transform: "rotate(180deg)" }} /></button>
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Collaboration Session</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--t-muted)" }}>
                      <Clock size={12} /> Last activity: 12 minutes ago
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--border)" }} />
                      <span style={{ color: "var(--emerald)", fontWeight: 600 }}>Active Collaboration</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}><RefreshCcw size={16} /> Sync All Systems</button>
                  <button
                    onClick={() => setIsSigning(true)}
                    disabled={session?.isSigned}
                    className="btn-accent"
                    style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}
                  >
                    <PenTool size={16} /> {session?.isSigned ? "Project Approved" : "Sign & Approve Project"}
                  </button>
                </div>
              </div>

              {/* Session Content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "40px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px" }}>
                {/* Left: Professional Review Intelligence */}
                <div>
                  <h3 className="font-display" style={{ fontSize: "22px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <ShieldCheck size={24} color="var(--emerald)" /> Professional Review Intelligence
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {session?.feedback.length === 0 ? (
                      <div className="card" style={{ padding: "40px", textAlign: "center", background: "var(--surface-1)" }}>
                        <Users size={48} style={{ margin: "0 auto 20px", opacity: 0.2 }} />
                        <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Awaiting Initial Review</h4>
                        <p style={{ color: "var(--t-muted)", fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
                          {selectedArchitect?.name} is currently analyzing your project&apos;s technical drawings, compliance status, and BOQ reports.
                        </p>
                      </div>
                    ) : (
                      session?.feedback.map((item) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          key={item.id}
                          className="card"
                          style={{
                            padding: "20px", borderRadius: "16px",
                            borderLeft: `4px solid ${item.severity === 'critical' ? 'var(--rose)' : item.severity === 'high' ? 'var(--amber)' : 'var(--cyan)'}`,
                            background: item.status === 'resolved' ? 'rgba(16, 185, 129, 0.05)' : 'var(--surface-1)'
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span className="badge" style={{ fontSize: "10px", textTransform: "uppercase" }}>{item.category}</span>
                              <span style={{ fontSize: "11px", color: "var(--t-muted)" }}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              {item.status === 'open' ? (
                                <button onClick={() => updateFeedbackStatus(item.id, 'resolved')} style={{ background: "transparent", border: "1px solid var(--emerald)", color: "var(--emerald)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Mark Resolved</button>
                              ) : (
                                <span style={{ color: "var(--emerald)", fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}><CheckCircle size={12} /> Resolved</span>
                              )}
                            </div>
                          </div>
                          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--t-primary)", marginBottom: "16px" }}>{item.content}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <button style={{ background: "transparent", border: "none", color: "var(--cyan)", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", padding: 0 }}>
                              <ExternalLink size={14} /> View Related System
                            </button>
                            <div style={{ display: "flex", gap: "4px" }}>
                              {[...Array(item.severity === 'critical' ? 3 : item.severity === 'high' ? 2 : 1)].map((_, i) => (
                                <AlertTriangle key={i} size={12} color={item.severity === 'critical' ? 'var(--rose)' : 'var(--amber)'} />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right: Collaborative Communication */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div className="card" style={{ padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column", height: "500px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <MessageCircle size={18} color="var(--cyan)" /> Project Discussion
                    </h4>
                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", padding: "10px 0" }}>
                      <div style={{ padding: "12px", background: "var(--surface-2)", borderRadius: "12px 12px 12px 0", maxWidth: "80%", alignSelf: "flex-start" }}>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--cyan)", marginBottom: "4px" }}>{selectedArchitect?.name}</div>
                        <div style={{ fontSize: "13px", color: "var(--t-primary)" }}>I&apos;ve completed the structural review. The cantilever on the north side needs a bit more reinforcement than what the AI initially suggested.</div>
                      </div>
                      <div style={{ padding: "12px", background: "var(--accent)", borderRadius: "12px 12px 0 12px", maxWidth: "80%", alignSelf: "flex-end", color: "white" }}>
                        <div style={{ fontSize: "13px" }}>Understood. Does this affect the BOQ estimation significantly?</div>
                      </div>
                    </div>
                    <div style={{ marginTop: "20px", position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Type a message..."
                        style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", background: "var(--surface-3)", border: "1px solid var(--border)", fontSize: "14px" }}
                      />
                    </div>
                  </div>

                  <div className="card" style={{ padding: "24px", borderRadius: "20px", background: "var(--surface-3)" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Digital Validation Layer</h4>
                    <div style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.6, marginBottom: "20px" }}>
                      Once all professional refinements are complete, the project will be digitally signed by {selectedArchitect?.name} for execution readiness.
                    </div>
                    <button
                      onClick={() => {
                        addFeedback({
                          architectId: selectedArchitect?.id || "",
                          category: "technical",
                          content: "Increase column cross-section in the basement for better load distribution.",
                          severity: "high"
                        });
                      }}
                      className="btn-secondary" style={{ width: "100%", padding: "12px", borderRadius: "10px", fontSize: "13px" }}>
                      Simulate Architect Feedback
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Digital Approval Overlay ─────────────────────────── */}
      <AnimatePresence>
        {isSigning && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(5, 5, 8, 0.9)", backdropFilter: "blur(10px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="card"
              style={{ maxWidth: "500px", width: "100%", padding: "40px", textAlign: "center", borderRadius: "24px" }}
            >
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34, 211, 238, 0.1)", color: "var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <PenTool size={32} />
              </div>
              <h2 className="font-display" style={{ fontSize: "24px", marginBottom: "12px" }}>Professional Project Approval</h2>
              <p style={{ color: "var(--t-muted)", fontSize: "15px", marginBottom: "32px", lineHeight: 1.6 }}>
                By signing this document, Ar. {selectedArchitect?.name} validates the technical accuracy, regulatory compliance, and execution feasibility of the project intelligence package.
              </p>

              <div style={{ height: "160px", background: "var(--surface-2)", border: "1px dashed var(--border)", borderRadius: "12px", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t-muted)", fontSize: "13px" }}>
                [ Digital Signature Pad ]
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setIsSigning(false)} className="btn-secondary" style={{ flex: 1, padding: "14px" }}>Cancel</button>
                <button
                  onClick={() => {
                    signProject("signed_by_architect");
                    setIsSigning(false);
                    setSessionStatus("approved");
                  }}
                  className="btn-primary" style={{ flex: 1, padding: "14px" }}>Authorize & Finish</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
