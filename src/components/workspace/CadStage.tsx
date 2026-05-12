"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, ArrowRight, Loader2, Compass, Ruler, Layers, Sparkles, Send, Box, MessageSquare } from "lucide-react";

export default function CadStage({ onNext }: { onNext: () => void }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "Ready for architectural prompting...",
    "System standby: Waiting for design directives."
  ]);

  const handleExecute = () => {
    if (!prompt.trim()) return;
    setAnalyzing(true);
    setLogs(prev => [...prev, `> Executing: ${prompt}`, "Processing structural constraints..."]);
    
    setTimeout(() => {
      setLogs(prev => [...prev, "Optimizing spatial adjacency...", "Verifying compliance...", "Drafting initial CAD layers..."]);
      setTimeout(() => {
        setAnalyzing(false);
        setLogs(prev => [...prev, "Draft complete. Ready for 2D View."]);
      }, 2000);
    }, 1500);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden" }}>
      
      {/* Drafting Studio Main Area */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", padding: isMobile ? "16px" : "40px", background: "var(--bg)" }}>
        <div style={{ marginBottom: "32px" }}>
          <div className="badge badge-cyan" style={{ marginBottom: "12px" }}>
            <PenTool size={10} /> Phase 1: CAD Drafting
          </div>
          <h1 className="font-display" style={{ fontSize: isMobile ? "1.8rem" : "2.4rem", marginBottom: "8px" }}>
            Floor Planning Studio
          </h1>
          <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>
            Refine your architectural logic through high-fidelity prompting.
          </p>
        </div>

        {/* Visual Feedback / Grid */}
        <div style={{ 
          flex: 1, background: "var(--surface-1)", borderRadius: "24px", border: "1px solid var(--border)",
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px", position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <AnimatePresence>
            {!analyzing && logs.length > 2 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                style={{ textAlign: "center", zIndex: 10 }}
              >
                <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "var(--surface-2)", border: "1px solid var(--cyan)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <Layers size={32} color="var(--cyan)" />
                </div>
                <h3 className="font-display">Draft Generated</h3>
                <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>Ready to proceed to 2D Plan detail.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Log Feed */}
          <div style={{ 
            position: "absolute", bottom: "20px", left: "20px", right: "20px", 
            maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" 
          }}>
            {logs.slice(-5).map((log, i) => (
              <div key={i} style={{ fontSize: "12px", color: i === 4 ? "var(--cyan)" : "var(--t-muted)", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "var(--t-secondary)" }}>[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div style={{ marginTop: "24px", position: "relative" }}>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'Ensure the living room has double height ceiling and direct access to the garden...'"
            style={{
              width: "100%", background: "var(--surface-1)", border: "1px solid var(--border)",
              borderRadius: "16px", padding: "16px", paddingRight: "60px", color: "var(--t-primary)",
              fontSize: "14px", minHeight: "80px", resize: "none", outline: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}
          />
          <button 
            onClick={handleExecute}
            disabled={analyzing || !prompt.trim()}
            style={{
              position: "absolute", right: "12px", bottom: "12px", width: "40px", height: "40px",
              borderRadius: "12px", background: "var(--cyan)", border: "none", display: "flex",
              alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--bg)"
            }}
          >
            {analyzing ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>

      {/* Side Control Panel */}
      {!isMobile && (
        <div style={{ width: "320px", borderLeft: "1px solid var(--border)", background: "var(--surface-1)", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>Drafting Settings</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "var(--surface-2)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--t-muted)", marginBottom: "4px" }}>Grid Precision</div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>0.01mm (High Precision)</div>
              </div>
              <div style={{ background: "var(--surface-2)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--t-muted)", marginBottom: "4px" }}>Scale</div>
                <div style={{ fontSize: "13px", fontWeight: 600 }}>1:100 Metric Standard</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            <button className="btn-primary" onClick={onNext} style={{ width: "100%", padding: "14px" }}>
              Proceed to 2D Plan <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {isMobile && (
        <div style={{ padding: "0 16px 24px" }}>
           <button className="btn-primary" onClick={onNext} style={{ width: "100%", padding: "14px" }}>
              Proceed to 2D Plan <ArrowRight size={16} />
            </button>
        </div>
      )}
    </div>
  );
}
