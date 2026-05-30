"use client";

import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";

/**
 * Modern 2D floating chat button that replaced the 3D AiOrb.
 * Keeps the same name and props for backward compatibility with imports.
 */
export default function AiOrb() {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleNavAndChat = () => {
      setChatOpen(true);
    };
    window.addEventListener("aiNavAndChat", handleNavAndChat);
    return () => window.removeEventListener("aiNavAndChat", handleNavAndChat);
  }, []);

  return (
    <>
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="ai-chat-trigger-btn"
          aria-label="Open AI Assistant"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
        >
          {/* Simple chat bubble SVG icon */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      <ChatWindow 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </>
  );
}
