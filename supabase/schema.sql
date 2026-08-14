-- =========================================================================
-- XONOBOD TURIZM PORTALI — Supabase database schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =========================================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------------
-- Shared enum-like helper: content_type values used by the 6 tourism tables
-- -------------------------------------------------------------------------
create type content_type_key as enum (
  'recreation_places', 'sanatoriums', 'dachas', 'restaurants', 'accommodations', 'attractions'
);

create type user_role as enum ('super_admin', 'content_manager', 'editor');
create type media_kind as enum ('photo', 'video');

-- -------------------------------------------------------------------------
-- admin_users — profile row linked 1:1 to Supabase auth.users
-- -------------------------------------------------------------------------
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role user_role not null default 'editor',
  created_at timestamptz not null default now()
);

-- Auto-create an admin_users row whenever a new auth user signs up.
-- The FIRST user ever created becomes super_admin automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.admin_users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case when (select count(*) from public.admin_users) = 0 then 'super_admin' else 'editor' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------------------------------------------------------
-- Reusable "tourism item" column set — one table per category so admin
-- CRUD/RLS stays simple, but every table shares this exact shape (the
-- frontend's generic hooks rely on this).
-- -------------------------------------------------------------------------
-- (Defined per-table below via a repeated block, since Postgres has no
-- table inheritance that plays perfectly with RLS + PostgREST — this is
-- intentional, not an oversight.)

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Macro-like generator is not available in plain SQL, so each table is
-- declared explicitly below (kept identical on purpose).

create table recreation_places (
  id uuid primary key default gen_random_uuid(),
  content_type content_type_key not null default 'recreation_places',
  name text not null,
  short_description text not null default '',
  description_html text not null default '',
  cover_image text,
  gallery jsonb not null default '[]',
  video_url text,
  address text not null default '',
  coordinates jsonb,
  phone text,
  working_hours text,
  price_info text,
  amenities text[] not null default '{}',
  services text[] not null default '{}',
  category_tag text,
  social jsonb not null default '{}',
  seo jsonb not null default '{"slug": ""}',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  extra jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Expression-based uniqueness can't be declared inline in CREATE TABLE,
-- so it's added as an index. Creating it BEFORE the "like ... including
-- all" tables below means every category table inherits its own copy.
create unique index recreation_places_slug_idx on recreation_places ((seo->>'slug'));

create table sanatoriums (like recreation_places including all);
alter table sanatoriums alter column content_type set default 'sanatoriums';

create table dachas (like recreation_places including all);
alter table dachas alter column content_type set default 'dachas';

create table restaurants (like recreation_places including all);
alter table restaurants alter column content_type set default 'restaurants';

create table accommodations (like recreation_places including all);
alter table accommodations alter column content_type set default 'accommodations';

create table attractions (like recreation_places including all);
alter table attractions alter column content_type set default 'attractions';

-- `like ... including all` copies the primary key + unique index but not
-- named CHECK constraints referencing the original table name, and it does
-- NOT copy triggers — add updated_at triggers explicitly for every table.
create trigger trg_updated_at before update on recreation_places for each row execute procedure set_updated_at();
create trigger trg_updated_at before update on sanatoriums for each row execute procedure set_updated_at();
create trigger trg_updated_at before update on dachas for each row execute procedure set_updated_at();
create trigger trg_updated_at before update on restaurants for each row execute procedure set_updated_at();
create trigger trg_updated_at before update on accommodations for each row execute procedure set_updated_at();
create trigger trg_updated_at before update on attractions for each row execute procedure set_updated_at();

-- -------------------------------------------------------------------------
-- events
-- -------------------------------------------------------------------------
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_image text,
  gallery jsonb not null default '[]',
  video_url text,
  description_html text not null default '',
  start_date date not null,
  end_date date,
  start_time time,
  end_time time,
  location_text text not null default '',
  coordinates jsonb,
  registration_url text,
  contact_info text,
  published boolean not null default false,
  seo jsonb not null default '{"slug": ""}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index events_slug_idx on events ((seo->>'slug'));
create trigger trg_updated_at before update on events for each row execute procedure set_updated_at();

-- -------------------------------------------------------------------------
-- media (Foto / Video markaziy kutubxonasi)
-- -------------------------------------------------------------------------
create table media (
  id uuid primary key default gen_random_uuid(),
  kind media_kind not null,
  url text not null,
  thumbnail_url text,
  title text,
  description text,
  category text,
  is_cover boolean not null default false,
  related_content_type text,
  related_content_id uuid,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- about_content — single row, "Xonobod haqida" page
-- -------------------------------------------------------------------------
create table about_content (
  id uuid primary key default gen_random_uuid(),
  history_html text not null default '',
  geography_html text not null default '',
  nature_html text not null default '',
  climate_html text not null default '',
  culture_html text not null default '',
  tourism_potential_html text not null default '',
  hero_image text,
  gallery jsonb not null default '[]',
  updated_at timestamptz not null default now()
);
create trigger trg_updated_at before update on about_content for each row execute procedure set_updated_at();

-- -------------------------------------------------------------------------
-- site_settings — single row, homepage CMS + global settings
-- -------------------------------------------------------------------------
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'XONOBOD',
  tagline text not null default 'Tabiat, hordiq va turizm maskani',
  logo_url text,
  favicon_url text,
  phone text,
  email text,
  address text,
  social jsonb not null default '{}',
  seo_default_title text,
  seo_default_description text,
  hero_image text,
  hero_video_url text,
  hero_title text not null default 'XONOBOD',
  hero_subtitle text not null default 'Tabiat, hordiq va unutilmas taassurotlar',
  hero_cta_primary_label text not null default 'Xonobodni kashf eting',
  hero_cta_secondary_label text not null default 'Dam olish joylarini ko''rish',
  featured_categories text[] not null default '{}',
  featured_item_ids uuid[] not null default '{}',
  featured_attraction_ids uuid[] not null default '{}',
  featured_event_ids uuid[] not null default '{}',
  featured_gallery_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now()
);
create trigger trg_updated_at before update on site_settings for each row execute procedure set_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY
-- Public (anon) visitors: read-only, published rows only.
-- Authenticated admin_users: full read/write on everything.
-- =========================================================================

alter table recreation_places enable row level security;
alter table sanatoriums enable row level security;
alter table dachas enable row level security;
alter table restaurants enable row level security;
alter table accommodations enable row level security;
alter table attractions enable row level security;
alter table events enable row level security;
alter table media enable row level security;
alter table about_content enable row level security;
alter table site_settings enable row level security;
alter table admin_users enable row level security;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$;

-- Tourism content tables: public can read published rows; admins can do anything.
do $$
declare t text;
begin
  foreach t in array array['recreation_places','sanatoriums','dachas','restaurants','accommodations','attractions']
  loop
    execute format('create policy "public_read_published" on %I for select using (published = true or is_admin())', t);
    execute format('create policy "admin_write" on %I for insert with check (is_admin())', t);
    execute format('create policy "admin_update" on %I for update using (is_admin())', t);
    execute format('create policy "admin_delete" on %I for delete using (is_admin())', t);
  end loop;
end $$;

create policy "public_read_published" on events for select using (published = true or is_admin());
create policy "admin_write" on events for insert with check (is_admin());
create policy "admin_update" on events for update using (is_admin());
create policy "admin_delete" on events for delete using (is_admin());

create policy "public_read" on media for select using (true);
create policy "admin_write" on media for insert with check (is_admin());
create policy "admin_update" on media for update using (is_admin());
create policy "admin_delete" on media for delete using (is_admin());

create policy "public_read" on about_content for select using (true);
create policy "admin_update" on about_content for update using (is_admin());

create policy "public_read" on site_settings for select using (true);
create policy "admin_update" on site_settings for update using (is_admin());

create policy "self_or_admin_read" on admin_users for select using (auth.uid() = id or is_admin());
create policy "admin_update_roles" on admin_users for update using (
  exists (select 1 from admin_users au where au.id = auth.uid() and au.role = 'super_admin')
);

-- =========================================================================
-- STORAGE — run once. Creates the public bucket used by the app for all
-- uploaded images/videos (see STORAGE_BUCKET in src/lib/supabase.ts).
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('xonobod-media', 'xonobod-media', true)
on conflict (id) do nothing;

create policy "public_read_media_bucket" on storage.objects
  for select using (bucket_id = 'xonobod-media');

create policy "admin_upload_media_bucket" on storage.objects
  for insert with check (bucket_id = 'xonobod-media' and is_admin());

create policy "admin_delete_media_bucket" on storage.objects
  for delete using (bucket_id = 'xonobod-media' and is_admin());

-- =========================================================================
-- Seed the two required singleton rows so the app has something to read
-- immediately (About page + Site settings). Content tables are seeded
-- separately in seed.sql with demo data.
-- =========================================================================
insert into about_content (history_html, geography_html, nature_html, climate_html, culture_html, tourism_potential_html)
values ('', '', '', '', '', '');

insert into site_settings (site_name, tagline) values ('XONOBOD', 'Tabiat, hordiq va turizm maskani');
