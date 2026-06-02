"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/apps");
      const data = await res.json();
      if (data.apps) {
        setApps(data.apps);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu uygulamayı silmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`/api/admin/apps?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setApps(apps.filter((app) => app.id !== id));
      } else {
        alert("Silme başarısız.");
      }
    } catch (error) {
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide">Uygulamalar</h1>
        <Link
          href="/admin/edit/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,240,255,0.3)]"
        >
          <Plus size={20} /> Yeni Uygulama
        </Link>
      </div>

      <div className="bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Ara..."
              className="pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00f0ff] transition-colors w-64"
            />
          </div>
          <button onClick={fetchApps} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg" title="Yenile">
            <RefreshCw size={18} className={loading ? "animate-spin text-[#00f0ff]" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin text-[#00f0ff]" size={32} />
            <span>Yükleniyor...</span>
          </div>
        ) : apps.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p>Henüz uygulama eklenmemiş. İlk uygulamanızı ekleyerek başlayın.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)] text-gray-400 text-sm">
                  <th className="py-4 px-6 font-medium">Uygulama</th>
                  <th className="py-4 px-6 font-medium">App Store ID</th>
                  <th className="py-4 px-6 font-medium">Fiyat</th>
                  <th className="py-4 px-6 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                {apps.map((app) => (
                  <tr key={app.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {app.icon_url ? (
                          <img src={app.icon_url} alt={app.name} className="w-12 h-12 rounded-xl object-cover shadow-lg border border-[rgba(255,255,255,0.1)]" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)]"></div>
                        )}
                        <div>
                          <div className="font-semibold text-white">{app.name}</div>
                          <div className="text-xs text-[#00f0ff] font-mono">{app.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-300 font-mono">{app.app_store_id || "-"}</td>
                    <td className="py-4 px-6 text-sm text-gray-300">
                      {app.price === 0 ? "Ücretsiz" : `$${app.price}`}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/edit/${app.id}`} className="p-2 text-gray-400 hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)] rounded-lg transition-colors" title="Düzenle">
                          <Edit2 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(app.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-[rgba(248,113,113,0.1)] rounded-lg transition-colors" title="Sil">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
