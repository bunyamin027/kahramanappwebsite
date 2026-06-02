"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare } from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Yeni İletişim Formu Mesajı: ${name}`);
    const body = encodeURIComponent(`Gönderen: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`);
    window.location.href = `mailto:kahramandev01@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container glass-panel">
        
        <motion.div 
          className="contact-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="contact-title">Bizimle İletişime Geçin</h2>
          <p className="contact-subtitle">Bir sonraki büyük projenizi birlikte inşa edelim.</p>
        </motion.div>

        <motion.form 
          className="contact-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <User className="input-icon" size={18} />
            <input 
              type="text" 
              className="contact-input" 
              placeholder="Adınız Soyadınız" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              className="contact-input" 
              placeholder="E-posta Adresiniz" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <MessageSquare className="input-icon textarea-icon" size={18} />
            <textarea 
              className="contact-input contact-textarea" 
              placeholder="Mesajınız..." 
              rows={4} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="contact-submit-btn">
            <span>Mesajı Gönder</span>
            <Send size={18} className="submit-icon" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
