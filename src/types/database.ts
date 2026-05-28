// ── Supabase Database Types ──────────────────────────────────
// Auto-generated types for the apps table.
// In production, generate with: npx supabase gen types typescript

export interface Database {
  public: {
    Tables: {
      apps: {
        Row: AppRow;
        Insert: AppInsert;
        Update: AppUpdate;
        Relationships: [];
      };
      app_clicks: {
        Row: AppClickRow;
        Insert: AppClickInsert;
        Update: AppClickUpdate;
        Relationships: [];
      };
      subscribers: {
        Row: SubscriberRow;
        Insert: SubscriberInsert;
        Update: SubscriberUpdate;
        Relationships: [];
      };
      app_reviews: {
        Row: AppReviewRow;
        Insert: AppReviewInsert;
        Update: AppReviewUpdate;
        Relationships: [
          {
            foreignKeyName: "app_reviews_app_id_fkey";
            columns: ["app_id"];
            referencedRelation: "apps";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export interface AppClickRow {
  id: string;
  app_id: string;
  os_type: string;
  source_page: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  created_at: string;
}

export interface AppClickInsert {
  id?: string;
  app_id: string;
  os_type: string;
  source_page: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at?: string;
}

export type AppClickUpdate = Partial<AppClickInsert>;

export interface AppRow {
  id: string;
  name: string;
  tagline: string;
  description: string;
  description_tr: string;
  icon_url: string;
  app_store_id: string;
  app_store_url: string;
  play_store_url: string;
  bundle_id: string;
  developer: string;
  category: string;
  color: string;
  position_x: number;
  position_y: number;
  position_z: number;
  screenshots: string[];
  video_url: string;
  permissions: string[];
  company_name: string;
  contact_email: string;
  price: number;
  rating: number;
  version: string;
  release_date: string | null;
  created_at: string;
  updated_at: string;

  // English ASO Metadata
  seo_title?: string;
  seo_keywords?: string[];

  // Turkish Translations & ASO
  name_tr?: string;
  tagline_tr?: string;
  seo_title_tr?: string;
  seo_keywords_tr?: string[];

  // Spanish Translations & ASO
  name_es?: string;
  tagline_es?: string;
  description_es?: string;
  seo_title_es?: string;
  seo_keywords_es?: string[];

  // German Translations & ASO
  name_de?: string;
  tagline_de?: string;
  description_de?: string;
  seo_title_de?: string;
  seo_keywords_de?: string[];

  // French Translations & ASO
  name_fr?: string;
  tagline_fr?: string;
  description_fr?: string;
  seo_title_fr?: string;
  seo_keywords_fr?: string[];

  // Japanese Translations & ASO
  name_ja?: string;
  tagline_ja?: string;
  description_ja?: string;
  seo_title_ja?: string;
  seo_keywords_ja?: string[];
}

export interface AppInsert {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  description_tr?: string;
  icon_url?: string;
  app_store_id?: string;
  app_store_url?: string;
  play_store_url?: string;
  bundle_id?: string;
  developer?: string;
  category?: string;
  color?: string;
  position_x?: number;
  position_y?: number;
  position_z?: number;
  screenshots?: string[];
  video_url?: string;
  permissions?: string[];
  company_name?: string;
  contact_email?: string;
  price?: number;
  rating?: number;
  version?: string;
  release_date?: string | null;

  seo_title?: string;
  seo_keywords?: string[];
  name_tr?: string;
  tagline_tr?: string;
  seo_title_tr?: string;
  seo_keywords_tr?: string[];
  name_es?: string;
  tagline_es?: string;
  description_es?: string;
  seo_title_es?: string;
  seo_keywords_es?: string[];
  name_de?: string;
  tagline_de?: string;
  description_de?: string;
  seo_title_de?: string;
  seo_keywords_de?: string[];
  name_fr?: string;
  tagline_fr?: string;
  description_fr?: string;
  seo_title_fr?: string;
  seo_keywords_fr?: string[];
  name_ja?: string;
  tagline_ja?: string;
  description_ja?: string;
  seo_title_ja?: string;
  seo_keywords_ja?: string[];
}

export type AppUpdate = Partial<AppInsert>;

export interface SubscriberRow {
  id: string;
  email: string;
  created_at: string;
}

export interface SubscriberInsert {
  id?: string;
  email: string;
  created_at?: string;
}

export type SubscriberUpdate = Partial<SubscriberInsert>;

export interface AppReviewRow {
  id: string;
  app_id: string;
  provider_review_id: string;
  reviewer_name: string;
  rating: number;
  content: string;
  territory: string;
  created_at: string;
}

export interface AppReviewInsert {
  id?: string;
  app_id: string;
  provider_review_id: string;
  reviewer_name: string;
  rating: number;
  content: string;
  territory?: string;
  created_at?: string;
}

export type AppReviewUpdate = Partial<AppReviewInsert>;
