"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyContent() {
  const { lang } = useLanguage();
  const isTr = lang === "tr";

  return (
    <main className="marketing-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '120px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}>
      <div className="marketing-aura"></div>
      
      <div style={{ maxWidth: '900px', width: '100%', position: 'relative', zIndex: 10, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
        <Link href="/" style={{ color: '#00f0ff', textDecoration: 'none', marginBottom: '30px', display: 'inline-block' }}>
          &larr; {isTr ? "Ana Sayfaya Dön" : "Back to Home"}
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px' }}>
          {isTr ? "Gizlilik Politikası" : "Privacy Policy"}
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: '1.7', color: 'rgba(255,255,255,0.8)' }}>
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "1. Topladığımız Bilgiler" : "1. Information We Collect"}
            </h2>
            <p>
              {isTr 
                ? "Kullanıcılarımıza daha iyi hizmet sunmak için bilgi topluyoruz. Topladığımız bilgi türleri şunları içerir:" 
                : "We collect information to provide better services to our users. The types of information we collect include:"}
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>{isTr ? "Bize doğrudan sağladığınız bilgiler." : "Information you provide to us directly."}</li>
              <li>{isTr ? "Hizmetlerimizi kullandığınızda otomatik olarak topladığımız bilgiler." : "Information we collect automatically when you use our services."}</li>
              <li>{isTr ? "Üçüncü taraf kaynaklardan alınan bilgiler." : "Information from third-party sources."}</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "2. Bilgileri Nasıl Kullanıyoruz" : "2. How We Use Information"}
            </h2>
            <p>
              {isTr 
                ? "Topladığımız bilgileri aşağıdaki amaçlar dahil olmak üzere çeşitli amaçlarla kullanıyoruz:" 
                : "We use the information we collect for various purposes, including to:"}
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>{isTr ? "Hizmetlerimizi sağlamak, sürdürmek ve iyileştirmek." : "Provide, maintain, and improve our services."}</li>
              <li>{isTr ? "Yeni özellikler ve hizmetler geliştirmek." : "Develop new features and services."}</li>
              <li>{isTr ? "Deneyiminizi kişiselleştirmek." : "Personalize your experience."}</li>
              <li>{isTr ? "Sizinle iletişim kurmak." : "Communicate with you."}</li>
              <li>{isTr ? "Kullanıcılarımızı ve hizmetlerimizi korumak." : "Protect our users and services."}</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "3. Veri Güvenliği" : "3. Data Security"}
            </h2>
            <p>
              {isTr 
                ? "Kullanıcılarımızı yetkisiz erişimlerden veya elimizde bulunan bilgilerin yetkisiz bir şekilde değiştirilmesinden, ifşa edilmesinden veya imha edilmesinden korumak için çok çalışıyoruz. Kişisel bilgilerinizi korumak için uygun teknik ve kurumsal güvenlik önlemlerini uyguluyoruz." 
                : "We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We implement appropriate technical and organizational security measures to protect your personal information."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "4. Bu Politikadaki Değişiklikler" : "4. Changes to This Policy"}
            </h2>
            <p>
              {isTr 
                ? "Bu Gizlilik Politikasını zaman zaman değiştirebiliriz. Açık rızanız olmadan bu Gizlilik Politikası kapsamındaki haklarınızı azaltmayacağız. Son değişikliklerin yayınlandığı tarihi her zaman belirtiriz." 
                : "We may change this Privacy Policy from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We always indicate the date the last changes were published."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "5. Bize Ulaşın" : "5. Contact Us"}
            </h2>
            <p>
              {isTr 
                ? "Gizlilik Politikamızla ilgili herhangi bir sorunuz veya öneriniz varsa bizimle iletişime geçmekten çekinmeyin." 
                : "If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us."}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
