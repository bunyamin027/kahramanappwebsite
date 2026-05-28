"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/context/AudioContext";
import "./ChatWindow.css";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const { playChatNotification, playHover } = useAudio();
  const { messages, sendMessage, status } = useChat({
    onToolCall({ toolCall }) {
      if (toolCall.toolName === "navigateToApp") {
        // Broadcast custom event for the 3D camera to intercept
        const event = new CustomEvent("aiNavigate", { 
          detail: ((toolCall as unknown) as { args: { appId: string } }).args.appId 
        });
        window.dispatchEvent(event);
      }
    },
  });

  // Listen to automatic navigation and chat prompt triggers
  useEffect(() => {
    const handleNavAndChat = (e: Event) => {
      const customEvent = e as CustomEvent;
      const message = customEvent.detail?.message;
      if (message) {
        sendMessage({ role: "user", parts: [{ type: "text", text: message }] });
      }
    };
    window.addEventListener("aiNavAndChat", handleNavAndChat);
    return () => window.removeEventListener("aiNavAndChat", handleNavAndChat);
  }, [sendMessage]);

  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
    setInput("");
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom and play notification sound when new assistant messages arrive
  const prevMessagesCount = useRef(messages.length);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    if (messages.length > prevMessagesCount.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        playChatNotification();
      }
    }
    prevMessagesCount.current = messages.length;
  }, [messages, playChatNotification]);

  if (!isOpen) return null;

  return (
    <div className="chat-window-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="ai-status-dot pulse" />
          <span className="ai-title">Agentic Guide</span>
        </div>
        <button className="chat-close-btn" onClick={onClose} onMouseEnter={playHover}>
          ×
        </button>
      </div>

      {/* Message List */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty-state">
            <p>I am your futuristic AI guide.</p>
            <p>Ask me to show you an app!</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-message ${
              m.role === "user" ? "message-user" : "message-assistant"
            }`}
          >
            <div className="message-bubble">
              {m.parts?.map((part, index) => {
                if (part.type === "text") {
                  return <span key={index}>{part.text}</span>;
                }
                return null;
              })}
              
              {/* Render Tool Invocations for transparency */}
              {m.parts?.map((part, index) => {
                const typedPart = part as { type: string; toolInvocation?: { toolName: string; args?: { appId: string }; toolCallId?: string } };
                if (typedPart.type === "tool-invocation" && typedPart.toolInvocation?.toolName === "navigateToApp") {
                  return (
                    <div key={typedPart.toolInvocation?.toolCallId || index} className="tool-invocation-badge">
                      <span className="tool-icon">✈️</span>
                      Navigating to: {typedPart.toolInvocation?.args?.appId}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message message-assistant">
            <div className="message-bubble typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          placeholder="e.g. Show me a sleep app..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="chat-submit-btn" 
          onMouseEnter={playHover}
          disabled={isLoading || !input.trim()}
        >
          &gt;
        </button>
      </form>
    </div>
  );
}
