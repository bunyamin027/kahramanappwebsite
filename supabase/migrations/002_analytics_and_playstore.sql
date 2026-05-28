-- ══════════════════════════════════════════════════════════
-- Agentic 3D Showcase — Supabase Schema Migration 002
-- Table: app_clicks & Update apps
-- ══════════════════════════════════════════════════════════

-- 1. Add play_store_url to apps table
ALTER TABLE apps
ADD COLUMN IF NOT EXISTS play_store_url TEXT DEFAULT '';

-- 2. Create the app_clicks table
CREATE TABLE IF NOT EXISTS app_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT REFERENCES apps(id) ON DELETE CASCADE,
  os_type TEXT NOT NULL,
  source_page TEXT NOT NULL,
  utm_source TEXT DEFAULT '',
  utm_medium TEXT DEFAULT '',
  utm_campaign TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for fast analytical queries
CREATE INDEX IF NOT EXISTS idx_app_clicks_app_id ON app_clicks(app_id);
CREATE INDEX IF NOT EXISTS idx_app_clicks_os_type ON app_clicks(os_type);
CREATE INDEX IF NOT EXISTS idx_app_clicks_source_page ON app_clicks(source_page);
CREATE INDEX IF NOT EXISTS idx_app_clicks_created_at ON app_clicks(created_at);

-- Enable Row Level Security
ALTER TABLE app_clicks ENABLE ROW LEVEL SECURITY;

-- Allow public insert access (since clicks happen from unauthenticated visitors)
CREATE POLICY "Public insert access" ON app_clicks
  FOR INSERT WITH CHECK (true);

-- Allow authenticated read access (service key / admin)
CREATE POLICY "Authenticated read access" ON app_clicks
  FOR SELECT USING (auth.role() = 'authenticated');
