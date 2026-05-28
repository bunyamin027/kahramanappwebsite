import { createClient } from "@/lib/supabase";
import { apps as localApps } from "@/data/apps";
import type { AppRow } from "@/types/database";
import type { AppData } from "@/types/app";

/**
 * Converts a Supabase AppRow to the frontend AppData format.
 */
function rowToAppData(row: AppRow): AppData {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    icon: row.icon_url || `/icons/${row.id}.png`,
    color: row.color,
    position: [row.position_x, row.position_y, row.position_z],
    category: row.category as AppData["category"],
    appStoreUrl: row.app_store_url,
    playStoreUrl: row.play_store_url,
    screenshots: row.screenshots,

    // Localized Translation copies
    name_tr: row.name_tr,
    tagline_tr: row.tagline_tr,
    description_tr: row.description_tr,
    name_es: row.name_es,
    tagline_es: row.tagline_es,
    description_es: row.description_es,
    name_de: row.name_de,
    tagline_de: row.tagline_de,
    description_de: row.description_de,
    name_fr: row.name_fr,
    tagline_fr: row.tagline_fr,
    description_fr: row.description_fr,
    name_ja: row.name_ja,
    tagline_ja: row.tagline_ja,
    description_ja: row.description_ja,
  };
}

/**
 * Fetch all apps. Uses Supabase if configured, falls back to local JSON.
 */
export async function getAllApps(): Promise<AppData[]> {
  const supabase = createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(rowToAppData);
    }
  }

  // Fallback to local data
  return localApps;
}

/**
 * Fetch a single app by ID. Uses Supabase if configured, falls back to local JSON.
 */
export async function getAppById(appId: string): Promise<AppRow | null> {
  const supabase = createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .eq("id", appId)
      .single();

    if (!error && data) {
      return data;
    }
  }

  // Fallback: convert local AppData to AppRow-like object
  const localApp = localApps.find((a) => a.id === appId);
  if (!localApp) return null;

  return {
    id: localApp.id,
    name: localApp.name,
    tagline: localApp.tagline,
    description: localApp.description,
    description_tr: localApp.description_tr || "",
    icon_url: localApp.icon,
    app_store_id: "",
    app_store_url: localApp.appStoreUrl || "",
    play_store_url: localApp.playStoreUrl || "",
    bundle_id: "",
    developer: "AgenticApps",
    category: localApp.category,
    color: localApp.color,
    position_x: localApp.position[0],
    position_y: localApp.position[1],
    position_z: localApp.position[2],
    screenshots: localApp.screenshots || [],
    video_url: localApp.video_url || "",
    permissions: [],
    company_name: "AgenticApps",
    contact_email: "privacy@agenticapps.com",
    price: 0,
    rating: 0,
    version: "1.0.0",
    release_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name_tr: localApp.name_tr,
    tagline_tr: localApp.tagline_tr,
    name_es: localApp.name_es,
    tagline_es: localApp.tagline_es,
    description_es: localApp.description_es,
    name_de: localApp.name_de,
    tagline_de: localApp.tagline_de,
    description_de: localApp.description_de,
    name_fr: localApp.name_fr,
    tagline_fr: localApp.tagline_fr,
    description_fr: localApp.description_fr,
    name_ja: localApp.name_ja,
    tagline_ja: localApp.tagline_ja,
    description_ja: localApp.description_ja,
  };
}
