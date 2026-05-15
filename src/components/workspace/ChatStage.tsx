"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, CheckCircle2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { usePlanStore } from "@/store/usePlanStore";
import { useUIStore } from "@/store/useUIStore";

export default function ChatStage() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");
  
  const { 
    messages, addMessage, requirements, 
    isTyping, setTyping, requirementsComplete, setRequirementsComplete, 
    addMemoryChip, memoryChips, customer
  } = useChatStore();
  const { setFloorPlan, setGenerating: setPlanGenerating } = usePlanStore();
  const { showNotification, setStage } = useUIStore();

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = customer.name 
        ? `Hello ${customer.name}! I'm your Architectural AI. To begin designing your space, what is your approximate plot size?`
        : `Hello! I'm your Architectural AI. To begin designing your space, what is your approximate plot size?`;
      setTimeout(() => addMessage({ role: "assistant", content: greeting }), 400);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const processInput = async (text: string) => {
    if (requirementsComplete) return;
    
    addMessage({ role: "user", content: text });
    setTyping(true);
    
    try {
      const response = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }],
          projectContext: { customer }
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to connect to AI Architect");

      setTyping(false);
      const reply: string = data.reply;
      
      // Check if AI says we are ready to generate
      if (reply.includes("[GENERATE_PLAN_READY]")) {
        setRequirementsComplete(true);
        addMessage({ 
          role: "assistant", 
          content: reply.replace("[GENERATE_PLAN_READY]", "").trim() || "I have all the details I need. We are ready to generate your architectural plan."
        });
      } else {
        addMessage({ role: "assistant", content: reply });
      }

      // Simple memory chip extraction logic
      const textLower = text.toLowerCase();
      if (textLower.includes("sqft") && !memoryChips.find(c => c.label === "Plot")) {
        const match = textLower.match(/(\d+,?\d*)/);
        if (match) addMemoryChip({ label: "Plot", value: `${match[1]} sqft`, color: "blue" });
      }
      if ((textLower.includes("bed") || textLower.includes("bhk")) && !memoryChips.find(c => c.label === "Bedrooms")) {
        const match = textLower.match(/(\d+)/);
        if (match) addMemoryChip({ label: "Bedrooms", value: `${match[1]} Beds`, color: "cyan" });
      }

    } catch (error: unknown) {
      setTyping(false);
      const errorMsg = error instanceof Error ? error.message : String(error);
      addMessage({ 
        role: "assistant", 
        content: `I encountered an error: ${errorMsg}. Please check your connection or API configuration.` 
      });
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isTyping) return;
    const text = inputText;
    setInputText("");
    processInput(text);
  };

  const handleGeneratePlan = async () => {
    setPlanGenerating(true);
    addMessage({ role: "user", content: "Generate Floor Plan" });
    setTyping(true);

    try {
      const response = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generateFeasibility: true,
          messages: messages,
          projectContext: { requirements, memoryChips, customer }
        }),
      });

      const planData = await response.json();
      if (!response.ok) throw new Error(planData.error || "Generation failed");

      setFloorPlan(planData);
      setTyping(false);
      addMessage({ role: "assistant", content: "Your AI-generated floor plan is ready! I've optimised it for the local climate, Vastu alignment, and your budget range. Let me take you to the workspace." });
      setPlanGenerating(false);
      showNotification("success", `Floor plan generated — Score: ${planData.plan_score?.total || 86}/100`);
      setTimeout(() => setStage("plan"), 1200);
    } catch (error: unknown) {
      setPlanGenerating(false);
      setTyping(false);
      const errorMsg = error instanceof Error ? error.message : String(error);
      showNotification("error", errorMsg);
      addMessage({ role: "assistant", content: `Failed to generate plan: ${errorMsg}` });
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>
      {/* Memory Chips Header */}
      <AnimatePresence>
        {memoryChips.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            style={{ padding: "12px 24px", borderBottom: "1px solid var(--border)", display: "flex", gap: "8px", flexWrap: "wrap", background: "var(--surface-0)", zIndex: 10 }}
          >
            {memoryChips.map((chip, i) => (
              <motion.div 
                key={i} 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`badge badge-${chip.color}`} 
                style={{ fontSize: "11px" }}
              >
                {chip.label}: {chip.value}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 16px 140px" }} className="custom-scroll">
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
          {messages.map((m) => (
            <motion.div 
              key={m.id} 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                display: "flex", 
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div style={{
                maxWidth: "85%",
                padding: "20px 24px",
                borderRadius: m.role === "user" ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                background: m.role === "user" ? "var(--accent)" : "var(--surface-1)",
                color: m.role === "user" ? "white" : "var(--t-primary)",
                fontSize: "15px",
                lineHeight: "1.6",
                boxShadow: m.role === "user" ? "var(--shadow-md)" : "none",
                border: m.role === "user" ? "none" : "1px solid var(--border)",
                position: "relative",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", opacity: 0.6 }}>
                  {m.role === "assistant" ? (
                    <div className="pulse" style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bot size={12} color="white" />
                    </div>
                  ) : <User size={14} />}
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {m.role === "user" ? "Client" : "Senior Architect"}
                  </span>
                </div>
                {m.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 0" }}>
              <div className="pulse" style={{ width: "36px", height: "36px", borderRadius: "12px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={18} color="white" />
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)" }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Sticky Input Bar */}
      <div style={{
        position: "sticky", bottom: "0", left: "0", right: "0",
        padding: "24px 16px 40px", 
        background: "linear-gradient(transparent, var(--bg) 30%)",
        zIndex: 50,
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {!requirementsComplete ? (
            <form onSubmit={handleSend} style={{ display: "flex", gap: "12px", position: "relative" }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe your vision, lifestyle, or plot details..."
                autoFocus
                style={{ 
                  flex: 1, 
                  padding: "18px 24px", 
                  paddingRight: "60px",
                  borderRadius: "20px", 
                  background: "var(--surface-1)",
                  border: "1px solid var(--border)",
                  color: "var(--t-primary)",
                  fontSize: "15px",
                  boxShadow: "var(--shadow-lg)",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                className="input-focus-accent"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || isTyping}
                style={{
                  position: "absolute", right: "8px", top: "8px", bottom: "8px", width: "44px",
                  borderRadius: "14px", 
                  background: inputText.trim() ? "var(--t-primary)" : "var(--surface-2)",
                  color: inputText.trim() ? "black" : "var(--t-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "none", cursor: inputText.trim() ? "pointer" : "default",
                  transition: "all 0.2s",
                }}
              >
                <Send size={18} />
              </button>
            </form>
          ) : (
            <motion.button 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGeneratePlan} 
              className="btn-accent pulse" 
              style={{ 
                width: "100%", padding: "20px", borderRadius: "20px", fontWeight: 800, 
                fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                boxShadow: "var(--shadow-glow)"
              }}
            >
              <CheckCircle2 size={20} />
              Generate Architectural Plan
            </motion.button>
          )}
        </div>
      </div>

      <style jsx global>{`
        .input-focus-accent:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 4px var(--accent-dim), var(--shadow-lg) !important;
        }
      `}</style>
    </div>
  );
}
