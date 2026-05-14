"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, Loader2, CheckCircle2, Layout, Layers, ShieldCheck } from "lucide-react";
import { useAIEngine } from "@/store/useAIEngine";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  options?: string[];
  type?: "standard" | "system" | "discovery";
};

const DISCOVERY_STEPS = [
  {
    id: "archetype",
    question: "What architectural archetype defines your vision?",
    options: ["Luxury Contemporary Villa", "Minimalist Urban Residence", "Sustainable Eco-Home", "Traditional Heritage Estate"]
  },
  {
    id: "scale",
    question: "What is the intended scale of this project?",
    options: ["Compact Efficiency (< 1500 sqft)", "Standard Family Home (1500-2500 sqft)", "Spacious Estate (2500-5000 sqft)", "Grand Manor (> 5000 sqft)"]
  },
  {
    id: "priority",
    question: "Which core value should the AI prioritize during planning?",
    options: ["Spatial Fluidity & Flow", "Cost Efficiency & ROI", "Environmental Harmony", "Structural Boldness"]
  }
];

export default function OnboardingSystem({ onNext }: { onNext: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-initial",
      sender: "ai",
      text: "Welcome to ARCOVA. I am your Lead Architectural Intelligence. To begin synthesizing your project, please select an architectural archetype or describe your vision below.",
      options: DISCOVERY_STEPS[0].options,
      type: "discovery"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgCounter = useRef(100);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleOptionSelect = (option: string) => {
    processInput(option);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isGeneratingPlan) return;
    processInput(input);
    setInput("");
  };

  const handleGeneratePlan = async (finalMessages: Message[]) => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generateFeasibility: true,
          projectContext: { chatHistory: finalMessages }
        }),
      });

      const result = await response.json();
      if (result.rooms && result.rooms.length > 0) {
        useAIEngine.setState({ rooms: result.rooms });
      }
      onNext();
    } catch {
      onNext();
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const processInput = async (text: string) => {
    msgCounter.current += 1;
    const userMsg: Message = { id: `u-${msgCounter.current}`, sender: "user", text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      if (currentStep < DISCOVERY_STEPS.length - 1) {
        const nextStepIdx = currentStep + 1;
        const nextStep = DISCOVERY_STEPS[nextStepIdx];

        await new Promise(resolve => setTimeout(resolve, 1000));

        msgCounter.current += 1;
        const aiMsg: Message = {
          id: `ai-${msgCounter.current}`,
          sender: "ai",
          text: `Understood. Processing "${text}" into the project parameters. \n\n${nextStep.question}`,
          options: nextStep.options,
          type: "discovery"
        };

        setMessages(prev => [...prev, aiMsg]);
        setCurrentStep(nextStepIdx);
      } else {
        const response = await fetch("/api/architect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            projectContext: { discoveryFinished: true }
          }),
        });

        const data = await response.json();
        const replyText: string = data.reply || "";
        const isReady = replyText.includes("[GENERATE_PLAN_READY]") || updatedMessages.length > 8;
        const cleanReply = replyText.replace("[GENERATE_PLAN_READY]", "").trim();

        msgCounter.current += 1;
        const aiMsg: Message = {
          id: `ai-${msgCounter.current}`,
          sender: "ai",
          text: cleanReply || "Your project parameters have been synthesized. We are ready to generate the initial floor plan.",
          type: "standard"
        };

        setMessages(prev => [...prev, aiMsg]);

        if (isReady) {
          handleGeneratePlan([...updatedMessages, aiMsg]);
        }
      }
    } catch {
      msgCounter.current += 1;
      setMessages(prev => [...prev, {
        id: `err-${msgCounter.current}`,
        sender: "ai",
        text: "System communication error. Continuing to synthesis..."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative", overflow: "hidden" }}>

      {/* Dynamic Progress Bar */}
      <div style={{ height: "4px", background: "var(--surface-2)", width: "100%" }}>
        <motion.div
          animate={{ width: `${((currentStep + 1) / (DISCOVERY_STEPS.length + 1)) * 100}%` }}
          style={{ height: "100%", background: "var(--gradient-ai)" }}
        />
      </div>

      {/* Header */}
      <div style={{ height: "72px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", flexShrink: 0, background: "rgba(10, 10, 15, 0.8)", backdropFilter: "blur(20px)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--t-primary)" }}>Lifestyle Intelligence Synthesis</div>
            <div style={{ fontSize: "11px", color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Phase 01 — Project Archetyping</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => handleGeneratePlan(messages)}
            disabled={isGeneratingPlan || messages.length < 2}
            className="btn-secondary"
            style={{ padding: "8px 20px", borderRadius: "10px", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}
          >
            {isGeneratingPlan ? <Loader2 size={14} className="spin" /> : <><Layout size={14} /> Bypass Synthesis</>}
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 0", scrollPaddingBottom: "200px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px", padding: "0 32px" }}>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: "32px", borderRadius: "24px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            {[
              { icon: Layers, label: "Structural Logic", desc: "Adaptive spatial matrices" },
              { icon: ShieldCheck, label: "Regulatory Guard", desc: "Zoning & code compliance" },
              { icon: CheckCircle2, label: "Cost Guardian", desc: "Real-time budget tracking" },
            ].map((feat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <feat.icon size={24} color="var(--accent)" style={{ marginBottom: "12px" }} />
                <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>{feat.label}</div>
                <div style={{ fontSize: "11px", color: "var(--t-muted)" }}>{feat.desc}</div>
              </div>
            ))}
          </motion.div>

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, x: msg.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                style={{
                  display: "flex",
                  gap: "24px",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%"
                }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "14px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: msg.sender === "ai" ? "var(--accent)" : "var(--surface-3)",
                  color: msg.sender === "ai" ? "var(--bg)" : "var(--t-primary)",
                  boxShadow: msg.sender === "ai" ? "0 8px 16px rgba(198,176,138,0.2)" : "none"
                }}>
                  {msg.sender === "ai" ? <Sparkles size={20} /> : <User size={20} />}
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    padding: "20px 24px", borderRadius: msg.sender === "ai" ? "4px 24px 24px 24px" : "24px 4px 24px 24px",
                    background: msg.sender === "ai" ? "var(--surface-2)" : "var(--accent)",
                    color: msg.sender === "ai" ? "var(--t-primary)" : "var(--bg)",
                    fontSize: "15px", lineHeight: 1.6, boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    border: msg.sender === "ai" ? "1px solid var(--border)" : "none"
                  }}>
                    {msg.text}
                  </div>

                  {msg.options && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {msg.options.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleOptionSelect(opt)}
                          disabled={isLoading}
                          style={{
                            padding: "10px 20px", borderRadius: "12px", border: "1px solid var(--border)",
                            background: "var(--surface-1)", color: "var(--t-primary)", fontSize: "13px",
                            fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                          }}
                        >
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "24px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "14px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--accent)", color: "var(--accent)" }}>
                  <Loader2 size={20} className="spin" />
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} style={{ width: "8px", height: "8px", background: "var(--accent)", borderRadius: "50%" }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div style={{ background: "linear-gradient(to top, var(--bg) 60%, transparent)", padding: "32px", position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5 }}>
        <form onSubmit={handleSend} style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <div style={{ position: "relative", filter: isLoading ? "grayscale(0.5) opacity(0.7)" : "none" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || isGeneratingPlan}
              placeholder="Describe your vision or ask a question..."
              style={{
                width: "100%", background: "var(--surface-1)", border: "1px solid var(--border)",
                color: "var(--t-primary)", padding: "24px 80px 24px 32px", borderRadius: "20px",
                fontSize: "16px", outline: "none", transition: "all 0.3s",
                boxShadow: "0 20px 50px rgba(0,0,0,0.4)"
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "var(--accent)", color: "var(--bg)", border: "none",
                width: "56px", height: "56px", borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              <Send size={24} />
            </button>
          </div>
        </form>
        <div style={{ textAlign: "center", fontSize: "12px", color: "var(--t-muted)", marginTop: "16px", display: "flex", justifyContent: "center", gap: "24px" }}>
          <span>AI Synthesis Protocol 4.2.0</span>
          <span>•</span>
          <span>Architectural Integrity Guaranteed</span>
        </div>
      </div>

    </div>
  );
}
}
