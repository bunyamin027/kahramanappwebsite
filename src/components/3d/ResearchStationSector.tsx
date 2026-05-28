"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";
import "./ResearchStationSector.css";

type TabType = "algorithms" | "ai" | "consulting";

export default function ResearchStationSector() {
  const stationRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const [activeTab, setActiveTab] = useState<TabType>("algorithms");

  // Laser coordinates around the hex platform
  const laserPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = 4;
    const radius = 3.5;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2 + Math.PI / 4;
      positions.push([
        Math.cos(theta) * radius,
        5.5, // Center Y for a height of 16
        Math.sin(theta) * radius,
      ]);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Slow hover rotation
    if (stationRef.current) {
      stationRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }

    // Pulse glowing rings
    if (ringRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.03;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  const handleConsultAI = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("aiNavAndChat", {
        detail: {
          message: "Tell me about your B2B algorithm and R&D consulting capabilities",
        },
      })
    );
  };

  return (
    <group position={[-20, -2, -15]}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={stationRef}>
          {/* ── Base Structural Platform ───────────────── */}
          <mesh position={[0, -2.5, 0]}>
            <cylinderGeometry args={[3.8, 4.4, 0.6, 6]} />
            <meshPhysicalMaterial 
              color="#081018" 
              metalness={0.9}
              roughness={0.15}
              clearcoat={1}
              envMapIntensity={0.8}
            />
          </mesh>
          
          {/* Inner Technical Hub Grid */}
          <mesh position={[0, -2.19, 0]}>
            <cylinderGeometry args={[3.5, 3.5, 0.02, 6]} />
            <meshStandardMaterial 
              color="#102535" 
              roughness={0.5} 
              metalness={0.7} 
              wireframe
            />
          </mesh>

          {/* Glowing Outer Rim (Ice-Blue) */}
          <mesh ref={ringRef} position={[0, -2.2, 0]}>
            <torusGeometry args={[3.9, 0.06, 16, 6]} />
            <meshBasicMaterial color="#00d2ff" toneMapped={false} />
          </mesh>

          {/* ── Vertical Laser Pillars (White/Blue) ─────── */}
          {laserPositions.map((pos, idx) => (
            <group key={idx} position={pos}>
              {/* Core white laser line */}
              <mesh>
                <cylinderGeometry args={[0.015, 0.015, 16, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.85} toneMapped={false} />
              </mesh>
              {/* Outer cyan laser glow */}
              <mesh scale={[2.5, 1, 2.5]}>
                <cylinderGeometry args={[0.02, 0.02, 16, 8]} />
                <meshBasicMaterial color="#00d2ff" transparent opacity={0.35} toneMapped={false} />
              </mesh>
            </group>
          ))}

          {/* ── Interactive Hologram Console ───────────── */}
          <Html
            transform
            occlude
            position={[0, 0.8, 0]}
            distanceFactor={9}
            zIndexRange={[100, 0]}
          >
            <div className="research-container" onPointerDown={(e) => e.stopPropagation()}>
              <h3 className="research-title">R&D DATA_ROOM</h3>
              
              <div className="research-tabs">
                <button 
                  className={`research-tab-btn ${activeTab === "algorithms" ? "active" : ""}`}
                  onClick={() => setActiveTab("algorithms")}
                >
                  ALGORITHMS
                </button>
                <button 
                  className={`research-tab-btn ${activeTab === "ai" ? "active" : ""}`}
                  onClick={() => setActiveTab("ai")}
                >
                  AI AGENTS
                </button>
                <button 
                  className={`research-tab-btn ${activeTab === "consulting" ? "active" : ""}`}
                  onClick={() => setActiveTab("consulting")}
                >
                  CONSULTING
                </button>
              </div>

              <div className="research-content">
                {activeTab === "algorithms" && (
                  <>
                    <div className="research-item">
                      <span className="research-item-code">[ROUTING_SOLVER_V4]</span>
                      <p style={{ margin: "2px 0 0 0" }}>High-performance dynamic fleet routing and vehicle scheduling heuristics.</p>
                    </div>
                    <div className="research-item">
                      <span className="research-item-code">[OPTIM_ENGINE]</span>
                      <p style={{ margin: "2px 0 0 0" }}>Real-time warehouse spatial layouts and operational constraint solvers.</p>
                    </div>
                  </>
                )}

                {activeTab === "ai" && (
                  <>
                    <div className="research-item">
                      <span className="research-item-code">[MULTI_AGENT_CORE]</span>
                      <p style={{ margin: "2px 0 0 0" }}>Autonomous multi-agent orchestration for back-office and task automation.</p>
                    </div>
                    <div className="research-item">
                      <span className="research-item-code">[RAG_SYSTEMS]</span>
                      <p style={{ margin: "2px 0 0 0" }}>Sub-second multi-source semantic vector retrieval and context loaders.</p>
                    </div>
                  </>
                )}

                {activeTab === "consulting" && (
                  <>
                    <div className="research-item">
                      <span className="research-item-code">[TECH_AUDITS]</span>
                      <p style={{ margin: "2px 0 0 0" }}>Rigorous technical codebase health profile, scaling audits, and R&D scoping.</p>
                    </div>
                    <div className="research-item">
                      <span className="research-item-code">[ACADEMIC_BRIDGE]</span>
                      <p style={{ margin: "2px 0 0 0" }}>Translating complex algorithmic research publications into production code.</p>
                    </div>
                  </>
                )}
              </div>

              <button className="research-cta-btn" onClick={handleConsultAI}>
                INITIALIZE_AI_CONSULTATION
              </button>
            </div>
          </Html>
        </group>
      </Float>

      {/* Localized Lighting */}
      <pointLight position={[0, 4, 0]} intensity={1.5} color="#00e5ff" distance={20} decay={2} />
      <pointLight position={[0, -2, 0]} intensity={0.5} color="#ffffff" distance={15} decay={2} />
    </group>
  );
}
