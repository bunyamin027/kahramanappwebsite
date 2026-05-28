-- ══════════════════════════════════════════════════════════
-- Agentic 3D Showcase — Supabase Schema Migration 003
-- Table: apps translation & ASO columns
-- ══════════════════════════════════════════════════════════

ALTER TABLE apps
  -- English ASO Metadata
  ADD COLUMN IF NOT EXISTS seo_title TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_keywords TEXT[] DEFAULT '{}',

  -- Turkish Translations & ASO
  ADD COLUMN IF NOT EXISTS name_tr TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tagline_tr TEXT DEFAULT '',
  -- description_tr already exists in schema migration 001
  ADD COLUMN IF NOT EXISTS seo_title_tr TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_keywords_tr TEXT[] DEFAULT '{}',

  -- Spanish Translations & ASO
  ADD COLUMN IF NOT EXISTS name_es TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tagline_es TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_es TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_title_es TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_keywords_es TEXT[] DEFAULT '{}',

  -- German Translations & ASO
  ADD COLUMN IF NOT EXISTS name_de TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tagline_de TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_de TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_title_de TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_keywords_de TEXT[] DEFAULT '{}',

  -- French Translations & ASO
  ADD COLUMN IF NOT EXISTS name_fr TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tagline_fr TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_fr TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_title_fr TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_keywords_fr TEXT[] DEFAULT '{}',

  -- Japanese Translations & ASO
  ADD COLUMN IF NOT EXISTS name_ja TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tagline_ja TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_ja TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_title_ja TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_keywords_ja TEXT[] DEFAULT '{}';
