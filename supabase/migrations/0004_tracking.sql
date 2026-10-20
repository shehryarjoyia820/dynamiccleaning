-- Open counts per email, and a starter proposal for "interested" contacts.

alter table public.email_sends add column if not exists open_count int not null default 0;

-- Called by the tracking pixel: counts every open, keeps the first-open time.
create or replace function public.track_open(send_id uuid) returns void
language sql security definer set search_path = public as $$
  update email_sends
     set open_count = open_count + 1,
         opened_at = coalesce(opened_at, now())
   where id = send_id;
$$;
revoke all on function public.track_open(uuid) from public, anon, authenticated;

insert into public.email_templates (id, name, kind, subject, body) values
  ('6f1b2a10-0000-4000-8000-000000000004',
   'Interested: priority scheduling offer',
   'proposal',
   '{{first_name}}, your priority Clean Truck Check slot is ready',
   E'Hi {{first_name}},\n\nThanks for your interest in Diesel Dynamix. Because you reached out, we''ve set aside **priority scheduling** for {{company}} this month.\n\n## What you get\n\n- A testing slot within days, not weeks\n- We come to your yard, so no trucks off the road\n- One visit for your whole fleet, OBD and smoke tests\n- Results explained in plain English, plus a reminder before your next deadline\n\nClean Truck Check deadlines don''t move, and testing slots fill up fast. Lock in your visit now and it''s one less thing to worry about.\n\nKameron\nDiesel Dynamix')
on conflict (id) do nothing;
