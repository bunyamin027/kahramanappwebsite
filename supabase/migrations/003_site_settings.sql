-- ══════════════════════════════════════════════════════════
-- Agentic 3D Showcase — Supabase Schema Migration 003
-- Table: site_settings
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  
  -- Hero Section Settings
  hero_title_1_tr TEXT DEFAULT 'Yeni Nesil Yapay Zeka',
  hero_title_1_en TEXT DEFAULT 'Next-Gen AI',
  hero_title_2_tr TEXT DEFAULT 'Mobil Deneyimleri',
  hero_title_2_en TEXT DEFAULT 'Mobile Experiences',
  
  -- About Us Section
  about_text_tr TEXT DEFAULT 'Kahraman App olarak, yapay zeka destekli yeni nesil mobil deneyimler tasarlamaya odaklanıyoruz. Misyonumuz, günlük yaşamınıza gerçek değer katan, şık ve kullanıcı odaklı uygulamalarla dijital hayatınızı kolaylaştırmaktır.',
  about_text_en TEXT DEFAULT 'At Kahraman App, we are dedicated to crafting next-generation mobile experiences powered by artificial intelligence. Our mission is to simplify your digital life through elegant, user-centric applications that bring real value to your everyday moments.',
  
  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure only one global record exists
INSERT INTO site_settings (id) 
VALUES ('global')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access on site_settings" ON site_settings
  FOR SELECT USING (true);

-- Allow authenticated update (admin)
CREATE POLICY "Authenticated update access on site_settings" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert access on site_settings" ON site_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Trigger to auto-update updated_at
CREATE TRIGGER update_site_settings_modtime
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column();
