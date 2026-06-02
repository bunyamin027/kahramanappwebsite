"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Download, Globe, RefreshCw, Link as LinkIcon } from "lucide-react";

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
          // Normalize null values to prevent controlled component warnings
          const normalizedApp = { ...data.app };
          Object.keys(normalizedApp).forEach(key => {
            if (normalizedApp[key] === null) {
              normalizedApp[key] = "";
            }
          });
          // Ensure screenshots is an array
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

    // Extract ID from full apple link if user pasted the link
    let storeIdToFetch = formData.app_store_id;
    const match = storeIdToFetch.match(/id(\d+)/);
    if (match) {
      storeIdToFetch = match[1];
      setFormData(prev => ({ ...prev, app_store_id: storeIdToFetch }));
    } else {
      // Clean up anything that is not a number
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
        const data = responseData.app; // GET returns { success: true, app: { trackName: ... } }
        
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
            // Generate an ID if empty
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
            // You can also use other translated fields if you want them in the form
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
    return <div className="text-white text-center py-20"><RefreshCw className="animate-spin mx-auto mb-4 text-[#00f0ff]" />Yükleniyor...</div>;
  }

  return (
    <div className="w-full pb-20" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 text-gray-400 hover:text-white bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold tracking-wide">{isNew ? "Yeni Uygulama" : "Uygulamayı Düzenle"}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            type="button" 
            onClick={handleFetchFromStore} 
            disabled={fetchingStore}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white text-sm hover:bg-[rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
          >
            <Download size={16} className={fetchingStore ? "animate-bounce" : ""} /> Store'dan Çek
          </button>
          <button 
            type="button" 
            onClick={handleTranslate} 
            disabled={translating}
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)] rounded-xl text-[#00f0ff] text-sm hover:bg-[rgba(0,240,255,0.15)] transition-all disabled:opacity-50"
          >
            <Globe size={16} className={translating ? "animate-spin" : ""} /> Otomatik Çevir
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-xl text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Save size={18} className={saving ? "animate-pulse" : ""} /> Kaydet
          </button>
        </div>
      </div>

      <form className="space-y-8 bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border border-[rgba(0,240,255,0.15)] rounded-2xl p-8 shadow-2xl">
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#00f0ff] border-b border-[rgba(0,240,255,0.1)] pb-2">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">ID (URL için, Boşluksuz. Örn: kahraman)</label>
              <input name="id" value={formData.id} onChange={handleChange} disabled={!isNew} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">İsim (Name)</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Kısa Açıklama (Tagline)</label>
              <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">İngilizce Açıklama (Description)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Türkçe Açıklama (Description TR)</label>
              <textarea name="description_tr" value={formData.description_tr} onChange={handleChange} rows={4} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">İkon URL</label>
              <input name="icon_url" value={formData.icon_url} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
              {formData.icon_url && <img src={formData.icon_url} alt="icon" className="mt-4 w-16 h-16 rounded-xl border border-[rgba(255,255,255,0.1)] object-cover" />}
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-semibold text-[#00f0ff] border-b border-[rgba(0,240,255,0.1)] pb-2">Medya (Ekran Görüntüleri)</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Video URL (Örn: Youtube veya MP4)</label>
              <input name="video_url" value={formData.video_url} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ekran Görüntüleri (URL)</label>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={screenshotInput} 
                  onChange={(e) => setScreenshotInput(e.target.value)} 
                  placeholder="https://..." 
                  className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" 
                  onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addScreenshot(); } }}
                />
                <button type="button" onClick={addScreenshot} className="px-4 bg-[#00f0ff] text-black font-bold rounded-lg hover:bg-white transition-colors">Ekle</button>
              </div>
              <div className="flex flex-wrap gap-4">
                {formData.screenshots.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`Screenshot ${i}`} className="h-32 object-contain rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.5)]" />
                    <button type="button" onClick={() => removeScreenshot(i)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* App Store Details */}
        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-semibold text-[#00f0ff] border-b border-[rgba(0,240,255,0.1)] pb-2">App Store Detayları</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">App Store ID veya Linki (Tüm linki yapıştırabilirsiniz)</label>
              <input name="app_store_id" value={formData.app_store_id} onChange={handleChange} placeholder="Örn: 123456789 veya https://apps.apple.com/app/id123456789" className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bundle ID</label>
              <input name="bundle_id" value={formData.bundle_id} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Geliştirici (Developer)</label>
              <input name="developer" value={formData.developer} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Kategori (Category)</label>
              <input name="category" value={formData.category} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Fiyat (USD)</label>
              <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">App Store Tam URL</label>
              <input name="app_store_url" value={formData.app_store_url} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* 3D Scene Config */}
        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-semibold text-[#bf00ff] border-b border-[rgba(191,0,255,0.1)] pb-2">3D Sahne Ayarları</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Neon Renk Kodu</label>
              <div className="flex items-center gap-3">
                <input type="color" name="color" value={formData.color} onChange={handleChange} className="w-12 h-12 rounded bg-transparent cursor-pointer" />
                <input name="color" value={formData.color} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#bf00ff] focus:outline-none transition-colors font-mono uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Position X</label>
              <input name="position_x" type="number" step="0.1" value={formData.position_x} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#bf00ff] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Position Y</label>
              <input name="position_y" type="number" step="0.1" value={formData.position_y} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#bf00ff] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Position Z</label>
              <input name="position_z" type="number" step="0.1" value={formData.position_z} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#bf00ff] focus:outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Legal Config */}
        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-semibold text-[#00f0ff] border-b border-[rgba(0,240,255,0.1)] pb-2">Yasal ve İletişim Bilgileri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Şirket Adı</label>
              <input name="company_name" value={formData.company_name} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">İletişim Email</label>
              <input name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Links Preview */}
        {!isNew && formData.id && (
          <div className="space-y-6 pt-6 mt-8 border-t border-[rgba(0,240,255,0.1)]">
            <h2 className="text-xl font-semibold text-[#00f0ff] pb-2 flex items-center gap-2">
              <LinkIcon size={20} /> Yayınlanan Sayfalar (Hızlı Linkler)
            </h2>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-4 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Ana Sayfa:</span>
                <a href={`/?app=${formData.id}`} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:underline">kahramanapp.com/?app={formData.id}</a>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Gizlilik Sözleşmesi (EN):</span>
                <a href={`/en/legal/${formData.id}`} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:underline">kahramanapp.com/en/legal/{formData.id}</a>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Kullanım Koşulları (EULA - EN):</span>
                <a href={`/en/legal/${formData.id}?type=terms`} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:underline">kahramanapp.com/en/legal/{formData.id}?type=terms</a>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Kullanım Koşulları (EULA - TR):</span>
                <a href={`/tr/legal/${formData.id}?type=terms`} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:underline">kahramanapp.com/tr/legal/{formData.id}?type=terms</a>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-[rgba(255,255,255,0.1)] pt-3 mt-1">
                <span className="text-gray-400">Ortak Link-in-Bio Sayfası:</span>
                <a href={`/link-in-bio`} target="_blank" rel="noreferrer" className="text-[#00f0ff] hover:underline">kahramanapp.com/link-in-bio</a>
              </div>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
