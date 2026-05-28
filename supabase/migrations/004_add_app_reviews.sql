-- ══════════════════════════════════════════════════════════
-- Agentic 3D Showcase — Supabase Schema Migration
-- Table: app_reviews
-- ══════════════════════════════════════════════════════════

-- Create the app_reviews table
CREATE TABLE IF NOT EXISTS app_reviews (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id             TEXT NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  provider_review_id TEXT UNIQUE NOT NULL,
  reviewer_name      TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content       TEXT NOT NULL,
  territory     TEXT DEFAULT 'us',
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by app
CREATE INDEX IF NOT EXISTS idx_app_reviews_app_id ON app_reviews(app_id);

-- Enable RLS
ALTER TABLE app_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON app_reviews
  FOR SELECT USING (true);

-- Allow authenticated/service key write access
CREATE POLICY "Authenticated write access" ON app_reviews
  FOR ALL USING (auth.role() = 'authenticated');
