"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { lang, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
          <img 
            src="/logo.png" 
            alt="KahramanApp Logo" 
            style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'contain', background: '#fff' }}
          />
          <span className="navbar-logo-text" style={{ fontSize: '1.5rem' }}>
            KAHRAMAN<span className="navbar-logo-accent">APP</span>
          </span>
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div className="navbar-links">
          <a href="#apps" className="nav-link">
            {t("apps")}
          </a>
          <a href="#about" className="nav-link">
            {t("about")}
          </a>
          <a href="#contact" className="nav-link">
            {t("contact")}
          </a>
        </div>

        {/* ── Premium Language Selector Dropdown ── */}
        <div 
          className={`lang-dropdown-container ${dropdownOpen ? "open" : ""}`} 
          ref={dropdownRef}
        >
          <button 
            className="lang-dropdown-btn" 
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <span>{activeLangObj.flag}</span>
            <span>{activeLangObj.label}</span>
            <span className="lang-dropdown-arrow">▼</span>
          </button>

          {dropdownOpen && (
            <div className="lang-dropdown-menu" role="listbox">
              {SUPPORTED_LANGUAGES.map((locale) => (
                <button
                  key={locale.code}
                  className={`lang-dropdown-item ${locale.code === lang ? "active" : ""}`}
                  onClick={() => {
                    setLanguage(locale.code);
                    setDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={locale.code === lang}
                >
                  <span>{locale.flag}</span>
                  <span>{locale.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Theme Toggle Button ── */}
        <button 
          className="lang-dropdown-btn" 
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span style={{ fontSize: '1rem' }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
        </button>

      </div>
    </nav>
  );
}
