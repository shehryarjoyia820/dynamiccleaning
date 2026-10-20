# Deployment

The site is deployed on Vercel from the `main` branch of this repository. Every push to `main` redeploys it.

## 1. Supabase (database + admin login)

1. Create a project at [supabase.com](https://supabase.com) (region: US West). Alternatively, in Vercel go to **Storage → Create → Supabase**, which adds the keys to the project automatically.
2. The database tables are created automatically by `/admin/setup` (below). To do it by hand instead, run `supabase/migrations/0001_init.sql`, `0002_email.sql` and `supabase/seed.sql` in the Supabase SQL Editor.
3. **Authentication → Providers → Email:** keep enabled. Turn **off** "Allow new users to sign up" (staff are invited only).
4. **Authentication → URL Configuration:** set the Site URL to the live site URL and add `<site>/admin/**` (and `http://localhost:3000/admin/**` for local work) to Redirect URLs.
5. **Authentication → Emails → SMTP Settings:** enter the same SMTP details as below, so login and invite emails come from your domain (Supabase's built-in sender only allows a few emails per hour).
6. If you created Supabase outside Vercel, put the Project URL, anon key, service-role key and `POSTGRES_URL_NON_POOLING` into the Vercel environment variables.

### Create the first admin (email + password)

1. In Vercel, set `ADMIN_EMAIL` (the admin login email) and `ADMIN_SETUP_TOKEN` (a long random code), then redeploy.
2. Open **`/admin/setup`** and enter the setup code (Vercel → Settings → Environment Variables → `ADMIN_SETUP_TOKEN`, click the eye icon).
3. One click creates the database tables and starter content (from `supabase/`, via the `POSTGRES_URL_NON_POOLING` the Supabase integration adds) and the admin account, then signs you in to choose your password. No email is needed.
4. From then on, sign in at **`/admin/login`** with email + password.
5. Forgot the password? Open `/admin/setup` again with the setup code to sign in and set a new one. Delete `ADMIN_SETUP_TOKEN` in Vercel to switch this off. Invite more staff from **/admin → Team**.

## 2. Email (SMTP)

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `EMAIL_FROM` in Vercel. Any provider works (Google Workspace, Microsoft 365, Zoho, SendGrid, Postmark, Amazon SES and others).

- Add the SPF and DKIM records your provider gives you to the `dieseldynamix.com` DNS, plus a DMARC record. Without them, proposals land in spam.
- `EMAIL_DAILY_LIMIT` caps marketing sends per 24 hours (default 400). Keep it under your provider's limit; for example, Google Workspace allows about 2,000 per day.
- `UNSUBSCRIBE_SECRET` and `CRON_SECRET` should be long random strings.
- If `SMTP_HOST` is empty, `RESEND_API_KEY` is used instead.

### What the email system does

- **Leads:** bookings and contact messages go to `SERVICE_INBOX` (service@dieseldynamix.com), and each customer gets a confirmation. Everyone who submits a form becomes a contact.
- **Subscribers:** the newsletter form (footer and blog) adds contacts tagged `newsletter`, with a welcome email.
- **Proposals:** at **/admin → Contacts → Upload emails**, import a CSV or paste a list and give it a tag. Write proposals and follow-ups at **/admin → Email templates** (PDF attachments are supported). Send from **/admin → Send proposals**: pick the tag, add up to 3 follow-ups (for example 3, 7 and 14 days), and send. You can also send to a single lead from the lead page.
- **Follow-ups** go out automatically once a day (Vercel Cron, 9 AM Pacific). They skip anyone who replied (mark the contact "replied"), unsubscribed, or whose lead is Scheduled, Completed or Closed.
- **Compliance:** every marketing email has an unsubscribe link, a one-click unsubscribe header and your postal address. Sending is blocked until you set the address at **/admin → Settings → Email footer address** (required by US CAN-SPAM).

## 3. Spam protection (Cloudflare Turnstile)

Create a Turnstile widget for the domain and set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. The honeypot field and rate limiting (5 submissions per 10 minutes per visitor) are always on.

## 4. Domain

Add `dieseldynamix.com` (and `www`) under Vercel → Project → Domains, update DNS as Vercel instructs (if the domain is with Squarespace, add the records under Squarespace → Domains → DNS), then set `NEXT_PUBLIC_SITE_URL=https://dieseldynamix.com` and redeploy. SSL is automatic.

## 5. SEO, AEO and analytics

- **Search Console:** verify the domain and submit `/sitemap.xml`.
- **GA4:** set `NEXT_PUBLIC_GA_ID`, then mark `generate_lead`, `call_click`, `whatsapp_click`, `email_click` and `subscribe` as key events.
- **Google Business Profile:** link it to the website, with "service area: Southern California" (LA, Orange, Riverside, San Bernardino, San Diego and Imperial counties).
- **AEO:** `/llms.txt` summarises the business for AI assistants. Pages carry FAQPage, HowTo, Service and BreadcrumbList structured data plus "Quick answer" boxes.
- The California keyword plan from the brief is mapped page by page in `SEO.md`. Verify search volumes in Google Keyword Planner or Ahrefs.

## Before launch (client to verify)

- [ ] WhatsApp Business is active on (858) 342-8328
- [ ] Test types offered match Diesel Dynamix's CARB credentials and equipment (`/mobile-testing-services`, `/obd-testing`, `/smoke-opacity-test`)
- [ ] Regulatory text and testing frequency reviewed (`/admin → Settings & regulatory text`)
- [ ] Postal address set for email footers
- [ ] Privacy Policy and Terms reviewed by legal counsel
- [ ] Real photos added (hero and gallery)
- [ ] Test booking reaches the Service@ inbox, the admin dashboard and the customer confirmation
- [ ] Test proposal sent to yourself from **Email templates → Send test to me**
- [ ] Lighthouse mobile 90+ on Home, Book and one service-area page
