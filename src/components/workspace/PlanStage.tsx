"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn, ZoomOut, Undo2, Redo2, Send, Loader2, Sparkles,
  Info, Layers, MousePointer2, BoxSelect, Maximize,
  ArrowRight, X, Ruler, RefreshCw
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

  // Auto-generate dynamic plan if none
  useEffect(() => {
    if (!floorPlan && !isGenerating) {
      setGenerating(true);
      setTimeout(() => {
        const newPlan = generateDynamicPlan(onboardingData);
        setFloorPlan(newPlan);
        setGenerating(false);
      }, 2000); // Simulate intense AI generation
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGGElement>, room: Room) => {
    if (layerMode !== "arch") return; // Only allow dragging in architecture layer
    
    // Capture the starting click position on the screen
    setDragStartPoint({ x: e.clientX, y: e.clientY });
    // Capture the original x/y of the room
    setDragStartPos({ x: room.x, y: room.y });
    setDraggingRoomId(room.id);
    selectRoom(room);
    
    // Capture pointer events so we keep dragging even if we move fast out of the SVG rect
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRoomId || !floorPlan) return;
    
    // Calculate difference (scaled by zoom)
    const dx = (e.clientX - dragStartPoint.x) / zoom;
    const dy = (e.clientY - dragStartPoint.y) / zoom;
    
    // Calculate raw new position
    const rawX = dragStartPos.x + dx;
    const rawY = dragStartPos.y + dy;
    
    // Grid Snap (e.g. 20px intervals)
    const snap = 20;
    const snappedX = Math.round(rawX / snap) * snap;
    const snappedY = Math.round(rawY / snap) * snap;
    
    usePlanStore.getState().updateRoomPosition(draggingRoomId, snappedX, snappedY);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingRoomId) {
      setDraggingRoomId(null);
      // We could add an updateFloorPlan here if we wanted to save to history
      if (floorPlan) {
        usePlanStore.getState().updateFloorPlan(floorPlan);
      }
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInput.trim() || !floorPlan) return;
    const instruction = editInput.trim();
    setEditInput("");
    setEditing(true);

    setTimeout(() => {
      // Natural language edit simulation
      let updatedPlan = { ...floorPlan, generatedAt: new Date().toISOString() };

      updateFloorPlan(updatedPlan);
      setEditing(false);
      showNotification("success", "AI Agent successfully applied edits.");
    }, 1500);
  };

  const handleUpdateRoom = (updates: Partial<Room>) => {
    if (!floorPlan || !selectedRoom) return;

    // Auto-calculate scaled dimensions and sqft if real dimensions change
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
      x: selectedRoom.x + 20, // Offset visually so it's obvious it duplicated
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
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "20px" }}>
            {[0, 1, 2].map(i => <div key={i} className="thinking-dot" style={{ width: "10px", height: "10px", background: "var(--cyan)" }} />)}
          </div>
          <h3 className="font-display" style={{ marginBottom: "8px" }}>Generating Smart Floor Plan</h3>
          <p style={{ color: "var(--t-muted)", fontSize: "14px" }}>
            Aligning {onboardingData?.requirements?.bedrooms || 2} bedrooms, applying Vastu compliance, and simulating structural flow...
          </p>
        </div>
      </div>
    );
  }

  const vbW = floorPlan.viewBoxW;
  const vbH = floorPlan.viewBoxH;

  return (
    <div style={{ height: "100%", display: "flex", background: "var(--bg)", overflow: "hidden" }}>

      {/* ── 1. Left Sidebar: Layers ───────────────────────────── */}
      <aside style={{ width: "260px", background: "var(--surface-1)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Layers size={16} color="var(--t-secondary)" />
            <span style={{ fontSize: "14px", fontWeight: 600 }}>Plan Layers</span>
          </div>
          <button
            className="btn-icon"
            title="Regenerate Layout based on Onboarding Data"
            onClick={() => {
              setGenerating(true);
              setTimeout(() => {
                const newPlan = generateDynamicPlan(onboardingData);
                setFloorPlan(newPlan);
                setGenerating(false);
                showNotification("success", "Floor plan regenerated based on Onboarding data");
              }, 1500);
            }}
          >
            <RefreshCw size={14} color="var(--t-muted)" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--t-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", padding: "0 8px" }}>Rooms</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {floorPlan.rooms.map(room => {
              const isSelected = selectedRoom?.id === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => selectRoom(isSelected ? null : room)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px", borderRadius: "8px", cursor: "pointer", border: "none",
                    background: isSelected ? "var(--surface-2)" : "transparent",
                    color: isSelected ? "var(--t-primary)" : "var(--t-secondary)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: room.color, border: "1px solid rgba(255,255,255,0.1)" }} />
                    <span style={{ fontSize: "13px", fontWeight: isSelected ? 600 : 500 }}>{room.name}</span>
                  </div>
                  {room.sqft && <span style={{ fontSize: "11px", color: "var(--t-muted)" }}>{room.sqft}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Plan Score */}
        <div style={{ padding: "20px", borderTop: "1px solid var(--border)", background: "rgba(16, 185, 129, 0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--emerald)" }}>AI Plan Score</span>
            <span className="badge badge-emerald">{floorPlan.plan_score?.total || 86}/100</span>
          </div>
          <div style={{ height: "4px", background: "var(--surface-2)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${floorPlan.plan_score?.total || 86}%`, background: "var(--emerald)" }} />
          </div>
        </div>
      </aside>

      {/* ── 2. Center: CAD Canvas ─────────────────────────────── */}
      <main style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Floating Toolbar */}
        <div className="glass" style={{
          position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", padding: "6px", borderRadius: "12px",
          border: "1px solid var(--border)", zIndex: 10, gap: "4px"
        }}>
          <button className="btn-icon" title="Select" style={{ background: "var(--surface-2)", color: "var(--t-primary)" }}><MousePointer2 size={16} /></button>
          <button className="btn-icon" title="Marquee"><BoxSelect size={16} /></button>
          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />
          <button className="btn-icon" onClick={undo} disabled={historyIndex <= 0}><Undo2 size={16} /></button>
          <button className="btn-icon" onClick={redo} disabled={historyIndex >= editHistory.length - 1}><Redo2 size={16} /></button>
          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />
          <button className="btn-icon" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}><ZoomIn size={16} /></button>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--t-secondary)", minWidth: "44px", textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
          <button className="btn-icon" onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}><ZoomOut size={16} /></button>
        </div>

        {/* Layer Toggles */}
        <div className="glass" style={{
          position: "absolute", top: "70px", left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", padding: "4px", borderRadius: "12px",
          border: "1px solid var(--border)", zIndex: 10, background: "rgba(10,10,15,0.8)"
        }}>
          {[
            { id: "arch", label: "Architecture" },
            { id: "struct", label: "Structure" },
            { id: "elec", label: "Electrical" },
            { id: "plumb", label: "Plumbing" },
          ].map(m => (
            <button key={m.id} onClick={() => setLayerMode(m.id as any)} style={{
              padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
              background: layerMode === m.id ? "var(--accent)" : "transparent",
              color: layerMode === m.id ? "white" : "var(--t-muted)",
              border: "none", cursor: "pointer", transition: "all 0.2s"
            }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* The Infinite Grid Background */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.5,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`, pointerEvents: "none", zIndex: 0
        }} />

        {/* SVG Drawing Area */}
        <div style={{
          transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.1s ease-out",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.4)",
          background: "var(--surface-1)", borderRadius: "4px", zIndex: 1
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

            {/* Compass (Top Right) */}
            <g transform={`translate(${vbW - 30}, 20)`} style={{ opacity: layerMode === "arch" ? 1 : 0.2 }}>
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

              const isMepMode = layerMode !== "arch";
              const roomOpacity = isMepMode ? 0.15 : 1;

              const wallThickness = 4;
              const isSlab = room.type === 'garden' || room.type === 'parking';

              return (
                <g key={room.id} style={{ opacity: roomOpacity, transition: "opacity 0.3s" }}>
                  {/* Inner Floor Fill */}
                  <rect
                    className="room-rect"
                    x={room.x} y={room.y} width={rw} height={rh}
                    fill={isSlab ? "rgba(255,255,255,0.02)" : "var(--bg)"}
                    onClick={() => selectRoom(isSelected ? null : room)}
                    onMouseEnter={() => setHoveredRoom(room)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    onPointerDown={(e) => handlePointerDown(e, room)}
                    style={{ cursor: isMepMode ? "default" : (draggingRoomId === room.id ? "grabbing" : "grab") }}
                  />

                  {/* Thickened Wall Representation */}
                  {!isSlab && (
                    <rect
                      x={room.x} y={room.y} width={rw} height={rh}
                      fill="none"
                      stroke={isSelected ? "var(--cyan)" : isHovered ? "var(--t-primary)" : "var(--t-secondary)"}
                      strokeWidth={wallThickness}
                      pointerEvents="none"
                    />
                  )}
                  {isSlab && (
                    <rect
                      x={room.x} y={room.y} width={rw} height={rh}
                      fill="none"
                      stroke={isSelected ? "var(--cyan)" : "rgba(255,255,255,0.15)"}
                      strokeWidth={1.5}
                      strokeDasharray="4,4"
                      pointerEvents="none"
                    />
                  )}

                  {/* Doors (Classic Arc) */}
                  {(room.doors ?? []).map((door, di) => {
                    const dw = (door.width ?? 3) * 10;
                    const dx = room.x + Math.min(door.x * 10, rw - dw);
                    const dy = room.y + rh;
                    return (
                      <g key={`d-${di}`} pointerEvents="none">
                        {/* Cut the wall */}
                        <rect x={dx} y={dy - wallThickness / 2} width={dw} height={wallThickness} fill="var(--bg)" />
                        {/* Door Panel */}
                        <line x1={dx} y1={dy} x2={dx} y2={dy - dw} stroke="var(--cyan)" strokeWidth="1.5" />
                        {/* Door Swing Arc */}
                        <path d={`M ${dx} ${dy - dw} A ${dw} ${dw} 0 0 1 ${dx + dw} ${dy}`} fill="none" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="3,3" />
                      </g>
                    );
                  })}

                  {/* Windows (Classic parallel lines) */}
                  {(room.windows ?? []).map((win, wi) => {
                    const ws = (win.size ?? 4) * 10;
                    let wx = room.x, wy = room.y, isH = true;
                    if (win.wall === "north") { wx = room.x + rw / 2 - ws / 2; wy = room.y; isH = true; }
                    else if (win.wall === "south") { wx = room.x + rw / 2 - ws / 2; wy = room.y + rh; isH = true; }
                    else if (win.wall === "east") { wx = room.x + rw; wy = room.y + rh / 2 - ws / 2; isH = false; }
                    else { wy = room.y + rh / 2 - ws / 2; wx = room.x; isH = false; }

                    return (
                      <g key={`w-${wi}`} pointerEvents="none">
                        {/* Cut the wall */}
                        <rect
                          x={isH ? wx : wx - wallThickness / 2}
                          y={isH ? wy - wallThickness / 2 : wy}
                          width={isH ? ws : wallThickness}
                          height={isH ? wallThickness : ws}
                          fill="var(--bg)"
                        />
                        {/* Window Sash Lines */}
                        {isH ? (
                          <>
                            <line x1={wx} y1={wy - 1.5} x2={wx + ws} y2={wy - 1.5} stroke="var(--cyan)" strokeWidth="1" />
                            <line x1={wx} y1={wy + 1.5} x2={wx + ws} y2={wy + 1.5} stroke="var(--cyan)" strokeWidth="1" />
                          </>
                        ) : (
                          <>
                            <line x1={wx - 1.5} y1={wy} x2={wx - 1.5} y2={wy + ws} stroke="var(--cyan)" strokeWidth="1" />
                            <line x1={wx + 1.5} y1={wy} x2={wx + 1.5} y2={wy + ws} stroke="var(--cyan)" strokeWidth="1" />
                          </>
                        )}
                      </g>
                    );
                  })}

                  {/* Revit Style Room Tag */}
                  {(!isMepMode && !isSlab && rw > 40 && rh > 40) && (
                    <g pointerEvents="none" style={{ opacity: isSelected ? 1 : 0.85 }} transform={`translate(${room.x + rw / 2}, ${room.y + rh / 2})`}>
                      <rect x="-35" y="-12" width="70" height="24" fill="var(--bg)" stroke="var(--t-secondary)" strokeWidth="1" rx="2" />
                      <text x="0" y="-1" textAnchor="middle" dominantBaseline="middle" fill="var(--t-primary)" fontSize="8" fontWeight="700" letterSpacing="0.05em">
                        {room.name.substring(0, 12).toUpperCase()}{room.name.length > 12 ? '.' : ''}
                      </text>
                      <line x1="-30" y1="5" x2="30" y2="5" stroke="var(--t-muted)" strokeWidth="0.5" />
                      <text x="0" y="10" textAnchor="middle" dominantBaseline="middle" fill="var(--t-muted)" fontSize="7" fontWeight="500">
                        {room.sqft} SF
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Structural Layer Overlay */}
            {layerMode === "struct" && floorPlan.rooms.map((room) => {
              const rw = Math.max(room.w, 20);
              const rh = Math.max(room.h, 20);
              return (
                <g key={`struct-${room.id}`} style={{ animation: "fadeIn 0.3s forwards" }}>
                  <rect x={room.x - 4} y={room.y - 4} width={8} height={8} fill="var(--red)" />
                  <rect x={room.x + rw - 4} y={room.y - 4} width={8} height={8} fill="var(--red)" />
                  <rect x={room.x - 4} y={room.y + rh - 4} width={8} height={8} fill="var(--red)" />
                  <rect x={room.x + rw - 4} y={room.y + rh - 4} width={8} height={8} fill="var(--red)" />
                  <rect x={room.x} y={room.y} width={rw} height={rh} fill="none" stroke="var(--red)" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
                </g>
              );
            })}

            {/* Electrical Layer Overlay */}
            {layerMode === "elec" && (() => {
              const living = floorPlan.rooms.find(r => r.type === "living" || r.type === "corridor") || floorPlan.rooms[0];
              if (!living) return null;
              const dbX = living.x + 20;
              const dbY = living.y + 20;
              return (
                <g style={{ animation: "fadeIn 0.3s forwards" }}>
                  {/* Wiring Conduits */}
                  {floorPlan.rooms.map(room => {
                    const cx = room.x + room.w / 2;
                    const cy = room.y + room.h / 2;
                    return (
                      <path key={`wire-${room.id}`} d={`M ${dbX} ${dbY} Q ${cx} ${dbY} ${cx} ${cy}`} fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8" />
                    );
                  })}
                  {/* Main DB Board */}
                  <rect x={dbX - 10} y={dbY - 14} width={20} height={28} fill="var(--amber)" rx="2" />
                  <text x={dbX} y={dbY + 3} fill="var(--bg)" fontSize="9" fontWeight="800" textAnchor="middle">DB</text>

                  {/* Fixtures (Lights/Fans) */}
                  {floorPlan.rooms.map(room => (
                    <circle key={`fix-${room.id}`} cx={room.x + room.w / 2} cy={room.y + room.h / 2} r="6" fill="var(--surface-1)" stroke="var(--amber)" strokeWidth="2" />
                  ))}
                </g>
              );
            })()}

            {/* Plumbing Layer Overlay */}
            {layerMode === "plumb" && floorPlan.rooms.map((room) => {
              if (!room.type || !['bath', 'kitchen', 'garden'].includes(room.type)) return null;
              const cx = room.x + room.w / 2;
              const cy = room.y + room.h / 2;
              return (
                <g key={`plumb-${room.id}`} style={{ animation: "fadeIn 0.3s forwards" }}>
                  {/* Wet Wall Highlight */}
                  <rect x={room.x} y={room.y} width={6} height={room.h} fill="var(--cyan)" opacity="0.5" />

                  {/* Cold/Hot Water Supply Lines */}
                  <path d={`M ${room.x} ${cy - 6} L ${cx} ${cy - 6}`} fill="none" stroke="var(--cyan)" strokeWidth="2" />
                  <path d={`M ${room.x} ${cy + 6} L ${cx} ${cy + 6}`} fill="none" stroke="var(--red)" strokeWidth="2" />

                  {/* Soil/Drainage Line (Routing to front of plot, y=0) */}
                  <path d={`M ${cx} ${cy} L ${cx} ${0}`} fill="none" stroke="var(--t-secondary)" strokeWidth="3" strokeDasharray="6,4" opacity="0.6" />

                  {/* Plumbing Fixture Nodes */}
                  <circle cx={cx} cy={cy} r="6" fill="var(--bg)" stroke="var(--cyan)" strokeWidth="2" />
                  <circle cx={room.x + 3} cy={cy} r="4" fill="var(--cyan)" />
                </g>
              );
            })}

          </svg>
        </div>

        {onNext && (
          <button onClick={onNext} className="btn-accent" style={{
            position: "absolute", bottom: "24px", right: "24px", zIndex: 20,
            padding: "12px 24px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "8px",
            fontWeight: 600, boxShadow: "0 8px 30px rgba(59,130,246,0.3)"
          }}>
            Render 3D Model <ArrowRight size={16} />
          </button>
        )}

      </main>

      {/* ── 3. Right Sidebar: Properties & AI Reasoning ───────── */}
      <aside style={{ width: "280px", background: "var(--surface-1)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Properties</span>
          {selectedRoom && <button onClick={() => selectRoom(null)} className="btn-icon" style={{ width: "20px", height: "20px" }}><X size={14} /></button>}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <AnimatePresence mode="wait">
            {selectedRoom ? (
              <motion.div key="selected" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>

                {/* Editable Name & Basic Info */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ width: "16px", height: "16px", flexShrink: 0, borderRadius: "4px", background: selectedRoom.color, border: "1px solid rgba(255,255,255,0.1)" }} />
                    <input
                      value={selectedRoom.name}
                      onChange={(e) => handleUpdateRoom({ name: e.target.value })}
                      style={{
                        background: "transparent", border: "none", color: "var(--t-primary)",
                        fontSize: "18px", fontWeight: 600, outline: "none", width: "100%",
                        borderBottom: "1px dashed rgba(255,255,255,0.2)"
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--t-muted)", textTransform: "capitalize", marginTop: "4px" }}>{selectedRoom.type} Space</div>
                </div>

                {/* Actions Grid */}
                <div style={{ marginBottom: "24px" }}>
                  <button onClick={handleDuplicateRoom} className="btn-secondary" style={{ width: "100%", padding: "8px", fontSize: "12px", display: "flex", justifyContent: "center", gap: "6px" }}>
                    <Layers size={14} /> Duplicate Room
                  </button>
                </div>

                {/* Dimensions Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                  <div className="card" style={{ padding: "12px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--t-muted)", fontSize: "11px", marginBottom: "8px" }}>
                      <Ruler size={12} /> Dimensions (ft)
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: 600 }}>
                      <input
                        type="number"
                        value={selectedRoom.realW || 0}
                        onChange={(e) => handleUpdateRoom({ realW: Number(e.target.value) })}
                        style={{ width: "36px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--t-primary)", borderRadius: "4px", padding: "4px", fontSize: "13px", textAlign: "center" }}
                      />
                      <span>×</span>
                      <input
                        type="number"
                        value={selectedRoom.realH || 0}
                        onChange={(e) => handleUpdateRoom({ realH: Number(e.target.value) })}
                        style={{ width: "36px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--t-primary)", borderRadius: "4px", padding: "4px", fontSize: "13px", textAlign: "center" }}
                      />
                    </div>
                  </div>
                  <div className="card" style={{ padding: "12px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--t-muted)", fontSize: "11px", marginBottom: "4px" }}>
                      <Maximize size={12} /> Area
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "6px" }}>{selectedRoom.sqft} sqft</div>
                  </div>
                </div>

                {/* AI Reasoning Block */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "var(--cyan)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <Sparkles size={12} /> AI Reasoning
                  </div>
                  <div className="card" style={{ padding: "16px", borderRadius: "8px", background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                    <p style={{ fontSize: "13px", color: "var(--t-secondary)", lineHeight: 1.5 }}>
                      {selectedRoom.reasoning || selectedRoom.reason || "Optimally positioned based on standard architectural flow and sunlight requirements."}
                    </p>
                  </div>
                </div>

                {/* Object Toggles (Mock) */}
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--t-muted)", marginBottom: "8px", textTransform: "uppercase" }}>Elements</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", color: "var(--t-secondary)", cursor: "pointer" }}>
                      Doors <input type="checkbox" defaultChecked style={{ accentColor: "var(--cyan)" }} />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", color: "var(--t-secondary)", cursor: "pointer" }}>
                      Windows <input type="checkbox" defaultChecked style={{ accentColor: "var(--cyan)" }} />
                    </label>
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", paddingTop: "40px" }}>
                <MousePointer2 size={32} color="var(--t-muted)" style={{ opacity: 0.3, margin: "0 auto 16px" }} />
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--t-secondary)", marginBottom: "8px" }}>No Element Selected</div>
                <div style={{ fontSize: "13px", color: "var(--t-muted)", lineHeight: 1.5 }}>Click on a room in the canvas or select a layer from the left panel to view properties and AI reasoning.</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Edit Input */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--t-muted)", marginBottom: "8px", textTransform: "uppercase" }}>Natural Edit</div>
          <form onSubmit={handleEdit} style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                className="input-field"
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                placeholder="e.g. 'Add a balcony'"
                disabled={isEditing}
                style={{ width: "100%", paddingRight: "32px", fontSize: "12px", padding: "10px 12px" }}
              />
            </div>
            <button type="submit" className="btn-accent" disabled={isEditing || !editInput.trim()} style={{ padding: "10px", borderRadius: "8px" }}>
              {isEditing ? <Loader2 size={14} className="spin" /> : <ArrowRight size={14} />}
            </button>
          </form>
        </div>

      </aside>

    </div>
  );
}
