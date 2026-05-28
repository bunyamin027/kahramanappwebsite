import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Initialize Supabase client. In production, prefer using the SERVICE_ROLE_KEY
// to bypass RLS for inserts if users aren't authenticated, or rely on anon key
// if RLS allows anon inserts to 'subscribers'.
const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    // Bypass type inference issue by casting to any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("subscribers") as any).insert({
      email,
    });

    if (error) {
      // Check if it's a unique constraint violation (already subscribed)
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Already subscribed" },
          { status: 200 }
        );
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
