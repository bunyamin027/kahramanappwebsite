"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Code, Cpu, Smartphone, Sparkles } from "lucide-react";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="about-section">
      <div className="about-container glass-panel">
        <div className="about-content">
          <motion.div
            className="about-badge"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Sparkles size={16} className="text-cyan-400" />
            <span>KAHRAMAN APP STUDIO</span>
          </motion.div>

          <motion.h2
            className="about-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
          >
            Geleceğin Dijital Mimarları
          </motion.h2>

          <motion.p
            className="about-description"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
          >
            "{t("about_text", "Biz sadece kod yazmıyoruz; sanat ile teknolojinin kesiştiği noktada, yapay zeka destekli yeni nesil mobil deneyimler inşa ediyoruz.")}"
          </motion.p>

          <div className="about-stats-grid">
            <motion.div 
              className="about-stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
            >
              <Cpu className="stat-icon neon-purple" />
              <div className="stat-value">AI Core</div>
              <div className="stat-label">Yapay Zeka Mimarisi</div>
            </motion.div>

            <motion.div 
              className="about-stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.4 }}
            >
              <Smartphone className="stat-icon neon-cyan" />
              <div className="stat-value">Premium</div>
              <div className="stat-label">Mobil Deneyim</div>
            </motion.div>

            <motion.div 
              className="about-stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.5 }}
            >
              <Code className="stat-icon neon-pink" />
              <div className="stat-value">Kusursuz</div>
              <div className="stat-label">Kod ve Performans</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
