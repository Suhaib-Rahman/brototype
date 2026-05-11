"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Layout, Box, BarChart3, MapPin, MessageSquare, FileText, Sparkles, Command, Zap } from "lucide-react";
import { useUIStore, WorkspaceStage } from "@/store/useUIStore";

interface CmdItem {
  id: string;
  label: string;
  icon: typeof Layout;
  group: string;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const { setStage, setCanvasTab } = useUIStore();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CmdItem[] = [
    { id: "nav-onboarding", label: "Go to Onboarding", icon: Sparkles, group: "Navigation", action: () => { setStage("onboarding"); onClose(); } },
    { id: "nav-plan", label: "Go to 2D Plan", icon: Layout, group: "Navigation", action: () => { setStage("plan"); onClose(); }, shortcut: "⌘2" },
    { id: "nav-3d", label: "Go to 3D View", icon: Box, group: "Navigation", action: () => { setStage("3d"); onClose(); }, shortcut: "⌘3" },
    { id: "nav-cost", label: "Go to Cost Estimation", icon: BarChart3, group: "Navigation", action: () => { setStage("cost"); onClose(); } },
    { id: "nav-summary", label: "Go to Summary", icon: FileText, group: "Navigation", action: () => { setStage("summary"); onClose(); } },
    { id: "ai-generate", label: "Analyze Feasibility", icon: Sparkles, group: "AI Actions", action: () => { setStage("onboarding"); onClose(); } },
    { id: "ai-optimize", label: "Optimize Layout", icon: Zap, group: "AI Actions", action: () => { setStage("plan"); onClose(); } },
  ];

  const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
  const groups = [...new Set(filtered.map(i => i.group))];

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && filtered[activeIdx]) { filtered[activeIdx].action(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filtered, activeIdx]);

  let flatIdx = -1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="cmd-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        className="cmd-palette"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <Search size={16} color="var(--t-muted)" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
            placeholder="Type a command..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--t-primary)", fontSize: "15px", fontFamily: "inherit",
            }}
          />
          <kbd style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--t-muted)" }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "320px", overflowY: "auto", padding: "8px" }}>
          {groups.map(group => (
            <div key={group}>
              <div style={{ padding: "8px 12px 4px", fontSize: "11px", fontWeight: 600, color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {group}
              </div>
              {filtered.filter(i => i.group === group).map(item => {
                flatIdx++;
                const idx = flatIdx;
                return (
                  <div
                    key={item.id}
                    className={`cmd-item ${idx === activeIdx ? "active" : ""}`}
                    onClick={item.action}
                    onMouseEnter={() => setActiveIdx(idx)}
                  >
                    <item.icon size={16} />
                    {item.label}
                    {item.shortcut && <span className="kbd">{item.shortcut}</span>}
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--t-muted)", fontSize: "14px" }}>
              No commands found
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
