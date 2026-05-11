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

  const processInput = (text: string) => {
    if (requirementsComplete) return;
    
    addMessage({ role: "user", content: text });
    setTyping(true);
    
    setTimeout(() => {
      setTyping(false);
      
      let detectedCount = 0;
      const textLower = text.toLowerCase();
      const state = useChatStore.getState();
      const currentChips = state.memoryChips;
      
      // Plot
      const sqftMatch = textLower.match(/(\d+,?\d*)\s*(sqft|square feet|sq ft)/);
      if (sqftMatch && !currentChips.find(c => c.label === "Plot")) {
        updateRequirement("plotSqft", parseInt(sqftMatch[1].replace(',', '')));
        addMemoryChip({ label: "Plot", value: `${sqftMatch[1]} sqft`, color: "blue" });
        detectedCount++;
      } else if ((text.includes("1,200") || text.includes("2,400") || text.includes("3,600")) && !currentChips.find(c => c.label === "Plot")) {
        addMemoryChip({ label: "Plot", value: text, color: "blue" });
        detectedCount++;
      }

      // Bedrooms
      const bedMatch = textLower.match(/(\d+)\s*(bhk|bed|bedroom)/);
      if (bedMatch && !currentChips.find(c => c.label === "Bedrooms")) {
        const beds = parseInt(bedMatch[1]);
        updateRequirement("bedrooms", beds);
        addMemoryChip({ label: "Bedrooms", value: `${beds} Beds`, color: "cyan" });
        detectedCount++;
      }

      // Style
      if ((textLower.includes("modern") || textLower.includes("traditional") || textLower.includes("contemporary")) && !currentChips.find(c => c.label === "Style")) {
        const style = textLower.includes("modern") ? "modern" : textLower.includes("traditional") ? "traditional" : "contemporary";
        updateRequirement("style", style);
        addMemoryChip({ label: "Style", value: style, color: "violet" });
        detectedCount++;
      }

      // Budget
      if ((textLower.includes("economy") || textLower.includes("standard") || textLower.includes("premium") || textLower.includes("luxury")) && !currentChips.find(c => c.label === "Budget")) {
        let budgetVal = 80;
        let tier = "Premium";
        if (textLower.includes("economy")) { budgetVal = 30; tier = "Economy"; }
        else if (textLower.includes("standard")) { budgetVal = 50; tier = "Standard"; }
        else if (textLower.includes("luxury")) { budgetVal = 150; tier = "Luxury"; }
        
        updateRequirement("budget", budgetVal);
        addMemoryChip({ label: "Budget", value: tier, color: "amber" });
        detectedCount++;
      }

      const newChips = useChatStore.getState().memoryChips;
      const missing = [];
      if (!newChips.find(c => c.label === "Plot")) missing.push("plot");
      if (!newChips.find(c => c.label === "Bedrooms")) missing.push("bedrooms");
      if (!newChips.find(c => c.label === "Style")) missing.push("style");
      if (!newChips.find(c => c.label === "Budget")) missing.push("budget");

      if (missing.length === 0) {
        addMessage({ role: "assistant", content: "Great! I have all the details I need. Click 'Generate Floor Plan' below when you're ready." });
        setRequirementsComplete(true);
      } else {
        const nextMissing = missing[0];
        let q = "";
        if (nextMissing === "plot") q = "What is the approximate plot size?";
        if (nextMissing === "bedrooms") q = "How many bedrooms do you need?";
        if (nextMissing === "style") q = "What is your preferred architectural style?";
        if (nextMissing === "budget") q = "What is the expected construction budget?";

        const aiResponse = detectedCount > 0 
          ? `I've noted that down. ${q}`
          : `I see. Let's make sure we have the core details. ${q}`;
        addMessage({ role: "assistant", content: aiResponse });
      }
    }, 800);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isTyping) return;
    const text = inputText;
    setInputText("");
    processInput(text);
  };

  const handleGeneratePlan = () => {
    setGenerating(true);
    setPlanGenerating(true);
    addMessage({ role: "user", content: "Generate Floor Plan" });
    setTyping(true);

    setTimeout(() => {
      setFloorPlan(DEMO_FLOOR_PLAN);
      setTyping(false);
      addMessage({ role: "assistant", content: "Your AI-generated floor plan is ready! I've optimised it for the local climate, Vastu alignment, and your budget range. Let me take you to the workspace." });
      setGenerating(false);
      setPlanGenerating(false);
      showNotification("success", "Floor plan generated — Score: 86/100");
      setTimeout(() => setStage("plan"), 800);
    }, 3000);
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
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 24px 180px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 500, color: msg.role === "assistant" ? "var(--t-primary)" : "var(--t-secondary)" }}>
                {msg.role === "assistant" ? (
                  <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Bot size={12} color="white" />
                  </div>
                ) : <User size={16} />}
                {msg.role === "assistant" ? "Architectural AI" : "You"}
              </div>
              <div style={{
                fontSize: "15px", lineHeight: 1.7, paddingLeft: "30px",
                color: msg.role === "assistant" ? "var(--t-primary)" : "var(--t-secondary)",
                whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 500 }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={12} color="white" />
                </div>
                Architectural AI
              </div>
              <div style={{ paddingLeft: "30px", display: "flex", gap: "6px", alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="thinking-dot" style={{ width: "7px", height: "7px", background: "var(--cyan)" }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        position: "absolute", bottom: "0", left: "0", right: "0",
        padding: "20px 24px 24px", background: "linear-gradient(transparent, var(--bg) 30%)",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          
          {/* Smart Suggestions */}
          {!requirementsComplete && lastIsAI && !isTyping && nextMissing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}
            >
              {SUGGESTIONS[nextMissing].map((choice) => (
                <button
                  key={choice}
                  onClick={() => processInput(choice)}
                  className="chip"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  {choice}
                </button>
              ))}
            </motion.div>
          )}

          {/* Chat Input */}
          {!requirementsComplete && (
            <form onSubmit={handleSend} style={{ display: "flex", gap: "8px", position: "relative" }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your requirements (e.g., '3 bedroom modern house around 2400 sqft')"
                className="input-field"
                style={{ 
                  flex: 1, 
                  padding: "16px 20px", 
                  paddingRight: "50px",
                  borderRadius: "100px", 
                  background: "var(--surface-1)",
                  border: "1px solid var(--border)",
                  fontSize: "15px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
                }}
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || isTyping}
                style={{
                  position: "absolute",
                  right: "6px",
                  top: "6px",
                  bottom: "6px",
                  width: "40px",
                  borderRadius: "100px",
                  background: inputText.trim() ? "var(--t-primary)" : "var(--surface-2)",
                  color: inputText.trim() ? "black" : "var(--t-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "none", cursor: inputText.trim() ? "pointer" : "default",
                  transition: "all 0.2s"
                }}
              >
                <Send size={16} style={{ marginLeft: "2px" }} />
              </button>
            </form>
          )}

          {/* Generate Button */}
          {requirementsComplete && !usePlanStore.getState().floorPlan && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <button className="btn-accent" onClick={handleGeneratePlan} disabled={generating} style={{ width: "100%", padding: "16px", fontSize: "15px", borderRadius: "var(--radius-lg)" }}>
                {generating ? (
                  <><Loader2 size={18} className="spin" /> Generating Plan...</>
                ) : (
                  <><Sparkles size={18} /> Generate Floor Plan</>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
