import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// Local mock data as fallback when Supabase is not configured
const LOCAL_SETTINGS_PATH = path.join(process.cwd(), 'src', 'data', 'site_settings.json');

function getLocalSettings() {
  try {
    if (fs.existsSync(LOCAL_SETTINGS_PATH)) {
      const data = fs.readFileSync(LOCAL_SETTINGS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {}
  
  return {
    hero_title_1_tr: 'Yeni Nesil Yapay Zeka',
    hero_title_1_en: 'Next-Gen AI',
    hero_title_2_tr: 'Mobil Deneyimleri',
    hero_title_2_en: 'Mobile Experiences',
    about_text_tr: 'Kahraman App olarak, yapay zeka destekli yeni nesil mobil deneyimler tasarlamaya odaklanıyoruz. Misyonumuz, günlük yaşamınıza gerçek değer katan, şık ve kullanıcı odaklı uygulamalarla dijital hayatınızı kolaylaştırmaktır.',
    about_text_en: 'At Kahraman App, we are dedicated to crafting next-generation mobile experiences powered by artificial intelligence. Our mission is to simplify your digital life through elegant, user-centric applications that bring real value to your everyday moments.'
  };
}

function saveLocalSettings(settings: any) {
  try {
    const dir = path.dirname(LOCAL_SETTINGS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_SETTINGS_PATH, JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error('Failed to save local settings', err);
  }
}

export async function GET() {
  const supabase = createAdminClient();
  
  if (supabase) {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
    if (!error && data) {
      return NextResponse.json({ settings: data });
    }
  }

  // Fallback to local settings
  return NextResponse.json({ settings: getLocalSettings() });
}

export async function POST(request: Request) {
  const supabase = createAdminClient();
  
  try {
    const body = await request.json();
    
    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert([{ id: 'global', ...body }])
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ settings: data[0] });
    } else {
      // Fallback
      const current = getLocalSettings();
      const updated = { ...current, ...body };
      saveLocalSettings(updated);
      return NextResponse.json({ settings: updated });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
