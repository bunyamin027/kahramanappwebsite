"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsContent() {
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
          {isTr ? "Lisanslı Uygulama Son Kullanıcı Lisans Anlaşması (EULA)" : "Licensed Application End User License Agreement (EULA)"}
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: '1.7', color: 'rgba(255,255,255,0.8)' }}>
          <p>
            {isTr 
              ? "App Store ve hizmetlerimiz aracılığıyla sunulan uygulamalar size satılmaz, lisanslanır. Her bir Uygulamaya ilişkin lisansınız, bu Lisanslı Uygulama Son Kullanıcı Lisans Sözleşmesini (\"Standart EULA\") veya sizinle Uygulama Sağlayıcısı arasındaki özel bir son kullanıcı lisans sözleşmesini önceden kabul etmenize tabidir." 
              : "The apps made available through the App Store and our services are licensed, not sold, to you. Your license to each App is subject to your prior acceptance of either this Licensed Application End User License Agreement (\"Standard EULA\"), or a custom end user license agreement between you and the Application Provider."}
          </p>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "a. Lisansın Kapsamı" : "a. Scope of License"}
            </h2>
            <p>
              {isTr 
                ? "Uygulama Sağlayıcısı, size ait olan veya kontrolünüzde bulunan Apple markalı ürünlerde Lisanslı Uygulamayı Kullanım Kurallarının izin verdiği şekilde kullanmanız için devredilemez bir lisans verir. Bu Standart EULA şartları, Lisanslı Uygulamadan erişilebilen veya Lisanslı Uygulama içinden satın alınan her türlü içerik, materyal veya hizmet için geçerli olacaktır. Lisanslı Uygulamayı aynı anda birden fazla cihaz tarafından kullanılabilecek bir ağ üzerinden dağıtamaz veya erişime sunamazsınız." 
                : "The Application Provider grants to you a nontransferable license to use the Licensed Application on any Apple-branded products that you own or control and as permitted by the Usage Rules. The terms of this Standard EULA will govern any content, materials, or services accessible from or purchased within the Licensed Application. You may not distribute or make the Licensed Application available over a network where it could be used by multiple devices at the same time."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "b. Veri Kullanımına İzin" : "b. Consent to Use of Data"}
            </h2>
            <p>
              {isTr 
                ? "Uygulama Sağlayıcısının, Lisanslı Uygulama ile ilgili yazılım güncellemelerinin, ürün desteğinin ve size sunulan diğer hizmetlerin sağlanmasını kolaylaştırmak için cihazınız, sisteminiz ve uygulama yazılımınız ile çevre birimleriniz hakkındaki teknik bilgiler dâhil ancak bunlarla sınırlı olmamak üzere, belirli aralıklarla toplanan teknik verileri ve ilgili bilgileri toplayıp kullanabileceğini kabul edersiniz." 
                : "You agree that Application Provider may collect and use technical data and related information—including but not limited to technical information about your device, system and application software, and peripherals—that is gathered periodically to facilitate the provision of software updates, product support, and other services to you (if any) related to the Licensed Application."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "c. Fesih" : "c. Termination"}
            </h2>
            <p>
              {isTr 
                ? "Bu Standart EULA, siz veya Uygulama Sağlayıcısı tarafından feshedilene kadar geçerlidir. Bu Standart EULA kapsamındaki haklarınız, şartlarından herhangi birine uymamanız durumunda otomatik olarak sona erecektir." 
                : "This Standard EULA is effective until terminated by you or Application Provider. Your rights under this Standard EULA will terminate automatically if you fail to comply with any of its terms."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "d. Harici Hizmetler" : "d. External Services"}
            </h2>
            <p>
              {isTr 
                ? "Lisanslı Uygulama, Uygulama Sağlayıcısının ve/veya üçüncü tarafların hizmetlerine ve web sitelerine erişim sağlayabilir. Harici Hizmetlerin kullanımı İnternet erişimi gerektirir ve ek şartları kabul etmenizi gerektirebilir. Üçüncü taraf Harici Hizmetlerin içeriğini veya doğruluğunu incelemekten veya değerlendirmekten sorumlu değiliz." 
                : "The Licensed Application may enable access to Application Provider's and/or third-party services and websites. Use of the External Services requires Internet access and may require you to accept additional terms. We are not responsible for examining or evaluating the content or accuracy of any third-party External Services."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "e. GARANTİ REDDİ" : "e. NO WARRANTY"}
            </h2>
            <p>
              {isTr 
                ? "LİSANSLI UYGULAMAYI KULLANMANIN RİSKİNİN TAMAMEN SİZE AİT OLDUĞUNU AÇIKÇA KABUL VE BEYAN EDERSİNİZ. GEÇERLİ YASALARIN İZİN VERDİĞİ AZAMİ ÖLÇÜDE, LİSANSLI UYGULAMA VE LİSANSLI UYGULAMA TARAFINDAN GERÇEKLEŞTİRİLEN VEYA SAĞLANAN HER TÜRLÜ HİZMET, TÜM HATALARIYLA BİRLİKTE VE HİÇBİR TÜRDE GARANTİ OLMAKSIZIN \"OLDUĞU GİBİ\" VE \"MEVCUT OLDUĞU ŞEKİLDE\" SAĞLANMAKTADIR." 
                : "You expressly acknowledge and agree that use of the Licensed Application is at your sole risk. To the maximum extent permitted by applicable law, the Licensed Application and any services performed or provided by the Licensed Application are provided \"as is\" and \"as available,\" with all faults and without warranty of any kind."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
              {isTr ? "f. Sorumluluğun Sınırlandırılması" : "f. Limitation of Liability"}
            </h2>
            <p>
              {isTr 
                ? "YASALARIN YASAKLAMADIĞI ÖLÇÜDE, UYGULAMA SAĞLAYICISI HİÇBİR DURUMDA LİSANSLI UYGULAMAYI KULLANMANIZ VEYA KULLANAMAMANIZDAN KAYNAKLANAN VEYA BUNUNLA İLGİLİ OLAN KÂR KAYBI, VERİ KAYBI, İŞ KESİNTİSİ VEYA DİĞER TİCARİ ZARARLAR VEYA KAYIPLAR DÂHİL ANCAK BUNLARLA SINIRLI OLMAMAK ÜZERE KİŞİSEL YARALANMALARDAN VEYA HERHANGİ BİR ARIZİ, ÖZEL, DOLAYLI VEYA SONUÇSAL ZARARDAN SORUMLU OLMAYACAKTIR." 
                : "To the extent not prohibited by law, in no event shall Application Provider be liable for personal injury or any incidental, special, indirect, or consequential damages whatsoever, including, without limitation, damages for loss of profits, loss of data, business interruption, or any other commercial damages or losses, arising out of or related to your use of or inability to use the Licensed Application."}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
