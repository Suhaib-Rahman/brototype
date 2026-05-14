"use client";
import { useMemo, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Text, Edges, GizmoHelper, GizmoViewport, SoftShadows, Grid } from "@react-three/drei";
import * as THREE from "three";
import { FloorPlan, Room } from "@/types/plan";
import { usePlanStore } from "@/store/usePlanStore";

const ROOM_COLORS: Record<string, string> = {
  living: "#0071E3", master: "#BF5AF2", bed: "#BF5AF2",
  kitchen: "#FF9F0A", bath: "#32D74B", corridor: "#86868B",
  balcony: "#0071E3", garden: "#32D74B", parking: "#86868B", default: "#1D1D1F",
};

interface SceneMaterial {
  color: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  transmission?: number;
  thickness?: number;
}

const MATERIALS: Record<string, SceneMaterial> = {
  "Italian Marble": { color: "#f8fafc", roughness: 0.1, metalness: 0.3, clearcoat: 1.0 },
  "Hardwood": { color: "#451a03", roughness: 0.4, metalness: 0.0, clearcoat: 0.2 },
  "Ceramic Tiles": { color: "#cbd5e1", roughness: 0.2, metalness: 0.1, clearcoat: 0.5 },
  "Oak Wood": { color: "#b45309", roughness: 0.6, metalness: 0.0, clearcoat: 0.1 },
  "Polished Concrete": { color: "#64748b", roughness: 0.3, metalness: 0.2, clearcoat: 0.8 },
  "Velvet Navy": { color: "#1e3a8a", roughness: 0.9, metalness: 0.0, clearcoat: 0.0 },
  "Warm Plaster": { color: "#fef3c7", roughness: 0.8, metalness: 0.0, clearcoat: 0.0 },
};

function Furniture({ type, rw, rh }: { type: string; rw: number; rh: number }) {
  if (type === "living") {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.45, -rh / 2 + 0.8]} castShadow>
          <boxGeometry args={[rw * 0.7, 0.5, 0.8]} />
          <meshPhysicalMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 0.8]} />
          <meshPhysicalMaterial color="#451a03" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>
    );
  }
  if (type === "bed" || type === "master") {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[2.0, 0.6, 2.2]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.8, -1.1]} castShadow>
          <boxGeometry args={[2.2, 1.2, 0.1]} />
          <meshPhysicalMaterial color="#1e293b" roughness={0.9} />
        </mesh>
      </group>
    );
  }
  if (type === "kitchen") {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[-rw / 2 + 0.3, 0.45, 0]} castShadow>
          <boxGeometry args={[0.6, 0.9, rh]} />
          <meshPhysicalMaterial color="#f1f5f9" roughness={0.1} metalness={0.2} clearcoat={1.0} />
        </mesh>
      </group>
    );
  }
  return null;
}

function RoomBox({ room, scale, offsetX, offsetY, isSelected, onSelect }: { room: Room; scale: number; offsetX: number; offsetY: number; isSelected: boolean; onSelect: () => void }) {
  // Safety check for color
  const colorMatch = room.color?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const colorStr = colorMatch ? `rgb(${colorMatch[1]},${colorMatch[2]},${colorMatch[3]})` : ROOM_COLORS[room.type || "default"] || ROOM_COLORS.default;

  const rw = (room.realW || room.w / 10) * scale;
  const rh = (room.realH || room.h / 10) * scale;
  const rx = (room.realX ?? room.x / 10) * scale;
  const ry = (room.realY ?? room.y / 10) * scale;

  let height = 3.2;
  if (room.type === "balcony") height = 1.2;
  if (room.type === "bathroom") height = 2.8;
  if (room.type === "garden") height = 0.1;
  if (room.type === "garage") height = 0.2;

  const cx = rx + rw / 2 - offsetX;
  const cz = ry + rh / 2 - offsetY;

  const wt = 0.15;
  const isSlab = room.type === "garden" || room.type === "garage";

  const floorMat = MATERIALS[room.floorMaterial || ""] || { color: colorStr, roughness: 0.7, metalness: 0.1, clearcoat: 0.5 };
  const wallMat = MATERIALS[room.wallMaterial || ""] || { color: "#e2e8f0", roughness: 0.3, metalness: 0.5, transmission: 0.5, thickness: 0.5 };

  return (
    <group position={[cx, 0, cz]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <mesh castShadow receiveShadow position={[0, isSlab ? height / 2 : 0.05, 0]}>
        <boxGeometry args={[rw, isSlab ? height : 0.1, rh]} />
        <meshPhysicalMaterial {...floorMat} opacity={isSlab ? 0.9 : 1.0} transparent={isSlab} />
        <Edges scale={1} threshold={15} color={isSelected ? "#00f2ff" : colorStr} />
      </mesh>

      {!isSlab && <Furniture type={room.type || ""} rw={rw} rh={rh} />}

      {!isSlab && (
        <mesh castShadow receiveShadow position={[0, height + 0.05, 0]}>
          <boxGeometry args={[rw + 0.4, 0.1, rh + 0.4]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.12} roughness={0.1} metalness={0.8} transmission={0.5} />
          <Edges scale={1} threshold={15} color={isSelected ? "#00f2ff" : "#cbd5e1"} />
        </mesh>
      )}

      {!isSlab && (
        <Text
          position={[0, height + 0.3, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.35}
          fontWeight="bold"
          color={isSelected ? "#00f2ff" : "#ffffff"}
          fillOpacity={isSelected ? 1 : 0.7}
          anchorX="center"
          anchorY="middle"
        >
          {room.name}
        </Text>
      )}

      {!isSlab && (
        <>
          <mesh castShadow receiveShadow position={[0, height / 2, -rh / 2 + wt / 2]}>
            <boxGeometry args={[rw, height, wt]} />
            <meshPhysicalMaterial {...wallMat} transparent opacity={isSelected ? 0.9 : 0.35} />
            <Edges scale={1} threshold={15} color={isSelected ? "#00f2ff" : colorStr} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, height / 2, rh / 2 - wt / 2]}>
            <boxGeometry args={[rw, height, wt]} />
            <meshPhysicalMaterial {...wallMat} transparent opacity={isSelected ? 0.9 : 0.35} />
            <Edges scale={1} threshold={15} color={isSelected ? "#00f2ff" : colorStr} />
          </mesh>
          <mesh castShadow receiveShadow position={[-rw / 2 + wt / 2, height / 2, 0]}>
            <boxGeometry args={[wt, height, rh - wt * 2]} />
            <meshPhysicalMaterial {...wallMat} transparent opacity={isSelected ? 0.9 : 0.35} />
            <Edges scale={1} threshold={15} color={isSelected ? "#00f2ff" : colorStr} />
          </mesh>
          <mesh castShadow receiveShadow position={[rw / 2 - wt / 2, height / 2, 0]}>
            <boxGeometry args={[wt, height, rh - wt * 2]} />
            <meshPhysicalMaterial {...wallMat} transparent opacity={isSelected ? 0.9 : 0.35} />
            <Edges scale={1} threshold={15} color={isSelected ? "#00f2ff" : colorStr} />
          </mesh>
        </>
      )}

      {isSelected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[rw + 0.1, height + 0.1, rh + 0.1]} />
          <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.4} />
        </mesh>
      )}

      {!isSlab && (room.doors || []).map((door, i) => {
        const dw = (door.width || 3) * scale;
        const doorOffsetX = Math.min(door.x * scale, rw - dw);
        const doorCenterX = -rw / 2 + doorOffsetX + dw / 2;
        const doorHeight = 2.1;
        return (
          <group key={`door-${i}`} position={[doorCenterX, doorHeight / 2, rh / 2 - wt / 2]}>
            <mesh castShadow receiveShadow position={[-dw / 2, 0, dw / 2]} rotation={[0, Math.PI / 2.5, 0]}>
              <boxGeometry args={[dw, doorHeight, 0.05]} />
              <meshPhysicalMaterial color="#fbbf24" roughness={0.2} metalness={0.5} clearcoat={1.0} />
            </mesh>
          </group>
        );
      })}

      {!isSlab && (room.windows || []).map((win, i) => {
        const ws = (win.size || 4) * scale;
        const winHeight = 1.2;
        const winY = 1.4;
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
              <meshPhysicalMaterial color="#22d3ee" transparent opacity={0.55} roughness={0.0} metalness={0.9} transmission={0.9} ior={1.5} thickness={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#0b0f19" roughness={1} metalness={0} />
      <Grid args={[100, 100]} sectionSize={5} sectionColor="#1e293b" cellColor="#0f172a" cellThickness={0.5} sectionThickness={1} fadeDistance={100} position={[0, 0, 0.01]} />
    </mesh>
  );
}

function CameraRig({ targetPosition, onUserInteraction }: { targetPosition: [number, number, number], onUserInteraction: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition]);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!onUserInteraction) {
      isAnimating.current = true;
    }
  }, [targetPosition, onUserInteraction]);

  useFrame(() => {
    if (isAnimating.current && !onUserInteraction) {
      camera.position.lerp(target, 0.06);
      if (camera.position.distanceTo(target) < 0.1) {
        isAnimating.current = false;
      }
    }
  });

  return null;
}

function Scene({ floorPlan, cameraPosition, dayNight }: { floorPlan?: FloorPlan; cameraPosition: [number, number, number]; dayNight: number }) {
  const scale = 0.5;
  const { selectedRoom, selectRoom, isCinematic } = usePlanStore();
  const [userInteracting, setUserInteracting] = useState(false);
  const prevCamRef = useRef(cameraPosition);

  useEffect(() => {
    if (JSON.stringify(cameraPosition) !== JSON.stringify(prevCamRef.current)) {
      prevCamRef.current = cameraPosition;
      setUserInteracting(false);
    }
  }, [cameraPosition]);

  const vbW = floorPlan?.viewBoxW || 600;
  const vbH = floorPlan?.viewBoxH || 400;
  const offsetX = (vbW / 10) * scale / 2;
  const offsetY = (vbH / 10) * scale / 2;

  const ambientIntensity = 0.2 + (dayNight / 100) * 1.2;
  const directIntensity = 0.1 + (dayNight / 100) * 2.5;
  const sunColor = dayNight > 50 ? "#fff5e6" : "#fb923c";
  const fogDensity = dayNight > 50 ? 0.01 : 0.02;

  useFrame((state) => {
    if (isCinematic && !userInteracting) {
      const t = state.clock.getElapsedTime() * 0.1;
      const dist = 30;
      state.camera.position.x = Math.sin(t) * dist;
      state.camera.position.z = Math.cos(t) * dist;
      state.camera.position.y = 10 + Math.sin(t * 0.5) * 6;
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {!isCinematic && <CameraRig targetPosition={cameraPosition} onUserInteraction={userInteracting} />}
      <SoftShadows size={15} samples={10} focus={0.5} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[15, 25, 10]}
        intensity={directIntensity}
        castShadow
        color={sunColor}
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-5, 8, -5]} intensity={0.5} color="#22d3ee" />

      <Floor />

      {floorPlan?.rooms.map((room) => (
        <RoomBox
          key={room.id}
          room={room}
          scale={scale}
          offsetX={offsetX}
          offsetY={offsetY}
          isSelected={selectedRoom?.id === room.id}
          onSelect={() => selectRoom(room)}
        />
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={100} blur={2} far={10} color="#000000" />

      <OrbitControls
        target={[0, 1, 0]}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={60}
        enableDamping
        dampingFactor={0.05}
        onStart={() => { setUserInteracting(true); }}
      />

      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
      </GizmoHelper>

      <fogExp2 attach="fog" args={["#050508", fogDensity]} />
    </>
  );
}

export default function ThreeScene({ floorPlan, cameraPosition = [10, 8, 14], dayNight = 70 }: { floorPlan?: FloorPlan; cameraPosition?: [number, number, number]; dayNight?: number }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: false, stencil: false, depth: true }}
        onPointerMissed={() => usePlanStore.getState().selectRoom(null)}
      >
        <Scene floorPlan={floorPlan} cameraPosition={cameraPosition} dayNight={dayNight} />
      </Canvas>
    </div>
  );
}
