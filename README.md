# Diesel Dynamix website

Fast, animated, mobile-first website for **Diesel Dynamix**, a mobile CARB Clean Truck Check testing company serving Southern California.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Supabase (Postgres, auth with 2FA) · SMTP email (Nodemailer) with proposals, follow-ups and subscribers · Embla carousel · deployed on Vercel.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you have; the site runs without any keys
npm run dev                  # http://localhost:3000
```

Without Supabase keys the public site uses the built-in content in `src/content/seed.ts`. The booking form then shows a "please call" message instead of silently dropping leads, and `/admin` shows setup instructions. Production setup is in [DEPLOYMENT.md](DEPLOYMENT.md).

## What's included

| Area | Where |
| --- | --- |
| Brand mark, logo variants, brand guide | `src/components/brand.tsx`, `public/brand/*.svg`, `/brand` (noindex) |
| Hero slider (Ken Burns, fade, autoplay with pause on hover, swipe, arrows/dots) | `src/components/home/hero-slider.tsx` |
| Hero illustrations (used until real photos arrive) | `src/components/home/scenes.tsx` |
| Scroll reveals, step tracker, counters | `src/components/client-effects.tsx`, `src/components/home/interactive.tsx` |
| Animated California map | `src/components/california-map.tsx` |
| Sticky mobile bar, WhatsApp button, booking modal | `src/components/contact-bars.tsx`, `src/components/booking-context.tsx` |
| Booking and contact forms | `src/components/forms.tsx` → `src/app/api/leads/route.ts` |
| Pages | `src/app/(site)/**` |
| Admin dashboard (leads, notes, assignment, CSV export, content editing, team) | `src/app/admin/**` |
| Email system: contacts, CSV upload, templates, proposals + automatic follow-ups, unsubscribe | `src/lib/campaigns.ts`, `src/app/admin/(panel)/email-actions.ts`, `src/app/api/cron/email` |
| SEO/AEO keyword map | `SEO.md`, `src/app/llms.txt` |
| Database schema and seed | `supabase/migrations/0001_init.sql`, `supabase/seed.sql` |
| SEO: metadata, JSON-LD, sitemap, robots, OG image | `src/components/seo.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx` |

## Editing content

Staff edit FAQs, service-area cities, blog posts, the testing requirements table, the testing-frequency text and homepage counters at **`/admin`**. Changes go live within seconds.

When you change `src/content/seed.ts`, run `npm run seed:sql` to regenerate `supabase/seed.sql`.

## Adding real photos

- **Hero:** add WebP/AVIF images (under 200 KB) to `public/hero/` and set `image` and `alt` on each slide in `hero-slider.tsx`.
- **Gallery:** add images to `public/gallery/` and list them in `PHOTOS` in `src/app/(site)/gallery/page.tsx`.

## Compliance guardrails built in

- Independent-provider disclaimer in every page footer, plus links to official CARB pages.
- Counters show only verifiable facts; there are no credentials, testimonials or guarantees until the client verifies them.
- WCAG AA contrast (dark text on orange buttons, darker orange and green for text on light backgrounds), visible focus rings, keyboard navigation and alt text.
- `prefers-reduced-motion` turns off autoplay and motion.
- Consent checkbox and privacy link on every form; GA4 loads only after cookie consent.
