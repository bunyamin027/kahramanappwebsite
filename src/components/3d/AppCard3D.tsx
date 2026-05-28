"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text, RoundedBox, Edges } from "@react-three/drei";
import * as THREE from "three";
import { AppData } from "@/types/app";
import HologramScreen from "./HologramScreen";
import ReviewCloud3D from "./ReviewCloud3D";
import { useSmartRedirect } from "@/hooks/useSmartRedirect";
import { useLanguage } from "@/context/LanguageContext";
import { useAudio } from "@/context/AudioContext";
import { updateSpatialPanner } from "@/lib/audio";
import { APP_CARD } from "@/lib/constants";

interface AppCard3DProps {
  app: AppData;
}

export default function AppCard3D({ app }: AppCard3DProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { handleDownload, isRedirecting } = useSmartRedirect();
  const { lang } = useLanguage();
  const { playHover, playClick } = useAudio();

  const neonColor = useMemo(() => new THREE.Color(app.color), [app.color]);
  const darkColor = useMemo(
    () => new THREE.Color(app.color).multiplyScalar(0.15),
    [app.color]
  );

  // Localized fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localizedName = (lang === "en" ? app.name : (app as any)[`name_${lang}`]) || app.name;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localizedTagline = (lang === "en" ? app.tagline : (app as any)[`tagline_${lang}`]) || app.tagline;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localizedDesc = (lang === "en" ? app.description : (app as any)[`description_${lang}`]) || app.description;

  // Pulse the glow & Frustum Culling
  useFrame((state) => {
    if (groupRef.current) {
      // Distance culling: hide if further than 40 units away
      const dist = state.camera.position.distanceTo(groupRef.current.position);
      const shouldBeVisible = dist < 40;
      
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);
      }

      // Update spatial coordinates dynamically relative to absolute 3D grid
      if (shouldBeVisible && (app.id === "dayzero" || app.id === "ninniai")) {
        const absPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(absPos);
        updateSpatialPanner(app.id, absPos.x, absPos.y, absPos.z);
      }
    }

    if (glowRef.current && isVisible) {
      const t = state.clock.getElapsedTime();
      const pulse = Math.sin(t * 2 + app.position[0]) * 0.3 + 0.7;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        pulse * (hovered ? 0.35 : 0.2);
    }
  });

  return (
    <Float
      speed={APP_CARD.floatSpeed}
      floatIntensity={APP_CARD.floatIntensity}
      rotationIntensity={0.15}
    >
      <group
        ref={groupRef}
        position={app.position}
        visible={isVisible}
        onPointerEnter={() => {
          setHovered(true);
          playHover();
        }}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          if (!isRedirecting) {
            handleDownload(app.id, "3d-showcase");
          }
        }}
        scale={hovered ? 1.08 : 1}
      >
        {/* ── Card Body ────────────────────────────────── */}
        <RoundedBox
          args={[APP_CARD.width, APP_CARD.height, APP_CARD.depth]}
          radius={APP_CARD.borderRadius}
          smoothness={4}
        >
          <meshPhysicalMaterial
            color="#0a0a1a"
            transparent
            opacity={0.65}
            roughness={0.2}
            metalness={0.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={0.5}
            side={THREE.DoubleSide}
          />
          {/* ── Neon Edge Glow ─────────────────────────── */}
          <Edges
            threshold={15}
            scale={1.0}
          >
            <meshBasicMaterial
              color={neonColor}
              toneMapped={false}
              transparent
              opacity={hovered ? 1 : 0.8}
            />
          </Edges>
        </RoundedBox>

        {/* ── Inner neon line accent ───────────────────── */}
        <mesh position={[0, 0.6, APP_CARD.depth / 2 + 0.01]}>
          <planeGeometry args={[APP_CARD.width - 0.5, 0.015]} />
          <meshBasicMaterial
            color={neonColor}
            toneMapped={false}
          />
        </mesh>

        {/* ── App Icon Circle ─────────────────────────── */}
        <mesh position={[0, 0.35, APP_CARD.depth / 2 + 0.01]}>
          <circleGeometry args={[APP_CARD.iconSize / 2, 64]} />
          <meshStandardMaterial
            color={darkColor}
            emissive={neonColor}
            emissiveIntensity={0.4}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* ── App Icon Initial Letter ─────────────────── */}
        <Text
          position={[0, 0.35, APP_CARD.depth / 2 + 0.02]}
          fontSize={0.55}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.ttf"
          outlineWidth={0}
        >
          {localizedName.charAt(0)}
          <meshBasicMaterial
            color="white"
            toneMapped={false}
          />
        </Text>

        {/* ── App Name ────────────────────────────────── */}
        <Text
          position={[0, -0.5, APP_CARD.depth / 2 + 0.02]}
          fontSize={0.22}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={APP_CARD.width - 0.4}
          font="/fonts/Inter-Bold.ttf"
        >
          {localizedName}
          <meshBasicMaterial color="white" toneMapped={false} />
        </Text>

        {/* ── Tagline ─────────────────────────────────── */}
        <Text
          position={[0, -0.85, APP_CARD.depth / 2 + 0.02]}
          fontSize={0.12}
          color={app.color}
          anchorX="center"
          anchorY="middle"
          maxWidth={APP_CARD.width - 0.4}
          font="/fonts/Inter-Bold.ttf"
        >
          {localizedTagline}
          <meshBasicMaterial
            color={neonColor}
            toneMapped={false}
            transparent
            opacity={0.9}
          />
        </Text>

        {/* ── Description ─────────────────────────────── */}
        <Text
          position={[0, -1.2, APP_CARD.depth / 2 + 0.02]}
          fontSize={0.08}
          color="#8888aa"
          anchorX="center"
          anchorY="top"
          maxWidth={APP_CARD.width - 0.5}
          lineHeight={1.4}
          font="/fonts/Inter-Bold.ttf"
        >
          {localizedDesc}
        </Text>

        {/* ── Background Glow Sphere ──────────────────── */}
        <mesh ref={glowRef} position={[0, 0, -0.5]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial
            color={neonColor}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* ── Hologram Media Player ───────────────────── */}
        {app.screenshots && app.screenshots.length > 0 && (
          <HologramScreen 
            screenshots={app.screenshots}
            videoUrl={app.video_url}
            color={app.color}
            position={[2.8, 0, 0]} 
          />
        )}

        {/* ── 3D Holographic Review Cloud ─────────────── */}
        <ReviewCloud3D appId={app.id} color={app.color} />
      </group>
    </Float>
  );
}
