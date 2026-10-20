-- Diesel Dynamix schema: leads + editable site content.
-- Run in the Supabase SQL editor (or `supabase db push`), then run supabase/seed.sql.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Staff profiles. A row here is what makes an auth user "staff".
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- True only for staff who completed two-factor sign-in (AAL2) in this session.
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid())
     and coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2';
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
     and coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2';
$$;

-- Lets a signed-in user (AAL1, before 2FA) check whether they are staff at all.
create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  kind text not null check (kind in ('booking', 'contact')),
  status text not null default 'new' check (status in ('new', 'contacted', 'scheduled', 'completed', 'closed')),
  full_name text not null,
  company text,
  phone text,
  email text not null,
  trucks int,
  location text,
  engine_type text check (engine_type in ('obd', 'non_obd', 'mixed', 'not_sure')),
  preferred_date date,
  notes text,
  message text,
  source_page text,
  ip_hash text,
  assigned_to uuid references public.profiles (id) on delete set null,
  appointment_at timestamptz
);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_ip_idx on public.leads (ip_hash, created_at);

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists lead_notes_lead_idx on public.lead_notes (lead_id, created_at);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Editable content
-- ---------------------------------------------------------------------------
create table if not exists public.faqs (
  id text primary key default gen_random_uuid()::text,
  question text not null,
  answer text not null,
  category text not null default 'General',
  sort int not null default 100,
  published boolean not null default true
);

create table if not exists public.service_areas (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  region text not null check (region in ('Southern California', 'Central Valley', 'Bay Area & Northern California', 'Central Coast')),
  intro text not null,
  lat double precision not null check (lat between 32 and 42.1),
  lng double precision not null check (lng between -124.5 and -114),
  sort int not null default 100,
  published boolean not null default true
);

create table if not exists public.posts (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  published_at date not null default current_date,
  published boolean not null default false
);

create table if not exists public.site_settings (
  key text primary key check (key in ('requirements', 'frequency_text', 'counters')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.faqs enable row level security;
alter table public.service_areas enable row level security;
alter table public.posts enable row level security;
alter table public.site_settings enable row level security;

-- Profiles: staff can see the team (for assignment); only admins change roles.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select using (public.is_staff());
drop policy if exists profiles_admin on public.profiles;
create policy profiles_admin on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- Leads: inserted only by the server (service role). Staff read and update; admins delete.
drop policy if exists leads_staff_read on public.leads;
create policy leads_staff_read on public.leads for select using (public.is_staff());
drop policy if exists leads_staff_update on public.leads;
create policy leads_staff_update on public.leads for update using (public.is_staff()) with check (public.is_staff());
drop policy if exists leads_admin_delete on public.leads;
create policy leads_admin_delete on public.leads for delete using (public.is_admin());

drop policy if exists notes_staff_read on public.lead_notes;
create policy notes_staff_read on public.lead_notes for select using (public.is_staff());
drop policy if exists notes_staff_insert on public.lead_notes;
create policy notes_staff_insert on public.lead_notes for insert with check (public.is_staff() and author_id = auth.uid());

-- Content: public reads published rows; staff manage everything.
drop policy if exists faqs_public on public.faqs;
create policy faqs_public on public.faqs for select using (published or public.is_staff());
drop policy if exists faqs_staff on public.faqs;
create policy faqs_staff on public.faqs for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists areas_public on public.service_areas;
create policy areas_public on public.service_areas for select using (published or public.is_staff());
drop policy if exists areas_staff on public.service_areas;
create policy areas_staff on public.service_areas for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists posts_public on public.posts;
create policy posts_public on public.posts for select using (published or public.is_staff());
drop policy if exists posts_staff on public.posts;
create policy posts_staff on public.posts for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists settings_public on public.site_settings;
create policy settings_public on public.site_settings for select using (true);
drop policy if exists settings_staff on public.site_settings;
create policy settings_staff on public.site_settings for all using (public.is_staff()) with check (public.is_staff());

grant execute on function public.is_staff(), public.is_admin(), public.my_role() to authenticated, anon;
