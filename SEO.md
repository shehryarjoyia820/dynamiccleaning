# SEO and AEO keyword map (Southern California)

**Service area: Southern California only** (Los Angeles, Orange, Riverside, San Bernardino, San Diego and Imperial counties). Program keywords such as "Clean Truck Check California" are still targeted, because that is how people search, but every service claim says Southern California.

Placement rule from the brief: each page targets 1–2 main keywords, which go in the title tag, H1, URL and first paragraph. City pages use unique local text.

| Page | URL | Main keywords | Also covers |
| --- | --- | --- | --- |
| Home | `/` | Clean Truck Check California, CARB Clean Truck Check | mobile Clean Truck Check California, California Clean Truck Check testing, CARB emissions testing California, heavy duty truck emissions testing California, Clean Truck Check near me |
| Mobile Testing Services | `/mobile-testing-services` | mobile CARB testing California, on-site Clean Truck Check | mobile truck emissions testing, mobile smoke test California, mobile OBD testing for trucks, Clean Truck Check at your location, mobile diesel emissions testing California |
| CARB OBD Test | `/obd-testing` | CARB OBD test California, Clean Truck Check OBD test | mobile OBD testing for trucks, alternative fuel truck emissions test California |
| Smoke Opacity Test | `/smoke-opacity-test` | smoke opacity test California, diesel smoke test California | truck smoke opacity testing, mobile smoke test California, non-OBD truck testing California, how to pass CARB smoke test |
| Clean Truck Check Explained | `/clean-truck-check` | what is Clean Truck Check, Clean Truck Check requirements | Clean Truck Check deadline, Clean Truck Check 2027 quarterly testing, CTC-VIS registration, Clean Truck Check out-of-state trucks, Clean Truck Check fines / penalties, Clean Truck Check 14,000 lbs GVWR, DMV registration hold Clean Truck Check, CARB compliance for trucks California |
| Why California Enforces It | `/why-california-enforces-it` | California truck emissions regulations | CARB compliance for trucks California |
| Fleet Testing | `/fleet-testing` | fleet Clean Truck Check testing, CARB compliance for fleets | fleet emissions testing California, fleet OBD testing California, owner-operator Clean Truck Check |
| How Testing Works | `/how-testing-works` | mobile Clean Truck Check (how it works) | HowTo structured data |
| Service Areas | `/service-areas` | Clean Truck Check near me | all cities and ports |
| City pages (10) | `/service-areas/[city]` | Clean Truck Check [city] | mobile CARB testing [city], smoke test [city] (H2s), city FAQ |
| Port pages (2) | `/ports/port-of-long-beach`, `/ports/port-of-los-angeles` | Clean Truck Check Port of … | drayage, out-of-state trucks |
| FAQ | `/faq` | Clean Truck Check FAQ | every long-tail question below |

## Cities

Los Angeles, Long Beach, Orange County, Inland Empire, Riverside, San Bernardino, Ontario, Fontana, San Diego, El Centro (Imperial Valley).

Pages for cities outside Southern California were removed and now redirect to `/service-areas`. Add more Southern California cities (for example Santa Ana, Anaheim, Carson, Compton, Pomona, Chula Vista, Oceanside, Temecula, Victorville) at **/admin → Service areas** at **/admin → Service areas**. Write unique local intro text for each one.

## Long-tail questions (blog + FAQ, answer-first for AEO)

| Question | Blog post | Also in |
| --- | --- | --- |
| How often do trucks need Clean Truck Check | `/blog/how-often-do-trucks-need-clean-truck-check` | FAQ |
| Does Clean Truck Check apply to out-of-state trucks | `/blog/clean-truck-check-out-of-state-trucks` | FAQ, Explained |
| How much does Clean Truck Check cost in California | `/blog/how-much-does-clean-truck-check-cost-california` | FAQ |
| How to pass CARB smoke test | `/blog/how-to-pass-carb-smoke-test` | FAQ, Smoke page |
| Can Clean Truck Check be done at my yard | `/blog/can-clean-truck-check-be-done-at-my-yard` | FAQ, every city page |
| What happens if I miss my Clean Truck Check deadline | `/blog/missed-clean-truck-check-deadline` | FAQ, Explained |

## AEO (answer engines: Google AI Overviews, ChatGPT, Perplexity)

- "Quick answer" boxes give a direct 1–3 sentence answer near the top of key pages.
- Every blog post opens with a bold **short answer**.
- Structured data: AutomotiveBusiness (statewide areaServed), Service (per city/port), FAQPage, HowTo, BlogPosting, BreadcrumbList.
- `/llms.txt` gives a plain-text summary of the business, test methods, pages, cities and FAQs.
- `robots.txt` allows all crawlers, including AI crawlers, on public pages.

## Still to do (needs the client)

- Verify keyword volumes in Google Keyword Planner or Ahrefs and adjust titles if needed.
- Google Business Profile with service area "California", plus reviews from real customers.
- Real photos with descriptive alt text (for example "Diesel Dynamix technician performing OBD test on a semi truck in Fresno").
- Publish a new blog post every 2–4 weeks (CARB updates, deadline reminders).

## Keyword content (October 2026)

- `docs/seo-keywords-socal.json`: 1,079 Southern California keywords in 43 clusters (volume band, intent, difficulty and target page), researched with Claude Fable. Volumes are estimates, not tool data.
- `src/content/page-seo.json`: per-page titles, descriptions, extra sections, FAQs and nearby areas written from those clusters. `pageMeta()` uses the title/description; `<SeoExtras>` renders the sections, nearby-area links and FAQs (merged into the page's FAQPage schema when it already has one).
- 14 keyword guides and the Rancho Cucamonga and Rialto city pages are added by migration 0017 (and mirrored in `seed.ts`).
- Pages follow the menu: `/services/...`, `/clean-truck-check/...`, `/service-areas/ports/...`; old addresses 301 in `next.config.mjs`.
