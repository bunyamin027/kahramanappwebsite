"use client";

import { useEffect, useState } from "react";
import { apps } from "@/data/apps";
import "./MilestoneTracker.css";

export default function MilestoneTracker() {
  const [mounted, setMounted] = useState(false);
  const goal = 50;
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentCount = apps.length;
  const percentage = (currentCount / goal) * 100;

  return (
    <div className="milestone-tracker">
      <div className="milestone-header">
        <span className="milestone-title">MISSION_PROGRESS</span>
        <span className="milestone-count">
          <span className="milestone-current">{currentCount}</span> / {goal}
        </span>
      </div>
      <div className="milestone-bar-bg">
        <div 
          className="milestone-bar-fill"
          style={{ width: `${percentage}%` }}
        />
        <div className="milestone-scanline" />
      </div>
      <div className="milestone-footer">
        TARGET: 50 AGENTIC APPS
      </div>
    </div>
  );
}
