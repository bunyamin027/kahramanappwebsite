"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search, RefreshCw, LayoutDashboard, Settings } from "lucide-react";

export default function AdminDashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  
  const [activeTab, setActiveTab] = useState<"apps" | "settings">("apps");
  
  // Settings Form
  const [settings, setSettings] = useState({
    hero_title_1_tr: "",
    hero_title_1_en: "",
    hero_title_2_tr: "",
    hero_title_2_en: "",
    about_text_tr: "",
    about_text_en: "",
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchApps();
    fetchSettings();
  }, []);

  const fetchApps = async () => {
    setLoadingApps(true);
    try {
      const res = await fetch("/api/admin/apps");
      const data = await res.json();
      if (data.apps) {
        setApps(data.apps);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSettings(false);
    }
  };

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

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert("Site ayarları başarıyla kaydedildi!");
      } else {
        alert("Kaydetme başarısız oldu.");
      }
    } catch (error) {
      alert("Bir hata oluştu.");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl p-6 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-white">Yönetim Paneli</h1>
          <p className="text-gray-400 text-sm mt-1">Uygulamalarınızı ve site içeriğini yönetin.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex p-1 bg-[rgba(255,255,255,0.05)] rounded-xl">
          <button 
            onClick={() => setActiveTab("apps")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "apps" 
                ? "bg-[rgba(0,240,255,0.1)] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.1)]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} />
            Uygulamalar
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "settings" 
                ? "bg-[rgba(0,240,255,0.1)] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.1)]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Settings size={18} />
            Site Ayarları
          </button>
        </div>
      </div>

      {/* Apps Tab Content */}
      {activeTab === "apps" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Tüm Uygulamalar</h2>
            <Link
              href="/admin/edit/new"
              className="flex items-center gap-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <Plus size={20} /> Yeni Uygulama
            </Link>
          </div>

          <div className="bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Uygulama ara..."
                  className="pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00f0ff] transition-colors w-64"
                />
              </div>
              <button onClick={fetchApps} className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00f0ff] transition-colors p-2 rounded-lg" title="Yenile">
                <RefreshCw size={16} className={loadingApps ? "animate-spin text-[#00f0ff]" : ""} />
                Yenile
              </button>
            </div>

            {loadingApps ? (
              <div className="p-20 text-center text-gray-400 flex flex-col items-center gap-4">
                <RefreshCw className="animate-spin text-[#00f0ff]" size={40} />
                <span className="text-lg">Uygulamalar Yükleniyor...</span>
              </div>
            ) : apps.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-[rgba(0,240,255,0.05)] rounded-full flex items-center justify-center mb-4">
                  <LayoutDashboard className="text-[#00f0ff] opacity-50" size={32} />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Uygulama Bulunamadı</h3>
                <p className="text-gray-400 mb-6 max-w-md">Henüz uygulama eklenmemiş. Yukarıdaki butonu kullanarak ilk uygulamanızı eklemeye başlayabilirsiniz.</p>
                <Link
                  href="/admin/edit/new"
                  className="flex items-center gap-2 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 px-6 py-2.5 rounded-xl font-semibold hover:bg-[#00f0ff]/20 transition-all"
                >
                  <Plus size={18} /> Şimdi Ekle
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)] text-gray-400 text-sm tracking-wider">
                      <th className="py-5 px-6 font-medium uppercase text-xs">Uygulama</th>
                      <th className="py-5 px-6 font-medium uppercase text-xs">Kategori</th>
                      <th className="py-5 px-6 font-medium uppercase text-xs">Fiyat</th>
                      <th className="py-5 px-6 font-medium uppercase text-xs">Eklenme Tarihi</th>
                      <th className="py-5 px-6 font-medium uppercase text-xs text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                    {apps.map((app) => (
                      <tr key={app.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            {app.icon_url ? (
                              <img src={app.icon_url} alt={app.name} className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-[rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform" />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                                <LayoutDashboard size={20} className="text-gray-500" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-white text-base">{app.name}</div>
                              <div className="text-xs text-[#00f0ff] font-mono mt-0.5">{app.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-300">
                          <span className="px-3 py-1 bg-[rgba(255,255,255,0.05)] rounded-full text-xs text-gray-300 border border-[rgba(255,255,255,0.1)] capitalize">
                            {app.category || "Utilities"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span className={app.price === 0 ? "text-green-400 font-medium" : "text-gray-300"}>
                            {app.price === 0 ? "Ücretsiz" : `$${app.price}`}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-400">
                          {new Date(app.created_at).toLocaleDateString("tr-TR")}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/edit/${app.id}`} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(0,240,255,0.2)] hover:text-[#00f0ff] border border-[rgba(255,255,255,0.1)] hover:border-[#00f0ff]/50 rounded-lg transition-all">
                              <Edit2 size={14} /> Düzenle
                            </Link>
                            <button onClick={() => handleDelete(app.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-[rgba(248,113,113,0.1)] rounded-lg transition-colors border border-transparent hover:border-red-400/30" title="Sil">
                              <Trash2 size={16} />
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
      )}

      {/* Settings Tab Content */}
      {activeTab === "settings" && (
        <div className="bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-6 flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#00f0ff]">Site İçerik Ayarları</h2>
              <p className="text-xs text-gray-400 mt-1">Ana sayfada ve diğer sayfalarda görünen genel metinleri buradan düzenleyebilirsiniz.</p>
            </div>
          </div>
          
          {loadingSettings ? (
            <div className="py-12 flex justify-center">
              <RefreshCw className="animate-spin text-[#00f0ff]" size={32} />
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              {/* Hero Section Texts */}
              <div className="space-y-6">
                <h3 className="text-base font-medium text-white flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                  Web Giriş Yazısı (Hero Section)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[rgba(255,255,255,0.02)] p-6 rounded-xl border border-[rgba(255,255,255,0.05)]">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-300 border-b border-[rgba(255,255,255,0.1)] pb-2">Türkçe (TR)</h4>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Üst Başlık (Satır 1)</label>
                      <input name="hero_title_1_tr" value={settings.hero_title_1_tr} onChange={handleSettingsChange} placeholder="Örn: Yeni Nesil Yapay Zeka" className="w-full bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2.5 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Alt Başlık (Satır 2)</label>
                      <input name="hero_title_2_tr" value={settings.hero_title_2_tr} onChange={handleSettingsChange} placeholder="Örn: Mobil Deneyimleri" className="w-full bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2.5 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-300 border-b border-[rgba(255,255,255,0.1)] pb-2">English (EN)</h4>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Top Title (Line 1)</label>
                      <input name="hero_title_1_en" value={settings.hero_title_1_en} onChange={handleSettingsChange} placeholder="e.g. Next-Gen AI" className="w-full bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2.5 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Bottom Title (Line 2)</label>
                      <input name="hero_title_2_en" value={settings.hero_title_2_en} onChange={handleSettingsChange} placeholder="e.g. Mobile Experiences" className="w-full bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2.5 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              {/* About Us Section */}
              <div className="space-y-6">
                <h3 className="text-base font-medium text-white flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#bf00ff]" />
                  Hakkımızda (About Us)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[rgba(255,255,255,0.02)] p-6 rounded-xl border border-[rgba(255,255,255,0.05)]">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Hakkımızda Metni (TR)</label>
                    <textarea 
                      name="about_text_tr" 
                      value={settings.about_text_tr} 
                      onChange={handleSettingsChange} 
                      rows={5} 
                      className="w-full bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#bf00ff] focus:outline-none transition-colors leading-relaxed" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">About Us Text (EN)</label>
                    <textarea 
                      name="about_text_en" 
                      value={settings.about_text_en} 
                      onChange={handleSettingsChange} 
                      rows={5} 
                      className="w-full bg-[rgba(10,10,20,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#bf00ff] focus:outline-none transition-colors leading-relaxed" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={savingSettings}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#00f0ff] to-[#bf00ff] rounded-xl text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  {savingSettings ? <RefreshCw className="animate-spin" size={18} /> : null}
                  {savingSettings ? "Kaydediliyor..." : "Ayarları Kaydet"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
