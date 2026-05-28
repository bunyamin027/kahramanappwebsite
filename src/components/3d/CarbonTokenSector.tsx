/* eslint-disable react-hooks/purity */
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

export default function CarbonTokenSector() {
  const particlesRef = useRef<THREE.Points>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  // Generate random particles representing digital leaves/data streams
  const particlesCount = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      // Cylinder distribution around the center
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 8;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Rotate particle system slowly
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.1;
      
      // Animate points vertically
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        let y = positions[i * 3 + 1];
        y += Math.sin(t + i) * 0.01 + 0.02; // Float up
        if (y > 4) y = -4; // Reset to bottom
        positions[i * 3 + 1] = y;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Pulse ring
    if (ringRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[20, -2, -15]}>
      {/* ── Architectural Platform ───────────────────────── */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, -2.5, 0]}>
          <cylinderGeometry args={[4, 5, 0.5, 64]} />
          <meshPhysicalMaterial 
            color="#0a150f" 
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            envMapIntensity={0.5}
          />
        </mesh>
        
        {/* Glowing Rim */}
        <mesh ref={ringRef} position={[0, -2.2, 0]}>
          <torusGeometry args={[4.1, 0.05, 16, 100]} />
          <meshBasicMaterial color="#00ff88" toneMapped={false} />
        </mesh>
      </Float>

      {/* ── Digital Leaves / Particle System ─────────────── */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#00ff88"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ── Localized Lighting ───────────────────────────── */}
      <pointLight position={[0, 2, 0]} intensity={1} color="#00ff88" distance={15} decay={2} />
      <pointLight position={[0, -1, 0]} intensity={0.5} color="#ffd700" distance={10} decay={2} />
    </group>
  );
}
