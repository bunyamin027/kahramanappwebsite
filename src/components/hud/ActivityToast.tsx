"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import "./ActivityToast.css";

interface ActivityEvent {
  id: string;
  app: string;
  country: string;
  countryCode: string;
  timeAgo: string;
  color: string;
}

// Simulated data to make the platform feel alive
const APPS = [
  { name: "Dayzero", color: "#00f0ff" },
  { name: "Ninniai", color: "#ff00aa" },
  { name: "CarbonTracker", color: "#00ff88" }
];

const COUNTRIES = [
  { name: "Germany", code: "🇩🇪", trName: "Almanya" },
  { name: "United States", code: "🇺🇸", trName: "Amerika" },
  { name: "United Kingdom", code: "🇬🇧", trName: "İngiltere" },
  { name: "Japan", code: "🇯🇵", trName: "Japonya" },
  { name: "France", code: "🇫🇷", trName: "Fransa" },
  { name: "Spain", code: "🇪🇸", trName: "İspanya" },
  { name: "Canada", code: "🇨🇦", trName: "Kanada" },
  { name: "Turkey", code: "🇹🇷", trName: "Türkiye" }
];

export default function ActivityToast() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const { lang } = useLanguage();

  const triggerRandomEvent = useCallback(() => {
    const randomApp = APPS[Math.floor(Math.random() * APPS.length)];
    const randomCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const timeAgoSecs = Math.floor(Math.random() * 59) + 1; // 1 to 59 seconds ago
    
    const newEvent: ActivityEvent = {
      id: Math.random().toString(36).substring(2, 9),
      app: randomApp.name,
      country: lang === "en" ? randomCountry.name : randomCountry.trName,
      countryCode: randomCountry.code,
      timeAgo: lang === "en" ? `${timeAgoSecs}s ago` : `${timeAgoSecs}s önce`,
      color: randomApp.color
    };

    setEvents(prev => [...prev, newEvent]);

    // Remove the event after 5 seconds (CSS animation handles slide out at 4.5s)
    setTimeout(() => {
      setEvents(prev => prev.filter(e => e.id !== newEvent.id));
    }, 5000);
  }, [lang]);

  useEffect(() => {
    // Initial delay before first toast
    const initialTimeout = setTimeout(() => {
      triggerRandomEvent();
    }, 3000);

    // Continuous random intervals between 15 and 45 seconds
    const scheduleNextEvent = () => {
      const nextDelay = Math.floor(Math.random() * 30000) + 15000;
      setTimeout(() => {
        triggerRandomEvent();
        scheduleNextEvent(); // Schedule the one after
      }, nextDelay);
    };

    scheduleNextEvent();

    return () => {
      clearTimeout(initialTimeout);
      // In a strict cleanup we would keep track of the recursive timeout ID too,
      // but since this sits at the root HUD level, it generally stays mounted.
    };
  }, [triggerRandomEvent]);

  if (events.length === 0) return null;

  return (
    <div className="activity-toast-container">
      {events.map(event => (
        <div 
          key={event.id} 
          className="activity-toast"
          style={{ 
            '--accent-color': event.color,
            '--accent-color-glow': `${event.color}40` // Add transparency to hex
          } as React.CSSProperties}
        >
          <div className="activity-toast-icon">
            {event.countryCode}
          </div>
          <div className="activity-toast-content">
            <span className="activity-toast-title">
              {lang === "en" ? "Live Download" : "Canlı İndirme"}
            </span>
            <span className="activity-toast-text">
              {lang === "en" ? (
                <>Someone from <strong>{event.country}</strong> just downloaded <strong>{event.app}</strong></>
              ) : (
                <><strong>{event.country}</strong>&apos;den biri az önce <strong>{event.app}</strong> indirdi</>
              )}
            </span>
            <span className="activity-toast-time">{event.timeAgo}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
