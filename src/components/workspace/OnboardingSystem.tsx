"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, Loader2, ArrowRight } from "lucide-react";
import { useAIEngine } from "@/store/useAIEngine";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

export default function OnboardingSystem({ onNext }: { onNext: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: "Hello. I am your ARCOVA Architectural AI. Describe the vision for your project, or tell me about the people who will be using the space, and we will build it together." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isGeneratingPlan) return;

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          projectContext: {} // We don't have project context yet, we're creating it
        }),
      });

      const data = await response.json();

      const replyText = data.reply || "";
      const isReady = replyText.includes("[GENERATE_PLAN_READY]");
      const cleanReply = replyText.replace("[GENERATE_PLAN_READY]", "").trim();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: cleanReply
      };

      setMessages(prev => [...prev, aiMsg]);

      // If the AI signaled it has enough information, automatically trigger the plan generation!
      if (isReady) {
        handleGeneratePlan([...updatedMessages, aiMsg]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Error connecting to AI: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async (finalMessages: Message[]) => {
    setIsGeneratingPlan(true);

    try {
      const response = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generateFeasibility: true,
          projectContext: { chatHistory: finalMessages } // Send the chat history as context to generate JSON
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to generate floor plan");
      }

      if (result.rooms && result.rooms.length > 0) {
        useAIEngine.setState({ rooms: result.rooms });
      }

      // Automatically transition to the CAD Plan viewer
      onNext();
    } catch (error) {
      console.error(error);
      // If it fails, fallback to passing them anyway
      onNext();
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative" }}>
      
      {/* Top Header */}
      <div style={{ height: "64px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0, background: "var(--surface-0)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={12} color="white" />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--t-primary)" }}>AI Feasibility Studio</span>
        </div>

        <button 
          onClick={() => handleGeneratePlan(messages)}
          disabled={isGeneratingPlan || messages.length < 3}
          style={{ 
            background: "var(--accent)", color: "var(--bg)", border: "none", padding: "8px 16px", borderRadius: "8px", 
            fontSize: "13px", fontWeight: 600, cursor: (isGeneratingPlan || messages.length < 3) ? "not-allowed" : "pointer", 
            display: "flex", alignItems: "center", gap: "8px", opacity: (isGeneratingPlan || messages.length < 3) ? 0.5 : 1,
            transition: "all 0.2s"
          }}
        >
          {isGeneratingPlan ? <><Loader2 size={16} className="spin" /> Generating Plan...</> : <>Force Generate Plan <ArrowRight size={16} /></>}
        </button>
      </div>

      {/* Chat Canvas */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px", padding: "0 24px" }}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", gap: "24px" }}
              >
                {/* Avatar */}
                <div style={{ 
                  width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: msg.sender === "ai" ? "var(--accent)" : "var(--surface-2)",
                  color: msg.sender === "ai" ? "var(--bg)" : "var(--t-primary)",
                  boxShadow: msg.sender === "ai" ? "0 4px 12px rgba(198,176,138,0.2)" : "none"
                }}>
                  {msg.sender === "ai" ? <Sparkles size={16} /> : <User size={16} />}
                </div>

                {/* Message Content */}
                <div style={{ flex: 1, paddingTop: "4px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: msg.sender === "ai" ? "var(--t-primary)" : "var(--t-secondary)" }}>
                    {msg.sender === "ai" ? "Architectural AI" : "You"}
                  </div>
                  <div style={{ 
                    fontSize: "15px", lineHeight: 1.6, color: "var(--t-primary)", whiteSpace: "pre-wrap"
                  }}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "24px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "1px solid var(--accent)", color: "var(--accent)" }}>
                  <Loader2 size={16} className="spin" />
                </div>
                <div style={{ flex: 1, paddingTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} style={{ width: "6px", height: "6px", background: "var(--accent)", borderRadius: "50%" }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Input Area */}
      <div style={{ background: "linear-gradient(to top, var(--bg) 60%, transparent)", padding: "24px", paddingBottom: "48px", position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <form onSubmit={handleSend} style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || isGeneratingPlan}
            placeholder="Message ARCOVA AI..."
            style={{ 
              width: "100%", background: "var(--surface-1)", border: "1px solid var(--border)", 
              color: "var(--t-primary)", padding: "20px 60px 20px 24px", borderRadius: "16px", 
              fontSize: "15px", outline: "none", transition: "border-color 0.2s",
              boxShadow: "0 -10px 40px rgba(0,0,0,0.2)"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading || isGeneratingPlan} 
            style={{ 
              position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", 
              background: (!input.trim() || isLoading) ? "var(--surface-3)" : "var(--accent)", 
              border: "none", width: "40px", height: "40px", borderRadius: "10px", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              cursor: (!input.trim() || isLoading) ? "not-allowed" : "pointer", 
              color: (!input.trim() || isLoading) ? "var(--t-muted)" : "var(--bg)",
              transition: "all 0.2s"
            }}
          >
            <Send size={18} />
          </button>
        </form>
        <div style={{ textAlign: "center", fontSize: "11px", color: "var(--t-muted)", marginTop: "12px" }}>
          ARCOVA AI can make mistakes. Verify critical structural decisions.
        </div>
      </div>

    </div>
  );
}
