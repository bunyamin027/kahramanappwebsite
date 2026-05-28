"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./not-found.css";

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("404");

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchText((prev) => (prev === "404" ? "ERR" : "404"));
        setTimeout(() => setGlitchText("404"), 150);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="not-found-container">
      <div className="not-found-scanlines" />
      <div className="not-found-content">
        <h1 className="not-found-title" data-text={glitchText}>
          {glitchText}
        </h1>
        <h2 className="not-found-subtitle">LOST SECTOR</h2>
        <p className="not-found-desc">
          The trajectory you specified does not exist in our database.<br />
          Possible path traversal anomaly detected and contained.
        </p>
        <Link href="/" className="not-found-btn">
          <span className="not-found-btn-glow"></span>
          RETURN TO CORE
        </Link>
      </div>
    </div>
  );
}
