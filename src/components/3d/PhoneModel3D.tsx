"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Float, RoundedBox, Edges, Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { AppData } from "@/types/app";
import { PHONE } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { useAudio } from "@/context/AudioContext";

import "./ImageFadeMaterial";

// ── Slideshow timing ─────────────────────────────────────────────
const HOLD_TIME = 3.5;
const FADE_TIME = 0.9;

// Z references — in front of the phone face
const Z_FACE = PHONE.depth / 2 + 0.002;
const Z_UI   = PHONE.depth / 2 + 0.005;

interface PhoneModel3DProps {
  app: AppData;
}

export default function PhoneModel3D({ app }: PhoneModel3DProps) {
  const groupRef    = useRef<THREE.Group>(null!);
  const glowRef     = useRef<THREE.Mesh>(null!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null!);
  const timerRef    = useRef({ time: 0, state: "hold" as "hold" | "fade" });

  const [hovered,    setHovered]    = useState(false);
  const [isActive,   setIsActive]   = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const router          = useRouter();
  const { camera }      = useThree();
  const { lang }        = useLanguage();
  const { playHover, playClick } = useAudio();

  // ── Colours ───────────────────────────────────────────────────
  const neonColor  = useMemo(() => new THREE.Color(app.color), [app.color]);
  const dimColor   = useMemo(() => new THREE.Color(app.color).multiplyScalar(0.06), [app.color]);
  const glowColor  = useMemo(() => new THREE.Color(app.color).multiplyScalar(0.35), [app.color]);

  // ── Localisation ──────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localizedName    = (lang === "en" ? app.name    : (app as any)[`name_${lang}`])    ?? app.name;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localizedTagline = (lang === "en" ? app.tagline : (app as any)[`tagline_${lang}`]) ?? app.tagline;

  // ── Textures ─────────────────────────────────────────────────
  const screenshots  = useMemo(() => app.screenshots ?? [], [app.screenshots]);
  const loadPaths    = screenshots.length > 0 ? screenshots : [app.icon];
  const textures     = useLoader(THREE.TextureLoader, loadPaths) as THREE.Texture[];
  const [iconTex]    = useLoader(THREE.TextureLoader, [app.icon]) as THREE.Texture[];
  const [appStoreTex] = useLoader(THREE.TextureLoader, ["/icons/appstore-badge.svg"]) as THREE.Texture[];

  const currentTex = textures[currentIdx % textures.length];
  const nextTex    = textures[(currentIdx + 1) % textures.length];

  // ── Click → GSAP zoom ────────────────────────────────────────
  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    playClick();
    if (!groupRef.current) return;

    window.dispatchEvent(new CustomEvent("phoneFocusStart"));
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    gsap.to(camera.position, {
      x: worldPos.x,
      y: worldPos.y,
      z: worldPos.z + 2.4,
      duration: 1.1,
      ease: "power3.inOut",
      onUpdate: () => camera.lookAt(worldPos.x, worldPos.y, worldPos.z),
      onComplete: () => router.push(`/${lang}/legal/${app.id}`),
    });
  }, [camera, lang, app.id, playClick, router]);

  // ── Per-frame ─────────────────────────────────────────────────
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const dist = state.camera.position.distanceTo(
      new THREE.Vector3(...(app.position as [number, number, number]))
    );
    if (!isActive && dist < PHONE.renderDistance) setIsActive(true);
    else if (isActive && dist > PHONE.renderDistance + PHONE.renderHysteresis) setIsActive(false);

    // Glow pulse
    if (glowRef.current) {
      const t = state.clock.getElapsedTime();
      const pulse = Math.sin(t * 1.6 + app.position[0]) * 0.2 + 0.8;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        pulse * (hovered ? 0.22 : 0.1);
    }

    // Slideshow — only when close, only when not hovered
    if (isActive && !hovered && screenshots.length > 1 && materialRef.current) {
      const timer = timerRef.current;
      timer.time += delta;
      if (timer.state === "hold") {
        materialRef.current.uProgression = 0;
        if (timer.time >= HOLD_TIME) { timer.state = "fade"; timer.time = 0; }
      } else {
        const p = timer.time / FADE_TIME;
        if (p >= 1.0) {
          timer.state = "hold"; timer.time = 0;
          setCurrentIdx(prev => (prev + 1) % screenshots.length);
          materialRef.current.uProgression = 0;
        } else {
          materialRef.current.uProgression = p * p * (3 - 2 * p);
        }
      }
    }
  });

  // ── Screen layout constants ───────────────────────────────────
  const SW = PHONE.screenW - 0.06;       // screen width minus padding
  const imgH  = PHONE.screenH * 0.55;   // top 55% = image zone
  const infoH = PHONE.screenH * 0.45;   // bottom 45% = info zone
  const imgY  =  (infoH / 2);           // center of image zone
  const infoY = -(imgH / 2);            // center of info zone

  // Label row positions inside info zone (from top of info zone downward)
  const iconY    = infoY + infoH * 0.28;
  const nameY    = infoY + infoH * 0.05;
  const tagY     = infoY - infoH * 0.16;
  const badgeY   = infoY - infoH * 0.36;

  return (
    <Float speed={PHONE.floatSpeed} floatIntensity={PHONE.floatIntensity} rotationIntensity={0.08}>
      <group
        ref={groupRef}
        position={app.position}
        scale={hovered ? 1.07 : 1.0}
        onPointerEnter={() => { setHovered(true); playHover(); }}
        onPointerLeave={() => setHovered(false)}
        onClick={handleClick}
      >

        {/* ══ FLOATING APP NAME ABOVE PHONE ══════════════════════════ */}
        {/* Big neon label — most visible identifier */}
        <Text
          position={[0, PHONE.height / 2 + 0.55, Z_UI + 0.01]}
          fontSize={0.38}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.ttf"
          letterSpacing={0.05}
        >
          {localizedName.toUpperCase()}
          <meshBasicMaterial color={neonColor} toneMapped={false} />
        </Text>

        {/* Thin neon underline below label */}
        <mesh position={[0, PHONE.height / 2 + 0.3, Z_UI]}>
          <planeGeometry args={[PHONE.width * 0.75, 0.018]} />
          <meshBasicMaterial color={neonColor} toneMapped={false} transparent opacity={0.7} />
        </mesh>

        {/* ══ CHASSIS ════════════════════════════════════════════════ */}
        <RoundedBox
          args={[PHONE.width, PHONE.height, PHONE.depth]}
          radius={PHONE.borderRadius}
          smoothness={6}
        >
          <meshPhysicalMaterial
            color={dimColor}
            transparent
            opacity={0.88}
            roughness={0.08}
            metalness={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            transmission={0.1}
            thickness={0.3}
            envMapIntensity={1.2}
            side={THREE.FrontSide}
          />
          <Edges threshold={15} scale={1.0}>
            <meshBasicMaterial
              color={neonColor}
              toneMapped={false}
              transparent
              opacity={hovered ? 1.0 : 0.65}
            />
          </Edges>
        </RoundedBox>

        {/* ══ SCREEN BEZEL ═══════════════════════════════════════════ */}
        <RoundedBox
          args={[PHONE.screenW, PHONE.screenH, 0.012]}
          radius={0.07}
          smoothness={4}
          position={[0, 0, Z_FACE - 0.003]}
        >
          <meshStandardMaterial color="#020209" roughness={0.2} metalness={0.5} />
        </RoundedBox>

        {/* ══ IMAGE CAROUSEL — top 55% of screen ══════════════════════ */}
        <mesh position={[0, imgY, Z_FACE + 0.003]}>
          <planeGeometry args={[SW, imgH]} />
          {/* @ts-expect-error custom shader intrinsic */}
          <imageFadeMaterial
            ref={materialRef}
            uTexture1={currentTex}
            uTexture2={nextTex}
            uProgression={0}
            uColor={neonColor}
            uOpacity={isActive ? 1.0 : 0.6}
            transparent
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Slide dots indicator */}
        {screenshots.length > 1 && (
          <group position={[0, imgY - imgH / 2 + 0.08, Z_UI]}>
            {screenshots.map((_, i) => (
              <mesh key={i} position={[(i - (screenshots.length - 1) / 2) * 0.16, 0, 0]}>
                <circleGeometry args={[0.038, 16]} />
                <meshBasicMaterial
                  color={neonColor}
                  toneMapped={false}
                  transparent
                  opacity={i === currentIdx % screenshots.length ? 1.0 : 0.3}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* ══ INFO PANEL — bottom 45% ══════════════════════════════════ */}

        {/* Background */}
        <mesh position={[0, infoY, Z_FACE + 0.003]}>
          <planeGeometry args={[SW, infoH]} />
          <meshBasicMaterial color="#03030f" transparent opacity={0.96} />
        </mesh>

        {/* Divider line (top of info panel) */}
        <mesh position={[0, infoY + infoH / 2, Z_UI]}>
          <planeGeometry args={[SW, 0.014]} />
          <meshBasicMaterial color={neonColor} toneMapped={false} transparent opacity={0.9} />
        </mesh>

        {/* Glowing color stripe under divider */}
        <mesh position={[0, infoY + infoH / 2 - 0.05, Z_UI]}>
          <planeGeometry args={[SW, 0.08]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.18} />
        </mesh>

        {/* App Icon */}
        <mesh position={[0, iconY, Z_UI]}>
          <planeGeometry args={[0.38, 0.38]} />
          <meshBasicMaterial map={iconTex} transparent />
        </mesh>

        {/* App Name — large, inside panel */}
        <Text
          position={[0, nameY, Z_UI]}
          fontSize={0.19}
          anchorX="center"
          anchorY="middle"
          maxWidth={SW - 0.1}
          font="/fonts/Inter-Bold.ttf"
        >
          {localizedName}
          <meshBasicMaterial color={neonColor} toneMapped={false} />
        </Text>

        {/* Tagline */}
        <Text
          position={[0, tagY, Z_UI]}
          fontSize={0.1}
          anchorX="center"
          anchorY="middle"
          maxWidth={SW - 0.1}
          font="/fonts/Inter-Bold.ttf"
        >
          {localizedTagline}
          <meshBasicMaterial color="#ccccee" toneMapped={false} transparent opacity={0.8} />
        </Text>

        {/* App Store Badge — centered */}
        {app.appStoreUrl && (
          <mesh position={[0, badgeY, Z_UI]}>
            <planeGeometry args={[0.7, 0.7 / (180 / 54)]} />
            <meshBasicMaterial map={appStoreTex} transparent opacity={0.88} />
          </mesh>
        )}

        {/* ══ PHONE HARDWARE DETAILS ══════════════════════════════════ */}

        {/* Camera notch */}
        <mesh position={[0, PHONE.height / 2 - 0.13, Z_FACE + 0.004]}>
          <circleGeometry args={[0.042, 24]} />
          <meshBasicMaterial color="#090912" />
        </mesh>

        {/* Home bar */}
        <mesh position={[0, -PHONE.height / 2 + 0.09, Z_FACE + 0.004]}>
          <planeGeometry args={[0.42, 0.03]} />
          <meshBasicMaterial color={neonColor} toneMapped={false} transparent opacity={hovered ? 1.0 : 0.5} />
        </mesh>

        {/* Left side buttons */}
        <mesh position={[-PHONE.width / 2 - 0.004, 0.55, 0]}>
          <boxGeometry args={[0.022, 0.26, PHONE.depth * 0.55]} />
          <meshPhysicalMaterial color="#0e0e1e" roughness={0.15} metalness={0.95} />
        </mesh>
        <mesh position={[-PHONE.width / 2 - 0.004, 0.2, 0]}>
          <boxGeometry args={[0.022, 0.16, PHONE.depth * 0.55]} />
          <meshPhysicalMaterial color="#0e0e1e" roughness={0.15} metalness={0.95} />
        </mesh>

        {/* Right power button */}
        <mesh position={[PHONE.width / 2 + 0.004, 0.24, 0]}>
          <boxGeometry args={[0.022, 0.2, PHONE.depth * 0.55]} />
          <meshPhysicalMaterial color="#0e0e1e" roughness={0.15} metalness={0.95} />
        </mesh>

        {/* ══ AMBIENT GLOW ════════════════════════════════════════════ */}
        <mesh ref={glowRef} position={[0, 0, -0.5]}>
          <sphereGeometry args={[3.0, 20, 20]} />
          <meshBasicMaterial
            color={neonColor}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* ══ HOVER RING ══════════════════════════════════════════════ */}
        {hovered && (
          <mesh position={[0, 0, -0.05]}>
            <torusGeometry args={[1.15, 0.014, 8, 80]} />
            <meshBasicMaterial color={neonColor} toneMapped={false} transparent opacity={0.55} />
          </mesh>
        )}

        {/* ══ HOVER: "TAP TO EXPLORE" prompt ════════════════════════ */}
        {hovered && (
          <Text
            position={[0, -PHONE.height / 2 - 0.38, Z_UI]}
            fontSize={0.13}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.ttf"
          >
            TAP TO EXPLORE →
            <meshBasicMaterial color={neonColor} toneMapped={false} transparent opacity={0.8} />
          </Text>
        )}

      </group>
    </Float>
  );
}
