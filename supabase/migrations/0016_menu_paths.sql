-- Pages moved under their menu section (Oct 2026). Old addresses redirect (next.config.mjs);
-- this points links inside blog posts and FAQ answers straight at the new ones. Runs once (tracked).

create table if not exists public.app_migrations (name text primary key, applied_at timestamptz not null default now());
alter table public.app_migrations enable row level security;

create or replace function pg_temp.newpaths(t text) returns text language sql immutable as $$
  select regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(regexp_replace(t,
    '(\(|href="|dieseldynamix\.com)/mobile-testing-services(?=[)"#?/\s]|$)', '\1/services', 'g'),
    '(\(|href="|dieseldynamix\.com)/obd-testing(?=[)"#?/\s]|$)', '\1/services/obd-testing', 'g'),
    '(\(|href="|dieseldynamix\.com)/smoke-opacity-test(?=[)"#?/\s]|$)', '\1/services/smoke-opacity-test', 'g'),
    '(\(|href="|dieseldynamix\.com)/how-testing-works(?=[)"#?/\s]|$)', '\1/services/how-testing-works', 'g'),
    '(\(|href="|dieseldynamix\.com)/fleet-testing(?=[)"#?/\s]|$)', '\1/services/fleet-testing', 'g'),
    '(\(|href="|dieseldynamix\.com)/why-california-enforces-it(?=[)"#?/\s]|$)', '\1/clean-truck-check/why-california-enforces-it', 'g'),
    '(\(|href="|dieseldynamix\.com)/faq(?=[)"#?/\s]|$)', '\1/clean-truck-check/faq', 'g'),
    '(\(|href="|dieseldynamix\.com)/ports/', '\1/service-areas/ports/', 'g')
$$;

do $$ begin
  if exists (select 1 from public.app_migrations where name = '0016_menu_paths') then return; end if;
  update public.posts set body = pg_temp.newpaths(body) where body <> pg_temp.newpaths(body);
  update public.posts set body_html = pg_temp.newpaths(body_html) where body_html is not null and body_html <> pg_temp.newpaths(body_html);
  update public.faqs set answer = pg_temp.newpaths(answer) where answer <> pg_temp.newpaths(answer);
  update public.service_areas set intro = pg_temp.newpaths(intro) where intro <> pg_temp.newpaths(intro);
  insert into public.app_migrations (name) values ('0016_menu_paths');
end $$;
