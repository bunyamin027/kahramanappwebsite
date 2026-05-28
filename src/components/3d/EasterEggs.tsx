"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

export default function EasterEggs() {
  const cubeRef = useRef<THREE.Mesh>(null!);
  const pyramidRef = useRef<THREE.Mesh>(null!);
  const torusRef = useRef<THREE.Mesh>(null!);

  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (cubeRef.current) {
      cubeRef.current.rotation.x = t * 0.5;
      cubeRef.current.rotation.y = t * 0.5;
    }
    if (pyramidRef.current) {
      pyramidRef.current.rotation.y = t * 0.8;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.2;
      torusRef.current.rotation.y = t * 0.3;
    }
  });

  const triggerGlitch = (message: string) => {
    const event = new CustomEvent("triggerGlitch", { detail: { message } });
    window.dispatchEvent(event);
  };

  return (
    <group>
      {/* 1. Glowing Data Cube */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[-15, 8, -10]}>
        <mesh
          ref={cubeRef}
          onClick={(e) => {
            e.stopPropagation();
            triggerGlitch("DATA_NODE_UNLOCKED: Vision 2030 initialized.");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered("cube");
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(null);
            document.body.style.cursor = "auto";
          }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#ff00aa"
            emissive="#ff00aa"
            emissiveIntensity={hovered === "cube" ? 2 : 0.8}
            wireframe
          />
        </mesh>
      </Float>

      {/* 2. Cyber Pyramid */}
      <Float speed={3} rotationIntensity={1} floatIntensity={0.8} position={[15, -6, -5]}>
        <mesh
          ref={pyramidRef}
          onClick={(e) => {
            e.stopPropagation();
            triggerGlitch("ARCHIVE_FOUND: We are the architects of tomorrow.");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered("pyramid");
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(null);
            document.body.style.cursor = "auto";
          }}
        >
          <coneGeometry args={[1, 1.5, 4]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={hovered === "pyramid" ? 2 : 0.5}
            transparent
            opacity={0.8}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* 3. Neural Torus */}
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5} position={[0, 15, -25]}>
        <mesh
          ref={torusRef}
          onClick={(e) => {
            e.stopPropagation();
            triggerGlitch("NEURAL_LINK_ESTABLISHED: Preparing next deployment.");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered("torus");
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(null);
            document.body.style.cursor = "auto";
          }}
        >
          <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />
          <meshStandardMaterial
            color="#bf00ff"
            emissive="#bf00ff"
            emissiveIntensity={hovered === "torus" ? 1.5 : 0.4}
            metalness={1}
            roughness={0}
          />
        </mesh>
      </Float>
    </group>
  );
}
