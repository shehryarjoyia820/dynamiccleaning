-- Campaign history survives contact deletion: each send keeps a copy of who it went to,
-- and deleting a contact detaches (instead of deletes) their sends.

alter table public.email_sends add column if not exists recipient_email text;
alter table public.email_sends add column if not exists recipient_name text;

update public.email_sends s
set recipient_email = c.email, recipient_name = c.name
from public.contacts c
where c.id = s.contact_id and s.recipient_email is null;

alter table public.email_sends alter column contact_id drop not null;
alter table public.email_sends drop constraint if exists email_sends_contact_id_fkey;
alter table public.email_sends
  add constraint email_sends_contact_id_fkey
  foreign key (contact_id) references public.contacts (id) on delete set null;

-- Mail still waiting for a deleted contact is cancelled, not sent.
create or replace function public.cancel_sends_for_deleted_contact() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.email_sends
  set status = 'cancelled', error = 'Contact deleted'
  where contact_id = old.id and status in ('queued', 'sending');
  return old;
end $$;

drop trigger if exists contacts_cancel_sends on public.contacts;
create trigger contacts_cancel_sends before delete on public.contacts
for each row execute function public.cancel_sends_for_deleted_contact();

-- One row of totals per campaign for the campaigns list (respects the caller's RLS).
create or replace view public.campaign_stats with (security_invoker = true) as
select
  campaign_id,
  count(*) filter (where step = 0) as recipients,
  count(*) filter (where status = 'sent') as sent,
  count(*) filter (where status in ('queued', 'sending')) as waiting,
  count(*) filter (where status = 'failed') as failed,
  count(distinct coalesce(contact_id::text, recipient_email)) filter (where opened_at is not null) as opened,
  coalesce(sum(open_count), 0)::int as total_opens,
  max(sent_at) as last_sent_at
from public.email_sends
group by campaign_id;

grant select on public.campaign_stats to authenticated;
