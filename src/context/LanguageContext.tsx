"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Language = "en" | "tr" | "es" | "de" | "fr" | "ja";

export const SUPPORTED_LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

interface LanguageContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, customFallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Localized UI Translations dictionary for common elements in HUD/Scene
const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  about_title: {
    en: "About Us",
    tr: "Hakkımızda",
    es: "Sobre Nosotros",
    de: "Über Uns",
    fr: "À Propos",
    ja: "私たちについて",
  },
  about_text: {
    en: "At Kahraman App, we are dedicated to crafting next-generation mobile experiences powered by artificial intelligence. Our mission is to simplify your digital life through elegant, user-centric applications that bring real value to your everyday moments.",
    tr: "Kahraman App olarak, yapay zeka destekli yeni nesil mobil deneyimler tasarlamaya odaklanıyoruz. Misyonumuz, günlük yaşamınıza gerçek değer katan, şık ve kullanıcı odaklı uygulamalarla dijital hayatınızı kolaylaştırmaktır.",
    es: "En Kahraman App, nos dedicamos a crear experiencias móviles de próxima generación impulsadas por IA. Nuestra misión es simplificar su vida digital a través de aplicaciones elegantes.",
    de: "Bei Kahraman App widmen wir uns der Entwicklung mobiler Erlebnisse der nächsten Generation, die von KI angetrieben werden. Unsere Mission ist es, Ihr digitales Leben zu vereinfachen.",
    fr: "Chez Kahraman App, nous nous consacrons à la création d'expériences mobiles de nouvelle génération propulsées par l'IA. Notre mission est de simplifier votre vie numérique.",
    ja: "Kahraman Appでは、人工知能を搭載した次世代のモバイル体験の構築に取り組んでいます。私たちの使命は、エレガントなアプリを通じてあなたのデジタルライフを簡素化することです。",
  },
  contact_title: {
    en: "Contact Us",
    tr: "Bize Ulaşın",
    es: "Contáctenos",
    de: "Kontaktiere Uns",
    fr: "Contactez-nous",
    ja: "お問い合わせ",
  },
  contact_text: {
    en: "Have a question or want to work with us? We'd love to hear from you.",
    tr: "Bir sorunuz mu var veya bizimle çalışmak mı istiyorsunuz? Sizden haber almaktan mutluluk duyarız.",
    es: "¿Tienes alguna pregunta o quieres trabajar con nosotros? Nos encantaría saber de ti.",
    de: "Haben Sie eine Frage oder möchten Sie mit uns arbeiten? Wir würden uns freuen, von Ihnen zu hören.",
    fr: "Vous avez une question ou souhaitez travailler avec nous ? Nous serions ravis d'avoir de vos nouvelles.",
    ja: "ご質問やお問い合わせは、お気軽にご連絡ください。",
  },
  contact_button: {
    en: "Send an Email",
    tr: "E-posta Gönder",
    es: "Enviar un Correo",
    de: "E-Mail Senden",
    fr: "Envoyer un Email",
    ja: "メールを送る",
  },
  download_btn: {
    en: "Download App",
    tr: "Uygulamayı İndir",
    es: "Descargar App",
    de: "App Herunterladen",
    fr: "Télécharger l'App",
    ja: "アプリをダウンロード",
  },
  redirecting_btn: {
    en: "Redirecting...",
    tr: "Yönlendiriliyor...",
    es: "Redirigiendo...",
    de: "Weiterleiten...",
    fr: "Redirection...",
    ja: "リダイレクト中...",
  },
  view_details: {
    en: "View Details →",
    tr: "Detayları Gör →",
    es: "Ver Detalles →",
    de: "Details Ansehen →",
    fr: "Voir les Détails →",
    ja: "詳細を見る →",
  },
  hero_title_1: {
    en: "Next-Gen AI",
    tr: "Yeni Nesil Yapay Zeka",
    es: "IA de Próxima Generación",
    de: "KI der nächsten Generation",
    fr: "IA de Nouvelle Génération",
    ja: "次世代AI",
  },
  hero_title_2: {
    en: "Mobile Experiences",
    tr: "Mobil Deneyimleri",
    es: "Experiencias Móviles",
    de: "Mobile Erlebnisse",
    fr: "Expériences Mobiles",
    ja: "モバイル体験",
  },
  explore_tagline: {
    en: "Explore the universe of our apps",
    tr: "Uygulamalarımızın evrenini keşfedin",
    es: "Explora el universo de nuestras aplicaciones",
    de: "Erkunden Sie das Universum unserer Apps",
    fr: "Explorez l'univers de nos applications",
    ja: "私たちのアプリの宇宙を探索する",
  },
  scroll_hint: {
    en: "Scroll to explore",
    tr: "Keşfetmek için kaydırın",
    es: "Desplázate para explorar",
    de: "Scrollen zum Erkunden",
    fr: "Faites défiler pour explorer",
    ja: "スクロールして探索する",
  },
  next_drop: {
    en: "THE NEXT DROP",
    tr: "YENİ YAYIN",
    es: "PRÓXIMO LANZAMIENTO",
    de: "DER NÄCHSTE DROP",
    fr: "PROCHAIN SOUMISSION",
    ja: "次回のアップデート",
  },
  waitlist_title: {
    en: "BE THE FIRST TO KNOW",
    tr: "İLK SİZ HABERDAR OLUN",
    es: "SÉ EL PRIMERO EN SABER",
    de: "SEIEN SIE DER ERSTE, DER ES ERFÄHRT",
    fr: "SOYEZ LE PREMIER INFORMÉ",
    ja: "最新情報をいち早くお届け",
  },
  waitlist_success: {
    en: "ACCESS GRANTED",
    tr: "ERİŞİM ONAYLANDI",
    es: "ACCESO PERMITIDO",
    de: "ZUGRIFF GEWÄHRT",
    fr: "ACCÈS AUTORISÉ",
    ja: "アクセスが許可されました",
  },
  waitlist_placeholder: {
    en: "ENTER_EMAIL_ADDRESS",
    tr: "E_POSTA_ADRESİ_GİRİN",
    es: "INGRESAR_CORREO_ELECTRONICO",
    de: "E_MAIL_ADRESSE_EINGEBEN",
    fr: "SAISIR_ADRESSE_EMAIL",
    ja: "メールアドレスを入力してください",
  },
  waitlist_initialize: {
    en: "INITIALIZE",
    tr: "BAŞLAT",
    es: "INICIALIZAR",
    de: "INITIALISIEREN",
    fr: "INITIALISER",
    ja: "登録する",
  },
  waitlist_uploading: {
    en: "UPLOADING...",
    tr: "YÜKLENİYOR...",
    es: "CARGANDO...",
    de: "LÄDT...",
    fr: "CHARGEMENT...",
    ja: "送信中...",
  },
  waitlist_error: {
    en: "CONNECTION FAILED",
    tr: "BAĞLANTI BAŞARISIZ",
    es: "CONEXIÓN FALLIDA",
    de: "VERBINDUNG FEHLGESCHLAGEN",
    fr: "ÉCHEC DE CONNEXION",
    ja: "接続に失敗しました",
  },
  apps: {
    en: "Apps",
    tr: "Uygulamalar",
    es: "Apps",
    de: "Apps",
    fr: "Apps",
    ja: "アプリ",
  },
  about: {
    en: "About",
    tr: "Hakkımızda",
    es: "Acerca de",
    de: "Über uns",
    fr: "À propos",
    ja: "概要",
  },
  contact: {
    en: "Contact",
    tr: "İletişim",
    es: "Contacto",
    de: "Kontakt",
    fr: "Contact",
    ja: "お問い合わせ",
  },
  god_progress: {
    en: "PORTFOLIO PROGRESS",
    tr: "PORTFÖY İLERLEMESİ",
    es: "PROGRESO DEL PORTAFOLIO",
    de: "PORTFOLIO-FORTSCHRITT",
    fr: "PROGRESSION DU PORTFOLIO",
    ja: "ポートフォリオの進捗",
  },
  god_downloads: {
    en: "LIVE DOWNLOADS (GLOBAL)",
    tr: "CANLI İNDİRME (KÜRESEL)",
    es: "DESCARGAS EN VIVO (GLOBAL)",
    de: "LIVE-DOWNLOADS (GLOBAL)",
    fr: "TÉLÉCHARGEMENTS EN DIRECT (GLOBAL)",
    ja: "ライブダウンロード（グローバル）",
  },
  god_status: {
    en: "EDGE NETWORK STATUS",
    tr: "EDGE NETWORK DURUMU",
    es: "ESTADO DE RED EDGE",
    de: "EDGE-NETZWERK-STATUS",
    fr: "STATUT DU RÉSEAU EDGE",
    ja: "エッジネットワークの状態",
  },
  god_console_start: {
    en: "Connection established to WebGL Matrix...",
    tr: "WebGL Matrisine bağlantı kuruldu...",
    es: "Conexión establecida con la matriz WebGL...",
    de: "Verbindung zur WebGL-Matrix hergestellt...",
    fr: "Connexion établie avec la matrice WebGL...",
    ja: "WebGLマトリックスへの接続が確立されました...",
  },
  god_console_culling: {
    en: "Frustum Culling: ACTIVE (4 objects suppressed)",
    tr: "Görüş Alanı Ayıklama: AKTİF (4 nesne gizlendi)",
    es: "Frustum Culling: ACTIVO (4 objetos suprimidos)",
    de: "Frustum Culling: AKTIV (4 Objekte unterdrückt)",
    fr: "Frustum Culling : ACTIF (4 objets supprimés)",
    ja: "フラスタムカリング：有効（4オブジェクトが非表示）",
  },
  god_console_awaiting: {
    en: "Awaiting next deployment sequence...",
    tr: "Yeni dağıtım sırası bekleniyor...",
    es: "Esperando la siguiente secuencia de despliegue...",
    de: "Warten auf die nächste Bereitstellungssequenz...",
    fr: "En attente de la prochaine séquence de déploiement...",
    ja: "次のデプロイシーケンスを待機中...",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // Load initial language from cookies (runs on mount on client side)
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const langCookie = cookies.find((row) => row.startsWith("lang="));
    if (langCookie) {
      const val = langCookie.split("=")[1] as Language;
      if (SUPPORTED_LANGUAGES.some((l) => l.code === val)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(val);
      }
    }
  }, []);

  const router = useRouter();

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    // Write language cookie with 1 year expiration
    document.cookie = `lang=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    // Refresh the router to update Server Components
    router.refresh();
  };

  const t = (key: string, customFallback?: string): string => {
    if (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key][lang]) {
      return UI_TRANSLATIONS[key][lang];
    }
    return customFallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
