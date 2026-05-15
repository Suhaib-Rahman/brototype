"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Building2, Cpu, BarChart3, Globe, Layers, Shield, Zap, ChevronRight, Play, Pause } from "lucide-react";

const FEATURES = [
  { 
    id: 0, 
    icon: Cpu, 
    title: "Multi-Agent Intelligence", 
    desc: "Six specialized AI agents (Design, Structural, Cost, Climate, etc.) collaborate in real-time to negotiate the optimal building design based on your constraints.",
    image: "/ai_collaboration_ui.png",
    color: "#A78BFA"
  },
  { 
    id: 1, 
    icon: Layers, 
    title: "Technical CAD Drafting", 
    desc: "Transform natural language prompts into precise 2D technical blueprints and 3D architectural models with automated dimensioning and circulation optimization.",
    image: "/cad_drafting_ui.png",
    color: "#3B82F6"
  },
  { 
    id: 2, 
    icon: BarChart3, 
    title: "Cost Intelligence Engine", 
    desc: "Automatic Bill of Quantities (BOQ) generation synchronized with live market rates. Track every material takeoff from structural concrete to luxury finishes.",
    image: "/cost_intelligence_ui.png",
    color: "#10B981"
  },
  { 
    id: 3, 
    icon: Globe, 
    title: "Site & Topographical Analysis", 
    desc: "Deep satellite intelligence analyzing topographical contours, solar exposure, wind patterns, and local regulatory setbacks for any plot globally.",
    image: "/site_analysis_ui.png",
    color: "#22D3EE"
  },
  { 
    id: 4, 
    icon: Zap, 
    title: "Immersive Architectural Studio", 
    desc: "Experience your building before it's built with cinematic 3D renders and real-time interactive walkthroughs powered by our visual intelligence engine.",
    image: "/architectural_ai_workspace_ui.png",
    color: "#F43F5E"
  },
];

const STATS = [
  { value: "1,200+", label: "Plans Generated" },
  { value: "92%", label: "Accuracy Score" },
  { value: "6", label: "Agent System" },
  { value: "< 8s", label: "Generation Time" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [[activeFeature, direction], setFeature] = useState([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);

  const paginate = (newDirection: number) => {
    setFeature([(activeFeature + newDirection + FEATURES.length) % FEATURES.length, newDirection]);
    setIsPlaying(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setFeature([(activeFeature + 1) % FEATURES.length, 1]);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeFeature]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", opacity: mounted ? 1 : 0, transition: "opacity 0.2s ease-out" }}>
      {/* ... navbar and hero remain same ... */}
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="glass" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "64px", borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "9px",
              background: "var(--gradient-ai)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
            }}>
              <Building2 size={17} color="white" />
            </div>
            <span className="font-display" style={{ fontSize: "15px", letterSpacing: "-0.02em" }}>
              Architectural <span className="gradient-text">AI</span>
            </span>
          </div>
          <nav className="desktop-only" style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {["Projects", "Explore", "Pricing"].map(l => (
              <Link key={l} href={l === "Pricing" ? "/pricing" : l === "Projects" ? "/dashboard" : "/project/new"} style={{
                fontSize: "14px", fontWeight: 500,
                color: "var(--t-secondary)", transition: "all 0.2s",
              }}>{l}</Link>
            ))}
          </nav>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link href="/dashboard" style={{ fontSize: "13px", color: "var(--t-secondary)", fontWeight: 600 }}>
              Dashboard
            </Link>
            <Link href="/project/new" className="btn-accent" style={{ padding: "10px 24px", fontSize: "13px" }}>
              <Sparkles size={14} /> New Project
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ paddingTop: "180px", paddingBottom: "100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "600px",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}
        >
          <div className="badge badge-cyan" style={{ marginBottom: "24px" }}>
            <Zap size={12} /> AI-Powered Construction Intelligence
          </div>

          <h1 className="font-display" style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 1.0, letterSpacing: "-0.05em", marginBottom: "24px" }}>
            Design buildings with
            <br />
            <span className="gradient-text">intelligent precision</span>
          </h1>

          <p style={{ fontSize: "1.2rem", color: "var(--t-secondary)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 48px" }}>
            An end-to-end AI operating system for construction — from site analysis to floor plans, 3D models, and cost estimation.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: "16px 40px", fontSize: "16px" }}>
              Explore Platform <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 120px", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "40px" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div className="font-display" style={{ fontSize: "2.5rem", fontWeight: 800, background: "var(--gradient-ai)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "var(--t-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Showcase Carousel ────────── */}
      <section style={{ maxWidth: "1200px", margin: "0 auto 140px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 className="font-display" style={{ fontSize: "3.2rem", marginBottom: "16px", letterSpacing: "-0.04em" }}>
            A powerful platform for artificial intelligence.
            <br />
            <span style={{ opacity: 0.5 }}>Smart to the core.</span>
          </h2>
        </div>

        <div className="glass" style={{ 
          borderRadius: "48px", overflow: "hidden", border: "1px solid var(--border)",
          background: "rgba(10, 10, 12, 0.4)", boxShadow: "var(--shadow-xl)",
          position: "relative"
        }}>
          <div style={{ position: "relative", aspectRatio: "16/9", padding: "60px", overflow: "hidden" }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div 
                key={activeFeature}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe < -100 || velocity.x < -500) {
                    paginate(1);
                  } else if (swipe > 100 || velocity.x > 500) {
                    paginate(-1);
                  }
                }}
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                style={{ 
                  position: "absolute", width: "calc(100% - 120px)", height: "calc(100% - 100px)", 
                  borderRadius: "24px", overflow: "hidden", 
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 60px 120px rgba(0,0,0,1)",
                  background: "#000",
                  cursor: "grab"
                }}
                whileTap={{ cursor: "grabbing" }}
              >
                <img 
                  src={FEATURES[activeFeature].image} 
                  alt={FEATURES[activeFeature].title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                />
                
                {/* Feature Content Overlay */}
                <div style={{ 
                  position: "absolute", bottom: "40px", left: "40px", zIndex: 10,
                  maxWidth: "500px", background: "rgba(0,0,0,0.6)", padding: "32px",
                  borderRadius: "24px", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <div className="badge badge-cyan" style={{ marginBottom: "16px" }}>
                    Core Intelligence Layer 0{activeFeature + 1}
                  </div>
                  <h3 className="font-display" style={{ fontSize: "2.2rem", marginBottom: "12px", letterSpacing: "-0.02em" }}>
                    {FEATURES[activeFeature].title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.6 }}>
                    {FEATURES[activeFeature].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Footer */}
          <div style={{ 
            height: "100px", borderTop: "1px solid var(--border)", 
            display: "flex", alignItems: "center", justifyContent: "center", gap: "40px",
            background: "rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", gap: "12px" }}>
              {FEATURES.map((f, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    const newDirection = i > activeFeature ? 1 : -1;
                    setFeature([i, newDirection]);
                    setIsPlaying(false);
                  }}
                  style={{ 
                    width: i === activeFeature ? "40px" : "12px", 
                    height: "12px", 
                    borderRadius: "6px", 
                    background: i === activeFeature ? "var(--t-primary)" : "var(--t-muted)",
                    border: "none", cursor: "pointer",
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
                  }} 
                />
              ))}
            </div>
            <div style={{ width: "1px", height: "32px", background: "var(--border)" }} />
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-icon" 
              style={{ 
                borderRadius: "50%", background: "var(--surface-3)", 
                width: "54px", height: "54px", border: "1px solid var(--border-hover)",
                color: "white", transition: "all 0.2s"
              }}
            >
              {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{ marginLeft: "2px" }} />}
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{ maxWidth: "900px", margin: "0 auto 140px", padding: "0 24px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card"
          style={{ padding: "80px 48px", background: "var(--gradient-glow)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "40px" }}
        >
          <h2 className="font-display" style={{ fontSize: "2.8rem", marginBottom: "20px", letterSpacing: "-0.03em" }}>
            Ready to build intelligently?
          </h2>
          <p style={{ color: "var(--t-secondary)", marginBottom: "48px", fontSize: "1.1rem", maxWidth: "550px", margin: "0 auto" }}>
            Join the elite developers and builders using AI to transform architectural concepts into precise structural reality.
          </p>
          <Link href="/project/new" className="btn-accent" style={{ padding: "20px 56px", fontSize: "17px", borderRadius: "100px", fontWeight: 700 }}>
            Start Your First Project <ChevronRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "80px 24px", textAlign: "center", background: "var(--surface-0)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
          <Building2 size={24} color="var(--accent)" />
          <span className="font-display" style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em" }}>Architectural Intelligence</span>
        </div>
        <p style={{ fontSize: "14px", color: "var(--t-muted)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
          The operating system for modern construction. Built for India, engineered for the world.
        </p>
        <div style={{ marginTop: "48px", fontSize: "13px", color: "var(--t-ghost)" }}>
          © 2026 ARCOVA Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
