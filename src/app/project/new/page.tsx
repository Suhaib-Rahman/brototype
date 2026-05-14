"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, MapPin, Layout, Box, BarChart3, FileText,
  ChevronLeft, ChevronRight, Sparkles, Command, PanelRightClose,
  PanelRightOpen, Menu, PenTool, Database, Users
} from "lucide-react";
import { useUIStore, WorkspaceStage } from "@/store/useUIStore";
import { AIStudioView } from "@/components/workspace/AIStudioView";
import LocationStage from "@/components/workspace/LocationStage";
import CadStage from "@/components/workspace/CadStage";
import PlanStage from "@/components/workspace/PlanStage";
import ThreeDStage from "@/components/workspace/ThreeDStage";
import MaterialStage from "@/components/workspace/MaterialStage";
import CinematicStudio from "@/components/workspace/CinematicStudio";
import CostEstimationStage from "@/components/workspace/CostEstimationStage";
import CollaborationStage from "@/components/workspace/CollaborationStage";
import SummaryStage from "@/components/workspace/SummaryStage";
import IntelligencePanel from "@/components/workspace/IntelligencePanel";
import DraftingStage from "@/components/workspace/DraftingStage";
import CommandPalette from "@/components/workspace/CommandPalette";

const STAGES: { id: WorkspaceStage; label: string; icon: typeof Sparkles }[] = [
  { id: "onboarding", label: "01 Lifestyle IQ", icon: Sparkles },
  { id: "location", label: "02 Site Input", icon: MapPin },
  { id: "cad", label: "03 Regulatory IQ", icon: PenTool },
  { id: "plan", label: "04 Spatial Zoning", icon: Layout },
  { id: "drafting", label: "05 Technical Drafting", icon: FileText },
  { id: "3d", label: "06 3D Studio", icon: Box },
  { id: "material", label: "07 Material Intel", icon: Database },
  { id: "cinematic", label: "08 Cinematic Studio", icon: Sparkles },
  { id: "cost", label: "09 Cost Intelligence", icon: BarChart3 },
  { id: "collaboration", label: "10 Collaboration", icon: Users },
  { id: "summary", label: "11 Project Summary", icon: FileText },
];

export default function WorkspacePage() {
  const {
    currentStage, setStage, sidebarCollapsed, setSidebarCollapsed,
    rightPanelOpen, setRightPanelOpen, commandPaletteOpen, setCommandPaletteOpen,
    demoMode, notification, clearNotification,
  } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Command palette shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const currentIdx = STAGES.findIndex(s => s.id === currentStage);
  const goNext = useCallback(() => {
    if (currentIdx < STAGES.length - 1) setStage(STAGES[currentIdx + 1].id);
  }, [currentIdx, setStage]);

  if (!mounted) return null;

  const showRightPanel = rightPanelOpen && ["plan", "3d", "material", "cinematic", "cost", "summary"].includes(currentStage);

  return (
    <div style={{ background: "var(--bg)", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ── Top Nav ─────────────────────────────────────────── */}
      <header className="glass" style={{
        height: "52px", borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none",
        borderBottom: "1px solid var(--border)", flexShrink: 0,
        display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Mobile Menu Toggle */}
          <button 
            className="btn-icon mobile-only" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ border: "none" }}
          >
            <Menu size={18} />
          </button>

          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "7px",
              background: "var(--gradient-ai)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Building2 size={14} color="white" />
            </div>
            <span className="font-display mobile-hidden" style={{ fontSize: "13px" }}>
              Architectural <span className="gradient-text">AI</span>
            </span>
          </Link>
          <div style={{ width: "1px", height: "20px", background: "var(--border)" }} className="desktop-only" />
          <span className="desktop-only" style={{ fontSize: "13px", color: "var(--t-muted)", fontWeight: 500 }}>
            {STAGES[currentIdx]?.label}
          </span>
        </div>

        {/* Stage pills — center */}
        <div className="desktop-only" style={{ display: "flex", gap: "2px", background: "var(--surface-2)", padding: "3px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
          {STAGES.map((s, i) => {
            const isActive = currentStage === s.id;
            const isDone = i < currentIdx;
            return (
              <button key={s.id} onClick={() => setStage(s.id)} style={{
                padding: "5px 14px", borderRadius: "var(--radius-full)", fontSize: "12px", fontWeight: 500,
                background: isActive ? "var(--bg)" : "transparent",
                color: isActive ? "var(--t-primary)" : isDone ? "var(--emerald)" : "var(--t-muted)",
                border: "none", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "5px",
                boxShadow: isActive ? "var(--shadow-sm)" : "none",
              }}>
                <s.icon size={12} />
                {s.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {demoMode && (
            <div className="badge badge-cyan desktop-only" style={{ fontSize: "10px" }}>DEMO MODE</div>
          )}
          <button className="btn-icon desktop-only" onClick={() => setCommandPaletteOpen(true)} title="Command Palette (⌘K)">
            <Command size={14} />
          </button>
          {["plan", "3d", "cinematic", "cost", "collaboration", "summary"].includes(currentStage) && (
            <button className="btn-icon" onClick={() => setRightPanelOpen(!rightPanelOpen)}>
              {rightPanelOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            </button>
          )}
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* Left Sidebar */}
        <aside style={{
          position: isMobile ? "absolute" : "relative",
          top: 0, bottom: 0, left: 0,
          width: isMobile ? "240px" : (sidebarCollapsed ? "48px" : "200px"),
          zIndex: 100,
          borderRight: "1px solid var(--border)",
          background: "var(--surface-1)",
          flexShrink: 0,
          display: "flex", flexDirection: "column",
          transform: isMobile && sidebarCollapsed ? "translateX(-100%)" : "translateX(0)",
          transition: "all 0.3s var(--ease-out)",
          overflow: "hidden",
        }}>
          <div style={{ padding: sidebarCollapsed && !isMobile ? "8px 6px" : "12px", display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
            {STAGES.map((s, i) => {
              const isActive = currentStage === s.id;
              const isDone = i < currentIdx;
              return (
                <button key={s.id} onClick={() => {
                  setStage(s.id);
                  if (isMobile) setSidebarCollapsed(true);
                }} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: isActive ? "var(--accent-dim)" : "transparent",
                  border: "none", cursor: "pointer", transition: "all 0.2s", width: "100%", textAlign: "left",
                  color: isActive ? "var(--accent)" : isDone ? "var(--emerald)" : "var(--t-muted)",
                }}>
                  <s.icon size={16} style={{ flexShrink: 0 }} />
                  {(!sidebarCollapsed || isMobile) && (
                    <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}>
                      {s.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button className="desktop-only" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
            padding: "12px", borderTop: "1px solid var(--border)",
            background: "transparent", border: "none", cursor: "pointer", color: "var(--t-muted)",
            display: "flex", justifyContent: "center",
          }}>
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </aside>

        {/* Center Canvas */}
        <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "100%" }}
            >
              {currentStage === "onboarding" && <AIStudioView />}
              {currentStage === "location" && <LocationStage onNext={goNext} />}
              {currentStage === "cad" && <CadStage onNext={goNext} />}
              {currentStage === "plan" && <PlanStage onNext={goNext} />}
              {currentStage === "drafting" && <DraftingStage onNext={goNext} />}
              {currentStage === "3d" && <ThreeDStage />}
              {currentStage === "material" && <MaterialStage />}
              {currentStage === "cinematic" && <CinematicStudio />}
              {currentStage === "cost" && <CostEstimationStage />}
              {currentStage === "collaboration" && <CollaborationStage />}
              {currentStage === "summary" && <SummaryStage />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right Intelligence Panel */}
        <AnimatePresence>
          {showRightPanel && (
            <motion.aside
              initial={{ width: 0, opacity: 0, x: 20 }}
              animate={{ 
                width: isMobile ? "100%" : 340, 
                opacity: 1,
                x: 0
              }}
              exit={{ width: 0, opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: isMobile ? "absolute" : "relative",
                top: 0, bottom: 0, right: 0,
                borderLeft: "1px solid var(--border)",
                background: "var(--surface-1)",
                flexShrink: 0,
                overflow: "hidden",
                zIndex: 200,
                boxShadow: isMobile ? "-10px 0 30px rgba(0,0,0,0.3)" : "none"
              }}
            >
              <div style={{ width: isMobile ? "100%" : "340px", height: "100%", overflowY: "auto" }}>
                <IntelligencePanel />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && <CommandPalette onClose={() => setCommandPaletteOpen(false)} />}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={clearNotification}
            style={{
              position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 500,
              padding: "12px 24px", borderRadius: "var(--radius-full)",
              background: notification.type === "success" ? "var(--emerald)" : notification.type === "error" ? "var(--rose)" : "var(--accent)",
              color: "white", fontSize: "14px", fontWeight: 600,
              boxShadow: "var(--shadow-lg)", cursor: "pointer",
            }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
