/**
 * Default content. The live site reads these records from Supabase (editable
 * in /admin) and falls back to this file when the database is not configured
 * or unreachable. supabase/seed.sql loads the same records into the database.
 */

export type Region = 'Southern California' | 'Central Valley' | 'Bay Area & Northern California' | 'Central Coast';

// Diesel Dynamix serves Southern California only. Other regions stay in the type so old data still validates.
export const REGIONS: Region[] = ['Southern California'];

export type ServiceArea = {
  slug: string;
  name: string;
  region: Region;
  intro: string;
  lat: number;
  lng: number;
  sort: number;
};

export type Faq = { id: string; question: string; answer: string; category: string; sort: number };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published_at: string;
  /** Rich HTML from the visual/HTML editor; when set it is shown instead of the Markdown body. */
  body_html?: string | null;
  cover_url?: string | null;
  cover_alt?: string | null;
};

export type RequirementRow = { vehicle: string; method: string };

export type Counter = { value: number; suffix?: string; label: string };

export type Settings = {
  requirements: RequirementRow[];
  frequency_text: string;
  counters: Counter[];
  /** Postal address shown in every marketing email footer (required by US CAN-SPAM). */
  email_footer_address: string;
};

export const SERVICE_AREAS: ServiceArea[] = [
  {
    slug: 'san-diego',
    name: 'San Diego',
    region: 'Southern California',
    lat: 32.72,
    lng: -117.16,
    sort: 1,
    intro:
      'From Otay Mesa border traffic to Miramar distribution yards and North County contractors, San Diego trucks work hard. We bring Clean Truck Check testing to your yard, jobsite or terminal so your rigs stay compliant without a trip across the county.',
  },
  {
    slug: 'los-angeles',
    name: 'Los Angeles',
    region: 'Southern California',
    lat: 34.05,
    lng: -118.24,
    sort: 2,
    intro:
      'Port drayage, last-mile delivery and construction fleets keep Los Angeles moving. Our mobile testers meet you at your yard in the Harbor area, the Valley, the Gateway Cities or downtown, so testing fits around dispatch instead of the other way round.',
  },
  {
    slug: 'orange-county',
    name: 'Orange County',
    region: 'Southern California',
    lat: 33.75,
    lng: -117.87,
    sort: 3,
    intro:
      'Orange County carriers, contractors and service fleets can schedule on-site Clean Truck Check testing from Anaheim and Santa Ana to Irvine and the coast. One visit can cover every truck parked at your location.',
  },
  {
    slug: 'inland-empire',
    name: 'Inland Empire',
    region: 'Southern California',
    lat: 33.95,
    lng: -117.4,
    sort: 4,
    intro:
      'Riverside, San Bernardino, Ontario and Fontana sit at the heart of California warehousing. We test at distribution centers, truck yards and owner-operator lots across the Inland Empire, built around your loading schedule.',
  },
  {
    slug: 'el-centro',
    name: 'El Centro',
    region: 'Southern California',
    lat: 32.79,
    lng: -115.56,
    sort: 5,
    intro:
      'Agricultural haulers and cross-border carriers in El Centro, Calexico and Brawley can get Clean Truck Check testing on-site. We travel to the Imperial Valley so your trucks never have to leave the field or the yard.',
  },
  {
    slug: 'long-beach',
    name: 'Long Beach',
    region: 'Southern California',
    lat: 33.77,
    lng: -118.19,
    sort: 19,
    intro:
      'Long Beach runs on the port. Drayage tractors, transload yards along the 710 and local delivery fleets can book Clean Truck Check testing at the yard, so trucks keep pulling containers instead of waiting at a test site.',
  },
  {
    slug: 'riverside',
    name: 'Riverside',
    region: 'Southern California',
    lat: 33.98,
    lng: -117.38,
    sort: 20,
    intro:
      'From Riverside’s warehouses near March Air Reserve Base to construction fleets in Corona and Moreno Valley, we test trucks on-site across Riverside County with OBD, smoke opacity and visual inspections.',
  },
  {
    slug: 'san-bernardino',
    name: 'San Bernardino',
    region: 'Southern California',
    lat: 34.11,
    lng: -117.29,
    sort: 21,
    intro:
      'San Bernardino’s rail yards, I-215 distribution centers and Cajon Pass carriers move freight nonstop. Our mobile testers come to your San Bernardino or Rialto yard so Clean Truck Check fits around your loads.',
  },
  {
    slug: 'ontario',
    name: 'Ontario',
    region: 'Southern California',
    lat: 34.06,
    lng: -117.65,
    sort: 22,
    intro:
      'Ontario sits at the center of the Inland Empire logistics belt, near ONT airport cargo and the I-10/I-15 interchange. We bring Clean Truck Check testing to Ontario, Chino and Rancho Cucamonga yards on your schedule.',
  },
  {
    slug: 'fontana',
    name: 'Fontana',
    region: 'Southern California',
    lat: 34.09,
    lng: -117.44,
    sort: 23,
    intro:
      'Fontana is home to some of the busiest truck yards and truck stops in California. Owner-operators and fleets parked in Fontana, Bloomington and Rialto can have their trucks tested where they park.',
  },
];

export const FAQS: Faq[] = [
  {
    id: 'what-is-ctc',
    category: 'Program',
    sort: 1,
    question: 'What is Clean Truck Check?',
    answer:
      'Clean Truck Check is the California Air Resources Board (CARB) inspection and maintenance program for heavy-duty vehicles. It requires periodic emissions testing of covered diesel and alternative-fuel trucks so that emissions-control systems are kept working and repaired.',
  },
  {
    id: 'who-must-test',
    category: 'Program',
    sort: 2,
    question: 'Which trucks need Clean Truck Check?',
    answer:
      'Most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California are covered, including out-of-state and Mexico-registered trucks that drive in the state. Some exemptions exist. Check your vehicle in CARB’s CTC-VIS system or ask us and we will help you work it out.',
  },
  {
    id: 'how-often',
    category: 'Program',
    sort: 3,
    question: 'How often do trucks need Clean Truck Check?',
    answer:
      'Most covered trucks currently test twice a year. Under the original rule, OBD-equipped vehicles move to four tests a year starting October 1, 2027, and a bill has proposed reducing testing to once a year. Requirements can change, so always confirm your deadlines in CARB’s CTC-VIS system.',
  },
  {
    id: 'mobile',
    category: 'Our service',
    sort: 4,
    question: 'Can Clean Truck Check be done at my yard?',
    answer:
      'Yes. Diesel Dynamix is a mobile testing service. We come to your yard, jobsite, terminal or parking location anywhere in Southern California, so you never drive to a test center.',
  },
  {
    id: 'how-long',
    category: 'Our service',
    sort: 5,
    question: 'How long does a test take?',
    answer:
      'An OBD test is typically quick once we are connected to the truck. Smoke opacity tests take longer because the engine must be warmed up. For fleets, we plan the visit so trucks rotate through without holding up dispatch.',
  },
  {
    id: 'what-ready',
    category: 'Our service',
    sort: 6,
    question: 'What do I need to have ready?',
    answer:
      'The truck’s VIN, access to the vehicle and keys, and a safe level place to park. For smoke opacity testing the engine should be able to reach normal operating temperature. We will confirm everything when we schedule.',
  },
  {
    id: 'fleet',
    category: 'Fleets',
    sort: 7,
    question: 'Can you test my whole fleet in one visit?',
    answer:
      'Yes. Tell us how many trucks you run and where they are parked. We schedule fleet visits to test as many trucks as possible per trip and can set up recurring testing so you never miss a deadline.',
  },
  {
    id: 'carb',
    category: 'Program',
    sort: 8,
    question: 'Are you part of CARB?',
    answer:
      'No. Diesel Dynamix is an independent testing service. CARB runs the Clean Truck Check program; we provide mobile testing so you can meet its requirements. For official rules and deadlines, see CARB’s Clean Truck Check website.',
  },
  {
    id: 'fail',
    category: 'Our service',
    sort: 9,
    question: 'What happens if my truck does not pass?',
    answer:
      'We explain the result and what it means in plain English. Your truck will need repairs to its emissions-control system before it can pass a retest. We can schedule the retest once repairs are done.',
  },
  {
    id: 'out-of-state',
    category: 'Program',
    sort: 10,
    question: 'Does Clean Truck Check apply to out-of-state trucks?',
    answer:
      'Yes. Trucks over 14,000 lb GVWR that are registered in other states or in Mexico are covered when they operate in California. They must be reported in CTC-VIS and keep their testing up to date. We test out-of-state trucks anywhere in Southern California.',
  },
  {
    id: 'cost',
    category: 'Program',
    sort: 11,
    question: 'How much does Clean Truck Check cost in California?',
    answer:
      'There are two parts: CARB’s annual compliance fee per vehicle, paid in CTC-VIS, and the tester’s fee for each test. Our price depends on the number of trucks, the test type and the location, with per-truck pricing for fleets. Call or WhatsApp (858) 342-8328 for a quote.',
  },
  {
    id: 'missed-deadline',
    category: 'Program',
    sort: 12,
    question: 'What happens if I miss my Clean Truck Check deadline?',
    answer:
      'The truck becomes non-compliant. California-registered vehicles can face a DMV registration hold, and non-compliant trucks can be cited and penalized by CARB. Get tested as soon as possible: we can often schedule a mobile test quickly.',
  },
  {
    id: 'pass-smoke',
    category: 'Our service',
    sort: 13,
    question: 'How do I pass the CARB smoke test?',
    answer:
      'Warm the engine to full operating temperature, fix exhaust leaks and engine faults, keep air filters and injectors in good shape, and make sure any diesel particulate filter is present and working. Well-maintained trucks usually pass.',
  },
];

export const POSTS: Post[] = [
  {
    slug: 'clean-truck-check-basics',
    title: 'Clean Truck Check: what California truck owners need to know',
    excerpt:
      'A plain-English overview of CARB’s heavy-duty inspection program: who it covers, which test your truck needs and how to stay ahead of deadlines.',
    published_at: '2026-10-20',
    body: `California’s Clean Truck Check program requires periodic emissions testing for most heavy-duty diesel and alternative-fuel vehicles that operate in the state.

## Who is covered

Most vehicles over 14,000 lb GVWR are covered, including trucks registered outside California that drive in the state.

## Which test does my truck need?

- 2013 and newer diesel engines with OBD use a CARB-verified OBD test.
- 2012 and older diesel engines without OBD use a smoke opacity test plus a visual inspection.
- 2018 and newer alternative-fuel engines with OBD use a CARB-verified OBD test.
- 2017 and older alternative-fuel engines without OBD need a visual inspection.

## Staying ahead of deadlines

Testing frequency is set by CARB and can change. Always check your own deadlines in CARB’s CTC-VIS system, and book early so testing fits your schedule.`,
  },
  {
    slug: 'how-often-do-trucks-need-clean-truck-check',
    title: 'How often do trucks need Clean Truck Check?',
    excerpt:
      'Most covered trucks test twice a year today, with quarterly testing for OBD trucks scheduled from October 2027. Here is what that means for your fleet.',
    published_at: '2026-10-20',
    body: `**Short answer:** most trucks covered by Clean Truck Check currently test **twice a year**. Under the original rule, OBD-equipped trucks move to **four tests a year (quarterly) starting October 1, 2027**. A bill has proposed reducing testing to once a year, so always confirm your schedule in CARB’s CTC-VIS system.

## Why the testing frequency matters

Each truck has its own deadlines in CTC-VIS. Missing one makes the truck non-compliant, which can lead to a DMV registration hold for California-registered vehicles and penalties from CARB.

## Planning for Clean Truck Check 2027 quarterly testing

If quarterly testing takes effect, an OBD fleet will need roughly twice as many tests per year. A few ways to stay ahead:

- Group trucks by deadline so one visit covers several of them.
- Book recurring testing instead of scheduling truck by truck.
- Keep check-engine and emissions faults fixed between tests, so trucks pass the first time.

## How Diesel Dynamix helps

We bring mobile testing to your yard and can set up a recurring schedule for your whole fleet. See [fleet testing](/fleet-testing) or [book a test](/book).

Official program details: [CARB Clean Truck Check](https://ww2.arb.ca.gov/our-work/programs/CTC).`,
  },
  {
    slug: 'clean-truck-check-out-of-state-trucks',
    title: 'Does Clean Truck Check apply to out-of-state trucks?',
    excerpt:
      'Yes. Out-of-state and Mexico-registered trucks over 14,000 lbs GVWR that drive in California are covered. Here is what carriers need to do.',
    published_at: '2026-10-20',
    body: `**Short answer: yes.** Clean Truck Check covers most diesel and alternative-fuel trucks over 14,000 lbs GVWR that operate in California, no matter where they are registered. That includes trucks from other states and from Mexico.

## What out-of-state carriers need to do

- Report each truck that operates in California in CARB’s CTC-VIS system and pay the annual compliance fee.
- Pass the required emissions tests on schedule: an OBD test for newer engines, or a smoke opacity test plus visual inspection for older non-OBD diesels.
- Keep proof of compliance current, because CARB enforces the program at the roadside and at facilities like ports.

## Getting tested in Southern California

Long-haul drivers don’t have time for a detour to a test site. Diesel Dynamix tests trucks on-site anywhere in Southern California: at a yard, a customer’s dock or near the [Port of Long Beach](/ports/port-of-long-beach) and the [Port of Los Angeles](/ports/port-of-los-angeles).

Call or WhatsApp **(858) 342-8328** to arrange a test on your next California run.`,
  },
  {
    slug: 'how-much-does-clean-truck-check-cost-california',
    title: 'How much does Clean Truck Check cost in California?',
    excerpt:
      'Clean Truck Check costs come in two parts: CARB’s annual compliance fee and the testing fee. Here is how to budget for both.',
    published_at: '2026-10-20',
    body: `**Short answer:** Clean Truck Check has two costs: **CARB’s annual compliance fee** for each vehicle, paid in CTC-VIS, and the **testing fee** charged by the credentialed tester for each test. The exact CARB fee is set by CARB and shown in CTC-VIS.

## What affects the testing price

- **Test type.** OBD tests are usually faster than smoke opacity tests, which need a warm engine and a visual inspection.
- **Number of trucks.** Fleets tested in one visit usually get a better per-truck price.
- **Location.** Mobile testing saves you the driver’s time, fuel and a lost day of work, which often costs more than the test itself.

## The hidden cost: downtime

Driving a truck to a test site can take half a day or more. Testing on-site at your yard keeps the truck earning. See [mobile CARB testing](/mobile-testing-services).

## Get a quote

Tell us how many trucks you have and where they are, and we will quote the visit. [Book online](/book) or call **(858) 342-8328**.`,
  },
  {
    slug: 'how-to-pass-carb-smoke-test',
    title: 'How to pass the CARB smoke test',
    excerpt:
      'Practical steps to help older diesel trucks pass the Clean Truck Check smoke opacity test the first time.',
    published_at: '2026-10-20',
    body: `**Short answer:** warm the engine fully, fix known engine and exhaust problems first, and make sure the emissions-control parts (especially any diesel particulate filter) are present and working. Well-maintained trucks usually pass.

## 1. Warm the engine

A cold engine smokes more. Drive or idle the truck until it reaches normal operating temperature before the test.

## 2. Fix the usual causes of smoke

- Worn or leaking injectors
- A dirty air filter or restricted intake
- Turbocharger problems
- Exhaust leaks upstream of the sensor

## 3. Check the particulate filter

If your truck has a DPF, it must be installed, intact and not overdue for cleaning. A cracked or plugged filter is a common reason for failure.

## 4. Pass the visual inspection

The smoke test comes with a visual inspection of emissions-control components. Missing, disconnected or tampered parts will fail the truck even if the smoke reading is fine.

## If the truck fails

We explain the result in plain English. Repair the problem, then we retest on-site. Learn more about the [smoke opacity test](/smoke-opacity-test).`,
  },
  {
    slug: 'can-clean-truck-check-be-done-at-my-yard',
    title: 'Can Clean Truck Check be done at my yard?',
    excerpt:
      'Yes. Mobile Clean Truck Check testing comes to your yard, jobsite or terminal. Here is how an on-site visit works.',
    published_at: '2026-10-20',
    body: `**Short answer: yes.** Clean Truck Check tests can be performed on-site by a mobile tester. Diesel Dynamix comes to your yard, jobsite, terminal or parking location anywhere in Southern California.

## How an on-site visit works

1. You tell us how many trucks, which engine types and where they are parked.
2. We confirm a time window that fits your dispatch.
3. Our tester arrives and runs the right test for each truck: OBD, smoke opacity or visual inspection.
4. Results are submitted and we explain next steps for every truck.

## What we need on site

- The VIN, keys and cab access for each truck
- A safe, level spot to work
- For smoke tests, engines that can reach operating temperature

## Why fleets prefer mobile testing

No drivers off the road, no fuel burned driving to a test site, and one visit covers the whole yard. See [how testing works](/how-testing-works) or [book mobile testing](/book).`,
  },
  {
    slug: 'missed-clean-truck-check-deadline',
    title: 'What happens if I miss my Clean Truck Check deadline?',
    excerpt:
      'Missing a Clean Truck Check deadline makes a truck non-compliant. Here are the consequences and how to get back on track fast.',
    published_at: '2026-10-20',
    body: `**Short answer:** the truck becomes **non-compliant**. California-registered vehicles can face a **DMV registration hold**, and non-compliant trucks can be **cited and penalized** by CARB. The fix is to get tested as soon as possible.

## Consequences of a missed deadline

- **DMV registration hold.** The California DMV can hold registration renewal for non-compliant vehicles.
- **Citations and penalties.** CARB enforces the program and can issue citations. Amounts are set by CARB and can change.
- **Problems with customers.** Shippers, brokers and ports increasingly check compliance status.

## How to get back on track

1. Check the truck’s status and deadline in CARB’s CTC-VIS system.
2. Make sure the vehicle is reported and the annual fee is paid.
3. Book a test right away. We can often schedule a [mobile test](/mobile-testing-services) quickly, at your location.

## Avoid it next time

Set up recurring testing so every truck is tested before its window closes. See [fleet testing](/fleet-testing).

Official information: [CARB Clean Truck Check](https://ww2.arb.ca.gov/our-work/programs/CTC).`,
  },
];

export const SETTINGS: Settings = {
  requirements: [
    { vehicle: '2013+ diesel engines with OBD', method: 'CARB-verified OBD test' },
    { vehicle: '2012 and older diesel without OBD', method: 'Smoke opacity test + visual inspection' },
    { vehicle: '2018+ alternative-fuel engines with OBD', method: 'CARB-verified OBD test' },
    { vehicle: '2017 and older alternative-fuel without OBD', method: 'Visual inspection' },
  ],
  frequency_text:
    'Most covered trucks (over 14,000 lb GVWR, including out-of-state trucks driving in California) currently test twice a year. Under the original rule, OBD-equipped vehicles move to four tests per year from October 1, 2027. A bill has proposed cutting testing to once a year, so requirements may change. Always check your own deadlines in CARB’s CTC-VIS system.',
  // Only facts, never unverified business stats. Add "trucks tested" in /admin once verified.
  counters: [
    { value: 6, label: 'Southern California counties covered' },
    { value: 10, label: 'Cities with local service pages' },
    { value: 2, label: 'Major ports served' },
  ],
  email_footer_address: '',
};

/** Starter email templates (editable in /admin → Email templates). */
export const EMAIL_TEMPLATES = [
  {
    id: '6f1b2a10-0000-4000-8000-000000000001',
    name: 'Proposal: mobile Clean Truck Check testing',
    kind: 'proposal',
    subject: 'Mobile Clean Truck Check testing for {{company}}',
    body: `Hi {{first_name}},

I’m reaching out from Diesel Dynamix. We provide **mobile CARB Clean Truck Check testing** anywhere in Southern California, so your trucks get tested at your yard instead of losing a day at a shop.

## What we offer

- On-site OBD testing, smoke opacity testing and visual inspections
- One truck or an entire fleet in a single visit
- Scheduling built around your dispatch, including early mornings
- Plain-English results and help planning any retests

Clean Truck Check deadlines apply to most trucks over 14,000 lb GVWR that drive in California, including out-of-state trucks. We can help {{company}} stay ahead of them.

Would you like a quote? Just reply with how many trucks you run and where they are parked, or call/WhatsApp **(858) 342-8328**.

Best regards,
Kameron
Diesel Dynamix
[dieseldynamix.com](https://dieseldynamix.com)`,
  },
  {
    id: '6f1b2a10-0000-4000-8000-000000000002',
    name: 'Follow-up 1: quick check-in',
    kind: 'follow_up',
    subject: 'Re: Mobile Clean Truck Check testing for {{company}}',
    body: `Hi {{first_name}},

Just following up on my note about mobile Clean Truck Check testing. If your next testing window is coming up, we can usually schedule an on-site visit quickly.

Reply with your truck count and location and I’ll send a quote, or call/WhatsApp **(858) 342-8328**.

Thanks,
Kameron
Diesel Dynamix`,
  },
  {
    id: '6f1b2a10-0000-4000-8000-000000000003',
    name: 'Follow-up 2: last note',
    kind: 'follow_up',
    subject: 'Should I close your file, {{first_name}}?',
    body: `Hi {{first_name}},

I haven’t heard back, so I’ll assume the timing isn’t right. If anything changes, we’re here whenever {{company}} needs Clean Truck Check testing, anywhere in Southern California.

You can book online any time at [dieseldynamix.com/book](https://dieseldynamix.com/book) or call **(858) 342-8328**.

All the best,
Kameron
Diesel Dynamix`,
  },
];
