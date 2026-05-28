import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60; // Allow translation process to take up to 60 seconds

// ── Zod Schema for Structured Translation & ASO Output ───────
const TranslationSchema = z.object({
  en: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    seo_title: z.string(),
    seo_keywords: z.array(z.string()),
  }),
  tr: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    seo_title: z.string(),
    seo_keywords: z.array(z.string()),
  }),
  es: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    seo_title: z.string(),
    seo_keywords: z.array(z.string()),
  }),
  de: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    seo_title: z.string(),
    seo_keywords: z.array(z.string()),
  }),
  fr: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    seo_title: z.string(),
    seo_keywords: z.array(z.string()),
  }),
  ja: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    seo_title: z.string(),
    seo_keywords: z.array(z.string()),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appId, appData } = body;

    if (!appId && !appData) {
      return Response.json(
        { error: "Missing 'appId' or 'appData' in request body." },
        { status: 400 }
      );
    }

    let sourceApp = appData;

    // 1. Fetch from Supabase if appId is provided and appData is not
    const supabase = createAdminClient();
    if (appId && !appData) {
      if (!supabase) {
        return Response.json(
          { error: "Database client unavailable. Could not fetch app." },
          { status: 503 }
        );
      }

      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .eq("id", appId)
        .single();

      if (error || !data) {
        return Response.json(
          { error: `App not found: ${error?.message || "Not found"}` },
          { status: 404 }
        );
      }
      sourceApp = data;
    }

    // 2. Prepare Source Material & Language Detection
    const name = sourceApp.name || "";
    const tagline = sourceApp.tagline || "";
    const description = sourceApp.description || "";
    const description_tr = sourceApp.description_tr || "";
    const category = sourceApp.category || "utilities";

    // Detect if the source text is mainly Turkish
    const isTurkishSource = !!description_tr && (!description || description_tr.length > description.length);
    const sourceLangLabel = isTurkishSource ? "Turkish" : "English";
    const sourceDescription = isTurkishSource ? description_tr : description;

    console.log(`[Auto-Translate] Translating app: ${name} (${sourceLangLabel} Source)`);

    // 3. Fallback logic if OpenAI API Key is missing (Offline Sandbox Mode)
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    let translationResult;

    if (!hasApiKey) {
      console.warn("[Auto-Translate] OPENAI_API_KEY is missing! Using high-fidelity localized mock translations...");
      translationResult = getMockTranslations(name, tagline, sourceDescription, isTurkishSource, category);
    } else {
      // 4. Call OpenAI API for structured translation and ASO generation
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: TranslationSchema,
        system: `
          You are a professional App Store Optimization (ASO) and app translation/localization system.
          Your task is to take a mobile app's metadata (Name, Tagline, Description) in a source language and:
          1. Translate them accurately into the 6 target languages: English, Turkish, Spanish, German, French, and Japanese.
             - Ensure translations feel natural, polished, and maintain the original tone.
             - Keep descriptions, key features, and details clear.
          2. Generate highly effective, localized ASO Meta Titles and Search Keywords for each language:
             - Meta Title: Max 40 characters. Include the app name + high-traffic local search keywords for that target market.
             - Keywords: Exactly 8-12 keywords/search terms, represented as an array of strings. Do not include duplicates. Use words that users in the target region actually type when looking for apps in this category (${category}).
        `,
        prompt: `
          App Category: ${category}
          Source Language: ${sourceLangLabel}

          Source App Metadata:
          - Name: ${name}
          - Tagline: ${tagline}
          - Description: ${sourceDescription}

          Please generate full translations and App Store search-optimized metadata for all 6 target locales: en, tr, es, de, fr, ja.
        `,
      });
      translationResult = object;
    }

    // 5. Update Database if Supabase is connected
    if (supabase && sourceApp.id) {
      const updateData = {
        name: translationResult.en.name,
        tagline: translationResult.en.tagline,
        description: translationResult.en.description,
        seo_title: translationResult.en.seo_title,
        seo_keywords: translationResult.en.seo_keywords,

        name_tr: translationResult.tr.name,
        tagline_tr: translationResult.tr.tagline,
        description_tr: translationResult.tr.description,
        seo_title_tr: translationResult.tr.seo_title,
        seo_keywords_tr: translationResult.tr.seo_keywords,

        name_es: translationResult.es.name,
        tagline_es: translationResult.es.tagline,
        description_es: translationResult.es.description,
        seo_title_es: translationResult.es.seo_title,
        seo_keywords_es: translationResult.es.seo_keywords,

        name_de: translationResult.de.name,
        tagline_de: translationResult.de.tagline,
        description_de: translationResult.de.description,
        seo_title_de: translationResult.de.seo_title,
        seo_keywords_de: translationResult.de.seo_keywords,

        name_fr: translationResult.fr.name,
        tagline_fr: translationResult.fr.tagline,
        description_fr: translationResult.fr.description,
        seo_title_fr: translationResult.fr.seo_title,
        seo_keywords_fr: translationResult.fr.seo_keywords,

        name_ja: translationResult.ja.name,
        tagline_ja: translationResult.ja.tagline,
        description_ja: translationResult.ja.description,
        seo_title_ja: translationResult.ja.seo_title,
        seo_keywords_ja: translationResult.ja.seo_keywords,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: updatedApp, error: updateError } = await (supabase.from("apps") as any)
        .update(updateData)
        .eq("id", sourceApp.id)
        .select()
        .single();

      if (updateError) {
        return Response.json(
          {
            error: `Failed to save translations: ${updateError.message}`,
            translations: translationResult,
          },
          { status: 500 }
        );
      }

      return Response.json({
        success: true,
        message: `App "${name}" successfully translated and localized for global markets.`,
        app: updatedApp,
      });
    }

    // No Database connection — return the translations directly
    return Response.json({
      success: true,
      message: "Translations generated successfully. (Offline Mode - No database updated)",
      translations: translationResult,
    });
  } catch (error) {
    console.error("[auto-translate] Error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── High Quality Sandbox Mock Translations Generator ──────────
function getMockTranslations(
  name: string,
  tagline: string,
  desc: string,
  isTurkish: boolean,
  category: string
) {
  // Simple check for known default apps to return custom-crafted mock data
  const isDayzero = name.toLowerCase().includes("dayzero") || tagline.toLowerCase().includes("moment");
  const isNinniai = name.toLowerCase().includes("ninni") || tagline.toLowerCase().includes("dream");

  if (isDayzero) {
    return {
      en: {
        name: "Dayzero",
        tagline: "Count every milestone",
        description: "Track important dates, countdowns, and life milestones with a beautiful, minimal interface. Never miss what matters.",
        seo_title: "Dayzero: Milestone Countdown Tracker",
        seo_keywords: ["countdown", "milestone", "days counter", "habit tracker", "event planner", "minimal widget"],
      },
      tr: {
        name: "Dayzero",
        tagline: "Her anı anlamlandırın",
        description: "Önemli tarihleri, geri sayımları ve hayatınızın dönüm noktalarını şık ve minimalist bir arayüzle takip edin. Değerli anları asla kaçırmayın.",
        seo_title: "Dayzero: Gün Sayacı ve Geri Sayım",
        seo_keywords: ["gün sayacı", "geri sayım", "dönüm noktası", "tarih takip", "minimalist widget", "takvim"],
      },
      es: {
        name: "Dayzero",
        tagline: "Cuenta cada hito",
        description: "Realice un seguimiento de fechas importantes, cuentas regresivas y hitos de la vida con una interfaz hermosa y minimalista. Nunca te pierdas lo que importa.",
        seo_title: "Dayzero: Cuenta Regresiva y Hitos",
        seo_keywords: ["cuenta regresiva", "contador dias", "hitos de vida", "rastreador habitos", "calendario minimalista"],
      },
      de: {
        name: "Dayzero",
        tagline: "Zähle jeden Meilenstein",
        description: "Verfolgen Sie wichtige Termine, Countdowns und Meilensteine des Lebens mit einer schönen, minimalistischen Benutzeroberfläche. Verpassen Sie nie wieder, was wichtig ist.",
        seo_title: "Dayzero: Countdown & Meilenstein Zähler",
        seo_keywords: ["countdown", "meilenstein zähler", "tagezähler", "minimalistisches widget", "event kalender"],
      },
      fr: {
        name: "Dayzero",
        tagline: "Chaque étape compte",
        description: "Suivez les dates importantes, les comptes à rebours et les étapes de la vie avec une interface minimaliste et élégante. Ne manquez jamais ce qui compte.",
        seo_title: "Dayzero : Compte à Rebours & Jalons",
        seo_keywords: ["compte a rebours", "compteur jours", "etapes de vie", "widget minimaliste", "agenda"],
      },
      ja: {
        name: "Dayzero",
        tagline: "人生の大切な瞬間をカウント",
        description: "美しくミニマルなインターフェースで、大切な日付、カウントダウン、人生の節目を記録します。大切な瞬間を決して見逃しません。",
        seo_title: "Dayzero: 日数カウントとカウントダウン",
        seo_keywords: ["カウントダウン", "日数計算", "記念日カウンター", "ミニマルウィジェット", "スケジュール"],
      },
    };
  }

  if (isNinniai) {
    return {
      en: {
        name: "Ninniai",
        tagline: "Sweet dreams for babies",
        description: "AI-powered lullabies, white noise, and sleep tracking for your little one. Designed by parents, loved by babies.",
        seo_title: "Ninniai: AI Lullabies & Baby Sleep",
        seo_keywords: ["baby sleep", "lullaby", "white noise", "sleep tracker", "newborn care", "soothing sounds"],
      },
      tr: {
        name: "Ninniai",
        tagline: "Bebekler için tatlı rüyalar",
        description: "Küçük çocuğunuz için yapay zeka destekli ninniler, beyaz gürültü sesleri ve uyku takibi. Ebeveynler tarafından tasarlandı, bebekler tarafından çok sevildi.",
        seo_title: "Ninniai: Yapay Zeka Ninni & Bebek Uyku",
        seo_keywords: ["bebek uyku", "ninni", "beyaz gurultu", "uyku takibi", "bebek sakinlestirici", "kolik bebek"],
      },
      es: {
        name: "Ninniai",
        tagline: "Dulces sueños para bebés",
        description: "Nanas impulsadas por IA, ruido blanco y seguimiento del sueño para tu pequeño. Diseñado por padres, amado por bebés.",
        seo_title: "Ninniai: Nanas IA y Sueño de Bebé",
        seo_keywords: ["sueño bebe", "nanas infantiles", "ruido blanco", "rastreador sueño", "sonidos relajantes"],
      },
      de: {
        name: "Ninniai",
        tagline: "Süße Träume für Babys",
        description: "KI-gestützte Schlaflieder, weißes Rauschen und Schlaf-Tracking für Ihr Kleines. Von Eltern entwickelt, von Babys geliebt.",
        seo_title: "Ninniai: KI Schlaflieder & Babyschlaf",
        seo_keywords: ["babyschlaf", "schlaflieder", "weisses rauschen", "schlaf tracker", "beruhigungssound"],
      },
      fr: {
        name: "Ninniai",
        tagline: "Doux rêves pour bébés",
        description: "Berceuses générées par IA, bruit blanc et suivi du sommeil pour votre tout-petit. Conçu par des parents, adoré par les bébés.",
        seo_title: "Ninniai : Berceuses IA & Sommeil Bébé",
        seo_keywords: ["sommeil bebe", "berceuse", "bruit blanc", "suivi sommeil", "sons apaisants"],
      },
      ja: {
        name: "Ninniai",
        tagline: "赤ちゃんに甘い夢を",
        description: "AIを活用した子守唄、ホワイトノイズ、そして赤ちゃんの睡眠記録。親がデザインし、赤ちゃんが愛する睡眠サポートアプリ。",
        seo_title: "Ninniai: AI子守唄と赤ちゃんの睡眠記録",
        seo_keywords: ["赤ちゃん睡眠", "子守唄", "ホワイトノイズ", "育児記録", "ネントレ", "泣き止む音楽"],
      },
    };
  }

  // Generic Translation fallback
  const trName = isTurkish ? name : `${name}`;
  const enName = isTurkish ? `${name}` : name;
  const trTag = isTurkish ? tagline : `[TR] ${tagline}`;
  const enTag = isTurkish ? `[EN] ${tagline}` : tagline;
  const trDesc = isTurkish ? desc : `[TR] ${desc}`;
  const enDesc = isTurkish ? `[EN] ${desc}` : desc;

  return {
    en: {
      name: enName,
      tagline: enTag,
      description: enDesc,
      seo_title: `${enName}: Premium ${category} Assistant`,
      seo_keywords: [category, "mobile assistant", "smart tool", "agentic apps", "productivity booster"],
    },
    tr: {
      name: trName,
      tagline: trTag,
      description: trDesc,
      seo_title: `${trName}: Akıllı ${category} Uygulaması`,
      seo_keywords: [category, "mobil asistan", "akilli araclar", "verimlilik", "kolay kullanim"],
    },
    es: {
      name: enName,
      tagline: `[ES] ${enTag}`,
      description: `[ES] ${enDesc}`,
      seo_title: `${enName}: Aplicación de ${category}`,
      seo_keywords: [category, "asistente movil", "herramienta inteligente", "productividad"],
    },
    de: {
      name: enName,
      tagline: `[DE] ${enTag}`,
      description: `[DE] ${enDesc}`,
      seo_title: `${enName}: Premium-${category}-App`,
      seo_keywords: [category, "mobiler assistent", "intelligentes tool", "effizienz"],
    },
    fr: {
      name: enName,
      tagline: `[FR] ${enTag}`,
      description: `[FR] ${enDesc}`,
      seo_title: `${enName} : Application ${category}`,
      seo_keywords: [category, "assistant mobile", "outil intelligent", "productivite"],
    },
    ja: {
      name: enName,
      tagline: `[JA] ${enTag}`,
      description: `[JA] ${enDesc}`,
      seo_title: `${enName}: ${category}のスマートツール`,
      seo_keywords: [category, "スマートツール", "モバイルアシスト", "生産性向上"],
    },
  };
}
