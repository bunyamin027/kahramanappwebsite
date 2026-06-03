import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LANGS = ["en", "tr", "es", "de", "fr", "ja"];

export function proxy(request: NextRequest) {
  // 1. Check if the user already has a 'lang' cookie set
  const cookieLang = request.cookies.get("lang")?.value;
  if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) {
    return NextResponse.next();
  }

  // 2. Identify language based on IP Country Header
  // Vercel deployment injects 'x-vercel-ip-country'
  // Cloudflare injects 'cf-ipcountry'
  const country = (
    request.headers.get("x-vercel-ip-country") || 
    request.headers.get("cf-ipcountry") || 
    ""
  ).toUpperCase();

  let detectedLang = "en";

  if (country) {
    if (country === "TR") {
      detectedLang = "tr";
    } else if (["ES", "MX", "AR", "CO", "PE", "VE", "CL", "EC", "GT", "BO", "UY", "PY", "CR", "PA", "SV", "HN", "PR"].includes(country)) {
      detectedLang = "es";
    } else if (["DE", "AT", "CH", "LI"].includes(country)) {
      detectedLang = "de";
    } else if (["FR", "BE", "LU", "MC", "CA"].includes(country)) {
      detectedLang = "fr";
    } else if (country === "JP") {
      detectedLang = "ja";
    }
  }

  // 3. Fallback: Identify language based on Accept-Language browser header
  if (detectedLang === "en") {
    const acceptLang = request.headers.get("accept-language") || "";
    const primaryLocale = acceptLang.split(",")[0].toLowerCase();
    
    if (primaryLocale.startsWith("tr")) {
      detectedLang = "tr";
    } else if (primaryLocale.startsWith("es")) {
      detectedLang = "es";
    } else if (primaryLocale.startsWith("de")) {
      detectedLang = "de";
    } else if (primaryLocale.startsWith("fr")) {
      detectedLang = "fr";
    } else if (primaryLocale.startsWith("ja") || primaryLocale.startsWith("jp")) {
      detectedLang = "ja";
    }
  }

  // 4. Secure Mutating API Routes
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith("/api/fetch-app") || 
    pathname.startsWith("/api/auto-translate") ||
    pathname.startsWith("/api/scrape-reviews") ||
    pathname.startsWith("/api/revalidate")
  ) {
    const authHeader = request.headers.get("authorization");
    const secretParams = request.nextUrl.searchParams.get("secret");
    
    // We expect "Bearer ADMIN_TOKEN" or ?secret=CRON_SECRET
    const isValidToken = 
      (authHeader && authHeader.replace("Bearer ", "") === process.env.ADMIN_TOKEN) ||
      (secretParams && secretParams === process.env.CRON_SECRET) ||
      (authHeader && authHeader.replace("Bearer ", "") === process.env.CRON_SECRET);

    if (!isValidToken && process.env.ADMIN_TOKEN) {
      // If we have an ADMIN_TOKEN set but they didn't provide it, block.
      // (If it's undefined, we might be in local dev without strict security, but in prod we block)
      console.warn(`[Security] Blocked unauthorized access to ${pathname}`);
      return NextResponse.json({ error: "Unauthorized. Access Denied by System Shield." }, { status: 401 });
    }
  }

  // 4.5. Protect /admin routes, but allow access to /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 5. Set the lang cookie on response so it persists and is synchronized
  const response = NextResponse.next();
  
  // Set Cookie for 1 year (SameSite=Lax is crucial for security)
  response.cookies.set({
    name: "lang",
    value: detectedLang,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  // Only log for page navigations, not every single API request to avoid noise
  if (!pathname.startsWith("/api")) {
    console.log(`[Middleware] Detected country: ${country || "Unknown"}, setting language: ${detectedLang}`);
  }
  
  return response;
}

// Only match home and page routes (exclude static assets, API calls)
export const config = {
  matcher: [
    /*
     * - api (API routes except mutating ones which we want to check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons/ (app icons)
     * - fonts/ (font files)
     * - screenshots/ (app screenshots)
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|fonts|screenshots|.*\\.).*)",
  ],
};
