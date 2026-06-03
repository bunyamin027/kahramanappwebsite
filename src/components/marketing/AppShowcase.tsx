"use client";

import { motion } from "framer-motion";
import { AppData } from "@/types/app";
import { Apple, Play } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";import Image from "next/image";

interface AppShowcaseProps {
  apps: AppData[];
}

export default function AppShowcase({ apps }: AppShowcaseProps) {
  const { lang, t } = useLanguage();

  return (
    <section id="apps" className="catalog-wrapper">
      <div className="catalog-grid">
        {apps.map((app, index) => {
          const localizedName = (app[`name_${lang}` as keyof AppData] as string) || app.name;
          const localizedTagline = (app[`tagline_${lang}` as keyof AppData] as string) || app.tagline;
          const localizedDescription = (app[`description_${lang}` as keyof AppData] as string) || app.description;

          return (
            <motion.div 
              key={app.id} 
              className="app-showcase-row glass-panel p-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              style={{ '--app-color': app.color } as React.CSSProperties}
            >
              {/* App Info */}
              <div className="app-info-col">
                <Image src={app.icon} alt={localizedName} width={128} height={128} className="app-icon-large" />
                <div>
                  <h2 className="app-title">{localizedName}</h2>
                  <p className="app-tagline">{localizedTagline}</p>
                </div>
                <p className="app-description">{localizedDescription}</p>
                
                <div className="download-buttons">
                  <Link href={`/apps/${app.id}`} className="store-button" style={{ background: 'transparent', borderColor: app.color, color: app.color }}>
                    <span>{t("view_details", "Read About")}</span>
                  </Link>
                

                {app.appStoreUrl && (
                  <a href={app.appStoreUrl} target="_blank" rel="noreferrer" className="store-button">
                    <Apple size={24} />
                    <div>
                      <div className="text-[10px] opacity-70 uppercase tracking-wider leading-none">Download on the</div>
                      <div className="font-bold leading-none mt-1">App Store</div>
                    </div>
                  </a>
                )}
                
                {app.playStoreUrl && (
                  <a href={app.playStoreUrl} target="_blank" rel="noreferrer" className="store-button">
                    <Play size={24} />
                    <div>
                      <div className="text-[10px] opacity-70 uppercase tracking-wider leading-none">GET IT ON</div>
                      <div className="font-bold leading-none mt-1">Google Play</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Mockup / Screenshots */}
            <div className="mockup-container">
              <div className="mockup-glow"></div>
              <div className="mockup-frame">
                <div className="mockup-notch"></div>
                {/* Fallback to a gradient if no screenshots exist */}
                {app.screenshots && app.screenshots.length > 0 ? (
                  <Image src={app.screenshots[0]} alt={`${app.name} screen`} width={400} height={800} className="mockup-screen" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center mockup-screen" style={{ background: `linear-gradient(135deg, #111, ${app.color}40)` }}>
                     <Image src={app.icon} alt={app.name} width={96} height={96} className="w-24 h-24 rounded-2xl shadow-2xl mb-6" />
                     <h3 className="font-bold text-xl text-white text-center px-4">{app.name}</h3>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </section>
  );
}
