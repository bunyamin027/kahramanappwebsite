import { notFound } from "next/navigation";
import { z } from "zod";
import { getAppById } from "@/lib/data";
import LegalContent from "./LegalContent";
import type { Metadata } from "next";

export const revalidate = 604800; // 1 week

// ── Supported languages ─────────────────────────────────
const VALID_LANGS = ["en", "tr"] as const;
type Lang = (typeof VALID_LANGS)[number];

function isValidLang(lang: string): lang is Lang {
  return VALID_LANGS.includes(lang as Lang);
}

// Security: Prevent Path Traversal & Invalid Bot Requests
const appIdSchema = z.string().regex(/^[a-z0-9-]+$/).min(2).max(50);

// ── Dynamic metadata ────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; app_id: string }>;
}): Promise<Metadata> {
  const { lang, app_id } = await params;
  
  if (!appIdSchema.safeParse(app_id).success) {
    return { title: "App Not Found" };
  }

  const app = await getAppById(app_id);

  if (!app) return { title: "App Not Found" };

  const isEnglish = lang === "en";
  return {
    title: `${app.name} — ${isEnglish ? "Legal" : "Yasal"} | AgenticApps`,
    description: `${isEnglish ? "Privacy Policy and Terms of Use" : "Gizlilik Politikası ve Kullanım Şartları"} for ${app.name}`,
    openGraph: {
      title: `${app.name} — Legal | AgenticApps`,
      description: `${isEnglish ? "Privacy Policy and Terms of Use" : "Gizlilik Politikası ve Kullanım Şartları"} for ${app.name}`,
      images: [
        {
          url: app.icon_url || "/icons/default-og.png",
          width: 1200,
          height: 630,
          alt: `${app.name} Cover Image`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${app.name} — Legal | AgenticApps`,
      description: `${isEnglish ? "Privacy Policy and Terms of Use" : "Gizlilik Politikası ve Kullanım Şartları"} for ${app.name}`,
      images: [app.icon_url || "/icons/default-og.png"],
    },
  };
}

// ── Page Component ──────────────────────────────────────
export default async function LegalPage({
  params,
}: {
  params: Promise<{ lang: string; app_id: string }>;
}) {
  const { lang, app_id } = await params;

  // Validate language and app_id security schema
  if (!isValidLang(lang) || !appIdSchema.safeParse(app_id).success) {
    notFound();
  }

  // Fetch app data
  const app = await getAppById(app_id);
  if (!app) {
    notFound();
  }

  return <LegalContent app={app} lang={lang} />;
}
