-- ══════════════════════════════════════════════════════════
-- Agentic 3D Showcase — Supabase Schema Migration
-- Table: apps
-- ══════════════════════════════════════════════════════════

-- Create the apps table
CREATE TABLE IF NOT EXISTS apps (
  id            TEXT PRIMARY KEY,                          -- slug identifier (e.g. "dayzero")
  name          TEXT NOT NULL,                             -- display name
  tagline       TEXT DEFAULT '',                           -- short tagline
  description   TEXT DEFAULT '',                           -- full description (English)
  description_tr TEXT DEFAULT '',                          -- Turkish description (i18n)
  icon_url      TEXT DEFAULT '',                           -- app icon URL
  app_store_id  TEXT DEFAULT '',                           -- Apple App Store numeric ID
  app_store_url TEXT DEFAULT '',                           -- full App Store link
  bundle_id     TEXT DEFAULT '',                           -- iOS bundle identifier
  developer     TEXT DEFAULT '',                           -- developer/artist name
  category      TEXT DEFAULT 'utilities',                  -- app category
  color         TEXT DEFAULT '#00f0ff',                    -- neon accent color for 3D scene
  position_x    REAL DEFAULT 0,                            -- 3D scene X position
  position_y    REAL DEFAULT 0,                            -- 3D scene Y position
  position_z    REAL DEFAULT 0,                            -- 3D scene Z position
  
  -- Media
  screenshots   TEXT[] DEFAULT '{}',                       -- array of screenshot URLs
  video_url     TEXT DEFAULT '',                           -- preview video URL
  
  -- Permissions (for legal page generation)
  permissions   TEXT[] DEFAULT '{}',                       -- e.g. {'camera', 'location', 'notifications', 'microphone', 'photos', 'contacts', 'health', 'bluetooth', 'tracking'}
  
  -- Legal config
  company_name  TEXT DEFAULT 'AgenticApps',                -- company name for legal texts
  contact_email TEXT DEFAULT 'privacy@agenticapps.com',    -- contact email for legal texts
  
  -- Metadata
  price         REAL DEFAULT 0,                            -- price in USD
  rating        REAL DEFAULT 0,                            -- average rating
  version       TEXT DEFAULT '1.0.0',                      -- latest version
  release_date  TIMESTAMPTZ,                               -- original release date
  
  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Create an index on app_store_id for lookups
CREATE INDEX IF NOT EXISTS idx_apps_app_store_id ON apps(app_store_id);

-- Enable Row Level Security
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anon key)
CREATE POLICY "Public read access" ON apps
  FOR SELECT USING (true);

-- Allow authenticated insert/update (service key / admin)
CREATE POLICY "Authenticated write access" ON apps
  FOR ALL USING (auth.role() = 'authenticated');

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_apps_modtime
  BEFORE UPDATE ON apps
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column();
