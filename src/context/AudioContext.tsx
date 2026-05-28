"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  initSynthEngine, 
  fadeInSynth, 
  fadeOutSynth, 
  playHoverSound, 
  playClickSound, 
  playChatNotificationSound 
} from "@/lib/audio";

interface AudioContextType {
  muted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playChatNotification: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize and fade-in audio on first user click or interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!initialized && !muted) {
        initSynthEngine();
        fadeInSynth();
        setInitialized(true);
      }
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [initialized, muted]);

  const toggleMute = () => {
    if (muted) {
      // Unmuting
      if (!initialized) {
        initSynthEngine();
        setInitialized(true);
      }
      fadeInSynth();
      setMuted(false);
      // Play a quick satisfying synth chime to confirm activation
      setTimeout(() => {
        playChatNotificationSound();
      }, 100);
    } else {
      // Muting
      fadeOutSynth();
      setMuted(true);
    }
  };

  const playHover = () => {
    if (!muted) playHoverSound();
  };

  const playClick = () => {
    if (!muted) playClickSound();
  };

  const playChatNotification = () => {
    if (!muted) playChatNotificationSound();
  };

  return (
    <AudioContext.Provider value={{ muted, toggleMute, playHover, playClick, playChatNotification }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
