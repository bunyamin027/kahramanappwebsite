/* eslint-disable react-hooks/purity */
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STARFIELD } from "@/lib/constants";

export default function Starfield() {
  const ref = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(STARFIELD.count * 3);
    const col = new Float32Array(STARFIELD.count * 3);

    for (let i = 0; i < STARFIELD.count; i++) {
      const i3 = i * 3;
      // Distribute stars in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = STARFIELD.radius * (0.3 + Math.random() * 0.7);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      // Slightly tinted colors — mix of white, cyan, and light purple
      const tint = Math.random();
      if (tint < 0.6) {
        // White-ish
        col[i3] = 0.8 + Math.random() * 0.2;
        col[i3 + 1] = 0.85 + Math.random() * 0.15;
        col[i3 + 2] = 0.95 + Math.random() * 0.05;
      } else if (tint < 0.8) {
        // Cyan-ish
        col[i3] = 0.2 + Math.random() * 0.2;
        col[i3 + 1] = 0.7 + Math.random() * 0.3;
        col[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        // Purple-ish
        col[i3] = 0.5 + Math.random() * 0.3;
        col[i3 + 1] = 0.2 + Math.random() * 0.2;
        col[i3 + 2] = 0.8 + Math.random() * 0.2;
      }
    }

    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * STARFIELD.rotationSpeed;
      ref.current.rotation.x += delta * STARFIELD.rotationSpeed * 0.3;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={STARFIELD.size}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
