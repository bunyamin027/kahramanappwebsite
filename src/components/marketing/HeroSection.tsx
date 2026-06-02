"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="hero-section-premium">
      {/* Animated gradient orbs */}
      <div className="hero-orb hero-orb--1" />
      <div className="hero-orb hero-orb--2" />
      <div className="hero-orb hero-orb--3" />

      {/* Subtle grid overlay */}
      <div className="hero-grid-overlay" />

      <div className="hero-content">
        <motion.div
          className="hero-badge-pill"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="hero-badge-dot" />
          <span>Kahraman App Studio</span>
        </motion.div>

        <motion.h1
          className="hero-title-main"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          {t("hero_title_1", "Next-Gen AI")}
          <br />
          <span className="hero-title-accent">
            {t("hero_title_2", "Mobile Experiences")}
          </span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          {t("about_text")}
        </motion.p>

        <motion.div
          className="hero-cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <button
            className="hero-cta-primary"
            onClick={() => {
              const showcase = document.getElementById("apps");
              showcase?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>{t("explore_tagline", "Explore Apps")}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span>{t("scroll_hint", "Scroll to explore")}</span>
        <ChevronDown size={16} className="hero-scroll-chevron" />
      </motion.div>
    </section>
  );
}
