# Deployment

## 1. Supabase (database + admin login)

1. Create a project at [supabase.com](https://supabase.com) (region: US West).
2. **SQL Editor:** run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`.
3. **Authentication → Providers → Email:** keep enabled. Turn **off** "Allow new users to sign up" (staff are invited only).
4. **Authentication → Multi-Factor:** make sure TOTP is enabled.
5. **Authentication → URL Configuration:** set Site URL to `https://dieseldynamix.com` and add `https://dieseldynamix.com/admin/**` (and `http://localhost:3000/admin/**` for local work) to Redirect URLs.
6. **Create the first admin.** Go to Authentication → Users → Add user (email + password), then run this in the SQL editor with that user's ID:
   ```sql
   insert into public.profiles (id, full_name, role) values ('<user-uuid>', 'Kameron', 'admin');
   ```
7. Copy the Project URL, anon key and service-role key into the environment variables below.

The first time an admin signs in at `/admin/login`, they scan a QR code to set up an authenticator app. After that, every sign-in needs a 6-digit code. More staff can be invited from **/admin → Team**.

## 2. Email (Resend)

1. Create an account at [resend.com](https://resend.com) and add the domain `dieseldynamix.com`.
2. Add the SPF/DKIM DNS records Resend shows, and wait for "Verified".
3. Create an API key and set `RESEND_API_KEY`.

Bookings are emailed to `SERVICE_INBOX` and contact messages to `INFO_INBOX`. Each customer gets an automatic confirmation with the phone and WhatsApp number.

## 3. Spam protection (Cloudflare Turnstile)

Create a Turnstile widget for `dieseldynamix.com` and set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. The honeypot field and rate limiting (5 submissions per 10 minutes per visitor) are always on.

## 4. Vercel

1. Import the GitHub repository in Vercel (framework: Next.js; build command and output are the defaults).
2. Add every variable from `.env.example` under Project → Settings → Environment Variables.
3. Add the domain `dieseldynamix.com` (and `www`) under Project → Domains, then update DNS as Vercel instructs. SSL is automatic.

## 5. Analytics and search

- **GA4:** create a property, set `NEXT_PUBLIC_GA_ID`, then mark `generate_lead`, `call_click`, `whatsapp_click` and `email_click` as key events (conversions).
- **Search Console:** verify the domain and submit `https://dieseldynamix.com/sitemap.xml`.
- **Google Business Profile:** link it to the website.

## Before launch (client to verify)

- [ ] WhatsApp Business is active on (858) 342-8328
- [ ] Test types offered match Diesel Dynamix's CARB credentials and equipment (`/mobile-testing-services`)
- [ ] Regulatory text and testing frequency reviewed (`/admin → Regulatory text`)
- [ ] Privacy Policy and Terms reviewed by legal counsel
- [ ] Real photos added (hero and gallery), and the logo approved or replaced with final designer files
- [ ] Test booking reaches the Service@ inbox, the admin dashboard and the customer confirmation
- [ ] Lighthouse mobile 90+ on Home, Book and one service-area page
