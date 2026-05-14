"use client";
import { useState, useEffect } from "react";
import { Send, User, CheckCircle2, Bot, Paperclip } from "lucide-react";
import { useAIEngine } from "@/store/useAIEngine";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  sender: "user" | "ai" | "architect";
  text: string;
  timestamp: string;
};

export function CollaborationView() {
  const { aiNotifications, rooms, totalArea, totalCost } = useAIEngine();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: "Welcome to the ARCOVA project space. I am your Senior Architectural AI Assistant. How can I help you optimize your design today?", timestamp: "10:00 AM" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Listen for AI Notifications and convert them to chat messages from the AI
  useEffect(() => {
    if (aiNotifications.length > 0) {
      const latest = aiNotifications[0];
      // Prevent duplicate messages if the notification hasn't changed
      if (!messages.find(m => m.text === latest.message)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages(prev => {
           const newMsg: Message = {
            id: latest.id,
            sender: "ai",
            text: latest.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return [...prev, newMsg];
        });

        // If it's a major optimization, simulate the human architect responding to the AI's change
        if (latest.type === 'optimization') {
          setTimeout(() => {
            setMessages(prev => {
              const newMsg: Message = {
                id: Date.now().toString(),
                sender: "architect",
                text: "I saw the AI replaced the Italian Marble with Ceramic Tiles. That's a smart value-engineering move, it saves us a lot of budget without compromising the core aesthetic.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              return [...prev, newMsg];
            });
          }, 3000);
        }
      }
    }
  }, [aiNotifications, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
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
          projectContext: { rooms, totalArea, totalCost }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response from AI");
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Error: ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", background: "var(--bg)", color: "var(--t-primary)" }}>
      
      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div style={{ height: "80px", borderBottom: "1px solid var(--border)", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Project Communications</h2>
            <div style={{ fontSize: "13px", color: "var(--t-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", background: "var(--accent)", borderRadius: "50%" }} /> AI & Architecture Team Active
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{ background: "transparent", color: "var(--t-primary)", border: "1px solid var(--border)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              View Approvals
            </button>
            <button style={{ background: "rgba(198,176,138,0.1)", color: "var(--accent)", border: "1px solid var(--accent)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Request Review
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, overflowY: "auto", padding: "48px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  display: "flex", 
                  gap: "16px", 
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row" 
                }}
              >
                <div style={{ 
                  width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: msg.sender === "ai" ? "rgba(198,176,138,0.1)" : msg.sender === "architect" ? "var(--surface-2)" : "var(--accent)",
                  color: msg.sender === "ai" ? "var(--accent)" : msg.sender === "architect" ? "var(--t-primary)" : "var(--bg)",
                  border: msg.sender === "ai" ? "1px solid rgba(198,176,138,0.3)" : "none"
                }}>
                  {msg.sender === "ai" ? <Bot size={18} /> : <User size={18} />}
                </div>

                <div style={{ maxWidth: "60%" }}>
                  <div style={{ 
                    display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", 
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" 
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      {msg.sender === "ai" ? "ARCOVA AI" : msg.sender === "architect" ? "Priya (Lead Architect)" : "You"}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--t-muted)" }}>{msg.timestamp}</span>
                  </div>
                  
                  <div style={{ 
                    padding: "16px", borderRadius: "12px", fontSize: "14px", lineHeight: 1.5,
                    background: msg.sender === "user" ? "var(--surface-2)" : "var(--surface-1)",
                    border: msg.sender === "ai" ? "1px solid var(--accent)" : "1px solid var(--border)",
                    color: msg.sender === "ai" ? "var(--accent)" : "var(--t-primary)",
                    borderTopRightRadius: msg.sender === "user" ? "0" : "12px",
                    borderTopLeftRadius: msg.sender !== "user" ? "0" : "12px",
                  }}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div style={{ padding: "24px 48px", borderTop: "1px solid var(--border)" }}>
          <form onSubmit={handleSend} style={{ position: "relative" }}>
            <button type="button" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--t-muted)", cursor: "pointer" }}>
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI to modify the plan, or send a message to your architect..."
              disabled={isLoading}
              style={{ width: "100%", background: "var(--surface-1)", border: "1px solid var(--border)", color: "var(--t-primary)", padding: "20px 60px 20px 52px", borderRadius: "12px", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
            <button type="submit" disabled={isLoading} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: isLoading ? "var(--surface-3)" : "var(--accent)", border: "none", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: isLoading ? "not-allowed" : "pointer", color: "var(--bg)" }}>
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>

      {/* Right Sidebar (Approvals/Tasks) */}
      <div style={{ width: "320px", borderLeft: "1px solid var(--border)", background: "var(--surface-0)", padding: "32px 24px", display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--t-muted)" }}>Pending Approvals</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-1)" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Approve Facade Material</div>
            <div style={{ fontSize: "12px", color: "var(--t-secondary)", marginBottom: "16px" }}>The AI suggests switching to Aluminum Composite Panels for weather resistance.</div>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "8px", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid #10b981", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <CheckCircle2 size={14} /> Approve Change
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
