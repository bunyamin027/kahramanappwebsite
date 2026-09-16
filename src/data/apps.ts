import { AppData } from "@/types/app";

export const apps: AppData[] = [
  {
    id: "dayzero",
    name: "Dayzero",
    tagline: "Count every moment",
    description:
      "Track important dates, countdowns, and life milestones with a beautiful, minimal interface. Never miss what matters.",
    icon: "/icons/dayzero.png",
    color: "#00f0ff",
    position: [-6, 0, 0],
    category: "productivity",
    appStoreUrl: "https://apps.apple.com/app/dayzero/id6742672685",
    playStoreUrl: undefined,
    screenshots: [
      "/screenshots/dayzero/1.png",
      "/screenshots/dayzero/2.png",
      "/screenshots/dayzero/3.png",
    ],

    // README data
    readmeDescription:
      "DayZero is a premium, beautifully designed iOS countdown application that turns your most anticipated events into aesthetic, shareable memories. Built with SwiftData and a completely native SwiftUI architecture, DayZero prioritizes design, typography, and a seamless user experience.",
    features: [
      "Aesthetic UI & Glassmorphism — Stunning dark-themed interface with custom modern typography and smooth micro-animations.",
      "Custom Memory Backgrounds — Personalize every countdown by capturing new moments with the camera or selecting photos from your gallery.",
      "Milestones & Tasks — Break down your big events into manageable sub-tasks with a dynamic, satisfying checklist system.",
      "Pro Subscriptions (StoreKit) — Premium features unlockable via auto-renewable subscriptions.",
      "Social Sharing — Export beautiful, custom-branded countdown cards directly to Instagram or other social platforms.",
      "Agentic Notifications — Smart, localized daily morning briefings summarizing upcoming events.",
      "iOS 17+ Widgets — Beautiful home screen widgets to keep your most important countdowns right in front of you.",
    ],
    techStack: [
      "SwiftUI",
      "MVVM Architecture",
      "SwiftData",
      "StoreKit 2",
      "UserNotifications",
    ],

    // Turkish
    readmeDescription_tr: "DayZero, en çok beklediğiniz etkinlikleri estetik, paylaşılabilir anılara dönüştüren birinci sınıf, güzel tasarımlı bir iOS geri sayım uygulamasıdır. SwiftData ve tamamen yerel SwiftUI mimarisiyle oluşturulan DayZero, tasarıma, tipografiye ve kusursuz bir kullanıcı deneyimine öncelik verir.",
    features_tr: [
      "Estetik Arayüz & Glassmorphism — Özel modern tipografi ve akıcı mikro animasyonlara sahip çarpıcı koyu temalı arayüz.",
      "Özel Anı Arka Planları — Kamerayla yeni anlar yakalayarak veya galerinizden fotoğraf seçerek her geri sayımı kişiselleştirin.",
      "Dönüm Noktaları & Görevler — Dinamik, tatmin edici bir kontrol listesi sistemiyle büyük etkinliklerinizi yönetilebilir alt görevlere bölün.",
      "Pro Abonelikler (StoreKit) — Otomatik yenilenen aboneliklerle açılabilen premium özellikler.",
      "Sosyal Paylaşım — Güzel, özel markalı geri sayım kartlarını doğrudan Instagram'a veya diğer sosyal platformlara aktarın.",
      "Akıllı Bildirimler — Yaklaşan etkinlikleri özetleyen akıllı, yerelleştirilmiş günlük sabah bilgilendirmeleri.",
      "iOS 17+ Widget'ları — En önemli geri sayımlarınızı gözünüzün önünde tutmak için güzel ana ekran widget'ları."
    ],
    name_tr: "Dayzero",
    tagline_tr: "Her anı anlamlandırın",
    description_tr: "Önemli tarihleri, geri sayımları ve hayatınızın dönüm noktalarını şık ve minimalist bir arayüzle takip edin. Değerli anları asla kaçırmayın.",

    // Spanish
    name_es: "Dayzero",
    tagline_es: "Cuenta cada hito",
    description_es: "Realice un seguimiento de fechas importantes, cuentas regresivas y hitos de la vida con una interfaz hermosa y minimalista. Nunca te pierdas lo que importa.",

    // German
    name_de: "Dayzero",
    tagline_de: "Zähle jeden Meilenstein",
    description_de: "Verfolgen Sie wichtige Termine, Countdowns und Meilensteine des Lebens mit einer schönen, minimalistischen Benutzeroberfläche. Verpassen Sie nie wieder, was wichtig ist.",

    // French
    name_fr: "Dayzero",
    tagline_fr: "Chaque étape compte",
    description_fr: "Suivez les dates importantes, les comptes à rebours et les étapes de la vie avec une interface minimaliste et élégante. Ne manquez jamais ce qui compte.",

    // Japanese
    name_ja: "Dayzero",
    tagline_ja: "人生の大切な瞬間をカウント",
    description_ja: "美しくミニマルなインターフェースで、大切な日付、カウントダウン、人生の節目を記録します。大切な瞬間を決して見逃しません。",
  },
  {
    id: "ninniai",
    name: "Ninniai",
    tagline: "Sweet dreams for babies",
    description:
      "AI-powered lullabies, white noise, and sleep tracking for your little one. Designed by parents, loved by babies.",
    icon: "/icons/ninniai.png",
    color: "#cc44ff",
    position: [6, 0, 0],
    category: "health",
    appStoreUrl: "https://apps.apple.com/app/ninniai/id6745401509",
    playStoreUrl: undefined,
    screenshots: [
      "/screenshots/ninniai/1.png",
      "/screenshots/ninniai/2.png",
      "/screenshots/ninniai/3.png",
    ],

    // README data
    readmeDescription:
      "NinniAI is a modern iOS application with the vision of a Personal Sleep Coach, designed according to the developmental stages and daily sleep trends of babies. It allows parents to analyze their babies' sleep, track autonomous sleep windows, and play relaxing lullabies.",
    features: [
      "Development-Oriented Sleep Windows — Optimal sleep windows calculated autonomously based on your baby's age and developmental stage.",
      "In-Depth Sleep Analysis — Daily sleep quality scoring, trends, and sleep fragmentation analysis.",
      "Offline Lullaby Player — A serene sound library that plays in the background without needing an internet connection.",
      "Lock Screen Tracking (Live Activities) — Real-time sleep tracking with WidgetKit and ActivityKit integration.",
      "Security and Privacy — All data is stored only on your device. 100% data privacy.",
      "StoreKit 2 Subscription — Transparent subscription models and native in-app purchases.",
    ],
    techStack: [
      "Swift 5.9+",
      "SwiftUI",
      "SwiftData",
      "AVFoundation & AudioEngine",
      "WidgetKit & ActivityKit",
      "XcodeGen",
    ],

    // Turkish
    readmeDescription_tr:
      "NinniAI, bebeklerin gelişim evrelerine ve günlük uyku trendlerine uygun olarak tasarlanmış, Kişisel Uyku Koçu vizyonuna sahip modern bir iOS uygulamasıdır. Ebeveynlerin bebeklerinin uykularını analiz etmelerini, otonom uyku pencerelerini takip etmelerini ve rahatlatıcı ninniler çalabilmelerini sağlar.",
    features_tr: [
      "Gelişim Odaklı Uyku Pencereleri — Bebeğinizin yaşına ve gelişim evresine göre otonom olarak hesaplanan en uygun uyku pencereleri.",
      "Derinlemesine Uyku Analizi — Günlük uyku kalitesi skorlamaları, trendler ve uyku bölünme analizleri.",
      "Çevrimdışı Ninni Çalar — İnternet bağlantısı gerektirmeyen, arka planda çalabilen dingin ses kütüphanesi.",
      "Kilit Ekranı Takibi (Live Activities) — WidgetKit ve ActivityKit entegrasyonu ile anlık uyku takibi.",
      "Güvenlik ve Gizlilik — Tüm veriler yalnızca cihazınızda saklanır. %100 veri gizliliği.",
      "StoreKit 2 Abonelik — Şeffaf abonelik modelleri ve yerel satın alım özellikleri.",
    ],

    // Turkish
    name_tr: "Ninniai",
    tagline_tr: "Bebekler için tatlı rüyalar",
    description_tr: "Küçük çocuğunuz için yapay zeka destekli ninniler, beyaz gürültü sesleri ve uyku takibi. Ebeveynler tarafından tasarlandı, bebekler tarafından çok sevildi.",

    // Spanish
    name_es: "Ninniai",
    tagline_es: "Dulces sueños para bebés",
    description_es: "Nanas impulsadas por IA, ruido blanco y seguimiento del sueño para tu pequeño. Diseñado por padres, amado por bebés.",

    // German
    name_de: "Ninniai",
    tagline_de: "Süße Träume für Babys",
    description_de: "KI-gestützte Schlaflieder, weißes Rauschen und Schlaf-Tracking für Ihr Kleines. Von Eltern entwickelt, von Babys geliebt.",

    // French
    name_fr: "Ninniai",
    tagline_fr: "Doux rêves pour bébés",
    description_fr: "Berceuses générées par IA, bruit blanc et suivi du sommeil pour votre tout-petit. Conçu par des parents, adoré par les bébés.",

    // Japanese
    name_ja: "Ninniai",
    tagline_ja: "赤ちゃんに甘い夢を",
    description_ja: "AIを活用した子守唄、ホワイトノイズ、そして赤ちゃんの睡眠記録。親がデザインし、赤ちゃんが愛する睡眠サポートアプリ。",
  },
  {
    id: "zikrify",
    name: "Zikrify",
    tagline: "Digital Tasbeeh & Dhikr",
    description:
      "A beautifully designed digital tasbeeh counter and dhikr companion. Track your daily prayers with an elegant, focused, and ad-free experience.",
    icon: "/icons/zikrify.png",
    color: "#00cc66", // Emerald Green
    position: [0, 0, -2],
    category: "health",
    appStoreUrl: "https://apps.apple.com/app/zikrify/id123456789",
    playStoreUrl: undefined,
    screenshots: [
      "/screenshots/zikrify/1.png",
      "/screenshots/zikrify/2.png",
      "/screenshots/zikrify/3.png",
    ],

    // README data
    readmeDescription:
      "Zikrify (Zikirmatik) is a modern iOS application designed for users to easily track their daily dhikr, tasbeeh, and prayers. Developed with current Apple design languages, it offers an intuitive user experience.",
    features: [
      "Modern and Clean Interface — A minimalist design that is easy on the eyes and facilitates focus.",
      "Haptic Feedback — The convenience of reciting dhikr without looking at the screen, with physical feedback you feel on every tap.",
      "Widget Support (ZikrWidget) — The ability to track your dhikr count instantly from the home screen.",
      "Auto-Save — Even if you close the app, your dhikr count continues from where you left off.",
      "Dark Mode Support — Day/night modes fully compatible with the system theme.",
      "Reset Confirmation — A secure reset mechanism to prevent accidental resets.",
    ],
    techStack: [
      "SwiftUI",
      "Swift 5+",
      "MVVM Architecture",
      "WidgetKit",
      "AppStorage / UserDefaults / CoreData",
    ],

    // Turkish
    readmeDescription_tr:
      "Zikrify (Zikirmatik), kullanıcıların günlük zikirlerini, tesbihatlarını ve dualarını kolayca takip edebilmeleri için tasarlanmış modern bir iOS uygulamasıdır. Güncel Apple tasarım dilleri ile geliştirilmiş olup, sezgisel bir kullanıcı deneyimi sunar.",
    features_tr: [
      "Modern ve Sade Arayüz — Göz yormayan, odaklanmayı kolaylaştıran minimalist tasarım.",
      "Haptik Geri Bildirim — Her dokunuşta hissedeceğiniz fiziksel geri bildirim ile ekrana bakmadan zikir çekme kolaylığı.",
      "Widget Desteği (ZikirWidget) — Ana ekrandan zikir sayınızı anlık olarak takip edebilme imkanı.",
      "Otomatik Kayıt — Uygulamayı kapatsanız bile zikir sayınız kaldığı yerden devam eder.",
      "Karanlık Mod (Dark Mode) Desteği — Sistem temasına tam uyumlu gece/gündüz modları.",
      "Sıfırlama Onayı — Yanlışlıkla sıfırlamaları önlemek için güvenli sıfırlama mekanizması.",
    ],

    // Turkish
    name_tr: "Zikrify",
    tagline_tr: "Dijital Tesbih ve Zikir",
    description_tr: "Güzel tasarlanmış dijital tesbih ve zikir arkadaşınız. Günlük dualarınızı şık, odaklanmış ve reklamsız bir deneyimle takip edin.",

    // Spanish
    name_es: "Zikrify",
    tagline_es: "Tasbih y Dhikr Digital",
    description_es: "Un contador digital de tasbih bellamente diseñado. Haz un seguimiento de tus oraciones diarias con una experiencia elegante y sin publicidad.",

    // German
    name_de: "Zikrify",
    tagline_de: "Digitaler Tasbih & Dhikr",
    description_de: "Ein wunderschön gestalteter digitaler Tasbih-Zähler. Verfolgen Sie Ihre täglichen Gebete mit einer eleganten und werbefreien Erfahrung.",

    // French
    name_fr: "Zikrify",
    tagline_fr: "Tasbih & Dhikr Numérique",
    description_fr: "Un compteur tasbih numérique magnifiquement conçu. Suivez vos prières quotidiennes avec une expérience élégante et sans publicité.",

    // Japanese
    name_ja: "Zikrify",
    tagline_ja: "デジタル タスビーフ & ズィクル",
    description_ja: "美しくデザインされたデジタルタスビーフカウンター。エレガントで広告のない体験で毎日の祈りを記録しましょう。",
  },
  {
    id: "edunote",
    name: "EduNoteAI",
    tagline: "Smart Notes & AI Assistant",
    description: "Modern mobile app for students to organize notes and accelerate learning with AI. Features smart PDF editor, AI assistant, and folder system.",
    icon: "/icons/edunote.png",
    color: "#3b82f6",
    position: [0, 0, 2],
    category: "productivity",
    appStoreUrl: "https://apps.apple.com/us/app/edunote-ai/id6783359428",
    playStoreUrl: undefined,
    screenshots: [
      "/screenshots/edunote/1.png",
      "/screenshots/edunote/2.png",
      "/screenshots/edunote/3.png",
    ],

    // README data
    readmeDescription:
      "EduNoteAI is a modern mobile application developed for students to organize, manage their lecture notes, and accelerate their learning processes with the power of AI. It is developed with Flutter and includes Supabase integration for robust backend solutions.",
    features: [
      "Smart PDF Editor (Canvas) — Free drawing, text addition, and note-taking features on PDF documents (Apple Pencil supported).",
      "AI Assistant (Chat & Summary) — Have AI read uploaded documents, ask questions, and automatically generate summaries and Flashcards.",
      "Advanced Folder System — Keep your lecture notes and PDF files organized hierarchically.",
      "In-App Purchases (StoreKit) — Premium Plan subscriptions offering ad-free/unlimited experience.",
      "Modern Authentication — Secure login with Supabase infrastructure.",
      "Account Deletion & Privacy — Fully compliant with App Store guidelines, allowing permanent and secure deletion of user data.",
    ],
    techStack: [
      "Flutter (Dart)",
      "BLoC Pattern",
      "Supabase (Auth, Edge Functions, Storage)",
      "StoreKit",
      "Hive",
    ],

    // Turkish
    readmeDescription_tr:
      "EduNoteAI, öğrencilerin ders notlarını düzenlemesi, yönetmesi ve yapay zeka gücüyle öğrenme süreçlerini hızlandırması için geliştirilmiş modern bir mobil (iOS/Android) uygulamasıdır. Flutter ile geliştirilmiştir ve güçlü arka uç çözümleri için Supabase entegrasyonu barındırır.",
    features_tr: [
      "Akıllı PDF Düzenleyici (Canvas) — PDF dokümanları üzerinde serbest çizim yapma, metin ekleme ve not alma özellikleri (Apple Pencil destekli).",
      "AI Asistanı (Sohbet & Özet) — Yüklediğiniz dokümanları yapay zekaya okutabilir, doküman hakkında sorular sorabilir, otomatik özetler ve 'Flashcard'lar oluşturabilirsiniz.",
      "Gelişmiş Klasörleme Sistemi — Ders notlarınızı ve PDF dosyalarınızı hiyerarşik bir şekilde klasörleyip düzenli tutun.",
      "Uygulama İçi Satın Alımlar (StoreKit) — Ücretsiz kullanım kotaları ve reklamsız/limitsiz deneyim sunan Premium Plan abonelikleri.",
      "Modern Kimlik Doğrulama — Supabase altyapısıyla güvenli giriş.",
      "Hesap Silme ve Gizlilik — App Store kurallarına tam uyumlu; kullanıcı verilerinin uygulama içinden kalıcı ve güvenli olarak silinmesini sağlayan altyapı.",
    ],

    name_tr: "EduNoteAI",
    tagline_tr: "Akıllı Ders Notları & Yapay Zeka Asistanı",
    description_tr: "Öğrencilerin ders notlarını düzenlemesi ve yapay zeka ile öğrenmelerini hızlandırması için modern mobil uygulama. Akıllı PDF düzenleyici ve AI asistanı içerir.",

    // Spanish
    name_es: "EduNoteAI",
    tagline_es: "Notas Inteligentes y Asistente de IA",
    description_es: "Aplicación móvil moderna para que los estudiantes organicen notas y aceleren el aprendizaje con IA.",

    // German
    name_de: "EduNoteAI",
    tagline_de: "Intelligente Notizen & KI-Assistent",
    description_de: "Moderne mobile App für Studenten, um Notizen zu organisieren und das Lernen mit KI zu beschleunigen.",

    // French
    name_fr: "EduNoteAI",
    tagline_fr: "Notes intelligentes et assistant IA",
    description_fr: "Application mobile moderne permettant aux étudiants d'organiser leurs notes et d'accélérer l'apprentissage avec l'IA.",

    // Japanese
    name_ja: "EduNoteAI",
    tagline_ja: "スマートノートとAIアシスタント",
    description_ja: "学生がノートを整理し、AIで学習を加速するための最新のモバイルアプリ。",
  },
  {
    id: "zarfim",
    name: "Zarfım",
    tagline: "Smart Envelope Budgeting",
    description:
      "Take control of your personal finances with the envelope budgeting method. Track your monthly budget, categorize expenses, and see exactly where your money goes — all in a beautiful, secure app.",
    icon: "/icons/zarfim.png",
    color: "#F59E0B", // Amber/Gold — Finance theme
    position: [3, 0, -2],
    category: "finance",
    appStoreUrl:
      "https://apps.apple.com/us/app/zarf%C4%B1m-b%C3%BCt%C3%A7e-takip/id6792155244",
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.zarfim.app",
    screenshots: [
      "/screenshots/zarfim/1.png",
      "/screenshots/zarfim/2.png",
      "/screenshots/zarfim/3.png",
    ],

    // README data — SEO-optimized long description
    readmeDescription:
      "Zarfım is a modern personal finance management app that brings the proven envelope budgeting method to your smartphone. Designed for anyone who wants to build healthy spending habits, Zarfım lets you create virtual envelopes for categories like groceries, transportation, and entertainment — each with its own spending limit and real-time progress tracking. With a stunning dark-themed interface and intuitive circular budget chart, managing your monthly budget has never been this elegant and effortless. Your financial data stays 100% private with on-device encryption.",
    features: [
      "Envelope Budgeting Method — Divide your expenses into categories like Groceries, Transportation, and Entertainment. Set custom limits for each envelope and track spending in real time.",
      "Visual Budget Dashboard — See your total budget usage at a glance with an elegant circular chart showing percentage spent and remaining balance.",
      "Income & Expense Tracking — Monitor Total Budget, Spent, and Remaining amounts with a clean, intuitive summary panel.",
      "Category Progress Bars — Each envelope displays a color-coded progress bar so you instantly know which categories are on track.",
      "Dark Mode Interface — A premium dark-themed design that's easy on the eyes during day and night use.",
      "Bank-Grade Security & Privacy — All financial data is encrypted with AES-256 on your device. No data is sent to external servers. Your privacy is our top priority.",
      "Cross-Platform — Available for free on both iOS and Android with optional premium features for power users.",
    ],
    techStack: [
      "Flutter (Dart)",
      "BLoC Pattern",
      "Hive (Local Storage)",
      "AES-256 Encryption",
      "StoreKit & Google Play Billing",
    ],

    // ── Turkish SEO Content ──────────────────────────────────
    readmeDescription_tr:
      "Zarfım, kanıtlanmış zarf bütçe metodunu akıllı telefonunuza getiren modern bir kişisel finans yönetimi uygulamasıdır. Sağlıklı harcama alışkanlıkları edinmek isteyen herkes için tasarlanan Zarfım, Market, Ulaşım ve Eğlence gibi kategoriler için sanal zarflar oluşturmanıza olanak tanır — her birinin kendi harcama limiti ve anlık ilerleme takibi vardır. Çarpıcı koyu temalı arayüzü ve sezgisel dairesel bütçe grafiği ile aylık bütçe yapma bu kadar şık ve zahmetsiz olmamıştı. Güvenli bütçe planlama için tüm finansal verileriniz cihaz üzerinde şifrelenerek %100 gizli kalır.",
    features_tr: [
      "Zarf Bütçe Metodu — Harcamalarınızı Market, Ulaşım, Eğlence gibi kategorilere bölün ve her zarfın limitini belirleyerek bütçe takip uygulaması deneyimini yaşayın.",
      "Görsel Bütçe Panosu — Dairesel grafik ile bütçe kullanım yüzdenizi (ör. %79 kullanıldı) ve kalan bakiyeyi tek bakışta görün. Gelir gider tablosu hep elinizin altında.",
      "Gelir-Gider Takibi — Toplam Bütçe, Harcanan ve Kalan tutarları anlık izleyin. Ücretsiz harcama takip programı olarak tüm temel özellikler ücretsiz.",
      "Kategori İlerleme Çubukları — Her zarfın ne kadar harcandığını renk kodlu ilerleme çubuklarıyla takip edin, bütçe aşımını önleyin.",
      "Koyu Tema (Dark Mode) — Göz yormayan, modern ve şık koyu tema arayüzü ile gece gündüz rahatça kullanın.",
      "Banka Düzeyinde Güvenlik ve Gizlilik — Tüm finansal veriler cihazınızda AES-256 şifreleme ile korunur. Hiçbir veri harici sunuculara gönderilmez. Güvenli bütçe planlama garantisi.",
      "Çoklu Platform — iOS ve Android'de ücretsiz indirin, isteğe bağlı premium özelliklerle kişisel finans yönetimi deneyiminizi güçlendirin.",
    ],
    name_tr: "Zarfım",
    tagline_tr: "Akıllı Bütçe Takip ve Finans Yönetimi",
    description_tr:
      "Zarfım ile aylık bütçenizi zarflara bölerek harcamalarınızı kontrol altına alın. Market, Ulaşım, Eğlence gibi kategorilerde güvenli bütçe planlama yapın. Ücretsiz bütçe takip uygulaması, iOS ve Android'de.",
    seo_title_tr: "Zarfım — Akıllı Bütçe Takip Uygulaması | Kişisel Finans",
    seo_keywords_tr: [
      "bütçe takip uygulaması",
      "kişisel finans yönetimi",
      "ücretsiz harcama takip programı",
      "gelir gider tablosu",
      "aylık bütçe yapma",
      "güvenli bütçe planlama",
      "zarf bütçe metodu",
    ],

    // ── Spanish ──────────────────────────────────────────────
    name_es: "Zarfım",
    tagline_es: "Presupuesto inteligente con sobres",
    description_es:
      "Controla tus finanzas personales con el método de presupuesto por sobres. Rastrea gastos por categoría de forma segura. Gratis en iOS y Android.",

    // ── German ───────────────────────────────────────────────
    name_de: "Zarfım",
    tagline_de: "Intelligente Umschlag-Budgetierung",
    description_de:
      "Übernehmen Sie die Kontrolle über Ihre Finanzen mit der Umschlag-Budgetmethode. Verfolgen Sie Ausgaben nach Kategorien — sicher und kostenlos.",

    // ── French ───────────────────────────────────────────────
    name_fr: "Zarfım",
    tagline_fr: "Budget intelligent par enveloppes",
    description_fr:
      "Maîtrisez vos finances avec la méthode budgétaire par enveloppes. Suivez vos dépenses par catégorie en toute sécurité. Gratuit sur iOS et Android.",

    // ── Japanese ─────────────────────────────────────────────
    name_ja: "Zarfım",
    tagline_ja: "スマート封筒式予算管理",
    description_ja:
      "封筒式予算管理で家計をコントロール。カテゴリ別に支出を追跡し、安全に予算を管理。iOS・Androidで無料。",
  },
];
