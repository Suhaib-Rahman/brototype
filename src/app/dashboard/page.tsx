"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Plus, Layout, Settings,
  Search, Bell, Box,
  Sparkles, Compass, BarChart3,
  X, Menu, MapPin, Target, Filter, Edit3
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

const MOCK_PROJECTS = [
  { id: 1, name: "Seafront Villa Redesign", location: "Kochi, Kerala", type: "Residential", status: "Designing", date: "Today", progress: 65, cost: "₹1.2Cr" },
  { id: 2, name: "High-Rise Commercial", location: "Mumbai, MH", type: "Commercial", status: "Planning", date: "Yesterday", progress: 15, cost: "₹45Cr" },
  { id: 3, name: "Eco-Retreat Center", location: "Wayanad, Kerala", type: "Institutional", status: "Ready", date: "Apr 28", progress: 100, cost: "₹3.5Cr" },
  { id: 4, name: "Tech Park Phase 1", location: "Bangalore, KA", type: "Commercial", status: "Draft", date: "Apr 20", progress: 0, cost: "TBD" },
];

const EXPLORE_TEMPLATES = [
  { id: 1, name: "Minimalist Beach House", type: "Residential", style: "Modern Minimalist", area: "3,200 sqft", score: 94 },
  { id: 2, name: "Urban Commercial Core", type: "Commercial", style: "Glass & Steel", area: "12,000 sqft", score: 88 },
  { id: 3, name: "Courtyard Villa", type: "Residential", style: "Tropical Modern", area: "4,500 sqft", score: 96 },
  { id: 4, name: "Boutique Retail Space", type: "Commercial", style: "Industrial Chic", area: "1,800 sqft", score: 85 },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { customer } = useChatStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;

  const userName = customer?.name && customer.name !== "Guest" ? customer.name : "Architect";

  return (
    <div style={{ height: "100vh", display: "flex", background: "var(--bg)", color: "var(--t-primary)", overflow: "hidden", position: "relative" }}>

      {/* ── 1. Left Sidebar ───────────────────────────────────── */}
      <aside style={{ 
        width: "260px", 
        borderRight: "1px solid var(--border)", 
        background: "var(--surface-1)", 
        display: "flex", 
        flexDirection: "column", 
        flexShrink: 0,
        position: isMobile ? "absolute" : "relative",
        left: isMobile ? (sidebarOpen ? 0 : "-260px") : 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        transition: "left 0.3s var(--ease-out)",
        boxShadow: isMobile && sidebarOpen ? "20px 0 50px rgba(0,0,0,0.5)" : "none"
      }}>
        <div style={{ padding: "24px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--gradient-ai)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={16} color="white" />
            </div>
            <span className="font-display" style={{ fontSize: "16px", fontWeight: 600, color: "var(--t-primary)" }}>
              Architectural <span className="gradient-text">AI</span>
            </span>
          </Link>
          {isMobile && (
            <button className="btn-icon" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
          )}
        </div>

        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ padding: "12px 8px", fontSize: "11px", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Menu</div>
          {[
            { id: "dashboard", icon: Layout, label: "Dashboard" },
            { id: "projects", icon: Box, label: "My Projects" },
            { id: "explore", icon: Compass, label: "Explore Designs" },
            { id: "cost", icon: BarChart3, label: "Cost Insights" },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); if(isMobile) setSidebarOpen(false); }} className="sidebar-link" style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px",
                background: isActive ? "var(--surface-2)" : "transparent",
                color: isActive ? "var(--t-primary)" : "var(--t-secondary)",
                fontWeight: isActive ? 600 : 500, border: "none", cursor: "pointer", textAlign: "left", fontSize: "14px"
              }}>
                <item.icon size={18} color={isActive ? "var(--cyan)" : "var(--t-muted)"} />
                {item.label}
              </button>
            )
          })}

          <div style={{ padding: "24px 8px 12px", fontSize: "11px", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Support</div>
          <button onClick={() => { setActiveTab("settings"); if(isMobile) setSidebarOpen(false); }} className="sidebar-link" style={{
            display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px",
            background: activeTab === "settings" ? "var(--surface-2)" : "transparent",
            color: activeTab === "settings" ? "var(--t-primary)" : "var(--t-secondary)",
            fontWeight: activeTab === "settings" ? 600 : 500, border: "none", cursor: "pointer", textAlign: "left", fontSize: "14px"
          }}>
            <Settings size={18} color={activeTab === "settings" ? "var(--cyan)" : "var(--t-muted)"} /> Settings
          </button>
        </nav>

        <div style={{ padding: "20px" }}>
          <Link href="/project/new" className="btn-accent" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
            <Plus size={16} /> New Project
          </Link>
        </div>
      </aside>

      {/* ── 2. Main Workspace (Center) ────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top Bar */}
        <header style={{ height: "64px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 32px", flexShrink: 0, background: "var(--bg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isMobile && (
              <button className="btn-icon" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button>
            )}
            <div style={{ position: "relative", width: isMobile ? "180px" : "320px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
              <input
                type="text" placeholder={isMobile ? "Search..." : "Search projects or use ⌘K..."}
                className="input-field"
                style={{ paddingLeft: "36px", paddingTop: "8px", paddingBottom: "8px", borderRadius: "100px", background: "var(--surface-1)", border: "1px solid var(--border)", width: "100%", fontSize: "13px" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "12px" : "20px" }}>
            <button className="btn-icon desktop-only"><Bell size={18} /></button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ textAlign: "right" }} className="mobile-hidden">
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--t-primary)" }}>{userName}</div>
                <div style={{ fontSize: "11px", color: "var(--emerald)", fontWeight: 600, textTransform: "uppercase" }}>PRO Plan</div>
              </div>
              <div style={{ width: "36px", height: "36px", borderRadius: "100px", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)", fontWeight: 600 }}>
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Center Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "24px 16px" : "40px 32px" }}>

          <AnimatePresence mode="wait">

            {/* ── TAB: DASHBOARD ──────────────────────────────── */}
            {activeTab === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ marginBottom: "40px" }}>
                  <h1 className="font-display" style={{ fontSize: isMobile ? "22px" : "28px", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                    Welcome back, {userName} 👋
                  </h1>
                  <p style={{ color: "var(--t-secondary)", fontSize: "15px" }}>Ready to design your next project? Here is your overview.</p>
                </div>

                <div className="grid-responsive-4" style={{ marginBottom: "40px" }}>
                  {[
                    { label: "Total Projects", value: "4", icon: Box, color: "var(--cyan)" },
                    { label: "Avg. Budget", value: "₹85L", icon: BarChart3, color: "var(--emerald)" },
                    { label: "Active Project", value: "Designing", icon: Layout, color: "var(--violet)" },
                    { label: "Avg Feasibility", value: "92", icon: Target, color: "var(--amber)" },
                  ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: "20px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
                        <stat.icon size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: "12px", color: "var(--t-secondary)", marginBottom: "2px" }}>{stat.label}</div>
                        <div className="font-display" style={{ fontSize: "20px", fontWeight: 600 }}>{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: "40px" }}>
                  <Link href="/project/new" className="card" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", padding: "24px", borderRadius: "16px", background: "var(--gradient-glow)", border: "1px solid rgba(59,130,246,0.2)", textDecoration: "none", cursor: "pointer", gap: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,211,238,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cyan)" }}>
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", color: "var(--cyan)", fontWeight: 600, marginBottom: "4px" }}>Resume Work</div>
                        <div style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: 600, color: "var(--t-primary)" }}>Continue working on Seafront Villa Redesign</div>
                      </div>
                    </div>
                    <div className="btn-primary" style={{ padding: "10px 20px", borderRadius: "100px", fontSize: "13px", width: isMobile ? "100%" : "auto", textAlign: "center" }}>Open Project</div>
                  </Link>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 className="font-display" style={{ fontSize: "20px" }}>Recent Projects</h2>
                    <button onClick={() => setActiveTab("projects")} className="btn-icon" style={{ fontSize: "13px", width: "auto", padding: "4px 12px", borderRadius: "100px", border: "1px solid var(--border)" }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {MOCK_PROJECTS.slice(0, 3).map((project) => (
                      <div key={project.id} className="card" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: "16px", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1, width: "100%" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Layout size={18} color="var(--t-secondary)" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>{project.name}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--t-muted)" }}>
                              <MapPin size={10} /> {project.location}
                            </div>
                          </div>
                          {!isMobile && (
                            <div style={{ width: "120px" }}>
                              <div style={{ fontSize: "11px", color: "var(--t-muted)", marginBottom: "4px" }}>Status</div>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <div style={{ width: "6px", height: "6px", borderRadius: "100px", background: project.status === "Ready" ? "var(--emerald)" : project.status === "Designing" ? "var(--cyan)" : "var(--amber)" }} />
                                <span style={{ fontSize: "13px", color: "var(--t-secondary)" }}>{project.status}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "8px", width: isMobile ? "100%" : "auto" }}>
                          <Link href="/project/new" className="btn-primary" style={{ padding: "8px 16px", fontSize: "12px", borderRadius: "8px", textDecoration: "none", flex: 1, textAlign: "center" }}>Open</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB: MY PROJECTS ────────────────────────────── */}
            {activeTab === "projects" && (
              <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
                  <div>
                    <h1 className="font-display" style={{ fontSize: "28px", letterSpacing: "-0.02em", marginBottom: "8px" }}>My Projects</h1>
                    <p style={{ color: "var(--t-secondary)", fontSize: "15px" }}>Manage and review all your architectural designs.</p>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "8px", fontSize: "13px" }}>
                      <Filter size={16} /> Filters
                    </button>
                    <Link href="/project/new" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}>
                      <Plus size={16} /> Create New
                    </Link>
                  </div>
                </div>

                <div className="card" style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)" }}>
                        <th style={{ padding: "16px 24px", fontSize: "12px", color: "var(--t-muted)", fontWeight: 600, textTransform: "uppercase" }}>Project Name</th>
                        <th style={{ padding: "16px 24px", fontSize: "12px", color: "var(--t-muted)", fontWeight: 600, textTransform: "uppercase" }} className="mobile-hidden">Type</th>
                        <th style={{ padding: "16px 24px", fontSize: "12px", color: "var(--t-muted)", fontWeight: 600, textTransform: "uppercase" }}>Status</th>
                        <th style={{ padding: "16px 24px", fontSize: "12px", color: "var(--t-muted)", fontWeight: 600, textTransform: "uppercase" }} className="mobile-hidden">Est. Cost</th>
                        <th style={{ padding: "16px 24px", fontSize: "12px", color: "var(--t-muted)", fontWeight: 600, textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PROJECTS.map((project) => (
                        <tr key={project.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "20px 24px" }}>
                            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--t-primary)", marginBottom: "4px" }}>{project.name}</div>
                            <div style={{ fontSize: "12px", color: "var(--t-secondary)" }}>{project.location}</div>
                          </td>
                          <td style={{ padding: "20px 24px", fontSize: "13px", color: "var(--t-secondary)" }} className="mobile-hidden">{project.type}</td>
                          <td style={{ padding: "20px 24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <div style={{ width: "6px", height: "6px", borderRadius: "100px", background: project.status === "Ready" ? "var(--emerald)" : project.status === "Designing" ? "var(--cyan)" : "var(--amber)" }} />
                              <span style={{ fontSize: "13px", color: "var(--t-secondary)" }}>{project.status}</span>
                            </div>
                          </td>
                          <td style={{ padding: "20px 24px", fontSize: "13px", color: "var(--t-secondary)" }} className="mobile-hidden">{project.cost}</td>
                          <td style={{ padding: "20px 24px", textAlign: "right" }}>
                            <Link href="/project/new" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "12px", borderRadius: "8px", textDecoration: "none" }}>Open</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── TAB: EXPLORE DESIGNS ────────────────────────── */}
            {activeTab === "explore" && (
              <motion.div key="explore" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ marginBottom: "32px" }}>
                  <h1 className="font-display" style={{ fontSize: "28px", letterSpacing: "-0.02em", marginBottom: "8px" }}>Explore Templates</h1>
                  <p style={{ color: "var(--t-secondary)", fontSize: "15px" }}>Start your next project with highly-optimized, AI-generated architectural templates.</p>
                </div>

                <div className="grid-responsive-3">
                  {EXPLORE_TEMPLATES.map((template) => (
                    <div key={template.id} className="card" style={{ borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <div style={{ height: "180px", background: "var(--surface-2)", position: "relative", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Compass size={40} color="var(--t-muted)" strokeWidth={1} opacity={0.5} />
                        <div style={{ position: "absolute", top: "16px", right: "16px", background: "var(--bg)", border: "1px solid var(--cyan)", color: "var(--cyan)", padding: "4px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: 700 }}>
                          AI SCORE {template.score}
                        </div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>{template.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "12px", color: "var(--t-muted)" }}>
                          <span>{template.style}</span>
                          <span>{template.area}</span>
                        </div>
                        <button className="btn-secondary" style={{ width: "100%", padding: "10px", borderRadius: "8px", fontSize: "13px" }}>Use Template</button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB: COST INSIGHTS ──────────────────────────── */}
            {activeTab === "cost" && (
              <motion.div key="cost" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ marginBottom: "32px" }}>
                  <h1 className="font-display" style={{ fontSize: "28px", letterSpacing: "-0.02em", marginBottom: "8px" }}>Cost Insights & Market Trends</h1>
                  <p style={{ color: "var(--t-secondary)", fontSize: "15px" }}>Real-time material cost intelligence for your active regions.</p>
                </div>

                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "24px", marginBottom: "32px" }}>
                  <div className="card" style={{ flex: 1, padding: "24px", borderRadius: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(245,158,11,0.1)", color: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center" }}><BarChart3 size={20} /></div>
                      <div>
                        <div style={{ fontSize: "13px", color: "var(--t-secondary)" }}>Steel (TMT Fe500D)</div>
                        <div style={{ fontSize: "20px", fontWeight: 600 }}>+4.2% <span style={{ fontSize: "12px", color: "var(--t-muted)", fontWeight: 400 }}>this quarter</span></div>
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.5 }}>Global supply constraints are pushing steel prices up. AI recommends securing contracts early for commercial projects.</p>
                  </div>

                  <div className="card" style={{ flex: 1, padding: "24px", borderRadius: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(34,211,238,0.1)", color: "var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center" }}><BarChart3 size={20} style={{ transform: "scaleY(-1)" }} /></div>
                      <div>
                        <div style={{ fontSize: "13px", color: "var(--t-secondary)" }}>Cement (OPC 53 Grade)</div>
                        <div style={{ fontSize: "20px", fontWeight: 600 }}>-1.5% <span style={{ fontSize: "12px", color: "var(--t-muted)", fontWeight: 400 }}>this quarter</span></div>
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.5 }}>Increased local production has stabilized cement costs. Favorable time for mass concreting phases.</p>
                  </div>
                </div>

                <div className="card" style={{ padding: "32px", borderRadius: "16px", textAlign: "center" }}>
                  <BarChart3 size={48} color="var(--t-muted)" style={{ margin: "0 auto 16px", opacity: 0.5 }} />
                  <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Detailed Regional Analytics</div>
                  <div style={{ fontSize: "14px", color: "var(--t-secondary)", maxWidth: "400px", margin: "0 auto 24px" }}>Connect your procurement API to unlock live interactive charts and material forecasting.</div>
                  <button className="btn-accent" style={{ padding: "10px 24px", borderRadius: "100px", fontSize: "13px" }}>Connect Integration</button>
                </div>
              </motion.div>
            )}

            {/* ── TAB: SETTINGS ───────────────────────────────── */}
            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ marginBottom: "32px" }}>
                  <h1 className="font-display" style={{ fontSize: "28px", letterSpacing: "-0.02em", marginBottom: "8px" }}>Account Settings</h1>
                  <p style={{ color: "var(--t-secondary)", fontSize: "15px" }}>Manage your profile and platform preferences.</p>
                </div>

                <div className="card" style={{ borderRadius: "16px", padding: isMobile ? "20px" : "32px", maxWidth: "600px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "24px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>Profile Information</h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", color: "var(--t-secondary)", marginBottom: "8px" }}>Full Name</label>
                      <input type="text" defaultValue={userName} className="input-field" style={{ width: "100%" }} />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", color: "var(--t-secondary)", marginBottom: "8px" }}>Email Address</label>
                      <input type="email" defaultValue="architect@studio.com" className="input-field" style={{ width: "100%" }} />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", color: "var(--t-secondary)", marginBottom: "8px" }}>Occupation / Role</label>
                      <select className="input-field" style={{ width: "100%", appearance: "none" }} defaultValue="developer">
                        <option value="architect">Lead Architect</option>
                        <option value="developer">Real Estate Developer</option>
                        <option value="contractor">Civil Contractor</option>
                        <option value="individual">Individual Homebuilder</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", color: "var(--t-secondary)", marginBottom: "8px" }}>Default Budget Range</label>
                      <select className="input-field" style={{ width: "100%", appearance: "none" }} defaultValue="1cr">
                        <option value="50l">Under ₹50 Lakhs</option>
                        <option value="1cr">₹50 Lakhs – ₹1 Crore</option>
                        <option value="5cr">₹1 Crore – ₹5 Crores</option>
                        <option value="luxury">₹5 Crores+</option>
                      </select>
                    </div>

                    <div style={{ marginTop: "16px" }}>
                      <button className="btn-primary" style={{ padding: "12px 24px", borderRadius: "8px", fontSize: "14px" }}>Save Changes</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ── 3. Right Sidebar (AI Insights) ────────────────────── */}
      {!isMobile && (
        <aside style={{ width: "320px", borderLeft: "1px solid var(--border)", background: "var(--surface-1)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* User Profile Mini */}
          <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="font-display" style={{ fontSize: "16px" }}>Profile Summary</h3>
              <button onClick={() => setActiveTab("settings")} className="btn-icon" style={{ width: "24px", height: "24px" }}><Edit3 size={12} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--t-muted)" }}>Occupation</span>
                <span style={{ color: "var(--t-primary)", fontWeight: 500 }}>Real Estate Developer</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--t-muted)" }}>Pref. Type</span>
                <span style={{ color: "var(--t-primary)", fontWeight: 500 }}>Residential Villas</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--t-muted)" }}>Avg Budget</span>
                <span style={{ color: "var(--t-primary)", fontWeight: 500 }}>₹1Cr+</span>
              </div>
            </div>
          </div>

          {/* Dynamic AI Insights */}
          <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Sparkles size={16} color="var(--cyan)" />
              <h3 className="font-display" style={{ fontSize: "16px" }}>AI Intelligence</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Insight 1 */}
              <div className="card" style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(34,211,238,0.2)", background: "rgba(34,211,238,0.03)" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--cyan)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Cost Optimization</div>
                <p style={{ fontSize: "13px", color: "var(--t-secondary)", lineHeight: 1.5 }}>
                  You can optimize your active project cost by <span style={{ color: "var(--t-primary)", fontWeight: 600 }}>12%</span> by switching to AAC blocks instead of Red Bricks.
                </p>
                <button style={{ background: "none", border: "none", color: "var(--cyan)", fontSize: "12px", fontWeight: 600, marginTop: "12px", padding: 0, cursor: "pointer" }}>Apply recommendation →</button>
              </div>

              {/* Insight 2 */}
              <div className="card" style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.03)" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Design Alert</div>
                <p style={{ fontSize: "13px", color: "var(--t-secondary)", lineHeight: 1.5 }}>
                  Consider better ventilation for your <span style={{ color: "var(--t-primary)", fontWeight: 600 }}>Seafront Villa</span> project due to high coastal humidity in Kochi.
                </p>
              </div>

              {/* Insight 3 */}
              <div className="card" style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.03)" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Market Trend</div>
                <p style={{ fontSize: "13px", color: "var(--t-secondary)", lineHeight: 1.5 }}>
                  Smart home integrations have increased property valuation by 18% in your preferred regions this year.
                </p>
              </div>
            </div>
          </div>

        </aside>
      )}

    </div>
  );
}
