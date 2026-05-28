"use client";

import { useState } from "react";
import Link from "next/link";
import type { AppRow } from "@/types/database";
import "./legal.css";

interface LegalContentProps {
  app: AppRow;
  lang: "en" | "tr";
}

// ── Permission Labels ───────────────────────────────────
const PERMISSION_LABELS: Record<string, { en: string; tr: string; desc_en: string; desc_tr: string }> = {
  camera: {
    en: "Camera",
    tr: "Kamera",
    desc_en: "to capture photos or videos within the app",
    desc_tr: "uygulama içinde fotoğraf veya video çekmek için",
  },
  location: {
    en: "Location",
    tr: "Konum",
    desc_en: "to provide location-based features and services",
    desc_tr: "konum tabanlı özellikler ve hizmetler sunmak için",
  },
  notifications: {
    en: "Push Notifications",
    tr: "Bildirimler",
    desc_en: "to send you timely updates and reminders",
    desc_tr: "zamanında güncellemeler ve hatırlatıcılar göndermek için",
  },
  microphone: {
    en: "Microphone",
    tr: "Mikrofon",
    desc_en: "to record audio within the app",
    desc_tr: "uygulama içinde ses kaydetmek için",
  },
  photos: {
    en: "Photo Library",
    tr: "Fotoğraf Kütüphanesi",
    desc_en: "to access and save photos from your library",
    desc_tr: "fotoğraf kitaplığınıza erişmek ve fotoğrafları kaydetmek için",
  },
  contacts: {
    en: "Contacts",
    tr: "Kişiler",
    desc_en: "to help you connect with people you know",
    desc_tr: "tanıdığınız kişilerle bağlantı kurmanıza yardımcı olmak için",
  },
  health: {
    en: "HealthKit",
    tr: "Sağlık Verileri",
    desc_en: "to read and/or write health-related data",
    desc_tr: "sağlıkla ilgili verileri okumak ve/veya yazmak için",
  },
  bluetooth: {
    en: "Bluetooth",
    tr: "Bluetooth",
    desc_en: "to connect with nearby devices",
    desc_tr: "yakındaki cihazlarla bağlantı kurmak için",
  },
  tracking: {
    en: "App Tracking",
    tr: "Uygulama Takibi",
    desc_en: "to measure advertising effectiveness",
    desc_tr: "reklam etkinliğini ölçmek için",
  },
};

function formatDate(lang: string): string {
  const now = new Date();
  if (lang === "tr") {
    return now.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function LegalContent({ app, lang }: LegalContentProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  const isEN = lang === "en";
  const date = formatDate(lang);
  const appName = app.name;
  const company = app.company_name || "AgenticApps";
  const email = app.contact_email || "privacy@agenticapps.com";
  const perms = app.permissions || [];

  return (
    <div className="legal-page">
      {/* ── Background Effect ──────────────────── */}
      <div className="legal-bg-grid" />
      <div className="legal-scanlines" />

      {/* ── Terminal Window ────────────────────── */}
      <div className="legal-terminal">
        {/* Title Bar */}
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="terminal-title">
            {company.toLowerCase()}://legal/{app.id}
          </span>
          <div className="terminal-status">
            <span className="status-dot" />
            SECURE
          </div>
        </div>

        {/* Header */}
        <div className="legal-header">
          <div className="legal-app-info">
            <div className="legal-app-icon">
              {appName.charAt(0)}
            </div>
            <div>
              <h1 className="legal-app-name">{appName}</h1>
              <p className="legal-app-id">
                {isEN ? "App ID" : "Uygulama ID"}: {app.id}
                {app.app_store_id && ` • Store: ${app.app_store_id}`}
              </p>
            </div>
          </div>
          <p className="legal-date">
            <span className="legal-date-label">
              {isEN ? "Last Updated" : "Son Güncelleme"}:
            </span>{" "}
            {date}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="legal-tabs">
          <button
            className={`legal-tab ${activeTab === "privacy" ? "active" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            <span className="tab-icon">🔒</span>
            {isEN ? "Privacy Policy" : "Gizlilik Politikası"}
          </button>
          <button
            className={`legal-tab ${activeTab === "terms" ? "active" : ""}`}
            onClick={() => setActiveTab("terms")}
          >
            <span className="tab-icon">📋</span>
            {isEN ? "Terms of Use" : "Kullanım Şartları"}
          </button>
        </div>

        {/* Content */}
        <div className="legal-content">
          {activeTab === "privacy" ? (
            <PrivacyPolicy
              appName={appName}
              company={company}
              email={email}
              permissions={perms}
              isEN={isEN}
              date={date}
            />
          ) : (
            <TermsOfUse
              appName={appName}
              company={company}
              email={email}
              isEN={isEN}
              date={date}
            />
          )}
        </div>

        {/* Footer */}
        <div className="legal-footer">
          <span>
            © {new Date().getFullYear()} {company}
          </span>
          <span className="legal-footer-sep">•</span>
          <a href={`mailto:${email}`} className="legal-footer-link">
            {email}
          </a>
          <span className="legal-footer-sep">•</span>
          <Link href="/" className="legal-footer-link">
            {isEN ? "Back to Home" : "Ana Sayfaya Dön"}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// PRIVACY POLICY TEMPLATE
// ══════════════════════════════════════════════════════════

function PrivacyPolicy({
  appName,
  company,
  email,
  permissions,
  isEN,
  date,
}: {
  appName: string;
  company: string;
  email: string;
  permissions: string[];
  isEN: boolean;
  date: string;
}) {
  if (isEN) {
    return (
      <div className="legal-text">
        <section>
          <h2>
            <span className="section-marker">&gt;</span> Privacy Policy
          </h2>
          <p className="legal-meta">
            Effective Date: {date}
          </p>
          <p>
            This Privacy Policy describes how {company} (&quot;we&quot;,
            &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects
            information when you use <strong>{appName}</strong> (the
            &quot;App&quot;). By using the App, you agree to the practices
            described in this policy.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Information We Collect
          </h2>
          <h3>Automatically Collected Data</h3>
          <p>
            We may automatically collect certain technical information
            including device type, operating system version, app version, and
            anonymous usage statistics to improve the App&apos;s performance
            and user experience.
          </p>

          {permissions.length > 0 && (
            <>
              <h3>Device Permissions</h3>
              <p>
                {appName} may request access to the following device
                capabilities:
              </p>
              <div className="permissions-grid">
                {permissions.map((perm) => {
                  const info = PERMISSION_LABELS[perm];
                  return (
                    <div key={perm} className="permission-card">
                      <span className="permission-name">
                        {info?.en || perm}
                      </span>
                      <span className="permission-desc">
                        {info?.desc_en || "Used for app functionality"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p>
                You can manage these permissions at any time through your
                device&apos;s Settings.
              </p>
            </>
          )}
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> How We Use Your
            Information
          </h2>
          <ul>
            <li>To provide and maintain the App&apos;s core functionality</li>
            <li>To improve and optimize user experience</li>
            <li>To send you notifications (if you have opted in)</li>
            <li>To detect and prevent technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Data Sharing
          </h2>
          <p>
            We do not sell your personal information. We may share anonymized,
            aggregated data with analytics providers to help us understand app
            usage patterns. Any third-party services used comply with industry
            standard data protection practices.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your
            data. However, no electronic transmission or storage method is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Children&apos;s
            Privacy
          </h2>
          <p>
            We do not knowingly collect personal information from children
            under 13. If you believe we have collected data from a child,
            please contact us at{" "}
            <a href={`mailto:${email}`} className="legal-link">
              {email}
            </a>{" "}
            and we will promptly delete it.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Changes to This
            Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will
            be posted within the App and/or on our website. Continued use of
            the App after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at:{" "}
            <a href={`mailto:${email}`} className="legal-link">
              {email}
            </a>
          </p>
        </section>
      </div>
    );
  }

  // ── Turkish Version ─────────────────────────────────
  return (
    <div className="legal-text">
      <section>
        <h2>
          <span className="section-marker">&gt;</span> Gizlilik Politikası
        </h2>
        <p className="legal-meta">
          Yürürlük Tarihi: {date}
        </p>
        <p>
          Bu Gizlilik Politikası, {company} (&quot;biz&quot; veya
          &quot;şirketimiz&quot;) olarak <strong>{appName}</strong>{" "}
          (&quot;Uygulama&quot;) kullanımınız sırasında bilgilerinizin nasıl
          toplandığını, kullanıldığını ve korunduğunu açıklar. Uygulamayı
          kullanarak bu politikada açıklanan uygulamaları kabul etmiş olursunuz.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Topladığımız Bilgiler
        </h2>
        <h3>Otomatik Olarak Toplanan Veriler</h3>
        <p>
          Uygulamanın performansını ve kullanıcı deneyimini iyileştirmek amacıyla
          cihaz türü, işletim sistemi sürümü, uygulama sürümü ve anonim
          kullanım istatistikleri gibi belirli teknik bilgiler otomatik olarak
          toplanabilir.
        </p>

        {permissions.length > 0 && (
          <>
            <h3>Cihaz İzinleri</h3>
            <p>
              {appName}, aşağıdaki cihaz özelliklerine erişim talep edebilir:
            </p>
            <div className="permissions-grid">
              {permissions.map((perm) => {
                const info = PERMISSION_LABELS[perm];
                return (
                  <div key={perm} className="permission-card">
                    <span className="permission-name">
                      {info?.tr || perm}
                    </span>
                    <span className="permission-desc">
                      {info?.desc_tr || "Uygulama işlevselliği için kullanılır"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p>
              Bu izinleri cihazınızın Ayarlar bölümünden istediğiniz zaman
              yönetebilirsiniz.
            </p>
          </>
        )}
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Bilgilerinizi Nasıl
          Kullanıyoruz
        </h2>
        <ul>
          <li>Uygulamanın temel işlevselliğini sağlamak ve sürdürmek</li>
          <li>Kullanıcı deneyimini iyileştirmek ve optimize etmek</li>
          <li>Size bildirim göndermek (izin verdiyseniz)</li>
          <li>Teknik sorunları tespit etmek ve önlemek</li>
          <li>Yasal yükümlülüklere uymak</li>
        </ul>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Veri Paylaşımı
        </h2>
        <p>
          Kişisel bilgilerinizi satmıyoruz. Uygulama kullanım kalıplarını
          anlamamıza yardımcı olması için analiz sağlayıcılarıyla anonimleştirilmiş,
          toplu veriler paylaşabiliriz. Kullanılan üçüncü taraf hizmetler, endüstri
          standardı veri koruma uygulamalarına uygundur.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Veri Güvenliği
        </h2>
        <p>
          Verilerinizi korumak için endüstri standardı güvenlik önlemleri
          uyguluyoruz. Ancak hiçbir elektronik iletim veya depolama yöntemi
          %100 güvenli değildir ve mutlak güvenliği garanti edemeyiz.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Çocukların Gizliliği
        </h2>
        <p>
          13 yaşın altındaki çocuklardan bilerek kişisel bilgi toplamıyoruz.
          Bir çocuğun verileri hakkında endişeleriniz varsa, lütfen{" "}
          <a href={`mailto:${email}`} className="legal-link">
            {email}
          </a>{" "}
          adresinden bizimle iletişime geçin; derhal sileceğiz.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Bu Politikadaki
          Değişiklikler
        </h2>
        <p>
          Bu Gizlilik Politikası zaman zaman güncellenebilir. Değişiklikler
          Uygulama içinde ve/veya web sitemizde yayımlanacaktır. Değişikliklerden
          sonra Uygulamayı kullanmaya devam etmeniz, revize edilmiş politikayı
          kabul ettiğiniz anlamına gelir.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Bize Ulaşın
        </h2>
        <p>
          Bu Gizlilik Politikası hakkında sorularınız varsa, lütfen bizimle
          iletişime geçin:{" "}
          <a href={`mailto:${email}`} className="legal-link">
            {email}
          </a>
        </p>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// TERMS OF USE TEMPLATE
// ══════════════════════════════════════════════════════════

function TermsOfUse({
  appName,
  company,
  email,
  isEN,
  date,
}: {
  appName: string;
  company: string;
  email: string;
  isEN: boolean;
  date: string;
}) {
  if (isEN) {
    return (
      <div className="legal-text">
        <section>
          <h2>
            <span className="section-marker">&gt;</span> Terms of Use
          </h2>
          <p className="legal-meta">
            Effective Date: {date}
          </p>
          <p>
            These Terms of Use (&quot;Terms&quot;) govern your use of{" "}
            <strong>{appName}</strong> (the &quot;App&quot;), provided by{" "}
            {company}. By downloading, installing, or using the App, you
            agree to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> License
          </h2>
          <p>
            {company} grants you a limited, non-exclusive, non-transferable,
            revocable license to use the App for personal, non-commercial
            purposes in accordance with these Terms and Apple&apos;s App Store
            Terms of Service.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Restrictions
          </h2>
          <p>You agree not to:</p>
          <ul>
            <li>Copy, modify, or distribute the App or its content</li>
            <li>Reverse engineer, decompile, or disassemble the App</li>
            <li>Use the App for any unlawful purpose</li>
            <li>
              Attempt to gain unauthorized access to the App&apos;s systems
            </li>
            <li>Remove any copyright or proprietary notices</li>
          </ul>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Intellectual Property
          </h2>
          <p>
            All content, features, and functionality of the App — including but
            not limited to text, graphics, logos, icons, images, audio, and
            software — are owned by {company} and protected by international
            copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Disclaimer of
            Warranties
          </h2>
          <p>
            THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
            WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. {company}{" "}
            DOES NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE,
            OR COMPLETELY SECURE.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Limitation of
            Liability
          </h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, {company} SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE APP.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these Terms at any time. Your
            continued use of the App following any changes constitutes
            acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2>
            <span className="section-marker">&gt;</span> Contact
          </h2>
          <p>
            For questions about these Terms, contact us at:{" "}
            <a href={`mailto:${email}`} className="legal-link">
              {email}
            </a>
          </p>
        </section>
      </div>
    );
  }

  // ── Turkish Version ─────────────────────────────────
  return (
    <div className="legal-text">
      <section>
        <h2>
          <span className="section-marker">&gt;</span> Kullanım Şartları
        </h2>
        <p className="legal-meta">
          Yürürlük Tarihi: {date}
        </p>
        <p>
          Bu Kullanım Şartları (&quot;Şartlar&quot;), {company} tarafından
          sağlanan <strong>{appName}</strong> (&quot;Uygulama&quot;)
          kullanımınızı düzenler. Uygulamayı indirerek, yükleyerek veya
          kullanarak bu Şartlara bağlı olmayı kabul etmiş olursunuz.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Lisans
        </h2>
        <p>
          {company}, size bu Şartlara ve Apple App Store Hizmet Şartlarına
          uygun olarak Uygulamayı kişisel, ticari olmayan amaçlarla kullanmanız
          için sınırlı, münhasır olmayan, devredilemez ve geri alınabilir bir
          lisans verir.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Kısıtlamalar
        </h2>
        <p>Aşağıdakileri yapmamayı kabul ediyorsunuz:</p>
        <ul>
          <li>Uygulamayı veya içeriğini kopyalamak, değiştirmek veya dağıtmak</li>
          <li>Uygulamayı tersine mühendislik yapmak, kaynak kodunu çözmek veya parçalarına ayırmak</li>
          <li>Uygulamayı herhangi bir yasa dışı amaç için kullanmak</li>
          <li>Uygulamanın sistemlerine yetkisiz erişim elde etmeye çalışmak</li>
          <li>Telif hakkı veya mülkiyet bildirimlerini kaldırmak</li>
        </ul>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Fikri Mülkiyet
        </h2>
        <p>
          Uygulamanın tüm içeriği, özellikleri ve işlevselliği — metin, grafik,
          logolar, simgeler, görüntüler, ses ve yazılım dahil ancak bunlarla
          sınırlı olmamak üzere — {company}&apos;ın mülkiyetindedir ve uluslararası
          telif hakkı, ticari marka ve diğer fikri mülkiyet yasalarıyla korunmaktadır.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Garanti Reddi
        </h2>
        <p>
          UYGULAMA, AÇIK VEYA ZIMNİ HERHANGİ BİR GARANTİ OLMAKSIZIN
          &quot;OLDUĞU GİBİ&quot; VE &quot;MEVCUT HALİYLE&quot; SUNULMAKTADIR.
          {company}, UYGULAMANIN KESİNTİSİZ, HATASIZ VEYA TAMAMEN GÜVENLİ
          OLACAĞINI GARANTİ ETMEZ.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Sorumluluk Sınırlaması
        </h2>
        <p>
          YASALARIN İZİN VERDİĞİ AZAMİ ÖLÇÜDE, {company} UYGULAMAYI
          KULLANIMINIZDAN KAYNAKLANAN HERHANGİ BİR DOLAYLI, ARIZİ, ÖZEL,
          SONUÇSAL VEYA CEZAİ ZARARDAN SORUMLU OLMAYACAKTIR.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> Şartlardaki
          Değişiklikler
        </h2>
        <p>
          Bu Şartları istediğimiz zaman değiştirme hakkını saklı tutarız.
          Değişikliklerin ardından Uygulamayı kullanmaya devam etmeniz, yeni
          Şartları kabul ettiğiniz anlamına gelir.
        </p>
      </section>

      <section>
        <h2>
          <span className="section-marker">&gt;</span> İletişim
        </h2>
        <p>
          Bu Şartlar hakkında sorularınız için bizimle iletişime geçin:{" "}
          <a href={`mailto:${email}`} className="legal-link">
            {email}
          </a>
        </p>
      </section>
    </div>
  );
}
