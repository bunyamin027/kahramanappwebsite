import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const urlSecret = request.nextUrl.searchParams.get("secret");
    const headerSecret = request.headers.get("x-revalidation-secret");
    const secret = urlSecret || headerSecret;

    console.log("[Revalidate Webhook] Received revalidation request.");

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      console.warn("[Revalidate Webhook] Unauthorized request. Token mismatch.");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    let body: unknown = null;
    try {
      body = await request.json();
    } catch {
      console.log("[Revalidate Webhook] No JSON body parsed, processing general revalidation.");
    }

    let appId: string | null = null;

    const payload = body as Record<string, unknown>;
    if (payload) {
      // 1. Direct payload format: { "app_id": "dayzero" }
      if (payload.app_id) {
        appId = String(payload.app_id);
        console.log(`[Revalidate Webhook] Parsed app_id directly: ${appId}`);
      } 
      // 2. Supabase DB webhook format:
      // { "table": "apps", "type": "UPDATE", "record": { "id": "dayzero" } }
      else if (payload.table === "apps") {
        if (payload.record && typeof payload.record === "object" && (payload.record as Record<string, unknown>).id) {
          appId = String((payload.record as Record<string, unknown>).id);
          console.log(`[Revalidate Webhook] Parsed app_id from Supabase record: ${appId} (Event type: ${payload.type})`);
        }
      }
    }

    // Always revalidate primary listing pages
    console.log("[Revalidate Webhook] Revalidating primary listing routes: '/' and '/link-in-bio'");
    revalidatePath("/");
    revalidatePath("/link-in-bio");

    // Revalidate language-specific dynamic sub-pages
    if (appId) {
      console.log(`[Revalidate Webhook] Revalidating detail routes for app: ${appId}`);
      
      // Dynamic static routes
      revalidatePath(`/en/legal/${appId}`);
      revalidatePath(`/tr/legal/${appId}`);
      revalidatePath(`/en/press/${appId}`);
      revalidatePath(`/tr/press/${appId}`);
      
      // General layouts/pages
      revalidatePath("/[lang]/legal/[app_id]", "page");
      revalidatePath("/[lang]/press/[app_id]", "page");
    }

    return NextResponse.json({ 
      success: true, 
      revalidated: true, 
      appId,
      timestamp: Date.now() 
    });
  } catch (err) {
    console.error("[Revalidate Webhook] Critical Error:", err);
    return NextResponse.json(
      { message: "Error revalidating path cache", error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
