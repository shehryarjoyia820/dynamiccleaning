-- "Only these cities": an automation can be limited to contacts in chosen cities (matched by
-- city name or ZIP). Separate from priority cities, which only change the order.

alter table public.automations add column if not exists only_cities text[] not null default '{}';
alter table public.automations add column if not exists only_zips text[] not null default '{}';

drop function if exists public.pick_priority_contacts(int, int, text[], boolean, text[], text[]);
drop function if exists public.pick_priority_contacts(int, int, text[], boolean);
create or replace function public.pick_priority_contacts(
  p_priority int, p_limit int, p_lists text[], p_skip_emailed boolean,
  p_cities text[] default '{}', p_zips text[] default '{}',
  p_only_cities text[] default '{}', p_only_zips text[] default '{}'
)
returns setof public.contacts
language sql stable security invoker set search_path = public as $$
  select c.* from public.contacts c
  where c.status = 'subscribed'
    and c.priority = p_priority
    and (p_lists is null or cardinality(p_lists) = 0 or c.list_name = any (p_lists))
    and (cardinality(p_only_cities) = 0 and cardinality(p_only_zips) = 0 or public.in_priority_area(c.details, p_only_cities, p_only_zips))
    and (not p_skip_emailed or not exists (select 1 from public.email_sends s where s.contact_id = c.id))
  order by public.in_priority_area(c.details, p_cities, p_zips) desc, c.trucks desc nulls last, c.created_at
  limit greatest(p_limit, 0)
$$;

drop function if exists public.priority_available(text[], boolean);
create or replace function public.priority_available(
  p_lists text[], p_skip_emailed boolean, p_only_cities text[] default '{}', p_only_zips text[] default '{}'
)
returns table (priority smallint, total bigint)
language sql stable security invoker set search_path = public as $$
  select c.priority, count(*) from public.contacts c
  where c.status = 'subscribed'
    and (p_lists is null or cardinality(p_lists) = 0 or c.list_name = any (p_lists))
    and (cardinality(p_only_cities) = 0 and cardinality(p_only_zips) = 0 or public.in_priority_area(c.details, p_only_cities, p_only_zips))
    and (not p_skip_emailed or not exists (select 1 from public.email_sends s where s.contact_id = c.id))
  group by 1
$$;

grant execute on function public.pick_priority_contacts(int, int, text[], boolean, text[], text[], text[], text[]),
  public.priority_available(text[], boolean, text[], text[]) to authenticated;
