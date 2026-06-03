"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Giriş başarısız.");
      }
    } catch (err) {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030308] flex items-center justify-center p-4" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
      <div className="w-full max-w-md bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Neon accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f0ff] to-[#bf00ff]"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[rgba(0,240,255,0.1)] flex items-center justify-center mb-4 border border-[rgba(0,240,255,0.2)]">
            <Lock className="text-[#00f0ff] w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-widest">ADMİN GİRİŞİ</h1>
          <p className="text-[#8888aa] text-xs mt-2 text-center">Yönetim paneline erişmek için yetkili şifresini girin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin Şifresi"
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
              required
            />
          </div>

          {error && <p className="text-[#ff00aa] text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:opacity-90 text-white font-semibold rounded-xl p-3.5 text-sm transition-all disabled:opacity-50"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
