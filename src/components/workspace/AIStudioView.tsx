"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, Loader2, ArrowRight, MessageSquare, Paperclip, MapPin } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

export function AIStudioView() {
  const { setStage, sidebarCollapsed } = useUIStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: "Welcome to ARCOVA. Before we discuss dimensions or geometry, I need to understand the people and the purpose behind this space.\n\nCould you describe the daily routines, family structure, or work habits of those who will use this environment? What are your primary goals—comfort, lifestyle, or perhaps a rental investment?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [thinkingStatus, setThinkingStatus] = useState("Human behavioral engine initializing...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      const statuses = [
        "Analyzing human behavior patterns...",
        "Synthesizing lifestyle intelligence...",
        "Mapping emotional expectations...",
        "Evaluating project intent archetype...",
        "Converting lifestyle data to architectural logic..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setThinkingStatus(statuses[i % statuses.length]);
        i++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: `u-${messages.length}`, sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          projectContext: { stage: "lifestyle_intelligence" }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error?.message || data.error || "An unexpected error occurred.";
        const aiErrorMsg: Message = {
          id: `ai-err-${messages.length + 1}`,
          sender: "ai",
          text: `🚨 Intelligence Offline: ${errorMsg}. Please wait a moment or check your API quota.`
        };
        setMessages(prev => [...prev, aiErrorMsg]);
        return;
      }

      const aiMsg: Message = { id: `ai-${messages.length + 1}`, sender: "ai", text: data.reply };
      setMessages(prev => [...prev, aiMsg]);

      if (data.reply.includes("[GENERATE_PLAN_READY]")) {
        setShowSummary(true);
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const networkErrorMsg: Message = {
        id: `ai-net-${messages.length + 1}`,
        sender: "ai",
        text: `🚨 Connection Failure: ${errorMsg}`
      };
      setMessages(prev => [...prev, networkErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setStage("location");
      setIsGeneratingPlan(false);
    }, 1500);
  };

  if (!mounted) return null;

  const quickStarts = [
    { label: "Private Homeowner", value: "I am building a home for my family" },
    { label: "Property Developer", value: "I am developing a project for investment/rental" },
    { label: "Business Owner", value: "I need a workspace/commercial environment" },
    { label: "Architect/Designer", value: "I am helping a client define their lifestyle profile" },
  ];

  return (
    <div style={{ height: "100%", position: "relative", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: "15px", fontWeight: 600 }}>Lifestyle & Human Intelligence Studio</h1>
            <p style={{ fontSize: "10px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Process Stage 01: Human Understanding</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 160px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
          <AnimatePresence mode="wait">
            {!showSummary ? (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "flex", gap: "20px",
                      flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                      alignItems: "flex-start"
                    }}
                  >
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: msg.sender === "user" ? "var(--surface-3)" : "var(--gradient-ai)",
                      color: "white",
                      boxShadow: msg.sender === "ai" ? "var(--shadow-glow)" : "none"
                    }}>
                      {msg.sender === "user" ? <User size={18} /> : <Sparkles size={18} />}
                    </div>
                    <div style={{
                      maxWidth: "85%",
                      padding: "16px 20px",
                      borderRadius: "20px",
                      background: msg.sender === "user" ? "var(--surface-2)" : "var(--surface-1)",
                      border: "1px solid var(--border)",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: "var(--t-primary)",
                      boxShadow: "0 2px 15px rgba(0,0,0,0.03)",
                      whiteSpace: "pre-wrap"
                    }}>
                      {msg.text.replace("[GENERATE_PLAN_READY]", "")}

                      {/* Quick Start Chips */}
                      {idx === 0 && messages.length === 1 && (
                        <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {quickStarts.map((chip, i) => (
                            <button
                              key={i}
                              onClick={() => setInput(chip.value)}
                              style={{
                                padding: "8px 24px", borderRadius: "100px", background: "var(--surface-2)",
                                border: "1px solid var(--border)", fontSize: "12px", color: "var(--t-secondary)",
                                cursor: "pointer", transition: "all 0.2s"
                              }}
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "20px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Loader2 size={18} className="spin" color="white" />
                    </div>
                    <div style={{ flex: 1, paddingTop: "10px" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} style={{ width: "6px", height: "6px", background: "var(--accent)", borderRadius: "50%" }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="summary" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "40px", borderRadius: "24px", background: "var(--surface-1)", border: "1px solid var(--accent)", position: "relative", marginTop: "40px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <div className="badge badge-emerald" style={{ marginBottom: "16px" }}>
                    <Sparkles size={10} /> Human Understanding Synthesis Complete
                  </div>
                  <h2 className="font-display" style={{ fontSize: "2.2rem", marginBottom: "8px" }}>Lifestyle Intelligence Report</h2>
                  <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>Process Stage 01: Behavior, Intent & Spatial Requirement Matrix</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
                  <div className="card" style={{ padding: "24px", borderRadius: "16px", background: "var(--surface-2)" }}>
                    <h3 style={{ fontSize: "12px", fontWeight: 700, marginBottom: "12px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Spatial Behavior Profile</h3>
                    <p style={{ fontSize: "14px", color: "var(--t-secondary)", lineHeight: 1.7 }}>
                      Mapped behavioral patterns suggest a high priority for work-life integration. Optimized for acoustic privacy and productive lighting environments.
                    </p>
                  </div>
                  <div className="card" style={{ padding: "24px", borderRadius: "16px", background: "var(--surface-2)" }}>
                    <h3 style={{ fontSize: "12px", fontWeight: 700, marginBottom: "12px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Project Archetype</h3>
                    <p style={{ fontSize: "14px", color: "var(--t-secondary)", lineHeight: 1.7 }}>
                      Classification: Permanent Family Living. Priorities: Emotional comfort, future adaptability, and long-term structural durability.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <button onClick={() => setShowSummary(false)} className="btn-secondary" style={{ flex: 1, padding: "18px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <MessageSquare size={18} /> Edit Requirements
                  </button>
                  <button onClick={handleGeneratePlan} disabled={isGeneratingPlan} className="btn-primary" style={{ flex: 1, padding: "18px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    {isGeneratingPlan ? <Loader2 size={18} className="spin" /> : <>Confirm & Start Planning <ArrowRight size={18} /></>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Input Area */}
      <AnimatePresence>
        {!showSummary && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            style={{
              background: "linear-gradient(to top, var(--bg) 80%, transparent)",
              padding: "24px 24px 40px",
              position: "fixed",
              bottom: 0,
              left: mounted && typeof window !== "undefined" && window.innerWidth >= 768 ? (sidebarCollapsed ? "48px" : "200px") : 0,
              right: 0,
              transition: "left 0.3s var(--ease-out)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <div style={{ maxWidth: "800px", width: "100%" }}>
              {/* Thinking Status */}
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", paddingLeft: "12px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)" }} />
                  <span style={{ fontSize: "11px", color: "var(--t-muted)", fontWeight: 500 }}>{thinkingStatus}</span>
                </motion.div>
              )}

              <form onSubmit={handleSend} style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", display: "flex", gap: "12px", color: "var(--t-muted)" }}>
                  <Paperclip size={18} style={{ cursor: "pointer" }} />
                  <MapPin size={18} style={{ cursor: "pointer" }} />
                </div>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading || isGeneratingPlan}
                  placeholder="Describe your vision or drop a location link..."
                  className="input-field"
                  style={{
                    height: "56px", paddingLeft: "80px", paddingRight: "60px", background: "var(--surface-1)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)", border: "1px solid var(--border-hover)",
                    fontSize: "15px", borderRadius: "18px"
                  }}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || isGeneratingPlan}
                  style={{
                    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                    background: (!input.trim() || isLoading) ? "var(--surface-3)" : "var(--gradient-ai)",
                    border: "none", width: "36px", height: "36px", borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", transition: "all 0.2s"
                  }}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
