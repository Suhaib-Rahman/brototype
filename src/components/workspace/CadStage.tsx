"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PenTool, ArrowRight, Loader2, Compass, Ruler, Layers } from "lucide-react";

export default function CadStage({ onNext }: { onNext: () => void }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleStartCAD = () => {
    setAnalyzing(true);
    const steps = [
      "Initializing AI CAD Engine...",
      "Importing topological constraints...",
      "Setting up high-resolution grid (18ft x 4ft slots)...",
      "Running spatial allocation algorithms...",
      "Finalizing bounding boxes..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
         const currentStep = steps[i];
         setLogs(prev => [...prev, currentStep]);
         i++;
      } else {
        clearInterval(interval);
        setTimeout(onNext, 1000);
      }
    }, 800);
  };

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ maxWidth: "600px", width: "100%", padding: "40px", borderRadius: "24px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
            <PenTool size={24} color="var(--cyan)" />
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: "24px", letterSpacing: "-0.02em" }}>CAD Planning Engine</h2>
            <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>Configure parameters before 2D/3D generation</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "var(--surface-1)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--t-secondary)" }}><Compass size={16} /> Grid Snap</div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>1/16" Precision</div>
          </div>
          <div style={{ background: "var(--surface-1)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--t-secondary)" }}><Ruler size={16} /> Scale</div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>1:100 Metric</div>
          </div>
          <div style={{ background: "var(--surface-1)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", gridColumn: "span 2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--t-secondary)" }}><Layers size={16} /> Initial Layers</div>
            <div style={{ display: "flex", gap: "6px" }}>
              <span className="badge badge-cyan">Architecture</span>
              <span className="badge badge-rose">Structural</span>
              <span className="badge badge-amber">Electrical</span>
            </div>
          </div>
        </div>

        {analyzing && (
          <div style={{ marginBottom: "32px", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "12px", border: "1px dashed var(--border)", minHeight: "120px" }}>
            {logs.map((log, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: "13px", color: idx === logs.length - 1 ? "var(--cyan)" : "var(--t-muted)", marginBottom: "8px", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "8px" }}>
                {idx === logs.length - 1 && <Loader2 size={12} className="spin" />}
                {log}
              </motion.div>
            ))}
          </div>
        )}

        <button onClick={handleStartCAD} disabled={analyzing} className="btn-primary" style={{ width: "100%", padding: "16px", borderRadius: "100px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
           {analyzing ? "Generating Drafts..." : "Execute CAD Plan"} {!analyzing && <ArrowRight size={16} />}
        </button>

      </motion.div>
    </div>
  );
}
