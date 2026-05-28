import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getAllApps } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      appId, 
      osType, 
      sourcePage, 
      utmSource = '', 
      utmMedium = '', 
      utmCampaign = '' 
    } = body;

    if (!appId || !osType || !sourcePage) {
      return NextResponse.json(
        { error: 'Missing required tracking parameters.' },
        { status: 400 }
      );
    }

    // Try to record the click in the database
    const supabase = createClient();
    if (supabase) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('app_clicks') as any).insert({
        app_id: appId,
        os_type: osType,
        source_page: sourcePage,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });

      if (error) {
        console.error('Failed to log click to Supabase:', error.message);
      }
    }

    // Determine where to redirect the user
    // In a full production setup, you might query the DB for the URLs.
    // We'll use the cached getAllApps() helper.
    const apps = await getAllApps();
    const app = apps.find(a => a.id === appId);

    if (!app) {
      return NextResponse.json(
        { error: 'App not found.' },
        { status: 404 }
      );
    }

    let redirectUrl = app.appStoreUrl || `https://kahraman.app/fallback`;

    // Smart OS routing
    if (osType === 'Android' && app.playStoreUrl) {
      redirectUrl = app.playStoreUrl;
    } else if (osType === 'iOS' && app.appStoreUrl) {
      redirectUrl = app.appStoreUrl;
    }

    return NextResponse.json({ success: true, redirectUrl });
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
