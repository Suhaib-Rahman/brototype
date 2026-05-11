"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Building2, Cpu, BarChart3, Globe, Layers, Shield, Zap, ChevronRight } from "lucide-react";

const FEATURES = [
  { icon: Cpu, title: "Multi-Agent AI", desc: "6 specialised AI agents work in parallel — Design, Climate, Cost, Compliance, Structural, and Optimization.", color: "#3B82F6" },
  { icon: Layers, title: "2D + 3D Generation", desc: "From constraints to architectural floor plans and immersive 3D walkthrough in seconds.", color: "#22D3EE" },
  { icon: BarChart3, title: "Cost Intelligence", desc: "4-tier cost estimation with material takeoffs, from Economy to Luxury, region-adjusted.", color: "#10B981" },
  { icon: Globe, title: "Global Ready", desc: "Adaptable to any geography, building code, and regulatory system. Starting with India.", color: "#8B5CF6" },
  { icon: Shield, title: "Compliance Engine", desc: "Automated zoning checks, setback validation, and building code compliance verification.", color: "#F59E0B" },
  { icon: Zap, title: "Real-time Edits", desc: "Natural language plan edits — 'Add balcony', 'Increase privacy' — with instant visual feedback.", color: "#F43F5E" },
];

const STATS = [
  { value: "1,200+", label: "Plans Generated" },
  { value: "92%", label: "Accuracy Score" },
  { value: "6", label: "Agent System" },
  { value: "< 8s", label: "Generation Time" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
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
          <nav className="desktop-only" style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {["Projects", "Explore", "Pricing"].map(l => (
              <Link key={l} href={l === "Pricing" ? "/pricing" : l === "Projects" ? "/dashboard" : "/project/new"} style={{
                padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 500,
                color: "var(--t-secondary)", transition: "all 0.2s",
              }}>{l}</Link>
            ))}
          </nav>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link href="/dashboard" className="btn-ghost" style={{ padding: "8px 24px", fontSize: "13px" }}>
              Login
            </Link>
            <Link href="/project/new" className="btn-accent" style={{ padding: "8px 24px", fontSize: "13px" }}>
              <Sparkles size={14} /> New Project
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ paddingTop: "160px", paddingBottom: "120px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "600px",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, rgba(34,211,238,0.05) 40%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.3,
          backgroundImage: "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px", pointerEvents: "none",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}
        >
          <div className="badge badge-cyan" style={{ marginBottom: "24px" }}>
            <Zap size={12} /> AI-Powered Construction Intelligence
          </div>

          <h1 className="font-display" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "24px" }}>
            Design buildings with
            <br />
            <span className="gradient-text">intelligent precision</span>
          </h1>

          <p style={{ fontSize: "1.2rem", color: "var(--t-secondary)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 48px" }}>
            An end-to-end AI operating system for construction — from site analysis to floor plans, 3D models, and cost estimation. Built for India, scaling globally.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: "16px 40px", fontSize: "16px" }}>
              Go to Dashboard <ArrowRight size={18} />
            </Link>
            <Link href="/pricing" className="btn-ghost" style={{ padding: "16px 32px", fontSize: "15px" }}>
              View Plans
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section style={{ maxWidth: "900px", margin: "0 auto 100px", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}
        >
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "24px" }}>
              <div className="font-display" style={{ fontSize: "2.2rem", marginBottom: "4px", background: "var(--gradient-ai)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "var(--t-muted)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features Grid ──────────────────────────────────── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto 120px", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <h2 className="font-display" style={{ fontSize: "2.4rem", marginBottom: "16px" }}>
            One platform. Complete intelligence.
          </h2>
          <p style={{ color: "var(--t-secondary)", fontSize: "1.05rem", maxWidth: "550px", margin: "0 auto" }}>
            Six AI agents orchestrated to deliver architect-level output — without hiring architects.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-glow"
              style={{ padding: "32px", cursor: "default" }}
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: `${f.color}15`, display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px", border: `1px solid ${f.color}30`,
              }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 className="font-display" style={{ fontSize: "1.1rem", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--t-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{ maxWidth: "800px", margin: "0 auto 120px", padding: "0 24px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card"
          style={{ padding: "64px 48px", background: "var(--gradient-glow)", border: "1px solid rgba(59,130,246,0.15)" }}
        >
          <h2 className="font-display" style={{ fontSize: "2rem", marginBottom: "16px" }}>
            Ready to build intelligently?
          </h2>
          <p style={{ color: "var(--t-secondary)", marginBottom: "32px", fontSize: "1.05rem" }}>
            Create your first AI-powered floor plan in under 60 seconds.
          </p>
          <Link href="/project/new" className="btn-accent" style={{ padding: "16px 40px", fontSize: "16px" }}>
            Start Free <ChevronRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
          <Building2 size={16} color="var(--accent)" />
          <span className="font-display" style={{ fontSize: "13px" }}>Architectural AI</span>
        </div>
        <p style={{ fontSize: "12px", color: "var(--t-muted)" }}>
          The intelligence layer powering construction globally — adaptable to any geography, any building type, and any regulatory system.
        </p>
      </footer>
    </div>
  );
}
