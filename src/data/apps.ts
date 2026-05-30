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
];
