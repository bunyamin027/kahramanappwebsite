export type AppCategory =
  | "productivity"
  | "health"
  | "entertainment"
  | "education"
  | "social"
  | "utilities"
  | "lifestyle"
  | "finance";

export interface AppData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  position: [number, number, number];
  category: AppCategory;
  appStoreUrl?: string;
  playStoreUrl?: string;
  screenshots?: string[];
  video_url?: string;

  // README-sourced detail fields
  features?: string[];
  techStack?: string[];
  readmeDescription?: string;

  // Translations & ASO
  readmeDescription_tr?: string;
  features_tr?: string[];
  name_tr?: string;
  tagline_tr?: string;
  description_tr?: string;
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
