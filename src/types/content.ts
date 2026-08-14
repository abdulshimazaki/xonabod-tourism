// Core shared shape for every tourism content type (recreation places,
// sanatoriums, dachas, restaurants, accommodations, attractions).
// Category-specific extra fields live in `extra` (jsonb column in Supabase),
// so every content type can share ONE generic list/detail/admin-CRUD UI
// while still supporting its own custom fields.

export type Coordinates = {
  lat: number;
  lng: number;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt?: string;
  order: number;
};

export type SocialLinks = {
  instagram?: string;
  telegram?: string;
  facebook?: string;
  website?: string;
  booking_url?: string;
};

export type SeoFields = {
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  slug: string;
};

// Generic tourism object — recreation_places, sanatoriums, dachas,
// restaurants, accommodations, attractions all use this same row shape.
export interface TourismItem {
  id: string;
  content_type: ContentTypeKey;
  name: string;
  short_description: string;
  description_html: string;
  cover_image: string | null;
  gallery: GalleryImage[];
  video_url: string | null;
  address: string;
  coordinates: Coordinates | null;
  phone: string | null;
  working_hours: string | null;
  price_info: string | null;
  amenities: string[]; // e.g. Wi-Fi, Basseyn, Avtoturargoh
  services: string[];
  category_tag: string | null; // sub-category, e.g. "Mehmonxona" / "Tarixiy obidalar"
  social: SocialLinks;
  seo: SeoFields;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // category-specific extras (Sanatoriya: davolash yo'nalishlari,
  // Dacha: mehmonlar/xonalar soni, Restoran: o'rtacha chek, etc.)
  extra: Record<string, string | number | boolean | null>;
}

export type ContentTypeKey =
  | "recreation_places"
  | "sanatoriums"
  | "dachas"
  | "restaurants"
  | "accommodations"
  | "attractions";

export interface EventItem {
  id: string;
  title: string;
  cover_image: string | null;
  gallery: GalleryImage[];
  video_url: string | null;
  description_html: string;
  start_date: string; // ISO date
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location_text: string;
  coordinates: Coordinates | null;
  registration_url: string | null;
  contact_info: string | null;
  published: boolean;
  seo: SeoFields;
  created_at: string;
  updated_at: string;
}

export type MediaKind = "photo" | "video";

export interface MediaItem {
  id: string;
  kind: MediaKind;
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  category: string | null;
  is_cover: boolean;
  related_content_type: ContentTypeKey | "events" | "about" | null;
  related_content_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface AboutContent {
  id: string;
  history_html: string;
  geography_html: string;
  nature_html: string;
  climate_html: string;
  culture_html: string;
  tourism_potential_html: string;
  hero_image: string | null;
  gallery: GalleryImage[];
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  logo_url: string | null;
  favicon_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  social: SocialLinks & { youtube?: string };
  seo_default_title: string | null;
  seo_default_description: string | null;
  hero_image: string | null;
  hero_video_url: string | null;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary_label: string;
  hero_cta_secondary_label: string;
  featured_categories: ContentTypeKey[];
  featured_item_ids: string[];
  featured_attraction_ids: string[];
  featured_event_ids: string[];
  featured_gallery_ids: string[];
  updated_at: string;
}

export type UserRole = "super_admin" | "content_manager" | "editor";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}
