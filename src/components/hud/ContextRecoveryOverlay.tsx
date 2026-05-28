"use client";

import "./ContextRecoveryOverlay.css";
import { useEffect, useState } from "react";

export default function ContextRecoveryOverlay() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="context-recovery-container">
      <div className="context-recovery-loader"></div>
      <div className="context-recovery-text">Rebooting WebGL Systems{dots}</div>
      <div className="context-recovery-subtext">Restoring lost context...</div>
    </div>
  );
}
