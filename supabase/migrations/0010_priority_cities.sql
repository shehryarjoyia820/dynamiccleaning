-- Priority cities: inside each priority tier, contacts in these cities (matched by city
-- name or ZIP, since imported city names are often misspelled) are emailed first.

alter table public.automations add column if not exists priority_cities text[] not null default '{}';
alter table public.automations add column if not exists priority_zips text[] not null default '{}';

-- Existing automations (including one already running) get the Inland Empire focus.
update public.automations
set priority_cities = array['Ontario', 'Fontana', 'Rancho Cucamonga', 'Rialto'],
    priority_zips = array['91758', '91761', '91762', '91764', '92334', '92335', '92336', '92337',
                          '91701', '91729', '91730', '91737', '91739', '92376', '92377']
where cardinality(priority_cities) = 0;

create or replace function public.in_priority_area(d jsonb, p_cities text[], p_zips text[]) returns boolean
language sql immutable as $$
  select (cardinality(p_zips) > 0 and left(coalesce(d->>'ZIP', d->>'Zip', d->>'zip', ''), 5) = any (p_zips))
      or (cardinality(p_cities) > 0 and lower(trim(coalesce(d->>'City', d->>'city', ''))) = any (select lower(c) from unnest(p_cities) c))
$$;

drop function if exists public.pick_priority_contacts(int, int, text[], boolean);
create or replace function public.pick_priority_contacts(
  p_priority int, p_limit int, p_lists text[], p_skip_emailed boolean,
  p_cities text[] default '{}', p_zips text[] default '{}'
)
returns setof public.contacts
language sql stable security invoker set search_path = public as $$
  select c.* from public.contacts c
  where c.status = 'subscribed'
    and c.priority = p_priority
    and (p_lists is null or cardinality(p_lists) = 0 or c.list_name = any (p_lists))
    and (not p_skip_emailed or not exists (select 1 from public.email_sends s where s.contact_id = c.id))
  order by public.in_priority_area(c.details, p_cities, p_zips) desc, c.trucks desc nulls last, c.created_at
  limit greatest(p_limit, 0)
$$;

-- Not-yet-emailed contacts per priority inside the priority cities (for the dashboard).
create or replace function public.priority_area_available(p_lists text[], p_cities text[], p_zips text[])
returns table (priority smallint, total bigint)
language sql stable security invoker set search_path = public as $$
  select c.priority, count(*) from public.contacts c
  where c.status = 'subscribed'
    and (p_lists is null or cardinality(p_lists) = 0 or c.list_name = any (p_lists))
    and public.in_priority_area(c.details, p_cities, p_zips)
    and not exists (select 1 from public.email_sends s where s.contact_id = c.id)
  group by 1
$$;

grant execute on function public.in_priority_area(jsonb, text[], text[]),
  public.pick_priority_contacts(int, int, text[], boolean, text[], text[]),
  public.priority_area_available(text[], text[], text[]) to authenticated;
