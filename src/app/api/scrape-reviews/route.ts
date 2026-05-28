import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import type { AppReviewInsert } from "@/types/database";

// Allowed territories for RSS feed
const TERRITORIES = ["us", "gb", "tr", "de", "fr", "jp", "es"];

export async function GET(request: Request) {
  return handleScrape(request);
}

export async function POST(request: Request) {
  return handleScrape(request);
}

async function handleScrape(request: Request) {
  try {
    // 1. Optional cron secret authorization
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret") || request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      console.warn("[Scraper] Unauthorized scrape attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "No database connected" }, { status: 503 });
    }

    // 2. Fetch all apps that have an app_store_id
    const { data: apps, error: appsError } = await supabase
      .from("apps")
      .select("id, app_store_id, name")
      .not("app_store_id", "is", null)
      .neq("app_store_id", "");

    if (appsError || !apps) {
      return NextResponse.json({ error: "Failed to fetch apps", details: appsError }, { status: 500 });
    }

    interface ScrapedApp {
      id: string;
      app_store_id: string;
      name: string;
    }

    const appsList = (apps as ScrapedApp[]) || [];
    console.log(`[Scraper] Found ${appsList.length} apps to check for reviews.`);

    let totalInserted = 0;
    const errors: string[] = [];

    // 3. Process each app
    for (const app of appsList) {
      console.log(`[Scraper] Fetching reviews for ${app.name} (${app.app_store_id})...`);
      
      // We will check multiple territories to get a global perspective
      // For performance in a real app, you might want to space these out or use Promise.all
      // but iTunes API rate limits can be strict, so sequential is safer.
      for (const territory of TERRITORIES) {
        try {
          const feedUrl = `https://itunes.apple.com/${territory}/rss/customerreviews/id=${app.app_store_id}/sortBy=mostRecent/json`;
          const response = await fetch(feedUrl, { next: { revalidate: 3600 } });
          
          if (!response.ok) {
            // Some territories might not have the app or reviews, ignore 400s
            continue;
          }

          const data = await response.json();
          const entries = data?.feed?.entry;

          if (!entries || !Array.isArray(entries)) {
            continue;
          }

          // The first entry is usually the app metadata itself in iTunes RSS,
          // reviews start from the second element or elements that have an author.
          const reviewsToInsert: AppReviewInsert[] = [];

          for (const entry of entries) {
            // Skip the metadata entry
            if (!entry.author || !entry.author.name) continue;

            const ratingStr = entry["im:rating"]?.label;
            const rating = parseInt(ratingStr, 10);
            
            // Only care about 4 and 5 star reviews
            if (isNaN(rating) || rating < 4) continue;

            const providerId = entry.id?.label;
            const reviewerName = entry.author.name.label;
            const content = entry.content?.label || entry.title?.label || "";

            if (!providerId || !reviewerName || !content) continue;

            reviewsToInsert.push({
              app_id: app.id,
              provider_review_id: providerId,
              reviewer_name: reviewerName,
              rating,
              content,
              territory,
            });
          }

          if (reviewsToInsert.length > 0) {
            // Upsert reviews to avoid duplicates (relies on provider_review_id unique constraint)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: insertError } = await (supabase.from("app_reviews") as any).upsert(
              reviewsToInsert,
              { onConflict: "provider_review_id" }
            );

            if (insertError) {
              console.error(`[Scraper] Insert error for ${app.name}:`, insertError);
              errors.push(insertError.message);
            } else {
              totalInserted += reviewsToInsert.length;
            }
          }
        } catch (err) {
          console.error(`[Scraper] Failed to fetch territory ${territory} for ${app.name}:`, err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scrape complete. Processed ${appsList.length} apps.`,
      inserted: totalInserted,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[Scraper] Fatal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
