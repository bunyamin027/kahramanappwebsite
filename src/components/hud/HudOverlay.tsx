"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import AiOrb from "./AiOrb";
import GodModeConsole from "./GodModeConsole";
import GlitchMessage from "./GlitchMessage";
import A11yFallback from "../ui/A11yFallback";
import { apps } from "@/data/apps";
import { useLanguage } from "@/context/LanguageContext";

export default function HudOverlay() {
  const { t } = useLanguage();
  const [glitchMessage, setGlitchMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleGlitch = (e: Event) => {
      const customEvent = e as CustomEvent;
      setGlitchMessage(customEvent.detail.message);
    };
    window.addEventListener("triggerGlitch", handleGlitch);
    return () => window.removeEventListener("triggerGlitch", handleGlitch);
  }, []);

  return (
    <>
      <div className="hud-overlay">
        <Navbar />

        {/* ── Bottom tagline ────────────────────── */}
        <div className="hud-bottom">
          <p className="hud-tagline">
            {t("explore_tagline")}
          </p>
          <div className="hud-scroll-hint">
            <span className="hud-scroll-arrow">↓</span>
            <span>{t("scroll_hint")}</span>
          </div>
        </div>

        {/* ── AI Assistant Orb ──────────────────── */}
        <AiOrb />
        
        {/* ── God Mode Console ──────────────────── */}
        <GodModeConsole />




      </div>

      {/* ── Glitch Message Overlay ────────────── */}
      {glitchMessage && (
        <GlitchMessage 
          message={glitchMessage} 
          onComplete={() => setGlitchMessage(null)} 
        />
      )}

      {/* ── Accessibility DOM Backup ──────────── */}
      <A11yFallback apps={apps} />
    </>
  );
}
