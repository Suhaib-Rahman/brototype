"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, Sparkles, TrendingUp, Lightbulb, ChevronDown, ChevronUp, Award, Bot, User, Send, Loader2 } from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useUIStore } from "@/store/useUIStore";
import { useChatStore } from "@/store/useChatStore";
import { useState, useRef, useEffect } from "react";
import { DEMO_AGENTS } from "@/data/demo-data";

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

export default function IntelligencePanel() {
  const { floorPlan, selectedRoom } = usePlanStore();
  const { currentStage } = useUIStore();
  const { copilotMessages, addCopilotMessage, copilotTyping, setCopilotTyping } = useChatStore();
  
  const [activeTab, setActiveTab] = useState<"overview" | "copilot">("overview");
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const plan = floorPlan;
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
    } catch (error: any) {
      setCopilotTyping(false);
      const errorMsg = error.message.includes("expired") 
        ? "🚨 API Connection Error: Your Gemini API key has expired. Please update .env.local with a fresh key to resume Copilot services."
        : `Connection Error: ${error.message}`;
      
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
            <Sparkles size={10} /> Architectural Intelligence
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ 
              width: "8px", height: "8px", borderRadius: "50%", 
              background: "var(--emerald)",
              boxShadow: "0 0 8px var(--emerald)"
            }} />
            <span style={{ fontSize: "10px", color: "var(--t-muted)", fontWeight: 500 }}>
              Live Intelligence
            </span>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "16px" }}>
          <button 
            onClick={() => setActiveTab("overview")}
            style={{ 
              padding: "8px 4px", fontSize: "13px", fontWeight: 600, background: "transparent", border: "none", 
              borderBottom: activeTab === "overview" ? "2px solid var(--t-primary)" : "2px solid transparent",
              color: activeTab === "overview" ? "var(--t-primary)" : "var(--t-muted)", cursor: "pointer", transition: "all 0.2s"
            }}>
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("copilot")}
            style={{ 
              padding: "8px 4px", fontSize: "13px", fontWeight: 600, background: "transparent", border: "none", 
              borderBottom: activeTab === "copilot" ? "2px solid var(--t-primary)" : "2px solid transparent",
              color: activeTab === "copilot" ? "var(--t-primary)" : "var(--t-muted)", cursor: "pointer", transition: "all 0.2s"
            }}>
            Copilot Chat
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <AnimatePresence mode="wait">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {score && (
                <div className="card" style={{ padding: "20px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                  <div style={{
                    width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 12px",
                    background: `conic-gradient(var(--accent) ${score.total * 3.6}deg, var(--surface-3) 0deg)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ width: "62px", height: "62px", borderRadius: "50%", background: "var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      <span className="font-display" style={{ fontSize: "1.4rem", lineHeight: 1 }}>{score.total}</span>
                      <span style={{ fontSize: "9px", color: "var(--t-muted)" }}>/100</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "4px" }}>Plan Score</div>
                  <div className="badge badge-emerald" style={{ fontSize: "10px" }}>
                    <Award size={9} /> {plan?.confidence_label || "High"} · {plan?.confidence_score || 88}%
                  </div>

                  {/* Score bars */}
                  <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "Space", value: score.space_efficiency, color: "#3B82F6" },
                      { label: "Cost", value: score.cost_efficiency, color: "#10B981" },
                      { label: "Climate", value: score.climate_suitability, color: "#F59E0B" },
                      { label: "Safety", value: score.compliance_safety, color: "#8B5CF6" },
                    ].map(d => (
                      <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "11px", color: "var(--t-muted)", width: "50px", textAlign: "right" }}>{d.label}</span>
                        <div style={{ flex: 1, height: "4px", background: "var(--surface-3)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: `${(d.value / 25) * 100}%`, height: "100%", background: d.color, borderRadius: "2px", transition: "width 0.8s var(--ease-out)" }} />
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 600, width: "20px" }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
