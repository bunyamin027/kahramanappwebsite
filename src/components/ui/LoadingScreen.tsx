"use client";

import { useState, useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const hasLoadedAssets = useRef(false);

  // Track if any assets ever started loading
  useEffect(() => {
    if (active || progress > 0) {
      hasLoadedAssets.current = true;
    }
  }, [active, progress]);

  // Fallback: if no drei assets are loading (all procedural 3D),
  // simulate progress and dismiss after a short delay
  useEffect(() => {
    if (hasLoadedAssets.current) return; // assets are loading, let useProgress handle it

    let frame: number;
    let start: number | null = null;
    const duration = 2000; // 2 second simulated boot

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setDisplayProgress(pct);

      if (pct < 100) {
        frame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setVisible(false), 800);
      }
    };

    // Start simulated progress after a brief initial delay
    const timeout = setTimeout(() => {
      if (!hasLoadedAssets.current) {
        frame = requestAnimationFrame(animate);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Handle real asset loading completion
  useEffect(() => {
    if (!active && progress === 100) {
      const timeout = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [active, progress]);

  // Use real progress if assets are loading, otherwise use simulated
  const effectiveProgress = hasLoadedAssets.current ? progress : displayProgress;

  const logs = ["INITIALIZING NEON KERNEL v9.0.1...", "LOADING MEMORY BANKS [OK]"];
  if (effectiveProgress > 10) logs.push("COMPILING CYBERPUNK SHADERS...");
  if (effectiveProgress > 50) logs.push("ESTABLISHING WEBGL CONTEXT... [OK]");
  if (effectiveProgress > 80) logs.push("ASSEMBLING UNIVERSE TOPOLOGY...");
  if (effectiveProgress >= 100) logs.push("SYSTEM READY.", "BOOTING...");

  if (!visible) return null;

  return (
    <div className={`loading-screen ${effectiveProgress >= 100 && !active ? "loading-screen-done" : ""}`}>
      <div className="terminal-container">
        <div className="terminal-header">
          <span className="terminal-blinking-cursor">_</span>
          <h2>AGENTIC_OS</h2>
        </div>
        
        <div className="terminal-logs">
          {logs.map((log, i) => (
            <p key={i} className="terminal-log-line">
              <span className="terminal-prefix">{'>'}</span> {log}
            </p>
          ))}
        </div>

        <div className="terminal-progress-section">
          <p className="terminal-status-text">
            SYSTEM INITIALIZING... <span className="terminal-percent">{Math.round(effectiveProgress)}%</span>
          </p>
          <div className="terminal-bar-track">
            <div
              className="terminal-bar-fill"
              style={{ width: `${effectiveProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scan line effect */}
      <div className="loading-scanlines" />
    </div>
  );
}

