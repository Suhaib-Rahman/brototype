"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, Loader2, ArrowRight } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

      // Automatically transition to the Location plotting
      setStage("location");
    } catch (error) {
      console.error(error);
      // Fallback transition
      setStage("location");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

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
          projectContext: {} 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }

      const replyText = data.reply || "";
      const isReady = replyText.includes("[GENERATE_PLAN_READY]");
      const cleanReply = replyText.replace("[GENERATE_PLAN_READY]", "").trim();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: cleanReply || "I received your message but couldn't generate a response. Please try again."
      };

      setMessages(prev => [...prev, aiMsg]);

      // If the AI signaled it has enough information, automatically trigger the plan generation!
      if (isReady) {
        handleGeneratePlan([...updatedMessages, aiMsg]);
      }

    } catch (error: any) {
      const errorMsg = error.message.includes("expired")
        ? "🚨 Architectural Intelligence Offline: Your Gemini API key has expired. Please update the .env.local file with a fresh key to continue the design process."
        : `Error connecting to AI: ${error.message}`;
        
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: errorMsg
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      
      {/* Top Header */}
      <div style={{ 
        height: "56px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", 
        padding: "0 16px", flexShrink: 0, background: "var(--surface-0)", zIndex: 10 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "22px", height: "22px", borderRadius: "5px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={11} color="white" />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--t-primary)" }} className="mobile-hidden">AI Feasibility Studio</span>
        </div>

        <button 
          onClick={() => handleGeneratePlan(messages)}
          disabled={isGeneratingPlan || messages.length < 2}
          style={{ 
            background: "var(--accent)", color: "var(--bg)", border: "none", padding: "6px 14px", borderRadius: "8px", 
            fontSize: "12px", fontWeight: 600, cursor: (isGeneratingPlan || messages.length < 2) ? "not-allowed" : "pointer", 
            display: "flex", alignItems: "center", gap: "6px", opacity: (isGeneratingPlan || messages.length < 2) ? 0.5 : 1,
            transition: "all 0.2s"
          }}
        >
          {isGeneratingPlan ? <Loader2 size={14} className="spin" /> : <><span className="mobile-hidden">Generate Plan</span><ArrowRight size={14} /></>}
        </button>
      </div>

      {/* Chat Canvas */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0 160px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", padding: "0 16px" }}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", gap: "16px" }}
              >
                {/* Avatar */}
                <div style={{ 
                  width: "28px", height: "28px", borderRadius: "6px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: msg.sender === "ai" ? "var(--accent)" : "var(--surface-2)",
                  color: msg.sender === "ai" ? "var(--bg)" : "var(--t-primary)",
                  boxShadow: msg.sender === "ai" ? "0 4px 12px rgba(198,176,138,0.2)" : "none"
                }}>
                  {msg.sender === "ai" ? <Sparkles size={14} /> : <User size={14} />}
                </div>

                {/* Message Content */}
                <div style={{ flex: 1, paddingTop: "2px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "4px", color: msg.sender === "ai" ? "var(--t-primary)" : "var(--t-secondary)" }}>
                    {msg.sender === "ai" ? "Architectural AI" : "You"}
                  </div>
                  <div style={{ 
                    fontSize: "14px", lineHeight: 1.6, color: "var(--t-primary)", whiteSpace: "pre-wrap"
                  }}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "16px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "6px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "1px solid var(--accent)", color: "var(--accent)" }}>
                  <Loader2 size={14} className="spin" />
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
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Input Area */}
      <div style={{ 
        background: "linear-gradient(to top, var(--bg) 60%, transparent)", 
        padding: "16px 16px 32px", 
        position: "fixed", 
        bottom: 0, 
        left: (mounted && window.innerWidth >= 768) ? (sidebarCollapsed ? "48px" : "200px") : 0, 
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
            placeholder="Message ARCOVA AI..."
            className="input-field"
            style={{ 
              width: "100%", background: "var(--surface-1)", border: "1px solid var(--border)", 
              color: "var(--t-primary)", padding: "16px 50px 16px 20px", borderRadius: "14px", 
              fontSize: "14px", outline: "none",
              boxShadow: "0 -10px 40px rgba(0,0,0,0.4)"
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
      </div>

    </div>
  );
}
