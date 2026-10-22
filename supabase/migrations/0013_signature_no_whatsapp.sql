-- Owner request: no "Chat on WhatsApp" button in emails (the booking page covers it), and one
-- signature everywhere: Regards, name, company, phone, email. Runs once (tracked).

create table if not exists public.app_migrations (name text primary key, applied_at timestamptz not null default now());
alter table public.app_migrations enable row level security;

do $$ begin
  if exists (select 1 from public.app_migrations where name = '0013_signature_no_whatsapp') then return; end if;

  update public.email_templates
  set body = regexp_replace(
        regexp_replace(body, '\n*\{\{\s*whatsapp_button\s*\}\}\n*', E'\n\n', 'g'),
        '((Best regards|Kind regards|Regards|regards|Thanks|Thank you|All the best|Best|Cheers|Sincerely),\n)?Kameron\nDiesel Dynamix(\n\(858\) 342-8328)?(\n\[dieseldynamix\.com\]\(https://dieseldynamix\.com\))?(\n(info|service)@dieseldynamix\.com)?',
        E'Regards,\nKameron\nDiesel Dynamix\n(858) 342-8328\nservice@dieseldynamix.com',
        'g')
  where body ~ 'whatsapp_button' or body ~ 'Kameron\nDiesel Dynamix';

  -- Tidy the end of each body (no trailing blank lines).
  update public.email_templates set body = regexp_replace(body, '\s+$', '') where body ~ '\s+$';

  insert into public.app_migrations (name) values ('0013_signature_no_whatsapp');
end $$;
