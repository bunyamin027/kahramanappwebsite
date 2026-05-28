"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { NEON, GRID } from "@/lib/constants";

export default function NeonGrid() {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d")!;

    // Background — fully transparent
    ctx.clearRect(0, 0, 2048, 2048);

    // Draw grid lines
    const divisions = GRID.divisions;
    const step = 2048 / divisions;

    ctx.strokeStyle = NEON.cyan;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.15;

    for (let i = 0; i <= divisions; i++) {
      const pos = i * step;
      // Horizontal
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(2048, pos);
      ctx.stroke();
      // Vertical
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, 2048);
      ctx.stroke();
    }

    // Brighter center lines
    ctx.strokeStyle = NEON.cyan;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(1024, 0);
    ctx.lineTo(1024, 2048);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 1024);
    ctx.lineTo(2048, 1024);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    return texture;
  }, []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3, 0]}
      receiveShadow
    >
      <planeGeometry args={[GRID.size, GRID.size]} />
      <meshBasicMaterial
        map={gridTexture}
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
