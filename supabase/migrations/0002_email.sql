-- Email marketing: contacts, templates, campaigns with follow-ups, send queue.
-- Run after 0001_init.sql.

create extension if not exists citext;

-- ---------------------------------------------------------------------------
-- Contacts: everyone we may email (leads, newsletter subscribers, imports)
-- ---------------------------------------------------------------------------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  name text,
  company text,
  phone text,
  source text not null default 'import' check (source in ('lead', 'subscriber', 'import', 'manual')),
  tags text[] not null default '{}',
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed', 'bounced')),
  replied_at timestamptz,
  unsubscribed_at timestamptz,
  lead_id uuid references public.leads (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contacts_tags_idx on public.contacts using gin (tags);
create index if not exists contacts_created_idx on public.contacts (created_at desc);
drop trigger if exists contacts_touch on public.contacts;
create trigger contacts_touch before update on public.contacts for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Templates (proposals, follow-ups, newsletters)
-- ---------------------------------------------------------------------------
create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null default 'proposal' check (kind in ('proposal', 'follow_up', 'newsletter', 'other')),
  subject text not null,
  body text not null,
  attachment_path text,
  attachment_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists templates_touch on public.email_templates;
create trigger templates_touch before update on public.email_templates for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Campaigns: one template to an audience, plus up to 3 timed follow-ups
-- ---------------------------------------------------------------------------
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  template_id uuid not null references public.email_templates (id) on delete restrict,
  audience jsonb not null default '{}'::jsonb,
  followups jsonb not null default '[]'::jsonb, -- [{ "template_id": uuid, "delay_days": int }]
  status text not null default 'draft' check (status in ('draft', 'sending', 'paused', 'sent')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  started_at timestamptz
);

create table if not exists public.email_sends (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  template_id uuid not null references public.email_templates (id) on delete restrict,
  step int not null default 0,          -- 0 = first email, 1..3 = follow-ups
  delay_days int not null default 0,    -- follow-up delay after the first email is sent
  status text not null default 'queued' check (status in ('queued', 'sending', 'sent', 'failed', 'skipped', 'cancelled')),
  send_after timestamptz not null default now(),
  sent_at timestamptz,
  opened_at timestamptz,
  attempts int not null default 0,
  error text,
  created_at timestamptz not null default now(),
  unique (campaign_id, contact_id, step)
);
create index if not exists email_sends_due_idx on public.email_sends (status, send_after);
create index if not exists email_sends_campaign_idx on public.email_sends (campaign_id, step, status);
create index if not exists email_sends_contact_idx on public.email_sends (contact_id);

-- Atomically claims due messages so the cron job and the admin "send" button never double-send.
create or replace function public.claim_email_sends(batch int) returns setof public.email_sends
language plpgsql security definer set search_path = public as $$
begin
  -- Recover rows stuck in "sending" (e.g. a function timed out mid-batch).
  update email_sends set status = 'queued'
   where status = 'sending' and attempts < 3 and send_after < now() - interval '15 minutes';
  return query
  update email_sends s set status = 'sending', attempts = s.attempts + 1, send_after = now()
   where s.id in (
     select e.id from email_sends e
      join campaigns c on c.id = e.campaign_id
      where e.status = 'queued' and e.send_after <= now() and c.status = 'sending'
      order by e.send_after
      limit batch
      for update of e skip locked)
  returning s.*;
end $$;
revoke all on function public.claim_email_sends(int) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Editable email footer address (CAN-SPAM requires a postal address)
-- ---------------------------------------------------------------------------
alter table public.site_settings drop constraint if exists site_settings_key_check;
alter table public.site_settings add constraint site_settings_key_check
  check (key in ('requirements', 'frequency_text', 'counters', 'email_footer_address'));

-- ---------------------------------------------------------------------------
-- Row-level security: staff only (the server uses the service role for sending)
-- ---------------------------------------------------------------------------
alter table public.contacts enable row level security;
alter table public.email_templates enable row level security;
alter table public.campaigns enable row level security;
alter table public.email_sends enable row level security;

drop policy if exists contacts_staff on public.contacts;
create policy contacts_staff on public.contacts for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists templates_staff on public.email_templates;
create policy templates_staff on public.email_templates for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists campaigns_staff on public.campaigns;
create policy campaigns_staff on public.campaigns for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists sends_staff on public.email_sends;
create policy sends_staff on public.email_sends for all using (public.is_staff()) with check (public.is_staff());

-- Private bucket for proposal PDFs attached to templates.
insert into storage.buckets (id, name, public) values ('email-attachments', 'email-attachments', false)
on conflict (id) do nothing;
