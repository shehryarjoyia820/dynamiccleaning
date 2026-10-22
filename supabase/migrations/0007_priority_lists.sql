-- Lead lists and priority tiers.
-- Priority by fleet size: 1 = one truck, 2 = up to 3, 3 = up to 10, 4 = more than 10.

alter table public.contacts add column if not exists priority smallint not null default 1;
alter table public.contacts add column if not exists trucks int;
alter table public.contacts add column if not exists list_name text not null default 'Website';
alter table public.contacts add column if not exists details jsonb not null default '{}'::jsonb;

do $$ begin
  alter table public.contacts add constraint contacts_priority_check check (priority between 1 and 4);
exception when duplicate_object then null; end $$;

create index if not exists contacts_list_priority_idx on public.contacts (list_name, priority, created_at desc);

create or replace function public.truck_priority(n int) returns smallint
language sql immutable as $$
  select case when n is null or n <= 1 then 1 when n <= 3 then 2 when n <= 10 then 3 else 4 end::smallint
$$;

-- Website contacts that came from a booking take the truck count from that booking.
update public.contacts c
set trucks = l.trucks, priority = public.truck_priority(l.trucks)
from public.leads l
where c.lead_id = l.id and l.trucks is not null and c.trucks is null;

-- Bulk import used by the admin uploader. New emails are inserted; existing ones keep their
-- status (an unsubscribe is never undone), gain the list tag, and get the newer fleet details.
create or replace function public.import_contacts(p_rows jsonb, p_list text, p_tag text)
returns table (inserted int, updated int)
language plpgsql security definer set search_path = public as $$
declare ins int := 0; upd int := 0;
begin
  with src as (
    select distinct on (lower(trim(r.email)))
      lower(trim(r.email)) as email, nullif(trim(r.name), '') as name, nullif(trim(r.company), '') as company,
      nullif(trim(r.phone), '') as phone, r.trucks, coalesce(r.details, '{}'::jsonb) as details
    from jsonb_to_recordset(p_rows) as r(email text, name text, company text, phone text, trucks int, details jsonb)
    where r.email ~* '^[^\s@]+@[^\s@]+\.[a-z]{2,}$'
    order by lower(trim(r.email)), r.trucks desc nulls last
  ), up as (
    insert into public.contacts as c (email, name, company, phone, source, tags, trucks, priority, list_name, details)
    select email, name, company, phone, 'import', array[p_tag], trucks, public.truck_priority(trucks), p_list, details from src
    on conflict (email) do update set
      name = coalesce(c.name, excluded.name),
      company = coalesce(c.company, excluded.company),
      phone = coalesce(c.phone, excluded.phone),
      tags = (select array_agg(distinct t) from unnest(c.tags || excluded.tags) t),
      trucks = greatest(c.trucks, excluded.trucks),
      priority = public.truck_priority(greatest(c.trucks, excluded.trucks)),
      list_name = case when c.source = 'import' then excluded.list_name else c.list_name end,
      details = c.details || excluded.details
    returning (xmax = 0) as is_new
  )
  select count(*) filter (where is_new), count(*) filter (where not is_new) into ins, upd from up;
  return query select ins, upd;
end $$;

revoke all on function public.import_contacts(jsonb, text, text) from public, anon, authenticated;
grant execute on function public.import_contacts(jsonb, text, text) to service_role;

-- Contact counts per list and priority, for the contacts page tabs.
create or replace function public.contact_counts()
returns table (list_name text, priority smallint, total bigint)
language sql stable security invoker set search_path = public as $$
  select list_name, priority, count(*) from public.contacts group by 1, 2
$$;

-- Picks up to p_limit subscribed contacts of one priority for a campaign, biggest fleets first.
-- With p_skip_emailed, contacts that already received any campaign email are left out,
-- so a list can be worked through in daily batches.
create or replace function public.pick_priority_contacts(p_priority int, p_limit int, p_lists text[], p_skip_emailed boolean)
returns setof public.contacts
language sql stable security invoker set search_path = public as $$
  select c.* from public.contacts c
  where c.status = 'subscribed'
    and c.priority = p_priority
    and (p_lists is null or cardinality(p_lists) = 0 or c.list_name = any (p_lists))
    and (not p_skip_emailed or not exists (select 1 from public.email_sends s where s.contact_id = c.id))
  order by c.trucks desc nulls last, c.created_at
  limit greatest(p_limit, 0)
$$;

-- How many contacts each priority still has to email (for the campaign form).
create or replace function public.priority_available(p_lists text[], p_skip_emailed boolean)
returns table (priority smallint, total bigint)
language sql stable security invoker set search_path = public as $$
  select c.priority, count(*) from public.contacts c
  where c.status = 'subscribed'
    and (p_lists is null or cardinality(p_lists) = 0 or c.list_name = any (p_lists))
    and (not p_skip_emailed or not exists (select 1 from public.email_sends s where s.contact_id = c.id))
  group by 1
$$;

grant execute on function public.truck_priority(int), public.contact_counts(), public.pick_priority_contacts(int, int, text[], boolean), public.priority_available(text[], boolean) to authenticated;
