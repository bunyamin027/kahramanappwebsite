"use client";

import { Suspense, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Bvh, Html } from "@react-three/drei";
import Starfield from "./Starfield";
import AppCard3D from "./AppCard3D";
import PhoneModel3D from "./PhoneModel3D";
import NeonGrid from "./NeonGrid";
import CameraRig from "./CameraRig";
import CarbonTokenSector from "./CarbonTokenSector";
import ResearchStationSector from "./ResearchStationSector";
import EasterEggs from "./EasterEggs";
import WaitlistCapsule from "./WaitlistCapsule";
import FounderNodeSector from "./FounderNodeSector";
import ContextRecoveryOverlay from "../hud/ContextRecoveryOverlay";
import { SCENE, BLOOM } from "@/lib/constants";
import { apps } from "@/data/apps";

// Draco Decoder will be configured on-demand when GLTF assets are loaded

export default function Scene() {
  const [canvasKey, setCanvasKey] = useState(0);
  const [isContextLost, setIsContextLost] = useState(false);

  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    gl.setClearColor(SCENE.background);
    gl.toneMapping = 3; // ACESFilmicToneMapping
    gl.toneMappingExposure = 1.2;

    const handleContextLost = (e: Event) => {
      e.preventDefault(); // Prevent default browser action
      console.warn("WebGL Context Lost! Initiating recovery...");
      setIsContextLost(true);
    };

    const handleContextRestored = () => {
      console.log("WebGL Context Restored! Rebooting scene...");
      setIsContextLost(false);
      setCanvasKey(prev => prev + 1); // Force a complete remount of the Canvas
    };

    gl.domElement.addEventListener("webglcontextlost", handleContextLost);
    gl.domElement.addEventListener("webglcontextrestored", handleContextRestored);
  }, []);

  return (
    <>
      {isContextLost && <ContextRecoveryOverlay />}
      <Canvas
        key={canvasKey}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      dpr={[1, 1.5]}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: SCENE.background,
        visibility: isContextLost ? "hidden" : "visible",
      }}
      onCreated={handleCreated}
    >
      <Suspense fallback={<Html center><h1 style={{color: 'white', whiteSpace: 'nowrap'}}>LOADING 3D ASSETS...</h1></Html>}>
        <Bvh firstHitOnly>
          {/* ── Camera ──────────────────────────── */}
          <CameraRig />

          {/* ── Lighting ────────────────────────── */}
          <ambientLight intensity={0.15} color="#4444aa" />
          <pointLight
            position={[10, 15, 10]}
            intensity={0.8}
            color="#00f0ff"
            distance={60}
            decay={2}
          />
          <pointLight
            position={[-10, 10, -10]}
            intensity={0.5}
            color="#ff00aa"
            distance={50}
            decay={2}
          />

          {/* ── Fog ─────────────────────────────── */}
          <fog attach="fog" args={[SCENE.fog, 30, 120]} />

          {/* ── Starfield Background ────────────── */}
          <Starfield />

          {/* ── Neon Grid Floor ─────────────────── */}
          <NeonGrid />

          {/* ── Green Tech / Web3 Sector ────────── */}
          <CarbonTokenSector />

          {/* ── R&D / Consulting B2B Sector ─────── */}
          <ResearchStationSector />

          {/* ── Hidden Mastery Corner / Founder's Node ── */}
          <FounderNodeSector />

          {/* ── Hype Elements ───────────────────── */}

          <WaitlistCapsule />

          {/* ── Cosmic Easter Eggs ──────────────── */}
          <EasterEggs />

          {/* ── App Phones ──────────────────────────── */}
          {apps.map((app) => (
            <PhoneModel3D key={app.id} app={app} />
          ))}
        </Bvh>

        {/* ── Postprocessing ──────────────────── */}
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={BLOOM.luminanceThreshold}
            luminanceSmoothing={BLOOM.luminanceSmoothing}
            intensity={BLOOM.intensity}
            mipmapBlur={BLOOM.mipmapBlur}
          />
          <Vignette
            offset={0.3}
            darkness={0.7}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
    </>
  );
}
