import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import type { AppInsert } from "@/types/database";

// ── iTunes Lookup API Response Types ────────────────────
interface iTunesResult {
  trackId: number;
  trackName: string;
  bundleId: string;
  artistName: string;
  description: string;
  artworkUrl512: string;
  artworkUrl100: string;
  trackViewUrl: string;
  screenshotUrls: string[];
  genres: string[];
  averageUserRating: number;
  price: number;
  version: string;
  releaseDate: string;
  currentVersionReleaseDate: string;
}

interface iTunesResponse {
  resultCount: number;
  results: iTunesResult[];
}

/**
 * Extracts App Store ID from a URL or returns the input if already a numeric ID.
 * Supports formats:
 *  - "1234567890"
 *  - "https://apps.apple.com/app/app-name/id1234567890"
 *  - "https://apps.apple.com/tr/app/app-name/id1234567890"
 */
function extractAppStoreId(input: string): string | null {
  // Already a numeric ID
  if (/^\d+$/.test(input.trim())) {
    return input.trim();
  }

  // Extract from URL: /id followed by digits
  const match = input.match(/\/id(\d+)/);
  if (match) {
    return match[1];
  }

  return null;
}

/**
 * Generates a URL-friendly slug from an app name.
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Maps iTunes genre strings to our category system.
 */
function mapCategory(genres: string[]): string {
  const genreMap: Record<string, string> = {
    Productivity: "productivity",
    Health: "health",
    "Health & Fitness": "health",
    Entertainment: "entertainment",
    Education: "education",
    "Social Networking": "social",
    Utilities: "utilities",
    Lifestyle: "lifestyle",
    Finance: "finance",
    Games: "entertainment",
    Music: "entertainment",
    Photo: "lifestyle",
    "Photo & Video": "lifestyle",
    Travel: "lifestyle",
    Weather: "utilities",
    News: "entertainment",
    Business: "productivity",
    Shopping: "lifestyle",
    Food: "lifestyle",
    "Food & Drink": "lifestyle",
    Sports: "entertainment",
    Medical: "health",
  };

  for (const genre of genres) {
    if (genreMap[genre]) return genreMap[genre];
  }
  return "utilities";
}

// ── POST /api/fetch-app ─────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, color, positionX, positionY, positionZ, permissions } = body;

    if (!input) {
      return Response.json(
        { error: "Missing 'input' field. Provide an App Store URL or ID." },
        { status: 400 }
      );
    }

    // 1. Extract App Store ID
    const appStoreId = extractAppStoreId(input);
    if (!appStoreId) {
      return Response.json(
        {
          error:
            "Could not extract App Store ID. Provide a valid URL (e.g. https://apps.apple.com/app/name/id1234567890) or a numeric ID.",
        },
        { status: 400 }
      );
    }

    // 2. Fetch from iTunes Lookup API
    const lookupUrl = `https://itunes.apple.com/lookup?id=${appStoreId}&country=us`;
    const response = await fetch(lookupUrl, {
      next: { revalidate: 0 }, // always fresh
    });

    if (!response.ok) {
      return Response.json(
        { error: `iTunes API returned ${response.status}` },
        { status: 502 }
      );
    }

    const data: iTunesResponse = await response.json();

    if (data.resultCount === 0 || !data.results[0]) {
      return Response.json(
        { error: `No app found with ID ${appStoreId}` },
        { status: 404 }
      );
    }

    const app = data.results[0];

    // 3. Build our app record
    const slug = slugify(app.trackName);
    const appRecord: AppInsert = {
      id: slug,
      name: app.trackName,
      tagline: app.genres?.[0] || "",
      description: app.description || "",
      description_tr: "", // to be filled manually or via translation API
      icon_url: app.artworkUrl512 || app.artworkUrl100 || "",
      app_store_id: String(app.trackId),
      app_store_url: app.trackViewUrl || "",
      bundle_id: app.bundleId || "",
      developer: app.artistName || "",
      category: mapCategory(app.genres || []),
      color: color || "#00f0ff",
      position_x: positionX ?? 0,
      position_y: positionY ?? 0,
      position_z: positionZ ?? 0,
      screenshots: app.screenshotUrls || [],
      video_url: "",
      permissions: permissions || [],
      company_name: "AgenticApps",
      contact_email: "privacy@agenticapps.com",
      price: app.price || 0,
      rating: app.averageUserRating || 0,
      version: app.version || "1.0.0",
      release_date: app.releaseDate || null,
    };

    // 4. Save to Supabase (if configured)
    const supabase = createAdminClient();

    if (supabase) {
      const { data: savedApp, error: dbError } = await supabase
        .from("apps")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .upsert([appRecord] as any, { onConflict: "id" })
        .select()
        .single();

      if (dbError) {
        return Response.json(
          {
            error: `Database error: ${dbError.message}`,
            app: appRecord, // still return the data even if DB fails
          },
          { status: 500 }
        );
      }

      return Response.json({
        success: true,
        message: `App "${app.trackName}" saved successfully.`,
        app: savedApp,
      });
    }

    // No Supabase configured — return data without saving
    return Response.json({
      success: true,
      message: `App "${app.trackName}" fetched successfully. (No database configured — data not saved)`,
      app: appRecord,
    });
  } catch (error) {
    console.error("[fetch-app] Error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── GET /api/fetch-app?id=... ───────────────────────────
// Quick lookup without saving
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("id") || searchParams.get("url");

  if (!input) {
    return Response.json(
      {
        error: "Missing 'id' or 'url' query parameter.",
        usage: {
          POST: "POST /api/fetch-app with body { input, color?, permissions? }",
          GET: "GET /api/fetch-app?id=1234567890",
        },
      },
      { status: 400 }
    );
  }

  const appStoreId = extractAppStoreId(input);
  if (!appStoreId) {
    return Response.json(
      { error: "Invalid App Store ID or URL" },
      { status: 400 }
    );
  }

  try {
    const lookupUrl = `https://itunes.apple.com/lookup?id=${appStoreId}&country=us`;
    const response = await fetch(lookupUrl, {
      next: { revalidate: 0 },
    });
    const data: iTunesResponse = await response.json();

    if (data.resultCount === 0) {
      return Response.json(
        { error: `No app found with ID ${appStoreId}` },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      app: data.results[0],
    });
  } catch (error) {
    console.error("[fetch-app GET] Error:", error);
    return Response.json(
      { error: "Failed to fetch from iTunes API" },
      { status: 502 }
    );
  }
}
