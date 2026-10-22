-- City of each recipient, kept on the send so the record still shows it if the contact is deleted.
-- Known ZIPs give the clean city name (imported lists often misspell it).

alter table public.email_sends add column if not exists recipient_city text;

create or replace function public.contact_city(d jsonb) returns text
language sql immutable as $$
  select case left(coalesce(d->>'ZIP', d->>'Zip', d->>'zip', ''), 5)
    when '91758' then 'Ontario' when '91761' then 'Ontario' when '91762' then 'Ontario' when '91764' then 'Ontario'
    when '92334' then 'Fontana' when '92335' then 'Fontana' when '92336' then 'Fontana' when '92337' then 'Fontana'
    when '91701' then 'Rancho Cucamonga' when '91729' then 'Rancho Cucamonga' when '91730' then 'Rancho Cucamonga'
    when '91737' then 'Rancho Cucamonga' when '91739' then 'Rancho Cucamonga'
    when '92376' then 'Rialto' when '92377' then 'Rialto'
    else nullif(initcap(trim(coalesce(d->>'City', d->>'city', ''))), '')
  end
$$;

update public.email_sends s
set recipient_city = public.contact_city(c.details)
from public.contacts c
where c.id = s.contact_id and s.recipient_city is null;

grant execute on function public.contact_city(jsonb) to authenticated;
