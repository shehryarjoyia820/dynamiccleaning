-- Owner request: the signature shows service@dieseldynamix.com (not info@). Runs once (tracked).

create table if not exists public.app_migrations (name text primary key, applied_at timestamptz not null default now());
alter table public.app_migrations enable row level security;

do $$ begin
  if exists (select 1 from public.app_migrations where name = '0014_signature_service_email') then return; end if;

  update public.email_templates
  set body = replace(body, E'Diesel Dynamix\n(858) 342-8328\ninfo@dieseldynamix.com', E'Diesel Dynamix\n(858) 342-8328\nservice@dieseldynamix.com')
  where body like E'%(858) 342-8328\ninfo@dieseldynamix.com%';

  insert into public.app_migrations (name) values ('0014_signature_service_email');
end $$;
