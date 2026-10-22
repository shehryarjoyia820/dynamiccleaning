-- Always-on email automation: daily sends per priority inside a California time window.
-- Each automation records its emails in one campaign, so Campaigns shows its full history.

alter table public.campaigns add column if not exists automation boolean not null default false;
alter table public.email_sends add column if not exists priority smallint;
create index if not exists email_sends_campaign_created_idx on public.email_sends (campaign_id, created_at);

create table if not exists public.automations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lists text[] not null default '{}',
  -- [{ "priority": 1, "enabled": true, "start": "19:00", "end": "21:00", "daily": 20,
  --    "proposal": uuid, "follow_up": uuid, "follow_up_days": 3 }]
  tiers jsonb not null,
  status text not null default 'running' check (status in ('running', 'stopped')),
  campaign_id uuid references public.campaigns (id) on delete set null,
  last_run_at timestamptz,
  last_run jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  started_at timestamptz not null default now(),
  stopped_at timestamptz
);

alter table public.automations enable row level security;
drop policy if exists automations_staff on public.automations;
create policy automations_staff on public.automations for all using (public.is_staff()) with check (public.is_staff());

-- Sends per California day and priority, for the automation's history table.
create or replace function public.campaign_daily(p_campaign uuid)
returns table (day date, priority smallint, picked bigint, sent bigint, opened bigint, follow_ups bigint)
language sql stable security invoker set search_path = public as $$
  select (s.created_at at time zone 'America/Los_Angeles')::date as day,
         coalesce(s.priority, 0)::smallint,
         count(*) filter (where s.step = 0),
         count(*) filter (where s.step = 0 and s.status = 'sent'),
         count(*) filter (where s.step = 0 and s.opened_at is not null),
         count(*) filter (where s.step > 0)
  from public.email_sends s
  where s.campaign_id = p_campaign
  group by 1, 2
  order by 1 desc, 2
$$;
grant execute on function public.campaign_daily(uuid) to authenticated;
