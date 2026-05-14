"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, Sparkles, TrendingUp, Lightbulb, ChevronDown, ChevronUp, Award, Bot, User, Send, Loader2 } from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useChatStore } from "@/store/useChatStore";
import { useState, useRef, useEffect } from "react";
import { DEMO_AGENTS } from "@/data/demo-data";
import { FloorPlan } from "@/types/plan";

function CollapsibleCard({ title, icon: Icon, iconColor, children, defaultOpen = true }: {
  title: string; icon: typeof Shield; iconColor: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card" style={{ borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: "8px", width: "100%",
        padding: "14px 16px", background: "transparent", border: "none",
        cursor: "pointer", color: "var(--t-primary)", fontSize: "13px", fontWeight: 600,
      }}>
        <Icon size={14} color={iconColor} />
        {title}
        <div style={{ marginLeft: "auto" }}>{open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</div>
      </button>
      {open && <div style={{ padding: "0 16px 14px" }}>{children}</div>}
    </div>
  );
}

type TabId = "overview" | "planning" | "copilot";

export default function IntelligencePanel() {
  const { floorPlan, selectedRoom } = usePlanStore();
  const { copilotMessages, addCopilotMessage, copilotTyping, setCopilotTyping } = useChatStore();
  
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const plan = floorPlan as FloorPlan | null;
  const score = plan?.plan_score;

  useEffect(() => {
    if (activeTab === "copilot") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [copilotMessages, copilotTyping, activeTab]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || copilotTyping) return;
    
    const text = inputText;
    setInputText("");
    addCopilotMessage({ role: "user", content: text });
    setCopilotTyping(true);

    try {
      const response = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "copilot",
          messages: [...copilotMessages, { role: "user", content: text }],
          projectContext: { 
            floorPlan: floorPlan,
            selectedRoom: selectedRoom
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to connect to Architectural Intelligence");
      }

      setCopilotTyping(false);
      addCopilotMessage({ role: "assistant", content: data.reply });
    } catch (error: unknown) {
      setCopilotTyping(false);
      const errorMsg = error instanceof Error && error.message.includes("expired") 
        ? "🚨 API Connection Error: Your Gemini API key has expired. Please update .env.local with a fresh key to resume Copilot services."
        : `Connection Error: ${error instanceof Error ? error.message : "Unknown error"}`;
      
      addCopilotMessage({ 
        role: "assistant", 
        content: errorMsg 
      });
    }
  };

  const handleSmartSuggestion = (text: string) => {
    setInputText(text);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      
      {/* Header & Tabs */}
      <div style={{ padding: "16px 16px 0", borderBottom: "1px solid var(--border)", background: "var(--surface-1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div className="badge badge-cyan" style={{ display: "inline-flex" }}>
            <Sparkles size={10} /> Planning Intelligence
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ 
              width: "8px", height: "8px", borderRadius: "50%", 
              background: "var(--emerald)",
              boxShadow: "0 0 8px var(--emerald)"
            }} />
            <span style={{ fontSize: "10px", color: "var(--t-muted)", fontWeight: 500 }}>
              Live Analysis
            </span>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { id: "overview" as const, label: "Overview" },
            { id: "planning" as const, label: "Exact Plan" },
            { id: "copilot" as const, label: "Copilot" }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: "8px 2px", fontSize: "12px", fontWeight: 600, background: "transparent", border: "none", 
                borderBottom: activeTab === tab.id ? "2px solid var(--t-primary)" : "2px solid transparent",
                color: activeTab === tab.id ? "var(--t-primary)" : "var(--t-muted)", cursor: "pointer", transition: "all 0.2s"
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <AnimatePresence mode="wait">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              
              <div className="card" style={{ padding: "20px", borderRadius: "var(--radius-md)", textAlign: "center", background: "var(--surface-1)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
                   <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                     <Sparkles size={12} color="white" />
                   </div>
                   <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--t-primary)" }}>Lifestyle Intelligence Profile</span>
                </div>
                
                {score ? (
                  <div style={{
                    width: "84px", height: "84px", borderRadius: "50%", margin: "0 auto 12px",
                    background: `conic-gradient(var(--accent) ${score.total * 3.6}deg, var(--surface-3) 0deg)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 20px rgba(0,113,227,0.15)"
                  }}>
                    <div style={{ width: "66px", height: "66px", borderRadius: "50%", background: "var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      <span className="font-display" style={{ fontSize: "1.5rem", lineHeight: 1 }}>{score.total}</span>
                      <span style={{ fontSize: "9px", color: "var(--t-muted)" }}>IQ Score</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
                    <Loader2 size={24} className="spin" color="var(--accent)" />
                    <span style={{ fontSize: "11px", color: "var(--t-muted)" }}>Synthesizing behavior...</span>
                  </div>
                )}

                <div className="badge badge-emerald" style={{ fontSize: "10px", marginTop: "4px" }}>
                  <Award size={9} /> High Fidelity · Human Centric
                </div>

                {/* Score bars */}
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { label: "Space", value: score?.space_efficiency || 82, color: "var(--accent)" },
                    { label: "Cost", value: score?.cost_efficiency || 74, color: "var(--emerald)" },
                    { label: "Lifestyle", value: score?.climate_suitability || 95, color: "var(--amber)" },
                    { label: "Safety", value: score?.compliance_safety || 88, color: "var(--violet)" },
                  ].map(d => (
                    <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "10px", color: "var(--t-muted)", width: "52px", textAlign: "left", fontWeight: 600 }}>{d.label}</span>
                      <div style={{ flex: 1, height: "4px", background: "var(--surface-3)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: `${d.value}%`, height: "100%", background: d.color, borderRadius: "2px", transition: "width 1s var(--ease-out)" }} />
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 700, width: "24px", color: "var(--t-primary)" }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRoom && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="card" style={{ padding: "16px", borderRadius: "var(--radius-md)", borderColor: "rgba(34,211,238,0.2)" }}>
                  <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "6px", color: "var(--cyan)" }}>{selectedRoom.name}</div>
                  {selectedRoom.sqft && <div style={{ fontSize: "11px", color: "var(--t-muted)", marginBottom: "6px" }}>~{selectedRoom.sqft} sqft{selectedRoom.realW ? ` · ${selectedRoom.realW}′×${selectedRoom.realH}′` : ""}</div>}
                  <div style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
                    {selectedRoom.reasoning || selectedRoom.reason || "Optimally positioned for the layout."}
                  </div>
                </motion.div>
              )}

              <CollapsibleCard title="Design Logic" icon={Shield} iconColor="var(--accent)">
                <ul style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.7, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>Optimised for natural light and cross-ventilation</li>
                  <li>Structural grid aligns with minimal beam spans</li>
                  <li>Vastu-compliant room orientation applied</li>
                </ul>
              </CollapsibleCard>

              <CollapsibleCard title="AI Suggestions" icon={Lightbulb} iconColor="var(--amber)">
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(plan?.ai_suggestions || ["Consider adding utility room near kitchen", "Solar panels could offset 40% electricity"]).map((s, i) => (
                    <div key={i} style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.5, padding: "8px 10px", background: "var(--surface-2)", borderRadius: "var(--radius-sm)" }}>
                      💡 {s}
                    </div>
                  ))}
                </div>
              </CollapsibleCard>

              <CollapsibleCard title="Risks & Assumptions" icon={AlertTriangle} iconColor="var(--rose)" defaultOpen={false}>
                <ul style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.7, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(plan?.risks || ["Setback compliance needs local verification"]).map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CollapsibleCard>

              <CollapsibleCard title="Agent Orchestra" icon={TrendingUp} iconColor="var(--emerald)" defaultOpen={false}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {DEMO_AGENTS.map(a => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--emerald)" }} />
                      <span style={{ fontWeight: 600, color: "var(--t-primary)" }}>{a.name}</span>
                      <span style={{ color: "var(--t-muted)", marginLeft: "auto" }}>✓</span>
                    </div>
                  ))}
                </div>
              </CollapsibleCard>
            </motion.div>
          )}

          {/* PLANNING / EXACT PLAN TAB */}
          {activeTab === "planning" && (
            <motion.div key="planning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Plot & Zoning Context */}
              <div className="card" style={{ padding: "16px", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Plot Specifications</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--t-secondary)" }}>Total Plot Area</span>
                    <span style={{ fontWeight: 600 }}>{plan?.plotSqft || 2400} sqft</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--t-secondary)" }}>Built-up Area</span>
                    <span style={{ fontWeight: 600 }}>{plan?.totalSqft} sqft</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--t-secondary)" }}>Ground Coverage</span>
                    <span style={{ fontWeight: 600 }}>{Math.round((plan?.totalSqft || 0) / (plan?.plotSqft || 2400) * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Exact Room Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px", paddingLeft: "4px" }}>Room Schedule</div>
                {plan?.rooms.map(room => (
                  <div key={room.id} className="card" style={{ padding: "12px", borderRadius: "var(--radius-sm)", background: "var(--surface-2)", border: selectedRoom?.id === room.id ? "1px solid var(--cyan)" : "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "10px", height: "100%", position: "absolute", left: 0, top: 0, background: room.color, borderRadius: "2px 0 0 2px" }} />
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{room.name}</span>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--t-primary)" }}>{room.sqft} SF</span>
                    </div>
                    <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "var(--t-muted)" }}>
                      <span>Dim: {room.realW || Math.round(room.w/10)}&apos; × {room.realH || Math.round(room.h/10)}&apos;</span>
                      <span>Floor: {room.floor || 1}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Planning Insights */}
              <div className="card" style={{ padding: "16px", borderRadius: "var(--radius-md)", background: "var(--emerald-dim)", border: "1px solid rgba(50, 215, 75, 0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Bot size={14} color="var(--emerald)" />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--emerald)" }}>Computational Logic</span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
                  Plan generated using a recursive grid-packing algorithm. Spatial adjacencies are optimized for <strong>{plan?.environmental_logic?.ventilation || "cross-ventilation"}</strong> and <strong>{plan?.environmental_logic?.light || "natural lighting"}</strong>.
                </p>
              </div>

            </motion.div>
          )}

          {/* COPILOT CHAT TAB */}
          {activeTab === "copilot" && (
            <motion.div key="copilot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "120px" }}>
              
              {copilotMessages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: msg.role === "assistant" ? "var(--t-primary)" : "var(--t-secondary)" }}>
                    {msg.role === "assistant" ? (
                      <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Bot size={10} color="white" />
                      </div>
                    ) : <User size={14} />}
                    {msg.role === "assistant" ? "AI Copilot" : "You"}
                  </div>
                  <div style={{
                    fontSize: "13px", lineHeight: 1.6, paddingLeft: "24px",
                    color: msg.role === "assistant" ? "var(--t-secondary)" : "var(--t-muted)",
                    whiteSpace: "pre-wrap",
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {copilotTyping && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600 }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bot size={10} color="white" />
                    </div>
                    AI Copilot
                  </div>
                  <div style={{ paddingLeft: "24px", display: "flex", gap: "4px", alignItems: "center", height: "20px" }}>
                    <Loader2 size={12} className="spin" color="var(--t-muted)" />
                    <span style={{ fontSize: "11px", color: "var(--t-muted)" }}>Analyzing project logic...</span>
                  </div>
                </div>
              )}
              
              <div ref={bottomRef} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Copilot Input Area (Pinned to bottom if active) */}
      <AnimatePresence>
        {activeTab === "copilot" && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 20, opacity: 0 }}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "12px 16px", background: "var(--surface-1)", borderTop: "1px solid var(--border)",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.1)"
            }}
          >
            {/* Smart Suggestions */}
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none" }} className="no-scrollbar">
              {["Check fire codes", "Is it Vastu compliant?", "Optimize for cost"].map((s, i) => (
                <button key={i} onClick={() => handleSmartSuggestion(s)} style={{ 
                  flexShrink: 0, padding: "6px 10px", fontSize: "11px", borderRadius: "100px", 
                  background: "var(--surface-2)", color: "var(--t-secondary)", border: "1px solid var(--border)",
                  cursor: "pointer", whiteSpace: "nowrap"
                }}>
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} style={{ display: "flex", gap: "8px", position: "relative" }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Copilot..."
                style={{ 
                  flex: 1, padding: "12px 14px", paddingRight: "40px", borderRadius: "10px", 
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  fontSize: "13px", color: "var(--t-primary)", outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--t-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || copilotTyping}
                style={{
                  position: "absolute", right: "6px", top: "6px", bottom: "6px", width: "30px",
                  borderRadius: "6px", background: inputText.trim() ? "var(--t-primary)" : "transparent",
                  color: inputText.trim() ? "var(--bg)" : "var(--t-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "none", cursor: inputText.trim() ? "pointer" : "default", transition: "all 0.2s"
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
