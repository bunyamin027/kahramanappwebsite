"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float, Line, Text } from "@react-three/drei";
import * as THREE from "three";
import "./FounderNodeSector.css";

// ── Swift code snippets for floating iOS memory holograms ──
const SWIFT_SNIPPETS = [
  "func retain() { ARC.incrementCount() }",
  "weak var delegate: AppManagerDelegate?",
  "unowned let core = self.kernel",
  "@frozen public struct MemoryLayout<T>",
  "autoreleasepool { try performiOSAllocation() }",
  "Task { await dispatchNotification() }",
  "class FounderNode: KernelOrchestrator { }",
];

export default function FounderNodeSector() {
  const groupRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const algorithmPulseRef = useRef<THREE.Mesh>(null!);

  const [hovered, setHovered] = useState(false);
  
  // Performance Guard States
  const [fps, setFps] = useState(60);
  const [lowPolyMode, setLowPolyMode] = useState(false);
  const fpsFrameCountRef = useRef(0);
  const fpsAccumulatorRef = useRef(0);
  const lowPolyTriggerCounter = useRef(0);

  // ── Construct Node Graph Coordinates ──
  // We use 7 nodes in a 3D configuration representing the Operations solver system
  const nodes = useMemo(() => {
    const arr: { id: number; pos: [number, number, number]; name: string }[] = [];
    const count = 7;
    const radius = 2.4;
    const names = ["SOLVER_A", "ROUTE_B", "DEPOT", "HUB_LINE", "BALANCER", "VRP_NODE", "RETAIN_CORE"];
    
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const yOffset = Math.sin(theta * 2) * 0.8; // beautiful undulating wave in 3D
      arr.push({
        id: i,
        pos: [
          Math.cos(theta) * radius,
          1.5 + yOffset,
          Math.sin(theta) * radius,
        ],
        name: names[i],
      });
    }
    return arr;
  }, []);

  // ── Define connection paths for the Routing Solver ──
  // Lines representing routing connections between nodes
  const connections = useMemo(() => {
    const lines: [number, number][] = [
      [0, 2], [2, 4], [4, 1], [1, 5], [5, 3], [3, 6], [6, 0], // Outer route
      [0, 3], [2, 5], [4, 6], [1, 3] // Inner shortcuts
    ];
    return lines;
  }, []);

  // Active path for the 3D VRP/shortest-path solver simulation pulse
  const activePath = useMemo(() => [0, 2, 4, 1, 5, 3, 6, 0], []);
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);

  // ── Real-time GPU Performance Monitoring & Adaptive Scaling ──
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const delta = state.clock.getDelta(); // time between frames

    // Monitor FPS
    fpsFrameCountRef.current += 1;
    fpsAccumulatorRef.current += delta;

    if (fpsAccumulatorRef.current >= 1) {
      const calculatedFps = Math.round(fpsFrameCountRef.current / fpsAccumulatorRef.current);
      setFps(calculatedFps);
      
      // Auto-trigger Performance Guard if FPS falls below 45 on heavy scenes
      if (calculatedFps < 45 && !lowPolyMode) {
        lowPolyTriggerCounter.current += 1;
        if (lowPolyTriggerCounter.current >= 3) {
          // If low FPS persists for 3 updates (seconds), engage performance guard
          setLowPolyMode(true);
          console.warn("[Performance Guard] Older device/low-GPU detected. Switched to optimized Low-Poly Mode.");
        }
      } else {
        lowPolyTriggerCounter.current = 0;
      }

      fpsFrameCountRef.current = 0;
      fpsAccumulatorRef.current = 0;
    }

    // 1. Slow, majestic rotation of the entire sector
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
    }

    // 2. Pulse structural platform rings
    if (ringRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.02;
      ringRef.current.scale.set(scale, scale, scale);
    }

    // 3. Shortest-Path / VRP routing animation (floating electrical pulse solver)
    const speed = lowPolyMode ? 0.8 : 1.5; // slow down updates on low performance
    setSegmentProgress((prev) => {
      let next = prev + delta * speed;
      if (next >= 1) {
        next = 0;
        setCurrentSegmentIdx((prevIdx) => (prevIdx + 1) % activePath.length);
      }
      return next;
    });

    if (algorithmPulseRef.current) {
      const startNode = nodes[activePath[currentSegmentIdx]];
      const endNode = nodes[activePath[(currentSegmentIdx + 1) % activePath.length]];
      
      if (startNode && endNode) {
        // Interpolate position along the path segment
        algorithmPulseRef.current.position.x = THREE.MathUtils.lerp(startNode.pos[0], endNode.pos[0], segmentProgress);
        algorithmPulseRef.current.position.y = THREE.MathUtils.lerp(startNode.pos[1], endNode.pos[1], segmentProgress);
        algorithmPulseRef.current.position.z = THREE.MathUtils.lerp(startNode.pos[2], endNode.pos[2], segmentProgress);
      }
    }
  });

  return (
    <group position={[0, -8, -50]}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <group 
          ref={groupRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* ── Base Structural Platform ───────────────── */}
          <mesh position={[0, -2.5, 0]}>
            <cylinderGeometry args={[4.2, 5.0, 0.8, 6]} />
            <meshPhysicalMaterial 
              color="#040a15" 
              metalness={0.95}
              roughness={0.1}
              clearcoat={lowPolyMode ? 0 : 1}
              envMapIntensity={0.8}
            />
          </mesh>

          {/* Hex Platform Inner Grid */}
          <mesh position={[0, -2.09, 0]}>
            <cylinderGeometry args={[3.8, 3.8, 0.02, 6]} />
            <meshStandardMaterial 
              color="#10f0ff" 
              roughness={0.8} 
              metalness={0.6} 
              wireframe
            />
          </mesh>

          {/* Glowing Platform Rim (Ice-Blue / Pink glow on hover) */}
          <mesh ref={ringRef} position={[0, -2.1, 0]}>
            <torusGeometry args={[4.25, 0.08, 16, 6]} />
            <meshBasicMaterial color={hovered ? "#ff00aa" : "#00f0ff"} toneMapped={false} />
          </mesh>

          {/* ── Orbiting Swift Code Blocks (Holographic iOS ARC) ── */}
          {SWIFT_SNIPPETS.map((snippet, idx) => {
            // Drop code density in lowPolyMode to optimize R3F draw calls
            if (lowPolyMode && idx % 2 !== 0) return null;

            const angle = (idx / SWIFT_SNIPPETS.length) * Math.PI * 2;
            const radius = 5.8;
            const height = Math.sin(idx) * 2;
            
            return (
              <Float key={idx} speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
                <group position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}>
                  <Text
                    font="/fonts/CourierPrime.ttf"
                    fontSize={0.22}
                    color="#ff00aa"
                    outlineColor="#100010"
                    outlineWidth={0.04}
                    anchorX="center"
                    anchorY="middle"
                  >
                    {snippet}
                    <meshBasicMaterial color={hovered ? "#00f0ff" : "#ff00aa"} toneMapped={false} />
                  </Text>
                </group>
              </Float>
            );
          })}

          {/* ── Operations Node Graph Algorithm Simulation ── */}
          <group>
            {/* Draw nodes (VRP routers) */}
            {nodes.map((node) => (
              <mesh key={node.id} position={node.pos}>
                <sphereGeometry args={[lowPolyMode ? 0.15 : 0.22, 16, 16]} />
                <meshStandardMaterial 
                  color={hovered ? "#ff00aa" : "#00f0ff"}
                  emissive={hovered ? "#ff00aa" : "#00f0ff"}
                  emissiveIntensity={1.2}
                  metalness={0.8}
                  roughness={0.1}
                />
              </mesh>
            ))}

            {/* Draw connection paths (Shortest paths VRP lines) */}
            {connections.map(([startIdx, endIdx], idx) => {
              // Hide half the connection shortcuts in lowPolyMode
              if (lowPolyMode && idx > 6) return null;

              const startNode = nodes[startIdx];
              const endNode = nodes[endIdx];
              
              if (!startNode || !endNode) return null;
              
              return (
                <Line
                  key={idx}
                  points={[startNode.pos, endNode.pos]}
                  color={hovered ? "#ff00aa" : "#00e5ff"}
                  lineWidth={lowPolyMode ? 1 : 2}
                  opacity={hovered ? 0.95 : 0.65}
                  transparent
                />
              );
            })}

            {/* Dynamic Operations payload solver pulse (Shortest Path Simulation) */}
            <mesh ref={algorithmPulseRef}>
              <sphereGeometry args={[lowPolyMode ? 0.18 : 0.28, 16, 16]} />
              <meshBasicMaterial color="#00ff88" toneMapped={false} />
              <pointLight color="#00ff88" intensity={2} distance={6} decay={2} />
            </mesh>
          </group>

          {/* ── Kurucu Çekirdeği HUD Dashboard Hologram ── */}
          <Html
            transform
            occlude
            position={[0, 0.4, 0]}
            distanceFactor={8}
            zIndexRange={[100, 0]}
          >
            <div className="founder-container" onPointerDown={(e) => e.stopPropagation()}>
              <h3 className="founder-title">FOUNDER_NODE // ACTIVE</h3>
              
              <div className="founder-profile">
                <div className="founder-stat">
                  <span className="stat-key">IDENTIFIER:</span>
                  <span className="stat-value highlight-green">BÜNYAMİN KAHRAMAN</span>
                </div>
                <div className="founder-stat">
                  <span className="stat-key">ROLE:</span>
                  <span className="stat-value">CHIEF CORE ARCHITECT</span>
                </div>
                <div className="founder-stat">
                  <span className="stat-key">FOCUS:</span>
                  <span className="stat-value highlight-pink">SWIFT // OPERATIONS R&D</span>
                </div>
                <div className="founder-stat">
                  <span className="stat-key">ALLOCATOR:</span>
                  <span className="stat-value">ARC AUTOMATIC REFERENCE</span>
                </div>
              </div>

              <div className="founder-algorithms">
                <span className="algo-section-title">REALTIME RUNTIME LOGS:</span>
                <div className="algo-active-run">
                  <span className="algo-pulse-dot" />
                  <span>VRP_SOLVER_RUNNING: {fps} FPS</span>
                </div>
              </div>

              {/* performance guard status */}
              <div className={`perf-guard-badge ${lowPolyMode ? "throttled" : "optimal"}`}>
                <span>PERFORMANCE_SHIELD:</span>
                <span>{lowPolyMode ? "ADAPTIVE LOW-POLY" : "OPTIMAL 3D GL"}</span>
              </div>
            </div>
          </Html>
        </group>
      </Float>

      {/* Dynamic light sources to emphasize the hidden corner's visual premium feel */}
      <pointLight position={[0, 5, 0]} intensity={1.5} color={hovered ? "#ff00aa" : "#00f0ff"} distance={25} decay={2} />
      <pointLight position={[0, -2, 0]} intensity={0.5} color="#ffffff" distance={15} decay={2} />
    </group>
  );
}
