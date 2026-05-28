"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";

export default function Countdown3D() {
  const { t } = useLanguage();
  const groupRef = useRef<THREE.Group>(null!);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: Next Friday at 18:00
    const getNextFriday = () => {
      const now = new Date();
      const nextFriday = new Date();
      nextFriday.setDate(now.getDate() + ((7 - now.getDay() + 5) % 7 || 7));
      nextFriday.setHours(18, 0, 0, 0);
      return nextFriday.getTime();
    };

    const targetTime = getNextFriday();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating/pulsing based on time
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t) * 0.5;
    }
  });

  const timeString = `${String(timeLeft.days).padStart(2, '0')}:${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  return (
    <group position={[0, 8, -30]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
        <group ref={groupRef}>
          <Text
            font="/fonts/CourierPrime.ttf"
            fontSize={6}
            letterSpacing={0.1}
            color="#ff00aa"
            anchorX="center"
            anchorY="middle"
          >
            {timeString}
            <meshBasicMaterial color="#ff00aa" toneMapped={false} />
          </Text>
          
          <Text
            position={[0, -4, 0]}
            font="/fonts/Inter-Bold.ttf"
            fontSize={1}
            letterSpacing={0.2}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
          >
            {t("next_drop")}
            <meshBasicMaterial color="#00f0ff" toneMapped={false} />
          </Text>

          {/* Glow effect behind text */}
          <mesh position={[0, 0, -2]}>
            <planeGeometry args={[35, 12]} />
            <meshBasicMaterial color="#ff00aa" transparent opacity={0.05} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
