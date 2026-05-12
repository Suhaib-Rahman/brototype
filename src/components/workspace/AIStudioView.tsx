"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, Loader2, ArrowRight, MessageSquare } from "lucide-react";
import { useAIEngine } from "@/store/useAIEngine";
import { useUIStore } from "@/store/useUIStore";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

export function AIStudioView() {
  const { setStage, sidebarCollapsed } = useUIStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: "Hello. I am your ARCOVA Architectural AI. Describe the vision for your project, or tell me about the people who will be using the space, and we will build it together." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          projectContext: { stage: "onboarding" }
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: "ai", text: data.reply };
      setMessages(prev => [...prev, aiMsg]);

      if (data.reply.includes("[GENERATE_PLAN_READY]")) {
        setShowSummary(true);
      }
    } catch (error) {
      console.error(error);
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

  return (
    <div style={{ height: "100%", position: "relative", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: "16px", fontWeight: 600 }}>Architectural Intelligence Studio</h1>
            <p style={{ fontSize: "11px", color: "var(--t-muted)" }}>Stage 01: Human Understanding & Feasibility</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 120px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <AnimatePresence mode="wait">
            {!showSummary ? (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      display: "flex", gap: "16px", 
                      flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                      alignItems: "flex-start" 
                    }}
                  >
                    <div style={{ 
                      width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0, 
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: msg.sender === "user" ? "var(--surface-3)" : "var(--gradient-ai)",
                      color: "white"
                    }}>
                      {msg.sender === "user" ? <User size={16} /> : <Sparkles size={16} />}
                    </div>
                    <div style={{ 
                      maxWidth: "80%", 
                      padding: "14px 18px", 
                      borderRadius: "16px",
                      background: msg.sender === "user" ? "var(--surface-2)" : "var(--surface-1)",
                      border: "1px solid var(--border)",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: "var(--t-primary)",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      whiteSpace: "pre-wrap"
                    }}>
                      {msg.text.replace("[GENERATE_PLAN_READY]", "")}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "16px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Loader2 size={16} className="spin" color="white" />
                    </div>
                    <div style={{ flex: 1, paddingTop: "8px" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} style={{ width: "5px", height: "5px", background: "var(--accent)", borderRadius: "50%" }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="summary" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "40px", borderRadius: "24px", background: "var(--surface-1)", border: "1px solid var(--accent)", position: "relative", marginTop: "40px" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <div className="badge badge-emerald" style={{ marginBottom: "16px" }}>
                    <Sparkles size={10} /> Intelligence Synthesis Complete
                  </div>
                  <h2 className="font-display" style={{ fontSize: "2.2rem", marginBottom: "8px" }}>Architectural Summary Report</h2>
                  <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>Stages 01–03: Lifestyle, Requirement & Regulatory Intelligence</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
                  <div className="card" style={{ padding: "20px", borderRadius: "16px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, marginBottom: "12px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Lifestyle Profile</h3>
                    <p style={{ fontSize: "14px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
                      Archetype: Modern Professional. Prioritizes seamless indoor-outdoor flow and dedicated spatial focus for work-life balance.
                    </p>
                  </div>
                  <div className="card" style={{ padding: "20px", borderRadius: "16px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, marginBottom: "12px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Regulatory Outlook</h3>
                    <p style={{ fontSize: "14px", color: "var(--t-secondary)", lineHeight: 1.6 }}>
                      Zone: Residential High-Density. Max FAR: 2.5. Site supports up to G+3 levels with 60% ground coverage based on inferred coordinates.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: window.innerWidth < 640 ? "column" : "row", gap: "16px" }}>
                  <button onClick={() => setShowSummary(false)} className="btn-secondary" style={{ flex: 1, padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <MessageSquare size={16} /> Edit Requirements
                  </button>
                  <button onClick={handleGeneratePlan} disabled={isGeneratingPlan} className="btn-primary" style={{ flex: 1, padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    {isGeneratingPlan ? <Loader2 size={16} className="spin" /> : <>Confirm & Start Planning <ArrowRight size={16} /></>}
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
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} style={{ 
            background: "linear-gradient(to top, var(--bg) 60%, transparent)", 
            padding: "16px 16px 32px", 
            position: "fixed", 
            bottom: 0, 
            left: window.innerWidth >= 768 ? (sidebarCollapsed ? "48px" : "200px") : 0, 
            right: 0,
            transition: "left 0.3s var(--ease-out)",
            zIndex: 50
          }}>
            <form onSubmit={handleSend} style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isGeneratingPlan}
                placeholder="Ask your Architect or provide more details..." 
                className="input-field"
                style={{ 
                  height: "56px", paddingRight: "60px", background: "var(--surface-1)", 
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)", border: "1px solid var(--border-hover)",
                  fontSize: "15px"
                }}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading || isGeneratingPlan} 
                style={{ 
                  position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", 
                  background: (!input.trim() || isLoading) ? "var(--surface-3)" : "var(--accent)", 
                  border: "none", width: "34px", height: "34px", borderRadius: "8px", 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  color: (!input.trim() || isLoading) ? "var(--t-muted)" : "var(--bg)",
                  transition: "all 0.2s"
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
