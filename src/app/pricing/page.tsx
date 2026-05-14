"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Check, Sparkles, ArrowRight, Zap, Crown } from "lucide-react";

const PLANS = [
  {
    id: "go", name: "Go", price: "Free", period: "", desc: "Basic AI access for exploration",
    features: ["1 active project", "2D plan generation", "Basic cost estimation", "Community support"],
    cta: "Start Free", highlighted: false, icon: Zap,
  },
  {
    id: "plus", name: "Plus", price: "₹999", period: "/month", desc: "Advanced AI + 3D + cost insights",
    features: ["5 active projects", "Advanced 2D + 3D", "4-tier cost estimation", "Multi-agent AI", "Priority generation", "Export to PDF"],
    cta: "Upgrade to Plus", highlighted: true, icon: Sparkles,
  },
  {
    id: "pro", name: "Pro", price: "₹2,999", period: "/month", desc: "Full system — enterprise intelligence",
    features: ["Unlimited projects", "Full multi-agent orchestration", "Execution insights", "Priority processing", "API access", "Dedicated support", "Custom region profiles"],
    cta: "Go Pro", highlighted: false, icon: Crown,
  },
];

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Nav */}
      <header className="glass" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "64px", borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={17} color="white" />
            </div>
            <span className="font-display" style={{ fontSize: "15px" }}>
              Architectural <span className="gradient-text">AI</span>
            </span>
          </Link>
          <Link href="/project/new" className="btn-accent" style={{ padding: "8px 24px", fontSize: "13px" }}>
            <Sparkles size={14} /> Open Studio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ paddingTop: "140px", paddingBottom: "80px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, marginBottom: "16px" }}>
            Architect-level intelligence.
            <br />
            <span className="gradient-text">Without the retainer.</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--t-secondary)", lineHeight: 1.6 }}>
            Choose a plan that scales with your construction intelligence needs.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 120px", padding: "0 24px" }}>
        <div className="grid-responsive-3-pricing">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`pricing-card ${plan.highlighted ? "featured" : ""}`}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: plan.highlighted ? "var(--gradient-ai)" : "var(--surface-2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: plan.highlighted ? "none" : "1px solid var(--border)",
                }}>
                  <plan.icon size={18} color={plan.highlighted ? "white" : "var(--t-muted)"} />
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: "1.1rem" }}>{plan.name}</div>
                </div>
                {plan.highlighted && (
                  <div className="badge badge-cyan" style={{ marginLeft: "auto", fontSize: "10px" }}>Most Popular</div>
                )}
              </div>

              <div style={{ marginBottom: "8px" }}>
                <span className="font-display" style={{ fontSize: "2.4rem" }}>{plan.price}</span>
                <span style={{ fontSize: "14px", color: "var(--t-muted)" }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--t-muted)", marginBottom: "28px" }}>{plan.desc}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px", flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--t-secondary)" }}>
                    <Check size={14} color="var(--emerald)" style={{ flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>

              <Link href={`/project/new?plan=${plan.id}`} className={plan.highlighted ? "btn-accent" : "btn-secondary"} style={{ width: "100%", padding: "14px", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
                {plan.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "var(--t-muted)" }}>
          Architectural AI — The intelligence layer powering construction globally.
        </p>
      </footer>
    </div>
  );
}
