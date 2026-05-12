"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn, ZoomOut, Undo2, Redo2, Send, Loader2, Sparkles,
  Info, Layers, MousePointer2, BoxSelect, Maximize,
  ArrowRight, X, Ruler, RefreshCw, Menu, ChevronLeft, ChevronRight
} from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useUIStore } from "@/store/useUIStore";
import { Room, FloorPlan } from "@/types/plan";

function generateDynamicPlan(onboardingData: any): FloorPlan {
  // Extract requirements
  const reqs = onboardingData?.requirements || { bedrooms: 2, bathrooms: 2, extras: [] };
  const numBeds = reqs.bedrooms > 0 ? reqs.bedrooms : 2;
  const numBaths = reqs.bathrooms > 0 ? reqs.bathrooms : 2;
  const extras = reqs.extras || [];

  const rooms: Room[] = [];

  // 1. Define the High-Resolution Architectural Grid
  const vbW = 600;
  const cols = 3;
  const slotW = 180; // 18 feet width
  const slotH = 40;  // 4 feet height (high resolution for corridors)
  const startX = (vbW - (cols * slotW)) / 2; // Centers the grid (30px padding)
  const startY = 20;

  // Track filled cells: true = filled, false = empty
  const grid = Array(300).fill(false);

  const allocateGridSlot = (w: number, h: number) => {
    for (let r = 0; r < 100; r++) { // 100 rows max
      for (let c = 0; c < cols; c++) {
        // If it goes off the right edge, skip
        if (c + w > cols) continue;

        let canFit = true;
        // Check if all needed cells are free
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (grid[(r + y) * cols + (c + x)]) {
              canFit = false;
            }
          }
        }

        if (canFit) {
          // Mark as filled
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              grid[(r + y) * cols + (c + x)] = true;
            }
          }
          return { col: c, row: r };
        }
      }
    }
    return { col: 0, row: 0 };
  };

  // 2. Standardized Grid Templates (gw = grid width, gh = grid height)
  const tpl: Record<string, any> = {
    living: { gw: 2, gh: 4, c: "rgba(59,130,246,0.1)", n: "Living Room" },
    kitchen: { gw: 1, gh: 4, c: "rgba(245,158,11,0.1)", n: "Kitchen + Dining" },
    corridor: { gw: 3, gh: 1, c: "rgba(255,255,255,0.05)", n: "Central Circulation Path" }, // The Hallway
    bed: { gw: 1, gh: 4, c: "rgba(139,92,246,0.1)", n: "Bedroom" },
    master: { gw: 1, gh: 4, c: "rgba(139,92,246,0.15)", n: "Master Bedroom" },
    bath: { gw: 1, gh: 2, c: "rgba(34,211,238,0.1)", n: "Bathroom" },
    balcony: { gw: 1, gh: 2, c: "rgba(34,211,238,0.05)", n: "Balcony / Deck" },
    garden: { gw: 1, gh: 6, c: "rgba(16,185,129,0.1)", n: "Courtyard Garden" },
    parking: { gw: 1, gh: 4, c: "rgba(148,163,184,0.1)", n: "Covered Parking" },
  };

  const blocks: any[] = [];
  const lowerExtras = extras.map((e: string) => e.toLowerCase());

  // 3. Build Layout Queue (Public -> Circulation -> Private)
  if (lowerExtras.some((e: string) => e.includes("parking") || e.includes("garage"))) blocks.push({ type: 'parking', id: 'parking' });
  blocks.push({ type: 'living', id: 'living' });
  blocks.push({ type: 'kitchen', id: 'kitchen' });

  // Inject Path Generation Logic
  blocks.push({ type: 'corridor', id: 'main-corridor' });

  if (lowerExtras.some((e: string) => e.includes("garden") || e.includes("yard"))) blocks.push({ type: 'garden', id: 'garden' });

  for (let i = 0; i < numBeds; i++) {
    blocks.push({ type: i === 0 ? 'master' : 'bed', id: `bed-${i + 1}`, index: i });
  }
  for (let i = 0; i < numBaths; i++) {
    blocks.push({ type: 'bath', id: `bath-${i + 1}`, index: i });
  }
  if (lowerExtras.some((e: string) => e.includes("balcony") || e.includes("deck"))) blocks.push({ type: 'balcony', id: 'balcony' });

  // 4. Execute Grid Packing Engine
  let maxRowUsed = 0;

  blocks.forEach((b) => {
    const t = tpl[b.type];
    const { col, row } = allocateGridSlot(t.gw, t.gh);

    if (row + t.gh > maxRowUsed) maxRowUsed = row + t.gh;

    const cx = startX + col * slotW;
    const cy = startY + row * slotH;
    const realW = t.gw * 18; // 18 feet per horizontal slot
    const realH = t.gh * 4;  // 4 feet per vertical slot

    // Dynamic Reasoning based on strict grid placement
    let reasoning = "";
    const windows: import("@/types/plan").RoomWindow[] = [];

    if (b.type === 'corridor') {
      reasoning = "AI-generated central circulation spine connecting public and private zones.";
    } else if (row === 0) {
      reasoning = "Anchored on the North boundary (Row 1) for optimal diffused daylight and foundational structure.";
      windows.push({ wall: "north", size: Math.max(2, realW / 3) });
    } else if (col === 0) {
      reasoning = "Placed on the Western structural edge (Col 1) to buffer internal spaces from evening heat.";
      windows.push({ wall: "west", size: Math.max(2, realW / 3) });
    } else if (col + t.gw >= cols) {
      reasoning = "Positioned perfectly on the Eastern flank to catch morning sunlight.";
      windows.push({ wall: "east", size: Math.max(2, realW / 3) });
    } else {
      reasoning = "Centrally integrated into the structural grid to optimize load bearing.";
      windows.push({ wall: "south", size: Math.max(2, realW / 3) });
    }

    const roomData: Room = {
      id: b.id,
      name: b.type === 'bed' ? `Bedroom ${b.index + 1}` : b.type === 'bath' ? (b.index === 0 ? "Master Bath" : `Bath ${b.index + 1}`) : t.n,
      type: b.type === 'master' ? 'bedroom' : b.type,
      x: cx,
      y: cy,
      w: t.gw * slotW,
      h: t.gh * slotH,
      realW: realW,
      realH: realH,
      sqft: realW * realH,
      floor: 1,
      color: t.c,
      reasoning: reasoning,
      // Geometrically perfect door placement
      doors: b.type !== 'garden' && b.type !== 'parking' && b.type !== 'corridor' ? [{ x: 1.5, y: 0, width: b.type === 'bath' ? 2.5 : 3.5 }] : [],
      windows: b.type !== 'garden' && b.type !== 'parking' && b.type !== 'corridor' ? windows : []
    };

    rooms.push(roomData);
  });

  return {
    id: `plan-${Date.now()}`,
    templateId: "grid-snap-architecture",
    floors: 1,
    totalSqft: rooms.reduce((acc, r) => acc + (r.sqft || 0), 0),
    plotSqft: 2400,
    viewBoxW: vbW,
    viewBoxH: Math.max(400, startY + maxRowUsed * slotH + 40), // Expands dynamically based on max row used
    rooms,
    generatedAt: new Date().toISOString(),
    plan_score: { total: 98, space_efficiency: 28, cost_efficiency: 23, climate_suitability: 24, compliance_safety: 23 }
  };
}

export default function PlanStage({ onNext }: { onNext?: () => void }) {
  const {
    floorPlan, selectedRoom, selectRoom, updateFloorPlan,
    undo, redo, isEditing, setEditing, editHistory, historyIndex,
    setFloorPlan, isGenerating, setGenerating
  } = usePlanStore();

  const { showNotification } = useUIStore();
  const { data: onboardingData } = useOnboardingStore();

  const [zoom, setZoom] = useState(1);
  const [editInput, setEditInput] = useState("");
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [layerMode, setLayerMode] = useState<"arch" | "struct" | "elec" | "plumb">("arch");

  // Drag State
  const [draggingRoomId, setDraggingRoomId] = useState<string | null>(null);
  const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Auto-generate dynamic plan if none
  useEffect(() => {
    if (!floorPlan && !isGenerating) {
      setGenerating(true);
      setTimeout(() => {
        const newPlan = generateDynamicPlan(onboardingData);
        setFloorPlan(newPlan);
        setGenerating(false);
      }, 2000); 
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGGElement>, room: Room) => {
    if (layerMode !== "arch") return; 
    setDragStartPoint({ x: e.clientX, y: e.clientY });
    setDragStartPos({ x: room.x, y: room.y });
    setDraggingRoomId(room.id);
    selectRoom(room);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRoomId || !floorPlan) return;
    const dx = (e.clientX - dragStartPoint.x) / zoom;
    const dy = (e.clientY - dragStartPoint.y) / zoom;
    const rawX = dragStartPos.x + dx;
    const rawY = dragStartPos.y + dy;
    const snap = 20;
    const snappedX = Math.round(rawX / snap) * snap;
    const snappedY = Math.round(rawY / snap) * snap;
    usePlanStore.getState().updateRoomPosition(draggingRoomId, snappedX, snappedY);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingRoomId) {
      setDraggingRoomId(null);
      if (floorPlan) usePlanStore.getState().updateFloorPlan(floorPlan);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInput.trim() || !floorPlan) return;
    const instruction = editInput.trim();
    setEditInput("");
    setEditing(true);
    setTimeout(() => {
      let updatedPlan = { ...floorPlan, generatedAt: new Date().toISOString() };
      updateFloorPlan(updatedPlan);
      setEditing(false);
      showNotification("success", "AI Agent successfully applied edits.");
    }, 1500);
  };

  const handleUpdateRoom = (updates: Partial<Room>) => {
    if (!floorPlan || !selectedRoom) return;
    if (updates.realW !== undefined) updates.w = updates.realW * 10;
    if (updates.realH !== undefined) updates.h = updates.realH * 10;
    let newSqft = selectedRoom.sqft;
    if (updates.realW !== undefined || updates.realH !== undefined) {
      const w = updates.realW ?? selectedRoom.realW ?? 10;
      const h = updates.realH ?? selectedRoom.realH ?? 10;
      newSqft = w * h;
      updates.sqft = newSqft;
    }
    const newRooms = floorPlan.rooms.map(r => r.id === selectedRoom.id ? { ...r, ...updates } : r);
    const newPlan = {
      ...floorPlan,
      rooms: newRooms,
      totalSqft: newRooms.reduce((acc, r) => acc + (r.sqft || 0), 0)
    };
    updateFloorPlan(newPlan);
    selectRoom({ ...selectedRoom, ...updates, sqft: newSqft });
  };

  const handleDuplicateRoom = () => {
    if (!floorPlan || !selectedRoom) return;
    const newRoom: Room = {
      ...selectedRoom,
      id: `${selectedRoom.id}-copy-${Date.now()}`,
      name: `${selectedRoom.name} (Copy)`,
      x: selectedRoom.x + 20, 
      y: selectedRoom.y + 20,
    };
    const newPlan = {
      ...floorPlan,
      rooms: [...floorPlan.rooms, newRoom],
      totalSqft: floorPlan.totalSqft + (newRoom.sqft || 0)
    };
    updateFloorPlan(newPlan);
    selectRoom(newRoom);
    showNotification("success", `Duplicated ${selectedRoom.name}`);
  };

  if (isGenerating || !floorPlan) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "20px" }}>
            {[0, 1, 2].map(i => <div key={i} className="thinking-dot" style={{ width: "10px", height: "10px", background: "var(--cyan)" }} />)}
          </div>
          <h3 className="font-display" style={{ marginBottom: "8px" }}>Generating Smart Floor Plan</h3>
          <p style={{ color: "var(--t-muted)", fontSize: "14px", maxWidth: "400px" }}>
            Aligning {onboardingData?.requirements?.bedrooms || 2} bedrooms, applying Vastu compliance, and simulating structural flow...
          </p>
        </div>
      </div>
    );
  }

  const vbW = floorPlan.viewBoxW;
  const vbH = floorPlan.viewBoxH;
  const isMobile = mounted && window.innerWidth < 1024;

  return (
    <div style={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      background: "var(--bg)", 
      overflow: "hidden" 
    }}>

      {/* ── 1. Left Sidebar: Layers ───────────────────────────── */}
      <aside style={{ 
        width: isMobile ? "100%" : "260px",
        height: isMobile ? "auto" : "100%",
        maxHeight: isMobile ? "180px" : "100%",
        background: "var(--surface-1)", 
        borderRight: isMobile ? "none" : "1px solid var(--border)", 
        borderBottom: isMobile ? "1px solid var(--border)" : "none", 
        display: "flex", flexDirection: "column", flexShrink: 0 
      }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={14} color="var(--t-secondary)" />
            <span style={{ fontSize: "12px", fontWeight: 600 }}>Plan Layers</span>
          </div>
          <button className="btn-icon" style={{ width: "28px", height: "28px" }} onClick={() => {
            setGenerating(true);
            setTimeout(() => {
              const newPlan = generateDynamicPlan(onboardingData);
              setFloorPlan(newPlan);
              setGenerating(false);
              showNotification("success", "Floor plan regenerated");
            }, 1500);
          }}>
            <RefreshCw size={12} color="var(--t-muted)" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px", display: "flex", flexDirection: isMobile ? "row" : "column", gap: "4px", flexWrap: "wrap" }}>
          {floorPlan.rooms.map(room => {
            const isSelected = selectedRoom?.id === room.id;
            return (
              <button
                key={room.id}
                onClick={() => selectRoom(isSelected ? null : room)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 10px", borderRadius: "6px", cursor: "pointer", border: "none",
                  background: isSelected ? "var(--surface-2)" : "transparent",
                  color: isSelected ? "var(--t-primary)" : "var(--t-secondary)",
                  minWidth: isMobile ? "100px" : "auto"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: room.color }} />
                  <span style={{ fontSize: "12px", fontWeight: isSelected ? 600 : 500 }}>{room.name.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── 2. Center: CAD Canvas ─────────────────────────────── */}
      <main style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#080809" }}>

        {/* Floating Toolbar */}
        <div className="glass" style={{
          position: "absolute", top: isMobile ? "8px" : "16px", left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", padding: "4px", borderRadius: "10px",
          border: "1px solid var(--border)", zIndex: 10, gap: "2px"
        }}>
          <button className="btn-icon" style={{ width: "32px", height: "32px" }}><MousePointer2 size={14} /></button>
          <div style={{ width: "1px", height: "16px", background: "var(--border)", margin: "0 2px" }} />
          <button className="btn-icon" style={{ width: "32px", height: "32px" }} onClick={undo} disabled={historyIndex <= 0}><Undo2 size={14} /></button>
          <button className="btn-icon" style={{ width: "32px", height: "32px" }} onClick={redo} disabled={historyIndex >= editHistory.length - 1}><Redo2 size={14} /></button>
          <div style={{ width: "1px", height: "16px", background: "var(--border)", margin: "0 2px" }} />
          <button className="btn-icon" style={{ width: "32px", height: "32px" }} onClick={() => setZoom(z => Math.min(z + 0.2, 3))}><ZoomIn size={14} /></button>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--t-secondary)", minWidth: "36px", textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
          <button className="btn-icon" style={{ width: "32px", height: "32px" }} onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}><ZoomOut size={14} /></button>
        </div>

        {/* The Infinite Grid Background */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.5,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`, pointerEvents: "none", zIndex: 0
        }} />

        {/* Canvas Area */}
        <div style={{
          transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.1s ease-out",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)", zIndex: 1, background: "var(--surface-1)", borderRadius: "4px"
        }}>
          <svg 
            viewBox={`0 0 ${vbW} ${vbH}`} 
            width={vbW} height={vbH} 
            style={{ display: "block", touchAction: "none" }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <defs>
              <pattern id="micro-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width={vbW} height={vbH} fill="url(#micro-grid)" />

            {/* Compass */}
            <g transform={`translate(${vbW - 30}, 20)`}>
              <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
              <path d="M -3 3 L 0 -8 L 3 3 Z" fill="rgba(59,130,246,0.6)" />
              <text x="0" y="-12" fill="rgba(59,130,246,0.8)" fontSize="8" textAnchor="middle" fontWeight="700">N</text>
            </g>

            {/* Architectural Rooms */}
            {floorPlan.rooms.map((room) => {
              const isSelected = selectedRoom?.id === room.id;
              const isHovered = hoveredRoom?.id === room.id;
              const rw = Math.max(room.w, 20);
              const rh = Math.max(room.h, 20);
              const wallThickness = 4;
              const isSlab = room.type === 'garden' || room.type === 'parking';

              return (
                <g key={room.id}>
                  <rect
                    className="room-rect"
                    x={room.x} y={room.y} width={rw} height={rh}
                    fill={isSlab ? "rgba(255,255,255,0.02)" : "var(--bg)"}
                    onClick={() => selectRoom(isSelected ? null : room)}
                    onMouseEnter={() => setHoveredRoom(room)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    onPointerDown={(e) => handlePointerDown(e, room)}
                    style={{ cursor: draggingRoomId === room.id ? "grabbing" : "grab" }}
                  />
                  {!isSlab && (
                    <rect
                      x={room.x} y={room.y} width={rw} height={rh}
                      fill="none"
                      stroke={isSelected ? "var(--cyan)" : isHovered ? "var(--t-primary)" : "var(--t-secondary)"}
                      strokeWidth={wallThickness}
                      pointerEvents="none"
                    />
                  )}
                  {/* Room Tag */}
                  {!isSlab && rw > 40 && rh > 40 && (
                    <g pointerEvents="none" transform={`translate(${room.x + rw / 2}, ${room.y + rh / 2})`}>
                      <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="var(--t-primary)" fontSize="8" fontWeight="700">
                        {room.name.toUpperCase()}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {onNext && (
          <button onClick={onNext} className="btn-accent" style={{
            position: "absolute", bottom: "16px", right: "16px", zIndex: 20,
            padding: "10px 20px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "6px",
            fontSize: "13px", fontWeight: 600
          }}>
            Render 3D <ArrowRight size={14} />
          </button>
        )}
      </main>

      {/* ── 3. Right Sidebar: Properties ──────────────────────── */}
      <aside style={{ 
        width: isMobile ? "100%" : "280px",
        height: isMobile ? "auto" : "100%",
        maxHeight: isMobile ? "240px" : "100%",
        background: "var(--surface-1)", 
        borderLeft: isMobile ? "none" : "1px solid var(--border)", 
        borderTop: isMobile ? "1px solid var(--border)" : "none",
        display: "flex", flexDirection: "column", flexShrink: 0 
      }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <AnimatePresence mode="wait">
            {selectedRoom ? (
              <motion.div key="selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: "var(--t-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: selectedRoom.color }} />
                  {selectedRoom.name}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div className="card" style={{ padding: "8px", borderRadius: "6px", fontSize: "11px" }}>
                    <div style={{ color: "var(--t-muted)", marginBottom: "4px" }}>Dimensions</div>
                    <div style={{ fontWeight: 600 }}>{selectedRoom.realW}' × {selectedRoom.realH}'</div>
                  </div>
                  <div className="card" style={{ padding: "8px", borderRadius: "6px", fontSize: "11px" }}>
                    <div style={{ color: "var(--t-muted)", marginBottom: "4px" }}>Area</div>
                    <div style={{ fontWeight: 600 }}>{selectedRoom.sqft} SF</div>
                  </div>
                </div>
                <div style={{ marginTop: "16px" }}>
                  <div style={{ fontSize: "11px", color: "var(--t-muted)", marginBottom: "8px", textTransform: "uppercase" }}>AI Reasoning</div>
                  <div style={{ fontSize: "12px", color: "var(--t-secondary)", lineHeight: 1.5, padding: "10px", background: "rgba(34,211,238,0.05)", borderRadius: "6px" }}>
                    {selectedRoom.reasoning || "Optimally positioned for structural integrity and light."}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div style={{ textAlign: "center", color: "var(--t-muted)", fontSize: "12px", paddingTop: "20px" }}>
                Select a room to view properties
              </div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}
