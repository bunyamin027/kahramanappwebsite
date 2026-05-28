"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { updateListenerPosition } from "@/lib/audio";
import { CAMERA } from "@/lib/constants";

export default function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseSmoothed = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      mouseTarget.current.x = (e.clientX / size.width - 0.5) * 2;
      mouseTarget.current.y = (e.clientY / size.height - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size]);

  // GSAP fly-in animation on mount
  useEffect(() => {
    if (cameraRef.current) {
      // Start far away
      cameraRef.current.position.set(0, 15, 50);
      cameraRef.current.lookAt(0, 0, 0);

      gsap.to(cameraRef.current.position, {
        x: CAMERA.initialPosition[0],
        y: CAMERA.initialPosition[1],
        z: CAMERA.initialPosition[2],
        duration: 3,
        ease: "power3.inOut",
        onUpdate: () => {
          cameraRef.current?.lookAt(0, 0, 0);
        },
      });
    }
  }, []);

  const cameraSettingsRef = useRef({
    initialPosition: [...CAMERA.initialPosition],
    parallaxFactor: CAMERA.parallaxFactor as number,
  });

  // Autonomous AI Navigation
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const appId = customEvent.detail;
      
      // Dynamic import to avoid circular dependencies if any, or just import at top
      import("@/data/apps").then(({ apps }) => {
        const targetApp = apps.find(a => a.id === appId);
        if (targetApp && cameraRef.current) {
          // Temporarily disable mouse parallax
          cameraSettingsRef.current.parallaxFactor = 0; 
          
          // Target position: slightly in front and above the app card
          const targetPos = {
            x: targetApp.position[0],
            y: targetApp.position[1] + 1,
            z: targetApp.position[2] + 15 // Stay 15 units back to see it clearly
          };

          gsap.to(cameraRef.current.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 2.5,
            ease: "power3.inOut",
            onUpdate: () => {
              cameraRef.current?.lookAt(targetApp.position[0], targetApp.position[1], targetApp.position[2]);
            },
            onComplete: () => {
              // Restore or update the base offset so parallax works around the new center
              cameraSettingsRef.current.initialPosition[0] = targetPos.x;
              cameraSettingsRef.current.initialPosition[1] = targetPos.y;
              cameraSettingsRef.current.initialPosition[2] = targetPos.z;
              cameraSettingsRef.current.parallaxFactor = CAMERA.parallaxFactor; 
            }
          });
        }
      });
    };

    window.addEventListener("aiNavigate", handleNavigate);
    return () => window.removeEventListener("aiNavigate", handleNavigate);
  }, []);

  // Center camera for AI Guide interaction when triggered
  useEffect(() => {
    const handleNavAndChat = () => {
      if (cameraRef.current) {
        cameraSettingsRef.current.parallaxFactor = 0; 
        gsap.to(cameraRef.current.position, {
          x: CAMERA.initialPosition[0],
          y: CAMERA.initialPosition[1],
          z: CAMERA.initialPosition[2],
          duration: 2.5,
          ease: "power3.inOut",
          onUpdate: () => {
            cameraRef.current?.lookAt(0, 0, 0);
          },
          onComplete: () => {
            cameraSettingsRef.current.initialPosition[0] = CAMERA.initialPosition[0];
            cameraSettingsRef.current.initialPosition[1] = CAMERA.initialPosition[1];
            cameraSettingsRef.current.initialPosition[2] = CAMERA.initialPosition[2];
            cameraSettingsRef.current.parallaxFactor = CAMERA.parallaxFactor; 
          }
        });
      }
    };

    window.addEventListener("aiNavAndChat", handleNavAndChat);
    return () => window.removeEventListener("aiNavAndChat", handleNavAndChat);
  }, []);

  // Mouse parallax
  useFrame(() => {
    if (!cameraRef.current) return;

    // Smooth the mouse
    mouseSmoothed.current.x +=
      (mouseTarget.current.x - mouseSmoothed.current.x) *
      CAMERA.parallaxSmoothing;
    mouseSmoothed.current.y +=
      (mouseTarget.current.y - mouseSmoothed.current.y) *
      CAMERA.parallaxSmoothing;

    // Apply parallax offset to camera position
    const offsetX = mouseSmoothed.current.x * cameraSettingsRef.current.parallaxFactor;
    const offsetY = -mouseSmoothed.current.y * cameraSettingsRef.current.parallaxFactor * 0.5;

    cameraRef.current.position.x =
      cameraSettingsRef.current.initialPosition[0] + offsetX;
    cameraRef.current.position.y =
      cameraSettingsRef.current.initialPosition[1] + offsetY;

    cameraRef.current.lookAt(0, 0, 0);

    // Update spatial audio listener location relative to camera matrix
    const pos = cameraRef.current.position;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    updateListenerPosition(pos.x, pos.y, pos.z, dir.x, dir.y, dir.z);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={CAMERA.initialPosition}
      fov={CAMERA.fov}
      near={CAMERA.near}
      far={CAMERA.far}
    />
  );
}
