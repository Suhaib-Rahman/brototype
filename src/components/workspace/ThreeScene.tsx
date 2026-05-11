"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text, Edges, GizmoHelper, GizmoViewport, SoftShadows, Grid } from "@react-three/drei";
import * as THREE from "three";
import { FloorPlan, Room } from "@/types/plan";

const ROOM_COLORS: Record<string, string> = {
  living_room: "#6366f1", master_bedroom: "#a78bfa", bedroom: "#f59e0b",
  kitchen: "#10b981", bathroom: "#0ea5e9", dining: "#fbbf24",
  balcony: "#22d3ee", puja_room: "#fb923c", study: "#06b6d4", default: "#64748b",
};

function RoomBox({ room, scale, offsetX, offsetY }: { room: Room; scale: number; offsetX: number; offsetY: number }) {
  // Parse RGBA to RGB for ThreeJS
  const match = room.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const colorStr = match ? `rgb(${match[1]},${match[2]},${match[3]})` : ROOM_COLORS[room.type || "default"] || ROOM_COLORS.default;
  
  const rw = (room.realW || room.w / 10) * scale;
  const rh = (room.realH || room.h / 10) * scale;
  const rx = (room.realX ?? room.x / 10) * scale;
  const ry = (room.realY ?? room.y / 10) * scale;
  
  // Dynamic heights based on room type
  let height = 3.2; // Standard ceiling
  if (room.type === "balcony") height = 1.2;
  if (room.type === "bathroom") height = 2.8;
  if (room.type === "garden") height = 0.1;
  if (room.type === "garage") height = 0.2; // just a parking slab

  const cx = rx + rw / 2 - offsetX;
  const cz = ry + rh / 2 - offsetY;

  const wt = 0.15; // wall thickness
  const isSlab = room.type === "garden" || room.type === "garage";

  return (
    <group position={[cx, 0, cz]}>
      {/* Floor Slab */}
      <mesh castShadow receiveShadow position={[0, isSlab ? height / 2 : 0.05, 0]}>
        <boxGeometry args={[rw, isSlab ? height : 0.1, rh]} />
        <meshPhysicalMaterial color={colorStr} roughness={0.7} metalness={0.1} clearcoat={0.5} opacity={isSlab ? 0.9 : 0.6} transparent />
        <Edges scale={1} threshold={15} color={colorStr} />
      </mesh>

      {/* Roof / Ceiling Slab */}
      {!isSlab && (
        <mesh castShadow receiveShadow position={[0, height + 0.05, 0]}>
          <boxGeometry args={[rw + 0.4, 0.1, rh + 0.4]} /> {/* 0.2 overhang on all sides */}
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.1} metalness={0.8} transmission={0.5} />
          <Edges scale={1} threshold={15} color="#cbd5e1" />
        </mesh>
      )}

      {/* Room Label */}
      {!isSlab && (
        <Text 
          position={[0, 0.1, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          fontSize={Math.max(0.4, Math.min(rw, rh) * 0.15)} 
          color="#ffffff" 
          fillOpacity={0.6} 
          anchorX="center"
          anchorY="middle"
        >
          {room.name}
        </Text>
      )}

      {/* Walls */}
      {!isSlab && (
        <>
          {/* North Wall */}
          <mesh castShadow receiveShadow position={[0, height / 2, -rh / 2 + wt / 2]}>
            <boxGeometry args={[rw, height, wt]} />
            <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.15} roughness={0.3} metalness={0.5} transmission={0.5} thickness={0.5} />
            <Edges scale={1} threshold={15} color={colorStr} />
          </mesh>
          {/* South Wall */}
          <mesh castShadow receiveShadow position={[0, height / 2, rh / 2 - wt / 2]}>
            <boxGeometry args={[rw, height, wt]} />
            <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.15} roughness={0.3} metalness={0.5} transmission={0.5} thickness={0.5} />
            <Edges scale={1} threshold={15} color={colorStr} />
          </mesh>
          {/* West Wall */}
          <mesh castShadow receiveShadow position={[-rw / 2 + wt / 2, height / 2, 0]}>
            <boxGeometry args={[wt, height, rh - wt * 2]} />
            <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.15} roughness={0.3} metalness={0.5} transmission={0.5} thickness={0.5} />
            <Edges scale={1} threshold={15} color={colorStr} />
          </mesh>
          {/* East Wall */}
          <mesh castShadow receiveShadow position={[rw / 2 - wt / 2, height / 2, 0]}>
            <boxGeometry args={[wt, height, rh - wt * 2]} />
            <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.15} roughness={0.3} metalness={0.5} transmission={0.5} thickness={0.5} />
            <Edges scale={1} threshold={15} color={colorStr} />
          </mesh>
        </>
      )}

      {/* Doors (Rendered on the South wall as per 2D logic) */}
      {!isSlab && (room.doors || []).map((door, i) => {
        const dw = (door.width || 3) * scale;
        // Clamp door position so it doesn't go outside the wall
        const doorOffsetX = Math.min(door.x * scale, rw - dw);
        // Calculate center of door panel
        const doorCenterX = -rw / 2 + doorOffsetX + dw / 2;
        const doorHeight = 2.1;

        return (
          <group key={`door-${i}`} position={[doorCenterX, doorHeight / 2, rh / 2 - wt / 2]}>
            {/* The door panel (rotated open) */}
            <mesh castShadow receiveShadow position={[-dw / 2, 0, dw / 2]} rotation={[0, Math.PI / 2.5, 0]}>
              <boxGeometry args={[dw, doorHeight, 0.05]} />
              <meshPhysicalMaterial color="#fbbf24" roughness={0.2} metalness={0.5} clearcoat={1.0} />
            </mesh>
            {/* Cutout indicator / Threshold */}
            <mesh castShadow receiveShadow position={[0, -doorHeight / 2 + 0.02, 0]}>
              <boxGeometry args={[dw, 0.04, wt + 0.1]} />
              <meshPhysicalMaterial color="#fbbf24" roughness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Windows (Centered on specified wall) */}
      {!isSlab && (room.windows || []).map((win, i) => {
        const ws = (win.size || 4) * scale;
        const winHeight = 1.2;
        const winY = 1.4; // Center height of window
        
        let wx = 0, wz = 0;
        let isH = true;

        if (win.wall === "north") { wz = -rh / 2 + wt / 2; }
        else if (win.wall === "south") { wz = rh / 2 - wt / 2; }
        else if (win.wall === "east") { wx = rw / 2 - wt / 2; isH = false; }
        else { wx = -rw / 2 + wt / 2; isH = false; }

        return (
          <group key={`win-${i}`} position={[wx, winY, wz]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={isH ? [ws, winHeight, wt + 0.05] : [wt + 0.05, winHeight, ws]} />
              <meshPhysicalMaterial color="#22d3ee" transparent opacity={0.4} roughness={0.0} metalness={0.9} transmission={0.9} ior={1.5} thickness={0.2} />
              <Edges scale={1} threshold={15} color="#06b6d4" />
            </mesh>
          </group>
        );
      })}
      
      {/* If it's a slab, we just give it a subtle edge to look neat */}
      {isSlab && (
        <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
          <boxGeometry args={[rw, height, rh]} />
          <meshPhysicalMaterial color={colorStr} transparent opacity={0.2} roughness={0.9} />
          <Edges scale={1} threshold={15} color={colorStr} />
        </mesh>
      )}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0b0f19" roughness={0.8} metalness={0.2} />
      <Grid args={[40, 40]} sectionSize={1} sectionColor="#1e293b" cellColor="#0f172a" cellThickness={0.5} sectionThickness={1} fadeDistance={40} position={[0, 0, 0.01]} />
    </mesh>
  );
}

// Camera Animation Rig
function CameraRig({ targetPosition, onUserInteraction }: { targetPosition: [number, number, number], onUserInteraction: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(...targetPosition), []);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!onUserInteraction) {
      target.set(...targetPosition);
      setAnimating(true);
    }
  }, [targetPosition, target, onUserInteraction]);

  useFrame(() => {
    if (animating && !onUserInteraction) {
      camera.position.lerp(target, 0.06); // Smooth easing
      if (camera.position.distanceTo(target) < 0.1) {
        setAnimating(false);
      }
    }
  });

  return null;
}

function Scene({ floorPlan, cameraPosition, dayNight }: { floorPlan?: FloorPlan; cameraPosition: [number, number, number]; dayNight: number }) {
  const scale = 0.5;
  const ambientIntensity = dayNight / 100 * 0.8 + 0.2;
  const [userInteracting, setUserInteracting] = useState(false);
  
  // Calculate perfect 3D centering based on the AI SVG grid
  const vbW = floorPlan?.viewBoxW || 600;
  const vbH = floorPlan?.viewBoxH || 400;
  const offsetX = (vbW / 10) * scale / 2;
  const offsetY = (vbH / 10) * scale / 2;

  // Whenever the preset changes, we assume the user stopped manually interacting 
  // so the animation can play.
  useEffect(() => {
    setUserInteracting(false);
  }, [cameraPosition]);

  return (
    <>
      <CameraRig targetPosition={cameraPosition} onUserInteraction={userInteracting} />
      <SoftShadows size={15} samples={10} focus={0.5} />
      <Environment preset={dayNight > 50 ? "city" : "night"} environmentIntensity={0.5} />
      <ambientLight intensity={ambientIntensity * 0.5} />
      <directionalLight 
        position={[15, 25, 10]} 
        intensity={dayNight / 100 * 2.0 + 0.8} 
        castShadow 
        color={dayNight > 50 ? "#fff5e6" : "#c4b5fd"} 
        shadow-mapSize={[2048, 2048]} 
        shadow-camera-near={0.5} 
        shadow-camera-far={100} 
        shadow-camera-left={-20} 
        shadow-camera-right={20} 
        shadow-camera-top={20} 
        shadow-camera-bottom={-20} 
      />
      <pointLight position={[-5, 8, -5]} intensity={0.5} color="#22d3ee" />

      <Floor />

      {floorPlan?.rooms.map((room) => (
        <RoomBox key={room.id} room={room} scale={scale} offsetX={offsetX} offsetY={offsetY} />
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={40} blur={2} far={10} color="#000000" />

      <OrbitControls
        target={[0, 1, 0]}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={40}
        enableDamping
        dampingFactor={0.05}
        onStart={() => setUserInteracting(true)} // Cancel animations if user starts dragging
      />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
      </GizmoHelper>

      <fogExp2 attach="fog" args={["#050508", 0.015]} />
    </>
  );
}

export default function ThreeScene({ floorPlan, cameraPosition = [10, 8, 14], dayNight = 70 }: { floorPlan?: FloorPlan; cameraPosition?: [number, number, number]; dayNight?: number }) {
  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: 45 }}
      style={{ background: "#050508" }}
      gl={{ antialias: true, alpha: false }}
    >
      <Scene floorPlan={floorPlan} cameraPosition={cameraPosition} dayNight={dayNight} />
    </Canvas>
  );
}

