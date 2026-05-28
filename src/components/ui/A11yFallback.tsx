"use client";

import { useEffect, useState } from "react";
import { AppData } from "@/types/app";

interface A11yFallbackProps {
  apps: AppData[];
}

export default function A11yFallback({ apps }: A11yFallbackProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleFocus = (appId: string) => {
    // When a screen reader or keyboard user tabs to this invisible link,
    // we fire the existing aiNavigate event to move the 3D camera to it!
    const event = new CustomEvent("aiNavigate", { detail: { targetId: appId } });
    window.dispatchEvent(event);
  };

  if (!mounted) return null;

  return (
    <div className="sr-only" aria-live="polite">
      <h2>Explore our apps in 3D</h2>
      <p>Use the Tab key to navigate through the apps. The 3D camera will follow your focus.</p>
      <ul>
        {apps.map((app) => (
          <li key={app.id}>
            <a
              href={`#${app.id}`}
              onFocus={() => handleFocus(app.id)}
              className="a11y-focus-link"
              aria-label={`View ${app.name} in 3D`}
            >
              {app.name} - {app.tagline}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
