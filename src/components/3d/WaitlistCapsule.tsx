/* eslint-disable react-hooks/purity */
"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";
import "./WaitlistCapsule.css";

export default function WaitlistCapsule() {
  const { t } = useLanguage();
  const capsuleRef = useRef<THREE.Group>(null!);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showConfetti, setShowConfetti] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (capsuleRef.current && status !== "success") {
      capsuleRef.current.position.y = Math.sin(t * 2) * 0.2 - 2;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setStatus("success");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <group position={[0, -2, -25]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group ref={capsuleRef}>
          {/* Base Cylinder */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2, 2, 1, 32]} />
            <meshStandardMaterial 
              color="#0a0a1a" 
              metalness={0.8} 
              roughness={0.2}
              envMapIntensity={1}
            />
          </mesh>

          {/* Glowing Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <torusGeometry args={[2.05, 0.05, 16, 64]} />
            <meshBasicMaterial color={status === "success" ? "#00ff88" : "#00f0ff"} />
          </mesh>

          {/* HTML Overlay */}
          <Html
            transform
            occlude
            position={[0, 0, 0.5]}
            distanceFactor={15}
            zIndexRange={[100, 0]}
          >
            <div className="waitlist-container" onPointerDown={(e) => e.stopPropagation()}>
              <h3 className="waitlist-title">{t("waitlist_title")}</h3>
              {status === "success" ? (
                <div className="waitlist-success">
                  <span>{t("waitlist_success")}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="waitlist-form">
                  <input
                    type="email"
                    placeholder={t("waitlist_placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="waitlist-input"
                    disabled={status === "loading"}
                  />
                  <button 
                    type="submit" 
                    className="waitlist-submit"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? t("waitlist_uploading") : t("waitlist_initialize")}
                  </button>
                </form>
              )}
              {status === "error" && <p className="waitlist-error">{t("waitlist_error")}</p>}
            </div>
          </Html>
        </group>
      </Float>

      {/* Confetti Explosion (Simple 3D Particles on success) */}
      {showConfetti && <ConfettiExplosion />}
    </group>
  );
}

// Simple R3F Particle Explosion Component
function ConfettiExplosion() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 200;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorPalette = [new THREE.Color("#00f0ff"), new THREE.Color("#ff00aa"), new THREE.Color("#00ff88")];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  const velocities = useRef<Float32Array | null>(null);
  
  if (velocities.current == null) {
    const vels = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      vels[i * 3] = (Math.random() - 0.5) * 0.4;
      vels[i * 3 + 1] = Math.random() * 0.4 + 0.1;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    velocities.current = vels;
  }

  useFrame(() => {
    if (pointsRef.current && velocities.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const vels = velocities.current;
      for (let i = 0; i < count; i++) {
        pos[i * 3] += vels[i * 3];
        pos[i * 3 + 1] += vels[i * 3 + 1];
        pos[i * 3 + 2] += vels[i * 3 + 2];
        
        // Gravity
        vels[i * 3 + 1] -= 0.01;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.3} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}
