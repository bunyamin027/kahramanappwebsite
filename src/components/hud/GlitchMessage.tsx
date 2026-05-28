"use client";

import { useEffect, useState } from "react";
import "./GlitchMessage.css";

interface GlitchMessageProps {
  message: string;
  onComplete: () => void;
}

export default function GlitchMessage({ message, onComplete }: GlitchMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500); // give time for fade out
    }, 5000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="glitch-overlay">
      <div className="glitch-container">
        <h2 className="glitch-text" data-text={message}>
          {message}
        </h2>
        <div className="glitch-scanlines"></div>
      </div>
    </div>
  );
}
