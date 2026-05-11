"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Lightbulb, Map, FileText, Loader2, Sparkles, Target } from "lucide-react";

export default function DiscoveryStage({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [ideas, setIdeas] = useState("");
  const [answers, setAnswers] = useState({
    hasLand: "",
    goal: "",
  });

  const handleNext = () => {
    if (step === 2) {
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setStep(3);
      }, 2500);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <AnimatePresence mode="wait">
        
        {/* Step 0: Has Land */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card" style={{ maxWidth: "480px", width: "100%", padding: "40px", borderRadius: "24px" }}>
            <Map size={24} color="var(--cyan)" style={{ marginBottom: "16px" }} />
            <h2 className="font-display" style={{ fontSize: "24px", marginBottom: "8px" }}>Do you already own land or a property?</h2>
            <p style={{ color: "var(--t-secondary)", marginBottom: "32px", fontSize: "14px" }}>This helps us determine if we need to account for land acquisition in your roadmap.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Yes, I own an empty plot", "Yes, I own a house to renovate", "No, I am looking for land"].map(opt => (
                <button key={opt} onClick={() => { setAnswers({ ...answers, hasLand: opt }); handleNext(); }} className="btn-secondary" style={{ padding: "16px", justifyContent: "flex-start", fontSize: "15px", background: answers.hasLand === opt ? "var(--surface-2)" : "var(--surface-1)", border: answers.hasLand === opt ? "1px solid var(--cyan)" : "1px solid transparent" }}>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Goals */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card" style={{ maxWidth: "480px", width: "100%", padding: "40px", borderRadius: "24px" }}>
            <Target size={24} color="var(--emerald)" style={{ marginBottom: "16px" }} />
            <h2 className="font-display" style={{ fontSize: "24px", marginBottom: "8px" }}>What is your primary goal?</h2>
            <p style={{ color: "var(--t-secondary)", marginBottom: "32px", fontSize: "14px" }}>We'll tailor the AI analysis based on your investment or lifestyle goals.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Building my dream home", "Commercial development", "Real estate investment / Flipping", "Sustainable / Eco-living"].map(opt => (
                <button key={opt} onClick={() => { setAnswers({ ...answers, goal: opt }); handleNext(); }} className="btn-secondary" style={{ padding: "16px", justifyContent: "flex-start", fontSize: "15px", background: answers.goal === opt ? "var(--surface-2)" : "var(--surface-1)", border: answers.goal === opt ? "1px solid var(--emerald)" : "1px solid transparent" }}>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Ideas */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card" style={{ maxWidth: "560px", width: "100%", padding: "40px", borderRadius: "24px" }}>
            <Lightbulb size={24} color="var(--amber)" style={{ marginBottom: "16px" }} />
            <h2 className="font-display" style={{ fontSize: "24px", marginBottom: "8px" }}>Do you have any specific ideas or suggestions?</h2>
            <p style={{ color: "var(--t-secondary)", marginBottom: "24px", fontSize: "14px" }}>Describe your vision. Don't worry about technical terms, the AI will translate your ideas into architecture.</p>
            
            <textarea
              className="input-field"
              placeholder="e.g., I want a lot of natural light, an open kitchen, and a small garden in the center..."
              value={ideas}
              onChange={e => setIdeas(e.target.value)}
              style={{ minHeight: "160px", padding: "16px", fontSize: "15px", marginBottom: "24px", resize: "none" }}
            />
            
            <button onClick={handleNext} disabled={analyzing} className="btn-primary" style={{ width: "100%", padding: "16px", borderRadius: "100px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
              {analyzing ? <><Loader2 className="spin" size={18} /> Analysing your vision...</> : <><Sparkles size={18} /> Generate Implementation Plan</>}
            </button>
          </motion.div>
        )}

        {/* Step 3: Analysis & Roadmap */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ maxWidth: "720px", width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div className="card" style={{ padding: "32px", borderRadius: "24px" }}>
              <h2 className="font-display" style={{ fontSize: "24px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles color="var(--cyan)" /> AI Feasibility Analysis
              </h2>
              <div style={{ fontSize: "15px", color: "var(--t-secondary)", lineHeight: 1.7 }}>
                Based on your goal of <strong>{answers.goal.toLowerCase()}</strong> {answers.hasLand.includes("empty") ? "on an empty plot" : "without current land"}, we've analyzed the trajectory. Your ideas emphasize natural light and openness. Structurally, this requires a focus on large-span glazing and passive solar orientation. Budget allocation should prioritize high-efficiency fenestration.
              </div>
            </div>

            <div className="card" style={{ padding: "32px", borderRadius: "24px" }}>
              <h2 className="font-display" style={{ fontSize: "20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText color="var(--emerald)" /> Implementation Roadmap
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
                <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "2px", background: "var(--border)" }} />
                
                {[
                  { title: "Phase 1: Site Context & Technical Requirements", desc: "Define pincode, plot boundaries, and zoning rules." },
                  { title: "Phase 2: Algorithmic Space Planning", desc: "Generate 2D floor plans optimized for your ideas." },
                  { title: "Phase 3: 3D Massing & Visualization", desc: "Extrude the plan into an immersive 3D environment." },
                  { title: "Phase 4: Material Takeoff & Costing", desc: "Generate multi-tier budget estimations." },
                ].map((phase, i) => (
                  <div key={i} style={{ display: "flex", gap: "20px", position: "relative", zIndex: 1 }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "100px", background: "var(--bg)", border: i === 0 ? "2px solid var(--cyan)" : "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: i === 0 ? "var(--cyan)" : "var(--t-muted)", fontWeight: 600, fontSize: "13px", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ paddingTop: "4px" }}>
                      <div style={{ fontWeight: 600, fontSize: "15px", color: i === 0 ? "var(--t-primary)" : "var(--t-secondary)", marginBottom: "4px" }}>{phase.title}</div>
                      <div style={{ fontSize: "13px", color: "var(--t-muted)" }}>{phase.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onNext} className="btn-accent" style={{ padding: "16px", borderRadius: "100px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontSize: "16px" }}>
              Begin Phase 1: Technical Requirements <ArrowRight size={18} />
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
