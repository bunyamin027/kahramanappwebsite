/* eslint-disable react-hooks/purity */
"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { createClient } from "@/lib/supabase";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  content: string;
}

interface ReviewCloud3DProps {
  appId: string;
  color: string;
}

// Fallback reviews if DB is unavailable or empty
const MOCK_REVIEWS: Record<string, Review[]> = {
  dayzero: [
    { id: "1", reviewer_name: "Alex_M", rating: 5, content: "Incredible design. The best countdown app I've used." },
    { id: "2", reviewer_name: "SarahK99", rating: 5, content: "So minimal and clean. Love the widget!" },
    { id: "3", reviewer_name: "TechGuru", rating: 5, content: "Finally an app that doesn't clutter my screen." },
  ],
  ninniai: [
    { id: "1", reviewer_name: "MomOfTwo", rating: 5, content: "A lifesaver! My baby falls asleep in minutes." },
    { id: "2", reviewer_name: "SleepyDad", rating: 5, content: "The AI generated lullabies are surprisingly good." },
    { id: "3", reviewer_name: "JaneDoe", rating: 5, content: "Best white noise app hands down." },
  ],
};

const DEFAULT_REVIEWS: Review[] = [
  { id: "1", reviewer_name: "User", rating: 5, content: "Amazing app, highly recommended!" },
  { id: "2", reviewer_name: "Tester", rating: 5, content: "Very smooth and intuitive interface." },
];

export default function ReviewCloud3D({ appId, color }: ReviewCloud3DProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isActive, setIsActive] = useState(false);

  const neonColor = useMemo(() => new THREE.Color(color), [color]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const supabase = createClient();
        if (supabase) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (supabase.from("app_reviews") as any)
            .select("id, reviewer_name, rating, content")
            .eq("app_id", appId)
            .order("created_at", { ascending: false })
            .limit(5);

          if (!error && data && data.length > 0) {
            setReviews(data);
            return;
          }
        }
        // Fallback
        setReviews(MOCK_REVIEWS[appId] || DEFAULT_REVIEWS);
      } catch {
        setReviews(MOCK_REVIEWS[appId] || DEFAULT_REVIEWS);
      }
    }

    fetchReviews();
  }, [appId]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Distance Calculation (Lazy Rendering logic)
    const distance = state.camera.position.distanceTo(groupRef.current.position);
    
    // Only render and animate when camera is somewhat close
    if (!isActive && distance < 20) {
      setIsActive(true);
    } else if (isActive && distance > 22) {
      setIsActive(false);
    }

    // Slow rotation of the cloud around the app
    if (isActive) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  if (!isActive || reviews.length === 0) return <group ref={groupRef} />;

  return (
    <group ref={groupRef}>
      {reviews.map((review, i) => {
        // Distribute reviews evenly in a circle around the app
        const angle = (i / reviews.length) * Math.PI * 2;
        const radius = 2.8; // Distance from the center of the app card
        const heightOffset = (Math.random() - 0.5) * 2; // Randomize height slightly

        return (
          <Float key={review.id} speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <group
              position={[
                Math.cos(angle) * radius,
                heightOffset,
                Math.sin(angle) * radius,
              ]}
              // Point them outward so they are readable from outside the circle
              rotation={[0, -angle + Math.PI / 2, 0]} 
            >
              {/* Glass panel backing */}
              <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[2.5, 0.6]} />
                <meshPhysicalMaterial
                  color="#000000"
                  transparent
                  opacity={0.3}
                  roughness={0.1}
                  metalness={0.8}
                  clearcoat={1}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Glowing Top Border */}
              <mesh position={[0, 0.3, -0.04]}>
                <planeGeometry args={[2.5, 0.02]} />
                <meshBasicMaterial color={neonColor} toneMapped={false} />
              </mesh>

              {/* Reviewer Name */}
              <Text
                position={[-1.15, 0.15, 0]}
                fontSize={0.12}
                color={neonColor}
                anchorX="left"
                anchorY="middle"
                font="/fonts/Inter-Bold.ttf"
                maxWidth={2.0}
              >
                @{review.reviewer_name}
                <meshBasicMaterial color={neonColor} toneMapped={false} />
              </Text>

              {/* 5 Stars */}
              <Text
                position={[1.15, 0.15, 0]}
                fontSize={0.12}
                color="#FFD700"
                anchorX="right"
                anchorY="middle"
              >
                ★★★★★
              </Text>

              {/* Content */}
              <Text
                position={[-1.15, -0.1, 0]}
                fontSize={0.09}
                color="#ffffff"
                anchorX="left"
                anchorY="top"
                maxWidth={2.3}
                lineHeight={1.2}
                font="/fonts/Inter-Medium.ttf"
              >
                &quot;{review.content.length > 80 ? review.content.slice(0, 80) + "..." : review.content}&quot;
              </Text>
            </group>
          </Float>
        );
      })}
    </group>
  );
}
