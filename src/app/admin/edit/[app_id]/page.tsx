"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Download, Globe, RefreshCw, Link as LinkIcon, Image as ImageIcon, Box, LayoutTemplate, Apple, ExternalLink } from "lucide-react";

export default function EditApp({ params }: { params: Promise<{ app_id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const appId = unwrappedParams.app_id;
  const isNew = appId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [fetchingStore, setFetchingStore] = useState(false);
  const [translating, setTranslating] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    tagline: "",
    description: "",
    description_tr: "",
    icon_url: "",
    app_store_id: "",
    app_store_url: "",
    bundle_id: "",
    developer: "",
    category: "utilities",
    color: "#00f0ff",
    position_x: 0,
    position_y: 0,
    position_z: 0,
    price: 0,
    version: "1.0.0",
    release_date: "",
    company_name: "AgenticApps",
    contact_email: "privacy@agenticapps.com",
    screenshots: [] as string[],
    video_url: ""
  });

  const [screenshotInput, setScreenshotInput] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetchApp();
    }
  }, [isNew]);

  const fetchApp = async () => {
    try {
      const res = await fetch(`/api/admin/apps?id=${appId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.app) {
          const normalizedApp = { ...data.app };
          Object.keys(normalizedApp).forEach(key => {
            if (normalizedApp[key] === null) {
              normalizedApp[key] = "";
            }
          });
          if (!Array.isArray(normalizedApp.screenshots)) {
            normalizedApp.screenshots = [];
          }
          setFormData(normalizedApp);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addScreenshot = () => {
    if (screenshotInput.trim()) {
      setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, screenshotInput.trim()] }));
      setScreenshotInput("");
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = "/api/admin/apps";
      const method = isNew ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const errData = await res.json();
        alert(`Kaydetme başarısız: ${errData.error || "Bilinmeyen hata"}`);
      }
    } catch (error) {
      alert("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleFetchFromStore = async () => {
    if (!formData.app_store_id) {
      alert("Lütfen önce App Store Linki veya ID'sini girin.");
      return;
    }

    let storeIdToFetch = formData.app_store_id;
    const match = storeIdToFetch.match(/id(\d+)/);
    if (match) {
      storeIdToFetch = match[1];
      setFormData(prev => ({ ...prev, app_store_id: storeIdToFetch }));
    } else {
      storeIdToFetch = storeIdToFetch.replace(/\D/g, "");
      setFormData(prev => ({ ...prev, app_store_id: storeIdToFetch }));
    }

    if (!storeIdToFetch) {
      alert("Geçerli bir App Store ID bulunamadı.");
      return;
    }

    setFetchingStore(true);
    try {
      const res = await fetch(`/api/fetch-app?id=${storeIdToFetch}`);
      if (res.ok) {
        const responseData = await res.json();
        const data = responseData.app;
        
        if (data) {
          setFormData((prev) => ({
            ...prev,
            name: data.trackName || prev.name,
            tagline: (data.genres && data.genres[0]) || prev.tagline,
            description: data.description || prev.description,
            icon_url: data.artworkUrl512 || data.artworkUrl100 || prev.icon_url,
            developer: data.artistName || prev.developer,
            price: data.price || prev.price,
            bundle_id: data.bundleId || prev.bundle_id,
            version: data.version || prev.version,
            release_date: data.releaseDate || prev.release_date,
            app_store_url: data.trackViewUrl || prev.app_store_url,
            screenshots: data.screenshotUrls?.length > 0 ? data.screenshotUrls : prev.screenshots,
            id: prev.id || (data.trackName ? data.trackName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") : prev.id),
          }));
          alert("App Store'dan bilgiler başarıyla çekildi!");
        } else {
          alert("App Store'dan veri dönmedi.");
        }
      } else {
        alert("App Store'dan çekilemedi. Lütfen ID'yi kontrol edin.");
      }
    } catch (error) {
      alert("Bir hata oluştu.");
    } finally {
      setFetchingStore(false);
    }
  };

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const res = await fetch("/api/auto-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appData: formData }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.translations && data.translations.tr) {
          setFormData((prev) => ({
            ...prev,
            description_tr: data.translations.tr.description || prev.description_tr,
          }));
          alert("Çeviri başarılı!");
        } else {
            alert("Çeviri sonucu gelmedi.");
        }
      } else {
        alert("Çeviri başarısız.");
      }
    } catch (error) {
      alert("Bir hata oluştu.");
    } finally {
      setTranslating(false);
    }
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-[50vh]"><RefreshCw className="animate-spin text-[#00f0ff] mb-4" size={48} /><p className="text-gray-400">Yükleniyor...</p></div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#060612]/90 backdrop-blur-xl border-b border-[rgba(0,240,255,0.15)] py-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2.5 text-gray-400 hover:text-white bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] rounded-xl transition-all shadow-sm">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white">
                {isNew ? "Yeni Uygulama" : "Uygulamayı Düzenle"}
              </h1>
              {!isNew && <p className="text-xs text-[#00f0ff] font-mono mt-1">{formData.id}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={handleFetchFromStore} 
              disabled={fetchingStore}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white text-sm hover:bg-[rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
            >
              <Download size={16} className={fetchingStore ? "animate-bounce" : ""} /> Store'dan Çek
            </button>
            <button 
              type="button" 
              onClick={handleTranslate} 
              disabled={translating}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)] rounded-xl text-[#00f0ff] text-sm hover:bg-[rgba(0,240,255,0.15)] transition-all disabled:opacity-50"
            >
              <Globe size={16} className={translating ? "animate-spin" : ""} /> Çevir
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-xl text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"
            >
              <Save size={18} className={saving ? "animate-pulse" : ""} /> {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </div>

      <form className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section: Temel Bilgiler */}
            <div className="bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl p-6 shadow-2xl">
              <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
                <LayoutTemplate size={20} className="text-[#00f0ff]" /> Temel Bilgiler
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 flex gap-6 items-start">
                  <div className="flex-1 space-y-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Uygulama Adı</label>
                      <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white text-lg font-medium focus:border-[#00f0ff] focus:bg-[rgba(0,240,255,0.02)] focus:outline-none transition-all shadow-inner" placeholder="App Name" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">URL Slug (ID)</label>
                      <input name="id" value={formData.id} onChange={handleChange} disabled={!isNew} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-gray-300 font-mono text-sm focus:border-[#00f0ff] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed" placeholder="e.g. kahraman-app" />
                    </div>
                  </div>
                  
                  <div className="w-32 flex flex-col items-center">
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold self-start">İkon</label>
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.3)] shadow-xl relative group">
                      {formData.icon_url ? (
                        <img src={formData.icon_url} alt="App Icon" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Kısa Açıklama (Tagline)</label>
                  <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:bg-[rgba(0,240,255,0.02)] focus:outline-none transition-all" placeholder="E.g. The best app for everything" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">İngilizce Açıklama (EN)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:bg-[rgba(0,240,255,0.02)] focus:outline-none transition-all leading-relaxed" placeholder="Full description..." />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold text-[#00f0ff]">Türkçe Açıklama (TR)</label>
                  <textarea name="description_tr" value={formData.description_tr} onChange={handleChange} rows={5} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:bg-[rgba(0,240,255,0.02)] focus:outline-none transition-all leading-relaxed" placeholder="Türkçe açıklama..." />
                </div>
              </div>
            </div>

            {/* Section: Medya */}
            <div className="bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl p-6 shadow-2xl">
              <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
                <ImageIcon size={20} className="text-[#00f0ff]" /> Medya
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">İkon URL</label>
                  <input name="icon_url" value={formData.icon_url} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:bg-[rgba(0,240,255,0.02)] focus:outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Tanıtım Videosu URL</label>
                  <input name="video_url" value={formData.video_url} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:bg-[rgba(0,240,255,0.02)] focus:outline-none transition-all" placeholder="YouTube or MP4 link" />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Ekran Görüntüleri</label>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={screenshotInput} 
                      onChange={(e) => setScreenshotInput(e.target.value)} 
                      placeholder="https://..." 
                      className="flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:bg-[rgba(0,240,255,0.02)] focus:outline-none transition-all" 
                      onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addScreenshot(); } }}
                    />
                    <button type="button" onClick={addScreenshot} className="px-6 bg-[#00f0ff] hover:bg-white text-black font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]">Ekle</button>
                  </div>
                  
                  {formData.screenshots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-[rgba(0,0,0,0.2)] rounded-xl border border-[rgba(255,255,255,0.05)]">
                      {formData.screenshots.map((url, i) => (
                        <div key={i} className="relative group aspect-[9/19] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]">
                          <img src={url} alt={`Screenshot ${i}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button type="button" onClick={() => removeScreenshot(i)} className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all shadow-lg">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl text-center text-gray-500">
                      Ekran görüntüsü bulunmuyor.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
          
          {/* Right Column (Meta & Settings) */}
          <div className="space-y-8">
            
            {/* Section: App Store Details */}
            <div className="bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl p-6 shadow-2xl">
              <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
                <Apple size={20} className="text-[#00f0ff]" /> Store Ayarları
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Store ID veya URL</label>
                  <input name="app_store_id" value={formData.app_store_id} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Kategori</label>
                  <input name="category" value={formData.category} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Fiyat ($)</label>
                    <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Versiyon</label>
                    <input name="version" value={formData.version} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Geliştirici</label>
                  <input name="developer" value={formData.developer} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">App Store Tam URL</label>
                  <input name="app_store_url" value={formData.app_store_url} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-all text-xs text-gray-400 font-mono" />
                </div>
              </div>
            </div>

            {/* Section: 3D Sahne Ayarları */}
            <div className="bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(191,0,255,0.2)] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#bf00ff] opacity-10 rounded-full blur-3xl translate-x-10 -translate-y-10" />
              <h2 className="text-base font-semibold text-[#bf00ff] flex items-center gap-2 mb-6 border-b border-[rgba(191,0,255,0.1)] pb-4 relative z-10">
                <Box size={20} /> 3D Sahne Ayarları
              </h2>
              
              <div className="space-y-4 relative z-10">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Neon Vurgu Rengi</label>
                  <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.03)] p-2 rounded-xl border border-[rgba(255,255,255,0.1)]">
                    <input type="color" name="color" value={formData.color} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0" />
                    <input name="color" value={formData.color} onChange={handleChange} className="w-full bg-transparent text-white font-mono uppercase focus:outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-gray-500 mb-1 text-center">Pos X</label>
                    <input name="position_x" type="number" step="0.1" value={formData.position_x} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2 text-center text-white text-sm focus:border-[#bf00ff] focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-500 mb-1 text-center">Pos Y</label>
                    <input name="position_y" type="number" step="0.1" value={formData.position_y} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2 text-center text-white text-sm focus:border-[#bf00ff] focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-gray-500 mb-1 text-center">Pos Z</label>
                    <input name="position_z" type="number" step="0.1" value={formData.position_z} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-2 text-center text-white text-sm focus:border-[#bf00ff] focus:outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            {!isNew && formData.id && (
              <div className="bg-[rgba(0,240,255,0.02)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-[#00f0ff] flex items-center gap-2 mb-4 uppercase tracking-wider">
                  <ExternalLink size={16} /> Hızlı Linkler
                </h2>
                <div className="flex flex-col gap-2.5">
                  <a href={`/?app=${formData.id}`} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.1)] p-2.5 rounded-lg transition-all flex items-center justify-between group">
                    <span>Ana Sayfa Görünümü</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-[#00f0ff] transition-opacity" />
                  </a>
                  <a href={`/link-in-bio`} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.1)] p-2.5 rounded-lg transition-all flex items-center justify-between group">
                    <span>Link-in-Bio Sayfası</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-[#00f0ff] transition-opacity" />
                  </a>
                  <a href={`/en/legal/${formData.id}`} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.1)] p-2.5 rounded-lg transition-all flex items-center justify-between group">
                    <span>Privacy Policy (EN)</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-[#00f0ff] transition-opacity" />
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </form>
    </div>
  );
}
