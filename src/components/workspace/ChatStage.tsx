"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, Sparkles, Loader2, Send } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { usePlanStore } from "@/store/usePlanStore";
import { useUIStore } from "@/store/useUIStore";
import { DEMO_FLOOR_PLAN, DEMO_AI_RESPONSES } from "@/data/demo-data";
import { Requirements } from "@/types/project";

const SUGGESTIONS = {
  plot: ["1,200 sqft", "2,400 sqft", "3,600 sqft"],
  bedrooms: ["2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"],
  style: ["Modern & Minimal", "Traditional & Vastu", "Contemporary"],
  budget: ["Economy", "Standard", "Premium", "Luxury"],
};

export default function ChatStage({ onNext }: { onNext: () => void }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [inputText, setInputText] = useState("");
  
  const { 
    messages, addMessage, requirements, updateRequirement, 
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
  }, []);

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
      const reply = data.reply;
      
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

      // Heuristic for memory chips based on AI response or user input
      // (Optional: we could have the AI return structured data, but for now we'll keep simple heuristics)
      const textLower = text.toLowerCase();
      if (textLower.includes("sqft") && !memoryChips.find(c => c.label === "Plot")) {
        const match = textLower.match(/(\d+,?\d*)/);
        if (match) addMemoryChip({ label: "Plot", value: `${match[1]} sqft`, color: "blue" });
      }
      if ((textLower.includes("bed") || textLower.includes("bhk")) && !memoryChips.find(c => c.label === "Bedrooms")) {
        const match = textLower.match(/(\d+)/);
        if (match) addMemoryChip({ label: "Bedrooms", value: `${match[1]} Beds`, color: "cyan" });
      }

    } catch (error: any) {
      setTyping(false);
      addMessage({ 
        role: "assistant", 
        content: `I encountered an error: ${error.message}. Please check your connection or API configuration.` 
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
    setGenerating(true);
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
      setGenerating(false);
      setPlanGenerating(false);
      showNotification("success", `Floor plan generated — Score: ${planData.plan_score?.total || 86}/100`);
      setTimeout(() => setStage("plan"), 1200);
    } catch (error: any) {
      setGenerating(false);
      setPlanGenerating(false);
      setTyping(false);
      showNotification("error", error.message);
      addMessage({ role: "assistant", content: `Failed to generate plan: ${error.message}` });
    }
  };


  const lastIsAI = messages[messages.length - 1]?.role === "assistant";
  
  // Determine which suggestions to show based on missing requirements
  const missingArr = [];
  if (!memoryChips.find(c => c.label === "Plot")) missingArr.push("plot");
  if (!memoryChips.find(c => c.label === "Bedrooms")) missingArr.push("bedrooms");
  if (!memoryChips.find(c => c.label === "Style")) missingArr.push("style");
  if (!memoryChips.find(c => c.label === "Budget")) missingArr.push("budget");
  const nextMissing = missingArr[0] as keyof typeof SUGGESTIONS | undefined;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Memory Chips */}
      {memoryChips.length > 0 && (
        <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--border)", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {memoryChips.map((chip, i) => (
            <div key={i} className={`badge badge-${chip.color}`} style={{ fontSize: "11px" }}>
              {chip.label}: {chip.value}
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 140px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 500, color: msg.role === "assistant" ? "var(--t-primary)" : "var(--t-secondary)" }}>
                {msg.role === "assistant" ? (
                  <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Bot size={10} color="white" />
                  </div>
                ) : <User size={14} />}
                {msg.role === "assistant" ? "Architectural AI" : "You"}
              </div>
              <div style={{
                fontSize: "14px", lineHeight: 1.6, paddingLeft: "28px",
                color: msg.role === "assistant" ? "var(--t-primary)" : "var(--t-secondary)",
                whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {/* ... isTyping logic ... */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        position: "fixed", bottom: "0", left: "0", right: "0",
        padding: "16px 16px 24px", 
        background: "linear-gradient(transparent, var(--bg) 20%)",
        zIndex: 50,
        // Match sidebar width on desktop
        marginLeft: (typeof window !== 'undefined' && window.innerWidth >= 768) ? "var(--sidebar-width, 200px)" : "0",
        transition: "margin-left 0.3s var(--ease-out)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* ... suggestions ... */}
          {!requirementsComplete && (
            <form onSubmit={handleSend} style={{ display: "flex", gap: "8px", position: "relative" }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your requirements..."
                className="input-field"
                style={{ 
                  flex: 1, 
                  padding: "14px 18px", 
                  paddingRight: "48px",
                  borderRadius: "100px", 
                  background: "var(--surface-1)",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                }}
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || isTyping}
                style={{
                  position: "absolute", right: "5px", top: "5px", bottom: "5px", width: "38px",
                  borderRadius: "100px", 
                  background: inputText.trim() ? "var(--t-primary)" : "var(--surface-2)",
                  color: inputText.trim() ? "black" : "var(--t-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "none", cursor: inputText.trim() ? "pointer" : "default"
                }}
              >
                <Send size={14} />
              </button>
            </form>
          )}
          {/* ... generate button ... */}
        </div>
      </div>
    </div>
  );
}
