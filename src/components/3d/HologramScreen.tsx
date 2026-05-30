"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Edges } from "@react-three/drei";

// Import our custom shader material (this also registers it with R3F)
import "./ImageFadeMaterial";

interface HologramScreenProps {
  screenshots: string[];
  videoUrl?: string;
  color: string;
  position?: [number, number, number];
}

const RENDER_DISTANCE_THRESHOLD = 15;
const SCREEN_WIDTH = 1.8;
const SCREEN_HEIGHT = 3.2; // 9:16 aspect ratio

// Configuration for the slideshow
const HOLD_TIME = 3.0; // Seconds to show an image
const FADE_TIME = 1.0; // Seconds to fade between images

export default function HologramScreen({
  screenshots,
  videoUrl,
  color,
  position = [2.5, 0, 0],
}: HologramScreenProps) {
  const groupRef = useRef<THREE.Group>(null!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null!);
  
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Detect mobile device to prevent WebGL out-of-memory crashes on heavy videos
  const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const shouldUseVideo = Boolean(videoUrl && !isMobile);
  
  // Timer state for the shader transition
  const timerRef = useRef({ time: 0, state: "hold" as "hold" | "fade" });
  
  const neonColor = useMemo(() => new THREE.Color(color), [color]);
  
  // Create a default black texture as a fallback if no screenshots
  const defaultTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 2, 2);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Pre-load all textures (R3F's useLoader handles caching automatically)
  // We only load them if we have screenshots, otherwise we just use the fallback
  const validScreenshots = screenshots && screenshots.length > 0 
    ? screenshots 
    : [];
    
  // If no screenshots, we still need an array to avoid useLoader errors
  const textureLoaderPaths = validScreenshots.length > 0 ? validScreenshots : ["/icons/dayzero.png"];
  
  // We use standard THREE.TextureLoader via useLoader
  // In a truly massive app with hundreds of high-res images, we'd want to suspend
  // loading until `isActive` is true. For now, since R3F suspends the component,
  // we'll load them as they mount, but only render the heavy shader when close.
  const textures = useLoader(
    THREE.TextureLoader,
    textureLoaderPaths
  ) as THREE.Texture[];

  // Manual video texture management to avoid Suspense crashes on empty URLs
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    if (shouldUseVideo && isActive && videoUrl) {
      const vid = document.createElement("video");
      vid.src = videoUrl;
      vid.crossOrigin = "Anonymous";
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.play().catch(e => console.warn("Video play prevented:", e));
      
      const tex = new THREE.VideoTexture(vid);
      setVideoTexture(tex);
      
      return () => {
        vid.pause();
        vid.removeAttribute("src");
        vid.load();
        tex.dispose();
      };
    }
  }, [shouldUseVideo, isActive, videoUrl]);

  const currentTexture = shouldUseVideo && videoTexture
    ? videoTexture
    : validScreenshots.length > 0 
      ? textures[currentIndex % textures.length] 
      : defaultTexture;
      
  const nextTexture = shouldUseVideo && videoTexture
    ? videoTexture
    : validScreenshots.length > 0 
      ? textures[(currentIndex + 1) % textures.length] 
      : defaultTexture;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Distance Calculation (Lazy Rendering logic)
    const distance = state.camera.position.distanceTo(groupRef.current.position);
    
    // Hysteresis to prevent flickering when at exact boundary
    if (!isActive && distance < RENDER_DISTANCE_THRESHOLD) {
      setIsActive(true);
    } else if (isActive && distance > RENDER_DISTANCE_THRESHOLD + 2) {
      setIsActive(false);
    }

    // 2. Animate Hologram Float
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.05;

    // 3. Handle Slideshow Crossfade (only if active and not using video)
    if (isActive && !shouldUseVideo && validScreenshots.length > 1 && materialRef.current) {
      const timer = timerRef.current;
      timer.time += delta;

      if (timer.state === "hold") {
        materialRef.current.uProgression = 0; // Show texture 1 fully
        if (timer.time >= HOLD_TIME) {
          timer.state = "fade";
          timer.time = 0;
        }
      } else if (timer.state === "fade") {
        // Linearly interpolate from 0 to 1 over FADE_TIME
        let progress = timer.time / FADE_TIME;
        
        if (progress >= 1.0) {
          progress = 1.0;
          timer.state = "hold";
          timer.time = 0;
          // Advance to next image
          setCurrentIndex((prev) => (prev + 1) % validScreenshots.length);
          // When index changes, React re-renders and passes the new currentTexture/nextTexture
          // So we reset progression to 0 for the new hold phase
          materialRef.current.uProgression = 0;
        } else {
          // Smoothstep for a nicer fade curve
          const smoothProgress = progress * progress * (3 - 2 * progress);
          materialRef.current.uProgression = smoothProgress;
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 
        LAZY LOADING IMPLEMENTATION:
        If the camera is far away, we only render a lightweight wireframe box.
        If it's close, we render the full custom shader and textures.
      */}
      {!isActive ? (
        <mesh>
          <boxGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT, 0.05]} />
          <meshBasicMaterial
            color={neonColor}
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      ) : (
        <group>
          {/* Main Hologram Screen */}
          <mesh>
            <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
            {/* @ts-expect-error custom shader intrinsic */}
            <imageFadeMaterial
              ref={materialRef}
              uTexture1={currentTexture}
              uTexture2={nextTexture}
              uProgression={0}
              uColor={neonColor}
              uOpacity={0.85}
              transparent={true}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Glass Backing for Depth */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[SCREEN_WIDTH + 0.02, SCREEN_HEIGHT + 0.02]} />
            <meshPhysicalMaterial
              color="#000000"
              transparent
              opacity={0.4}
              roughness={0.1}
              metalness={0.8}
              clearcoat={1}
            />
            {/* Neon Border */}
            <Edges threshold={15} scale={1.0}>
              <meshBasicMaterial
                color={neonColor}
                toneMapped={false}
                transparent
                opacity={0.5}
              />
            </Edges>
          </mesh>

          {/* Corner Accents (Cyberpunk HUD UI elements) */}
          <group position={[0, 0, 0.01]}>
            {/* Top Left */}
            <mesh position={[-SCREEN_WIDTH / 2 + 0.1, SCREEN_HEIGHT / 2 - 0.02, 0]}>
              <planeGeometry args={[0.2, 0.02]} />
              <meshBasicMaterial color={neonColor} toneMapped={false} />
            </mesh>
            <mesh position={[-SCREEN_WIDTH / 2 + 0.02, SCREEN_HEIGHT / 2 - 0.1, 0]}>
              <planeGeometry args={[0.02, 0.2]} />
              <meshBasicMaterial color={neonColor} toneMapped={false} />
            </mesh>

            {/* Top Right */}
            <mesh position={[SCREEN_WIDTH / 2 - 0.1, SCREEN_HEIGHT / 2 - 0.02, 0]}>
              <planeGeometry args={[0.2, 0.02]} />
              <meshBasicMaterial color={neonColor} toneMapped={false} />
            </mesh>
            <mesh position={[SCREEN_WIDTH / 2 - 0.02, SCREEN_HEIGHT / 2 - 0.1, 0]}>
              <planeGeometry args={[0.02, 0.2]} />
              <meshBasicMaterial color={neonColor} toneMapped={false} />
            </mesh>

            {/* Bottom Left */}
            <mesh position={[-SCREEN_WIDTH / 2 + 0.1, -SCREEN_HEIGHT / 2 + 0.02, 0]}>
              <planeGeometry args={[0.2, 0.02]} />
              <meshBasicMaterial color={neonColor} toneMapped={false} />
            </mesh>
            <mesh position={[-SCREEN_WIDTH / 2 + 0.02, -SCREEN_HEIGHT / 2 + 0.1, 0]}>
              <planeGeometry args={[0.02, 0.2]} />
              <meshBasicMaterial color={neonColor} toneMapped={false} />
            </mesh>

            {/* Bottom Right */}
            <mesh position={[SCREEN_WIDTH / 2 - 0.1, -SCREEN_HEIGHT / 2 + 0.02, 0]}>
              <planeGeometry args={[0.2, 0.02]} />
              <meshBasicMaterial color={neonColor} toneMapped={false} />
            </mesh>
            <mesh position={[SCREEN_WIDTH / 2 - 0.02, -SCREEN_HEIGHT / 2 + 0.1, 0]}>
              <planeGeometry args={[0.02, 0.2]} />
              <meshBasicMaterial color={neonColor} toneMapped={false} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
