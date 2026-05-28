"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ChatWindow from "./ChatWindow";

/**
 * The 3D pulsing orb that represents the AI Assistant.
 */
function OrbMesh({ hovered, onClick }: { hovered: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Rotate the orb
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x += delta * 0.2;

    // Pulse the emission intensity
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      const basePulse = Math.sin(t * 3) * 0.2 + 0.8;
      const hoverPulse = hovered ? 1.5 : 1.0;
      materialRef.current.emissiveIntensity = basePulse * hoverPulse;
    }
    
    // Scale slightly on hover
    const targetScale = hovered ? 1.1 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#00f0ff"
        emissive="#00f0ff"
        emissiveIntensity={1}
        roughness={0.1}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.5}
        thickness={0.5}
      />
    </mesh>
  );
}

export default function AiOrb() {
  const [chatOpen, setChatOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleNavAndChat = () => {
      setChatOpen(true);
    };
    window.addEventListener("aiNavAndChat", handleNavAndChat);
    return () => window.removeEventListener("aiNavAndChat", handleNavAndChat);
  }, []);

  return (
    <>
      <div 
        className="ai-orb-3d-container"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "120px",
          height: "120px",
          zIndex: 1000,
          pointerEvents: "auto",
        }}
      >
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />
          
          <OrbMesh 
            hovered={hovered} 
            onClick={() => setChatOpen(!chatOpen)} 
          />
        </Canvas>
        
        {/* Subtle glow behind the canvas */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60px",
          height: "60px",
          background: "#00f0ff",
          borderRadius: "50%",
          filter: "blur(30px)",
          opacity: hovered ? 0.6 : 0.3,
          transition: "opacity 0.3s",
          pointerEvents: "none",
          zIndex: -1
        }} />
      </div>

      <ChatWindow 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </>
  );
}
