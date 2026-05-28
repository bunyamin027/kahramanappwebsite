"use client";

import Image from "next/image";
import Navbar from "@/components/hud/Navbar";
import BioDownloadButton from "./link-in-bio/BioDownloadButton";
import { apps } from "@/data/apps";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t, lang } = useLanguage();

  return (
    <main className="landing-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          {t("hero_title_1")} <br />
          {t("hero_title_2")}
        </h1>
        <p className="hero-subtitle">
          {t("explore_tagline")}
        </p>
      </section>

      {/* Apps Section */}
      <section id="apps" className="apps-section">
        <div className="apps-grid">
          {apps.map((app) => {
            // Extract localized fields dynamically
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const localizedName = (lang === "en" ? app.name : (app as any)[`name_${lang}`]) || app.name;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const localizedTagline = (lang === "en" ? app.tagline : (app as any)[`tagline_${lang}`]) || app.tagline;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const localizedDesc = (lang === "en" ? app.description : (app as any)[`description_${lang}`]) || app.description;

            return (
              <div 
                key={app.id} 
                className="app-card-2d"
                style={{ "--app-color": app.color } as React.CSSProperties}
              >
                <div className="app-card-icon-wrapper">
                  {app.icon ? (
                    <Image
                      src={app.icon}
                      alt={`${localizedName} icon`}
                      fill
                      className="app-card-icon-image"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#333' }} />
                  )}
                </div>
                <h2 className="app-card-title">{localizedName}</h2>
                <h3 className="app-card-tagline">{localizedTagline}</h3>
                <p className="app-card-desc">{localizedDesc}</p>
                
                <div style={{ width: '100%', marginTop: 'auto' }}>
                  <BioDownloadButton appId={app.id} color={app.color} className="main-download-btn" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2 className="about-title">{t("about_title")}</h2>
          <p className="about-text">{t("about_text")}</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <h2 className="contact-title">{t("contact_title")}</h2>
          <p className="contact-text">{t("contact_text")}</p>
          <a href="mailto:kahramandev01@gmail.com" className="contact-button">
            {t("contact_button")}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p className="landing-footer-text">
          &copy; {new Date().getFullYear()} Kahraman App. All rights reserved.
        </p>
        <div className="landing-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </main>
  );
}
