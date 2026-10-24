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
  {
    slug: 'rancho-cucamonga',
    name: "Rancho Cucamonga",
    region: 'Southern California',
    lat: 34.11,
    lng: -117.59,
    sort: 24,
    intro: "Rancho Cucamonga's warehouses south of Foothill Boulevard and its yards near the I-15 and the 210 keep a lot of trucks moving. We bring Clean Truck Check testing to your Rancho Cucamonga, Etiwanda or Alta Loma location, so trucks get tested where they park.",
  },
  {
    slug: 'rialto',
    name: "Rialto",
    region: 'Southern California',
    lat: 34.11,
    lng: -117.37,
    sort: 25,
    intro: "Rialto sits between the 210 and the I-10, with distribution centers, truck yards and owner-operator lots on both sides of town. We bring Clean Truck Check testing to Rialto and neighboring Bloomington, Colton and Fontana, so your trucks get tested without leaving the yard.",
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

We bring mobile testing to your yard and can set up a recurring schedule for your whole fleet. See [fleet testing](/services/fleet-testing) or [book a test](/book).

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

Long-haul drivers don’t have time for a detour to a test site. Diesel Dynamix tests trucks on-site anywhere in Southern California: at a yard, a customer’s dock or near the [Port of Long Beach](/service-areas/ports/port-of-long-beach) and the [Port of Los Angeles](/service-areas/ports/port-of-los-angeles).

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

Driving a truck to a test site can take half a day or more. Testing on-site at your yard keeps the truck earning. See [mobile CARB testing](/services).

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

We explain the result in plain English. Repair the problem, then we retest on-site. Learn more about the [smoke opacity test](/services/smoke-opacity-test).`,
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

No drivers off the road, no fuel burned driving to a test site, and one visit covers the whole yard. See [how testing works](/services/how-testing-works) or [book mobile testing](/book).`,
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
3. Book a test right away. We can often schedule a [mobile test](/services) quickly, at your location.

## Avoid it next time

Set up recurring testing so every truck is tested before its window closes. See [fleet testing](/services/fleet-testing).

Official information: [CARB Clean Truck Check](https://ww2.arb.ca.gov/our-work/programs/CTC).`,
  },
  {
    slug: 'ctc-vis-registration-guide',
    title: "CTC-VIS registration: how to register your truck",
    excerpt: "A plain-English CTC-VIS registration guide: set up your account, add each truck, pay CARB's fee and check compliance status before a deadline sneaks up.",
    published_at: '2026-10-24',
    body: "**Short answer:** CTC-VIS registration means reporting each covered truck in CARB's Clean Truck Check Vehicle Inspection System and paying CARB's annual compliance fee for it. After that, a credentialed tester submits passing test results, and you check the truck's compliance status and deadlines in your CTC-VIS account.\n\n## What CTC-VIS is and why you need it\n\nCTC-VIS is the online system CARB uses to run the Clean Truck Check program. It is where owners report vehicles, pay the compliance fee and see each truck's status. If a covered truck is not reported there, it cannot show as compliant, even if it passes a test.\n\nMost diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California need to be in CTC-VIS. That includes trucks registered in other states and other countries. Buses, refuse trucks, construction and agricultural vehicles and motorhomes over 14,000 lb can be covered too, so check CARB's rules for your vehicle if you are not sure.\n\nOne thing to know up front: CTC-VIS belongs to CARB. Diesel Dynamix is an independent testing service, not CARB or a government agency. We can walk you through it, but your account is yours.\n\n## How to register a truck in Clean Truck Check, step by step\n\nThe clean truck check registration process comes down to a few steps. Screens and wording change over time, so follow the prompts in the portal itself.\n\n1. **Open the Clean Truck Check portal.** Start from [CARB's Clean Truck Check page](https://ww2.arb.ca.gov/our-work/programs/CTC), which links to CTC-VIS and CARB's own instructions.\n2. **Set up your CTC-VIS account.** Use the business or owner name that matches your vehicle records, and an email address you actually check. Deadline notices and account messages go there.\n3. **Add each vehicle.** Enter the VIN and the other vehicle details CTC-VIS asks for. Double-check the VIN character by character. A single wrong digit causes problems later when test results try to match the truck.\n4. **Pay the annual compliance fee.** CARB charges this fee per vehicle, and the amount is shown in CTC-VIS. More on that in our [compliance fee guide](/blog/clean-truck-check-compliance-fee-explained).\n5. **Get each truck tested.** A credentialed tester runs the right test and submits the result to CARB.\n6. **Check the status.** Log back in and confirm each truck shows compliant, and note the next due date.\n\n### Setting up a CTC-VIS fleet account\n\nIf you run more than one truck, put them all under one CTC-VIS account so you can see every VIN in one place. Keep a simple list outside the portal too: VIN, unit number, engine model year, test type and next due date. That list makes it easy to group trucks by deadline and test several in one visit. See [fleet testing](/services/fleet-testing) for how we handle multi-truck yards.\n\n### CTC-VIS registration for out-of-state trucks\n\nOut-of-state and international trucks that operate in California are covered, and they register in CTC-VIS the same way. Report the truck, pay the fee and keep its tests current. Our post on [out-of-state trucks](/blog/clean-truck-check-out-of-state-trucks) covers the details.\n\n## How to pay the Clean Truck Check fee in CTC-VIS\n\nCTC-VIS fee payment happens inside your account. The compliance fee is annual and per vehicle, and CARB sets the amount. We do not quote it here because CARB can change it. Your account shows what is owed for each truck.\n\nKeep in mind that this fee is separate from the testing fee your tester charges. Paying one does not cover the other.\n\n## Test submission and checking your compliance status\n\nYou do not upload test results yourself. The credentialed tester submits them after the test. Once a passing result is on record, the fee is paid and the truck is reported, CTC-VIS can show the truck as compliant.\n\nTo run a clean truck check status lookup, log in and open the vehicle by VIN. This is also where you check your deadlines. Most covered trucks currently test twice a year, and the schedule can change, so trust what CTC-VIS shows for your truck over any general rule. See [how often trucks need testing](/blog/how-often-do-trucks-need-clean-truck-check).\n\n### Finding your compliance certificate\n\nProof of compliance lives in CTC-VIS. If you need a CTC-VIS compliance certificate for a customer, a broker or your own records, look in the vehicle's record in your account. If you cannot find it, contact CARB's Clean Truck Check help through the CARB site.\n\n## When CTC-VIS is not working or your test is missing\n\nMost \"CTC-VIS not working\" problems come down to a few things:\n\n- **VIN mismatch.** The VIN in your account does not match the VIN the truck reports. Fix the vehicle record or have a repair shop check the engine computer.\n- **Vehicle not reported.** The test happened, but the truck was never added to the account.\n- **Fee not paid.** A truck with an unpaid fee will not show as compliant.\n- **Login or account access.** Password and account issues go to CARB, since they run the system.\n\nIf a test still does not show, ask your tester to confirm it was submitted. Our [failed Clean Truck Check guide](/blog/failed-clean-truck-check-what-to-do) covers VIN mismatches and rejected results in more depth.\n\n## Clean Truck Check reporting requirements and deadlines\n\nReport every covered vehicle, keep the annual fee paid and pass each test before its deadline. That is the whole job. Registration deadlines and test deadlines are set by CARB for each vehicle, so check CTC-VIS or CARB for the exact dates that apply to you. Missing them can lead to a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check) for California-registered trucks, plus CARB citations and penalties.\n\nIf something about your truck changes, such as ownership, plates or whether it still operates in California, update the vehicle info in CTC-VIS so your records stay accurate.\n\n## How Diesel Dynamix helps\n\nWe test trucks on site across Southern California, at your yard, jobsite, terminal, port or home. If you need clean truck check registration help in Southern California, we answer CTC-VIS questions, explain results in plain English and give you each truck's next due date. Fleets get reminders, recurring visits and records per truck and VIN.\n\n- [How testing works](/services/how-testing-works)\n- [CARB OBD testing](/services/obd-testing) and [smoke opacity testing](/services/smoke-opacity-test)\n- [Clean Truck Check FAQ](/clean-truck-check/faq)\n\nReady to test? [Book online](/book), or call, text or WhatsApp **(858) 342-8328**.",
  },
  {
    slug: 'clean-truck-check-compliance-fee-explained',
    title: "Clean Truck Check compliance fee, explained",
    excerpt: "What the Clean Truck Check compliance fee is, who pays it, when it's due and why it's separate from your test cost. Avoid a surprise DMV hold.",
    published_at: '2026-10-24',
    body: "**Short answer:** the Clean Truck Check compliance fee is an annual, per-vehicle fee that owners pay to CARB in the CTC-VIS system. CARB sets the amount and shows it in CTC-VIS. It is separate from the testing fee, which your tester charges for each test.\n\n## What the Clean Truck Check compliance fee is\n\nEvery covered vehicle in the Clean Truck Check program carries an annual compliance fee. You pay it to CARB, not to a tester, and you pay it inside CTC-VIS when you report the vehicle.\n\nThe fee applies to most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California. That includes trucks, and also buses, refuse trucks, construction and agricultural vehicles and motorhomes over 14,000 lb where they fall under the program. If you are not sure your vehicle is covered, check CARB's rules for your vehicle.\n\n## How much is the fee?\n\nThe amount is set by CARB and shown in CTC-VIS. We do not state an amount here because CARB sets it and can change it, and an old number is worse than no number. Log in to CTC-VIS or check [CARB's Clean Truck Check page](https://ww2.arb.ca.gov/our-work/programs/CTC) for the current clean truck check fee per vehicle.\n\nWhat we can say for certain:\n\n- It is charged **per vehicle**, not per fleet.\n- It is charged **annually**.\n- It is paid **to CARB in CTC-VIS**.\n\n## Compliance fee vs test cost\n\nThese are two different payments, and mixing them up is one of the most common Clean Truck Check mistakes.\n\n**The compliance fee:**\n\n- Is paid to CARB\n- Is paid inside CTC-VIS\n- Is due once a year for each vehicle\n- Has an amount set by CARB\n\n**The testing fee:**\n\n- Is paid to your credentialed tester\n- Is paid directly to the tester, not through CTC-VIS\n- Is due each time the truck is tested\n- Has an amount set by the tester\n\nPaying the compliance fee does not test your truck. Passing a test does not pay the fee. A truck needs both to be compliant, plus it must be reported in CTC-VIS.\n\nOur testing price depends on how many trucks you have, the test type and your location, with per-truck pricing for fleets. For the full budgeting picture, see [how much Clean Truck Check costs](/blog/how-much-does-clean-truck-check-cost-california).\n\n## When is the Clean Truck Check fee due?\n\nThe fee is due annually for each vehicle. The exact due date for your truck is set by CARB and shown in CTC-VIS, so check your account rather than guessing. The simplest habit is to pay the fee when you first report a truck and then renew it each year before its date comes around.\n\n### Do I pay the Clean Truck Check fee every year?\n\nYes. The compliance fee is annual. As long as a covered vehicle operates in California, plan on paying it every year for that vehicle.\n\n## What happens if the fee is not paid?\n\nA truck with an unpaid fee is not compliant, even if it has passed its emissions test. For California-registered vehicles, non-compliance can lead to a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check). CARB can also issue citations and penalties for non-compliant vehicles.\n\nIf you got a DMV notice and your truck already passed its test, an unpaid fee is one of the first things to check in CTC-VIS.\n\n## Do out-of-state trucks pay the fee?\n\nYes. Out-of-state and international trucks that operate in California are covered by Clean Truck Check. They are reported in CTC-VIS and pay the annual compliance fee per vehicle, the same as California trucks. See our post on [out-of-state trucks](/blog/clean-truck-check-out-of-state-trucks).\n\n## Budgeting the fee for a fleet\n\nBecause the fee is per vehicle, a fleet's total grows with every truck you report. A few habits keep it from becoming a surprise:\n\n- **Count only covered vehicles.** Trucks under 14,000 lb GVWR are generally not part of the program. For edge cases, check CARB's rules for your vehicle.\n- **Report new trucks as soon as they start operating in California,** so the fee and the first test are not forgotten.\n- **Update CTC-VIS when a truck is sold or stops operating in California,** so your records match your real fleet.\n- **Plan the fee and the tests together.** Most covered trucks currently test twice a year, so a year of compliance for one truck usually means one fee plus the tests CARB requires.\n\n## Invoices and refunds\n\nThe compliance fee is paid through CTC-VIS, so records of that payment live in your CTC-VIS account. Keep a copy with your other records for each truck.\n\nQuestions about a CARB compliance fee invoice, a duplicate charge or a clean truck check fee refund go to CARB, because CARB collects the fee. A tester cannot issue refunds for CARB's fee.\n\n## A simple fee checklist for owners and fleets\n\n1. Report every covered vehicle in CTC-VIS. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) walks through it.\n2. Pay the annual compliance fee for each vehicle.\n3. Note each truck's fee date and test deadlines in one list, by VIN.\n4. Book testing early so trucks pass before their window closes.\n5. After each test, confirm in CTC-VIS that the truck shows compliant.\n\n## How Diesel Dynamix helps\n\nWe are an independent testing service, not CARB, so we do not collect the compliance fee. What we do is make the testing side easy. We test on site at your yard, jobsite, terminal, port or home across Southern California, explain results in plain English, help with CTC-VIS questions and give you the next due date for each truck. Fleets get reminders, recurring visits and records per VIN.\n\n- [Our services](/services)\n- [Fleet testing](/services/fleet-testing)\n- [Clean Truck Check requirements](/clean-truck-check)\n\n[Book a test](/book), or call, text or WhatsApp **(858) 342-8328** for a quote.",
  },
  {
    slug: 'dmv-registration-hold-clean-truck-check',
    title: "Clean Truck Check DMV registration hold: how to clear it",
    excerpt: "Got a DMV registration hold for CARB Clean Truck Check? Learn why it happens, what clears it and how to get your truck tested fast in Southern California.",
    published_at: '2026-10-24',
    body: "**Short answer:** a DMV registration hold for Clean Truck Check means CARB's records show your California-registered truck is not compliant. To clear it, make sure the truck is reported in CTC-VIS, the annual compliance fee is paid and a passing test is on record. Then check CTC-VIS until the truck shows compliant.\n\n## Why the DMV says CARB compliance is required for your truck\n\nThe California DMV can hold registration renewal for vehicles that are not compliant with Clean Truck Check. If your renewal notice or the DMV counter says CARB compliance is required, the DMV is not judging your truck itself. It is reflecting what CARB's system shows.\n\nA CARB hold on registration usually traces back to one of these:\n\n- **No passing test on record** for the current period, often from a [missed deadline](/blog/missed-clean-truck-check-deadline).\n- **The truck is not reported** in CTC-VIS.\n- **The annual compliance fee is unpaid.** See the [compliance fee guide](/blog/clean-truck-check-compliance-fee-explained).\n- **A test that did not match the truck,** for example because of a VIN mismatch between the vehicle record and the engine computer.\n- **A failed test** that has not been followed by a repair and a passing retest.\n\nThe program covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR. If you believe your vehicle should not be covered, check CARB's rules for your vehicle before you spend money on testing.\n\n## How to remove a DMV hold for Clean Truck Check\n\nClearing the hold is a compliance problem, not a DMV problem. Work through it in this order.\n\n1. **Log in to CTC-VIS** and find the truck by VIN. If you do not have an account yet, start with our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide).\n2. **Confirm the truck is reported** and the VIN in the record is exactly right.\n3. **Pay any outstanding compliance fee** for that vehicle.\n4. **Look at the test status.** If there is no passing test for the current period, book one right away.\n5. **If the truck has a known problem,** such as a check engine light or emissions fault, get it repaired first so it can pass. Our posts on [failed tests](/blog/failed-clean-truck-check-what-to-do) and [readiness monitors](/blog/readiness-monitors-check-engine-light-clean-truck-check) explain what to look for.\n6. **After the passing test,** check CTC-VIS again and confirm the truck shows compliant.\n\nOnce CARB's records show the truck as compliant, renew your registration with the DMV as usual.\n\n## How long until the hold clears after a passed test?\n\nCARB and the DMV control how quickly records update, and we cannot promise a release time. Allow time for the passing result and status to show in CTC-VIS. If the truck shows compliant in CTC-VIS and the DMV still shows a hold, contact CARB's Clean Truck Check help through [CARB's Clean Truck Check page](https://ww2.arb.ca.gov/our-work/programs/CTC).\n\nThe practical lesson: do not wait until the week your registration expires. Test early, so there is room for a repair and retest if one is needed.\n\n## Can you renew registration while the hold is pending?\n\nThat decision belongs to the DMV and CARB. Check with them about your specific situation. In most cases, the fastest route back to a normal renewal is getting the truck compliant in CTC-VIS as soon as possible.\n\nKeep in mind that a registration problem is not the only risk. Non-compliant trucks can also receive CARB citations and penalties.\n\n## Can a mobile tester clear my DMV hold?\n\nA mobile tester can run the test that gets you compliant, but the hold itself is released through CARB's and the DMV's systems. What a tester does is:\n\n- Run the right test for your truck: a CARB-verified OBD test for 2013 and newer diesel and 2018 and newer alternative-fuel engines, or a smoke opacity test plus visual inspection for 2012 and older diesel without OBD.\n- Submit the result to CARB.\n- Explain the result, including what to fix if the truck fails.\n\nComing to you matters when a truck is under a hold. You do not need to drive across town to a test site, and the truck can be tested where it is parked.\n\n## DMV holds in Los Angeles, the Inland Empire and beyond\n\nWe see registration hold questions all over Southern California, from yards near the [Port of Los Angeles](/service-areas/ports/port-of-los-angeles) and [Long Beach](/service-areas/long-beach) to warehouses in [Ontario](/service-areas/ontario), [Fontana](/service-areas/fontana) and across the [Inland Empire](/service-areas/inland-empire). We also test in [San Diego](/service-areas/san-diego), [Orange County](/service-areas/orange-county) and [El Centro](/service-areas/el-centro). The fix is the same everywhere: report, pay, pass and confirm.\n\n## What to have ready when you book\n\nGetting a truck tested fast is easier when you have the basics on hand:\n\n- The VIN, and the plate if you have it\n- The engine model year, so we know which test the truck needs\n- Where the truck is parked, plus keys and cab access\n- Any warning lights or known problems, so you can decide whether a repair should come first\n\n## How to avoid the next hold\n\n- Keep every truck's due dates in one place, by VIN.\n- Pay the compliance fee each year without waiting for a reminder.\n- Fix check engine lights and emissions faults between tests.\n- Book testing early in each window.\n- For fleets, set up recurring visits so no truck slips through.\n\n## How Diesel Dynamix helps\n\nWe are an independent testing service, not CARB or the DMV. We test on site at your yard, jobsite, terminal, port or home, help with CTC-VIS questions, explain results in plain English and give you the next due date. Fleets get reminders, recurring visits, early-morning visits and records per truck.\n\n- [Mobile testing services](/services)\n- [Fleet testing](/services/fleet-testing)\n- [Service areas](/service-areas)\n\nNeed a test to clear a hold? [Book online](/book), or call, text or WhatsApp **(858) 342-8328**.",
  },
  {
    slug: 'failed-clean-truck-check-what-to-do',
    title: "Failed Clean Truck Check? What to do next",
    excerpt: "Failed Clean Truck Check? Learn the common causes of OBD and smoke test failures, VIN mismatches and no-communication errors, and how to retest.",
    published_at: '2026-10-24',
    body: "**Short answer:** if your truck fails Clean Truck Check, it is not compliant until it passes. Find out why it failed, get the problem repaired, then retest. Most failures come from a check engine light, readiness monitors not set, DPF or other emissions faults, or tampered or deleted equipment.\n\n## What happens if your truck fails Clean Truck Check\n\nA failed test does not take your truck off the road by itself, but it does leave the truck non-compliant. Test results are submitted to CARB's system, and the truck stays non-compliant until a passing result is on record. If the deadline passes while the truck is non-compliant, California-registered vehicles can face a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check), and CARB can issue citations and penalties.\n\nThe good news: a failed test tells you exactly what to work on. The sooner you act, the more room you have before the deadline.\n\n## Why trucks fail the OBD test\n\nThe CARB-verified OBD test applies to 2013 and newer diesel engines and 2018 and newer alternative-fuel engines. It reads data from the truck's engine computer. Common reasons a truck failed the OBD test:\n\n- **Check engine light (MIL) on.** An active emissions fault is a common cause of failure.\n- **Readiness monitors not set.** Often after codes were cleared or the battery was disconnected. See our post on [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).\n- **Emissions system faults.** NOx sensor, DEF system, SCR, EGR and DPF faults all show up here.\n- **Tampered or deleted equipment.** Deleted or tampered systems fail, and they are illegal. More in our [DPF and deletes post](/blog/dpf-deletes-and-smoke-clean-truck-check).\n\n## Why trucks fail the smoke opacity test\n\nFor 2012 and older diesel without OBD, the test is a smoke opacity test plus a visual inspection. A truck failed the smoke test usually because of:\n\n- Too much smoke from worn injectors, a dirty air filter, turbo problems or a cracked or plugged DPF\n- An engine that was not fully warmed up\n- Missing, disconnected or tampered emissions parts found in the visual inspection\n\nOur guide on [how to pass the CARB smoke test](/blog/how-to-pass-carb-smoke-test) covers prep in detail.\n\n## Clean Truck Check VIN mismatch\n\nAn OBD test can be rejected when the VIN the truck reports does not match the VIN on record. A VIN mismatch failure usually comes from one of two places:\n\n1. **The vehicle record in CTC-VIS has a typo.** Check the VIN in your account against the truck character by character and correct it.\n2. **The engine computer reports a different VIN.** This can happen when an engine control module has been replaced or reprogrammed. A dealer or qualified repair shop will need to look at it.\n\nIf your carb obd test result was rejected and you are not sure why, ask your tester to explain the message they received.\n\n## When the truck will not communicate with the OBD tester\n\nSometimes the tester cannot connect to the truck at all. An OBD communication failure is not the same as a failed emissions result, but you still cannot pass until it is fixed. Things to check with your repair shop:\n\n- A damaged OBD port, pins or wiring\n- Blown fuses for the diagnostic circuit\n- An ECM that is not responding\n- Aftermarket devices plugged into the diagnostic connector\n\nIf the truck still will not talk to the tester after repairs, check CARB's rules for your situation, since CARB decides how these cases are handled.\n\n## How to fix a failed test and get compliant again\n\n1. **Get the details.** Ask your tester what failed, in plain English.\n2. **Take the truck to a qualified diesel emissions repair shop.** Bring the test result with you.\n3. **Fix the root cause.** Clearing codes alone does not fix anything and resets readiness monitors, which can cause another failure.\n4. **Drive the truck normally** after the repair so its monitors can set, following the shop's advice.\n5. **Retest.** Book the retest once the repair is done.\n6. **Confirm in CTC-VIS** that the truck shows compliant. If a test result is not showing in CTC-VIS, see our [CTC-VIS guide](/blog/ctc-vis-registration-guide).\n\n### How soon can you retest, and how many times?\n\nYou can book a clean truck check retest after the repair is done. CARB sets any rules on retest timing and on what happens after repeated failures, so check CARB or CTC-VIS for your truck. In practice, the limit is usually how fast the repair gets done and the monitors set.\n\n### What about repair cost?\n\nRepair costs depend entirely on what failed and on your shop. A loose connection and a failed aftertreatment part are very different jobs. Get a written estimate from the repair shop before work starts.\n\n## Why your truck shows non-compliant even after testing\n\nIf the truck passed but still shows non-compliant, look for:\n\n- An unpaid annual compliance fee\n- A truck that is not reported in CTC-VIS\n- A VIN mismatch that kept the result from matching the truck\n\n## How Diesel Dynamix helps\n\nWe test and explain. We do not do repairs, so there is no conflict between the result and a repair bill. We test on site across Southern California at your yard, jobsite, terminal, port or home, tell you in plain English why a truck failed and come back to retest after your shop fixes it. Fleets get reminders, recurring visits and records per truck and VIN.\n\n- [CARB OBD testing](/services/obd-testing)\n- [Smoke opacity testing](/services/smoke-opacity-test)\n- [How testing works](/services/how-testing-works)\n\nReady for a retest? [Book online](/book), or call, text or WhatsApp **(858) 342-8328**.",
  },
  {
    slug: 'readiness-monitors-check-engine-light-clean-truck-check',
    title: "Check engine light and Clean Truck Check: will you pass?",
    excerpt: "Will a check engine light or unset readiness monitors fail Clean Truck Check? What the CARB OBD test looks at and how to get your truck ready to pass.",
    published_at: '2026-10-24',
    body: "**Short answer:** a check engine light that is on because of an emissions fault is a common reason trucks fail the Clean Truck Check OBD test. Readiness monitors that are not set are another. Fix the fault, drive the truck normally so the monitors complete, and do not clear codes right before the test.\n\n## How the CARB OBD test reads your truck\n\nThe CARB-verified OBD test applies to 2013 and newer diesel engines and 2018 and newer alternative-fuel engines. Instead of measuring smoke, the tester connects to the truck's diagnostic port and reads what the engine computer reports about its emissions systems.\n\nTwo things in that data cause most problems:\n\n- **The malfunction indicator lamp (MIL),** better known as the check engine light\n- **Readiness monitors,** the self-checks the truck runs on its emissions systems\n\nCARB sets the exact pass and fail criteria. This post explains the ideas so you know what to watch for. For the official rules, check [CARB's Clean Truck Check page](https://ww2.arb.ca.gov/our-work/programs/CTC).\n\n## Will a check engine light fail Clean Truck Check?\n\nA check engine light on because of an emissions fault is one of the most common reasons a truck fails. When the computer commands the MIL on, it is telling the tester that an emissions system has a problem it has confirmed.\n\nCommon sources on heavy-duty diesels include NOx sensors, the DEF and SCR system, EGR faults and DPF faults. On a semi truck, a check engine light before an emissions test is your cue to get it diagnosed now, not the day before.\n\n### What to do if the light is on\n\n1. Have a qualified repair shop read the codes and find the cause.\n2. Fix the cause, not just the light.\n3. Drive the truck normally afterward so the monitors complete.\n4. Then book the test.\n\n## What readiness monitors are\n\nReadiness monitors are the truck's own tests of its emissions systems. Each monitor runs when the right driving conditions happen and then reports as ready (complete) or not ready (incomplete).\n\nWhen readiness monitors are not ready, the truck has not yet finished checking itself. That is a common reason for an OBD failure even when nothing is broken. You may see it described as an \"OBD not ready\" result.\n\n### How many monitors can be not ready?\n\nCARB decides how many readiness monitors may be incomplete, and the answer can depend on the vehicle. We do not give a number here because it is CARB's rule to set. Check CARB, or ask us before the test and we will explain what applies to your truck.\n\n## How to set readiness monitors on a diesel truck\n\nMonitors set themselves when the truck is driven through the conditions each one needs, often called a drive cycle. The exact diesel truck drive cycle varies by engine maker and model.\n\n- **Drive the truck normally** for a while after any repair, including highway and steady-speed driving where possible.\n- **Do not keep restarting** a short idle-and-stop routine and expect monitors to set.\n- **Ask your dealer or repair shop** for the drive cycle for your engine. Freightliner Cascadia, Peterbilt and other platforms each follow the engine maker's procedure.\n- **Make sure no faults return.** If the light comes back on, the repair is not finished.\n\n## Should you clear codes before the test?\n\nNo. Clearing codes turns the light off but does not fix anything. It also resets readiness monitors to not ready, so a truck with cleared codes is often not ready for the OBD test. Disconnecting the battery on a semi truck can have the same effect.\n\nIf a shop cleared codes as part of a repair, give the truck time and miles to set its monitors before you test.\n\n## Pending and permanent codes\n\nThe OBD system stores different kinds of codes:\n\n- **Pending codes** point to a fault the computer has seen but not yet confirmed.\n- **Permanent codes** stay in memory even after codes are cleared, until the truck's own monitoring confirms the repair worked.\n\nHow CARB treats each type in the Clean Truck Check pass criteria is set by CARB, so check CARB for your vehicle. Practically, a pending code is an early warning to get looked at, and a permanent code means the system still needs to verify a repair through normal driving.\n\n## Readiness and the check engine light for fleets\n\nFor a fleet, one truck with a light on can throw off a whole test day. Ask drivers to report check engine lights as soon as they appear, and get those trucks to the shop between test windows. Keep a note by VIN of any recent repairs or cleared codes, so you know which trucks may need more driving before they are ready.\n\nThe same ideas apply to 2018 and newer alternative-fuel engines, which also take the OBD test.\n\n## A pre-test checklist\n\n- No check engine light on\n- No known emissions faults (DEF, SCR, NOx, EGR, DPF)\n- No codes cleared or battery disconnected recently\n- Normal driving since the last repair\n- Diagnostic port and connector in good shape\n- Correct VIN on record in CTC-VIS\n\n## If the truck fails anyway\n\nYou will know exactly what to fix. See [what to do after a failed Clean Truck Check](/blog/failed-clean-truck-check-what-to-do). For older non-OBD diesels, the test is different; see [how to pass the CARB smoke test](/blog/how-to-pass-carb-smoke-test).\n\n## How Diesel Dynamix helps\n\nWe run the CARB-verified OBD test on site at your yard, jobsite, terminal, port or home across Southern California. We explain results in plain English, including which monitors were not ready or which fault caused a failure, so your shop knows where to start. We do not do repairs; we test and explain, then retest when you are ready.\n\n- [CARB OBD testing](/services/obd-testing)\n- [How testing works](/services/how-testing-works)\n- [Fleet testing](/services/fleet-testing)\n\n[Book a test](/book), or call, text or WhatsApp **(858) 342-8328**.",
  },
  {
    slug: 'dpf-deletes-and-smoke-clean-truck-check',
    title: "DPF deletes, smoke and Clean Truck Check",
    excerpt: "Will a DPF or EGR delete pass Clean Truck Check? No. Here's why deleted trucks fail, what causes excess smoke and how a legal, working truck passes.",
    published_at: '2026-10-24',
    body: "**Short answer:** no, a DPF-deleted, EGR-deleted or emissions-tampered truck will not pass Clean Truck Check. Deleted or tampered systems fail, and they are illegal. Diesel Dynamix does not remove, bypass or help hide emissions equipment. A truck with its emissions systems intact and working is the only way to pass.\n\n## Deleted and tampered trucks fail. Full stop.\n\nThis needs to be said plainly because there is a lot of bad advice out there. Removing or disabling a diesel particulate filter (DPF), EGR valve, SCR system or other emissions equipment is illegal. Tuning an engine computer to hide that equipment is tampering too.\n\nTampered or deleted equipment is one of the common reasons trucks fail:\n\n- **On the OBD test** (2013 and newer diesel, 2018 and newer alternative fuel), the tester reads the engine computer. A deleted or tuned truck will not report the way a working, unmodified system does.\n- **On the smoke opacity test** (2012 and older diesel without OBD), the visual inspection checks emissions-control parts. Missing, disconnected or tampered parts fail the truck even if the smoke reading looks fine.\n\nBeyond failing the test, non-compliant and tampered trucks face CARB citations and penalties, and California-registered vehicles can face a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check). CARB sets the penalty amounts, so check CARB for current figures. For the reasons behind the rules, see [why California enforces Clean Truck Check](/clean-truck-check/why-california-enforces-it).\n\n**Our policy:** we test and explain. We do not remove, bypass, tune out or otherwise defeat emissions equipment, and we do not help anyone pass with a deleted truck.\n\n## Can a reinstalled DPF pass Clean Truck Check?\n\nA truck that has had its emissions equipment properly restored, and whose systems are working, can be tested like any other truck. It still has to pass on its own. Work with a qualified diesel emissions repair shop to restore the correct parts and software, then drive the truck normally so readiness monitors can set before you test. See our post on [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).\n\n## DPF faults and the OBD test\n\nYou do not need a delete for the DPF to cause trouble. A DPF fault code or warning on an OBD-equipped truck is an emissions fault, and an emissions fault with the check engine light on is a common reason for failure.\n\nIf your dash shows a DPF warning or the truck is overdue for a regeneration, deal with it before the test:\n\n- Follow the engine maker's procedure for regeneration.\n- If regeneration does not clear the warning, have a repair shop check the DPF and its sensors.\n- Ask your shop whether DPF cleaning is due.\n\nDo not clear codes right before the test. That resets readiness monitors and can cause a failure on its own.\n\n## What causes excess smoke on the opacity test\n\nFor older non-OBD diesels, the smoke opacity test measures how much smoke the exhaust gives off. Common causes of excessive smoke:\n\n- **Worn or leaking injectors**\n- **A dirty air filter or restricted intake**\n- **Turbo problems**\n- **Exhaust leaks**\n- **A cracked or plugged DPF**\n- **A cold engine.** Smoke goes up when the engine is not at operating temperature.\n\n### Black smoke vs blue smoke\n\nBlack smoke from a diesel usually points to fuel and air problems, such as injectors, a restricted intake or turbo trouble. Blue smoke usually points to oil being burned. Either one can fail the opacity test. A repair shop can tell you which you have and why.\n\n## How to reduce smoke opacity before the test\n\n1. **Fix known problems first.** Injectors, air filter, turbo and exhaust leaks.\n2. **Check the DPF,** if the truck has one. It must be installed, intact and not overdue for cleaning.\n3. **Confirm emissions parts are present and connected,** since the visual inspection checks them.\n4. **Warm the engine fully** before the test.\n5. **Book the test** once the repairs are done.\n\nOur guide on [how to pass the CARB smoke test](/blog/how-to-pass-carb-smoke-test) goes deeper on diesel smoke test preparation.\n\n## What the visual inspection looks at\n\nOn older diesels that take the smoke opacity test, the visual inspection is where tampering usually shows up. The tester looks at the emissions-control parts that belong on that engine and checks that they are present, connected and not tampered with. A part that is missing, unplugged or modified fails the truck, no matter how clean the smoke reading is.\n\nThat is why \"it doesn't smoke\" is not the same as \"it will pass.\" A deleted truck can blow a low reading and still fail.\n\n## Do aftermarket tunes cause problems?\n\nAny tune that disables or hides emissions equipment is tampering, and it fails. If you are unsure whether software on your truck has been changed, ask a qualified repair shop to check it before you book a test.\n\n## If you just bought a truck with a delete\n\nIt happens, especially with used trucks. The path forward is the same: have a qualified shop restore the emissions equipment, make sure it works, and then test. Until then, the truck cannot pass Clean Truck Check. If you are unsure what was changed, ask a repair shop to inspect it before you book.\n\n## How Diesel Dynamix helps\n\nWe test working, legal trucks on site across Southern California, at your yard, jobsite, terminal, port or home. We run the CARB-verified OBD test or the smoke opacity test plus visual inspection, explain the result in plain English and retest after your shop finishes repairs. We do not do repairs and we do not help with deletes.\n\n- [Smoke opacity testing](/services/smoke-opacity-test)\n- [CARB OBD testing](/services/obd-testing)\n- [What to do after a failed test](/blog/failed-clean-truck-check-what-to-do)\n\n[Book a test](/book), or call, text or WhatsApp **(858) 342-8328**.",
  },
  {
    slug: 'clean-truck-check-vs-smog-check',
    title: "Clean Truck Check vs smog check vs PSIP",
    excerpt: "Clean Truck Check vs smog check vs PSIP: which test does your truck need? How CARB's heavy-duty program differs from regular smog and DOT inspections.",
    published_at: '2026-10-24',
    body: "**Short answer:** Clean Truck Check is not the same as a regular smog check. Clean Truck Check is CARB's emissions testing program for most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California. Lighter vehicles generally fall under California's regular Smog Check program instead, which is a separate program with its own rules.\n\n## Clean Truck Check vs smog check: the core difference\n\nPeople search for a \"truck smog check\" all the time, and it is easy to see why. Both are emissions tests. But they are different programs.\n\n- **Clean Truck Check** is run by CARB (the California Air Resources Board). It covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR operating in California, including out-of-state and international trucks. Owners report vehicles in CTC-VIS, pay CARB's annual compliance fee and pass tests on a schedule.\n- **California's regular Smog Check** is a separate program, run through the Bureau of Automotive Repair (BAR), for passenger cars and other lighter vehicles. Check the DMV or BAR for what applies to a vehicle at or under 14,000 lb.\n\nSo the difference between CARB and BAR testing comes down to which program covers your vehicle. Weight, fuel type and how the vehicle is used all matter. For edge cases, check CARB's rules for your vehicle.\n\n## Diesel trucks: 14,000 lb or less vs over\n\nThe 14,000 lb GVWR line is the key number.\n\n- **Over 14,000 lb GVWR,** diesel and alternative-fuel: most are covered by Clean Truck Check. That includes semis, box trucks, dump trucks, buses, refuse trucks, construction and agricultural vehicles and motorhomes over 14,000 lb, where they fall under the program.\n- **14,000 lb or less:** generally not Clean Truck Check. Check the regular Smog Check rules for your vehicle.\n\nIf you drive a heavy pickup or a work truck near the line, look at the GVWR on the door label and check CARB's rules before you book anything.\n\n## Can a STAR smog station test a truck over 14,000 lb?\n\nA Clean Truck Check test has to be done by a credentialed Clean Truck Check tester using the right equipment, such as a CARB-verified OBD test for 2013 and newer diesel engines. Being a smog station, STAR or otherwise, is a different credential for a different program. If you are thinking about a local smog shop, ask whether it performs Clean Truck Check tests.\n\n## Which Clean Truck Check test does your truck need?\n\nClean Truck Check itself has different tests depending on the engine:\n\n- **2013 and newer diesel:** CARB-verified OBD test\n- **2018 and newer alternative fuel:** CARB-verified OBD test\n- **2012 and older diesel without OBD:** smoke opacity test plus visual inspection\n- **2017 and older alternative fuel without OBD:** visual inspection\n\nLearn more about the [OBD test](/services/obd-testing) and the [smoke opacity test](/services/smoke-opacity-test).\n\n## Clean Truck Check vs PSIP\n\nPSIP, the Periodic Smoke Inspection Program, was CARB's older periodic smoke testing requirement for diesel fleets. Clean Truck Check is CARB's current heavy-duty inspection and maintenance program, and it is the one that drives today's CTC-VIS reporting, fees and test deadlines. If you have questions about how older PSIP records or requirements apply to your fleet, check CARB.\n\nThe practical takeaway: plan your testing around Clean Truck Check and the deadlines in CTC-VIS. Most covered vehicles currently test twice a year, with changes possible. See [how often trucks need testing](/blog/how-often-do-trucks-need-clean-truck-check).\n\n## Clean Truck Check vs DOT and BIT inspections\n\nClean Truck Check is an emissions program. DOT inspections and California's BIT inspections are safety programs. They check different things, and passing one does not satisfy the other. If your trucks need both, plan for both.\n\n## Mobile testing vs a test station\n\nA Clean Truck Check test is the same test whether a tester comes to you or you drive to a shop. What changes is the hassle.\n\n- **At a test station,** a driver takes the truck off the road, drives to the shop, waits and drives back.\n- **With mobile testing,** the tester comes to your yard, jobsite, terminal, port or home. The truck stays where it is, and one visit can cover a whole fleet.\n\nFor many owners, the lost time and fuel of driving to a shop costs more than the test. See [can Clean Truck Check be done at my yard](/blog/can-clean-truck-check-be-done-at-my-yard).\n\n## Common mix-ups to avoid\n\n- **\"I passed a smog check, so I'm covered.\"** A regular smog check does not count for Clean Truck Check, and the reverse is also true.\n- **\"My truck is registered out of state, so this doesn't apply.\"** Out-of-state and international trucks that operate in California are covered.\n- **\"I paid the fee, so I'm done.\"** The compliance fee and the tests are separate. A truck needs both, plus a report in CTC-VIS.\n- **\"I'll deal with it at renewal.\"** Non-compliance can lead to a [DMV registration hold](/blog/dmv-registration-hold-clean-truck-check) for California-registered trucks, plus CARB citations and penalties.\n\n## Quick guide: which test do I need?\n\n1. Check the GVWR on the door label.\n2. Over 14,000 lb, diesel or alternative fuel, operating in California? You most likely need Clean Truck Check. Report the truck in CTC-VIS; our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) shows how.\n3. At or under 14,000 lb? Check the regular Smog Check rules with the DMV or BAR.\n4. Not sure? Check CARB's rules for your vehicle, or call us and we will help you read them.\n\n## How Diesel Dynamix helps\n\nWe are an independent Clean Truck Check testing service, not CARB or a government agency. We test on site anywhere in our Southern California area, from [Los Angeles](/service-areas/los-angeles) and the ports to the [Inland Empire](/service-areas/inland-empire) and [San Diego](/service-areas/san-diego). We help with CTC-VIS questions, explain results in plain English and give you the next due date for every truck.\n\n- [What Clean Truck Check requires](/clean-truck-check)\n- [Clean Truck Check FAQ](/clean-truck-check/faq)\n- [Our services](/services)\n\n[Book a test](/book), or call, text or WhatsApp **(858) 342-8328**.",
  },
  {
    slug: 'which-vehicles-need-clean-truck-check',
    title: "Which vehicles need Clean Truck Check? A truck-type guide",
    excerpt: "Which vehicles need Clean Truck Check? Semis, box trucks, dump trucks, buses and motorhomes over 14,000 lb GVWR. See which test yours needs and how to book.",
    published_at: '2026-10-24',
    body: "**Short answer:** Clean Truck Check covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California. That includes semis, box trucks, dump trucks, tow trucks, buses and many motorhomes, whether they are registered in California, another state or another country. Your engine model year decides which test you need, not the body style.\n\n## Which vehicles need Clean Truck Check?\n\nThe rule is built on two things: weight and fuel. If a vehicle runs on diesel or an alternative fuel, is rated over 14,000 lb gross vehicle weight (GVWR) and operates in California, it is most likely covered.\n\nBody type does not change that. A Class 8 sleeper and a Class 6 delivery truck are in the same program if both are over the weight line. That is why the question \"does my truck need it?\" almost always comes down to the GVWR on the door label and the fuel the engine burns.\n\nCovered vehicles also include trucks that live outside the state. Out-of-state and international trucks that drive in California are part of the program. See [Clean Truck Check for out-of-state trucks](/blog/clean-truck-check-out-of-state-trucks) for more.\n\n## Truck types we test most often\n\nHere is how common vehicle types line up. In every case the 14,000 lb GVWR rating and the fuel type are what count.\n\n### Semis and tractors\n\nSemi truck emissions tests in California are the bulk of the program. Day cabs, sleepers, heavy haul tractors, car haulers, tankers and reefer trucks are all over 14,000 lb GVWR, so they are covered when they run in California.\n\n### Box trucks, step vans and delivery trucks\n\nMany box trucks need a Clean Truck Check, but not all. A large box truck or reefer used for delivery is usually rated over 14,000 lb. Smaller step vans and cab-overs, such as some Isuzu NPR and Hino models, can fall on either side of the line depending on the build. Check the GVWR on the door label before you decide.\n\n### Dump trucks, roll-offs and construction trucks\n\nDump trucks, roll-off trucks, concrete mixers, water trucks, crane trucks and bucket trucks are almost always heavy enough to be covered. Construction fleets are part of the program, and we test at jobsites as well as yards.\n\n### Tow trucks and flatbeds\n\nHeavy tow trucks and wreckers are covered. Light-duty tow trucks and flatbeds built on smaller chassis may be under 14,000 lb, so the door label decides.\n\n### Garbage trucks and street sweepers\n\nRefuse trucks, garbage trucks and roll-off haulers are covered. Street sweepers and other special vehicles can have their own rules, so check CARB's rules for your vehicle before you assume either way.\n\n### Buses\n\nSchool buses, transit buses, coach buses and larger shuttle buses over 14,000 lb are part of the program. Smaller shuttles built on light chassis may be under the line.\n\n### Medium-duty chassis: F-450, F-550, F-650, Ram 4500/5500, Silverado 6500\n\nThese are the trucks people ask about most. A Ford F-650 or Silverado 6500 is usually rated well over 14,000 lb. A Ford F-450, F-550, Ram 4500 or Ram 5500 may be just over or under the line depending on the configuration. The rating on your own door label settles it. Our [pickup guide](/blog/does-my-pickup-need-clean-truck-check) covers this in more detail.\n\n### Motorhomes\n\nDiesel motorhomes over 14,000 lb GVWR can fall under the program. See [Clean Truck Check for motorhomes](/blog/motorhome-clean-truck-check).\n\n### Agricultural and livestock trucks\n\nAgricultural trucks, hay trucks and livestock trucks over 14,000 lb are included in the program where they fall under it. CARB has specific rules for some farm vehicles, so check CARB's rules or our [exemptions guide](/blog/clean-truck-check-exemptions) before assuming yours is exempt.\n\n### Fire trucks and other special cases\n\nEmergency vehicles, military vehicles and other special categories have their own treatment under CARB's rules. We don't guess on these. Check CARB's rules for your vehicle or look it up in CTC-VIS.\n\n## Which test does each vehicle need?\n\nThe test depends on engine type and model year, not on whether it is a bus, a dump truck or a semi.\n\n- **2013 and newer diesel engines:** CARB-verified OBD test. See [OBD testing](/services/obd-testing).\n- **2012 and older diesel engines without OBD:** smoke opacity test plus a visual inspection. See [smoke opacity testing](/services/smoke-opacity-test).\n- **2018 and newer alternative-fuel engines:** CARB-verified OBD test.\n- **2017 and older alternative-fuel engines without OBD:** visual inspection.\n\nSo a 2015 dump truck and a 2015 sleeper get the same OBD test, while a 2010 box truck gets a smoke test and visual inspection.\n\n## How to check if your vehicle needs Clean Truck Check\n\n1. **Find the GVWR.** It is printed on the label on the driver's door or door jamb. If it reads over 14,000 lb, keep going.\n2. **Confirm the fuel.** Diesel and alternative-fuel engines are covered.\n3. **Ask if it runs in California.** Registration state does not matter. Operating in California does.\n4. **Look it up in CTC-VIS.** CARB's CTC-VIS system is where owners report vehicles, pay the annual compliance fee and see deadlines. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) walks through it.\n5. **Check edge cases with CARB.** If you think your vehicle might be exempt, confirm it with CARB's rules before you skip a test.\n\nMost covered vehicles currently test twice a year. Missing a deadline can lead to a DMV registration hold for California-registered vehicles, plus CARB citations and penalties.\n\n## How Diesel Dynamix helps\n\nDiesel Dynamix is an independent mobile testing service in Southern California. We are not CARB. We come to your yard, jobsite, terminal, port or home and run the right test for each vehicle, whether it is one tow truck or a mixed fleet of semis, buses and dump trucks.\n\n- We explain results in plain English and give you the next due date.\n- We help with CTC-VIS questions.\n- Fleets get per-truck pricing, recurring visits, early-morning visits, reminders and records per VIN. See [fleet testing](/services/fleet-testing).\n\nWe cover Los Angeles, Long Beach, Orange County, the Inland Empire, San Diego and El Centro. See our [service areas](/service-areas), then [book a test](/book) or call or text (858) 342-8328.",
  },
  {
    slug: 'does-my-pickup-need-clean-truck-check',
    title: "Does my F-350 need Clean Truck Check? The GVWR rule",
    excerpt: "Does my F-350 need Clean Truck Check? Most pickups are under 14,000 lb GVWR and not covered. Here is how to check yours and when heavy-duty pickups qualify.",
    published_at: '2026-10-24',
    body: "**Short answer:** Clean Truck Check only covers vehicles rated over 14,000 lb GVWR, so most pickups, including most F-350, Ram 3500 and Silverado 3500 diesels, are not covered. Heavy-duty pickups and chassis cabs rated over 14,000 lb may be. The GVWR on your door label decides, and CARB has the final word on edge cases.\n\n## Does my F-350 need Clean Truck Check?\n\nUsually not. Clean Truck Check is CARB's program for heavy-duty vehicles, and it applies to diesel and alternative-fuel vehicles over 14,000 lb gross vehicle weight rating (GVWR) that operate in California. Most pickups are rated below that.\n\nThe key word is **rating**. GVWR is the maximum loaded weight the manufacturer rates the truck for. It is not what the truck weighs empty, and it is not how much you happen to be hauling today. A pickup does not become covered because you load it heavy or pull a big trailer. It is covered only if its rated GVWR is over 14,000 lb.\n\n## Where to find GVWR on your truck\n\nOpen the driver's door and look at the label on the door or door jamb. The GVWR is printed there, usually in pounds and kilograms. You may also see GCWR (gross combined weight rating) on some paperwork. GCWR includes a trailer, and it is not the number Clean Truck Check uses.\n\n1. Open the driver's door.\n2. Find the label on the door edge or door jamb.\n3. Read the GVWR value in pounds.\n4. If it is 14,000 lb or less, your truck is not in Clean Truck Check.\n5. If it is over 14,000 lb, your truck is likely covered. Confirm in CARB's CTC-VIS system.\n\nIf the label is missing or damaged, check your registration paperwork or ask the dealer. If you are still unsure, check CARB's rules for your vehicle.\n\n## 3/4-ton and one-ton diesel pickups\n\n**3/4-ton diesels** like the F-250, Ram 2500 and Silverado 2500 are well below the 14,000 lb line, so they are not part of Clean Truck Check.\n\n**One-ton diesels** like the F-350, Ram 3500 and Silverado 3500, including duallys, are still rated below 14,000 lb in most configurations. Read your own door label rather than relying on a general rule, because configurations vary.\n\n## F-450, F-550, Ram 4500 and 5500, and hotshot trucks\n\nThis is where pickups and Clean Truck Check start to overlap. Heavier models such as the F-450, F-550, Ram 4500 and Ram 5500 come in many configurations, and some are rated over 14,000 lb. Many hotshot trucks are built on these chassis.\n\n- If your hotshot F-450 or F-550 shows a GVWR over 14,000 lb, it is likely covered and needs testing on CARB's schedule.\n- If it shows 14,000 lb or less, it is not in Clean Truck Check.\n- If you have questions about a re-rated or modified truck, check CARB's rules for your vehicle. We won't guess on weight edge cases, and neither should you.\n\n## Smog check or Clean Truck Check for my diesel pickup?\n\nThey are different programs. Clean Truck Check is CARB's heavy-duty program for vehicles over 14,000 lb GVWR. A diesel pickup under that rating is outside Clean Truck Check. Whether it needs a regular smog check is a separate question for the DMV, not something Clean Truck Check decides. Our post on [Clean Truck Check vs smog check](/blog/clean-truck-check-vs-smog-check) explains the difference.\n\n## If your pickup is covered: which test it needs\n\nIf your heavy-duty pickup or chassis cab is over 14,000 lb GVWR, the test is based on engine type and model year:\n\n- **2013 and newer diesel:** CARB-verified [OBD test](/services/obd-testing).\n- **2012 and older diesel without OBD:** [smoke opacity test](/services/smoke-opacity-test) plus a visual inspection.\n- **2018 and newer alternative fuel:** CARB-verified OBD test.\n- **2017 and older alternative fuel without OBD:** visual inspection.\n\nCovered vehicles are reported in CTC-VIS, where the owner pays CARB's annual compliance fee per vehicle. Most covered vehicles currently test twice a year. Under CARB's original rule, OBD-equipped vehicles move to four tests a year from October 1, 2027, though a bill has proposed cutting testing to once a year. Check your own deadlines in CTC-VIS.\n\n## Pickups in a work fleet\n\nMany Southern California fleets mix pickups with heavier trucks. A contractor might run F-250s and F-350s alongside an F-550 dump body and a few semis. In that case, sort the fleet by GVWR first. Pickups at or under 14,000 lb stay off your Clean Truck Check list. Chassis cabs and heavier trucks over the line go on it, get reported in CTC-VIS and follow CARB's testing schedule. Keeping that list accurate per VIN is the easiest way to avoid paying for tests you don't need, or missing ones you do.\n\n## Practical steps for pickup owners\n\n1. Read the GVWR on your door label today.\n2. If it is over 14,000 lb, look the truck up in CTC-VIS and check your deadline. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) can help.\n3. Make sure the check engine light is off and emissions faults are fixed before testing. See [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).\n4. Book your test before the deadline. A missed deadline can lead to a DMV registration hold for California-registered vehicles, plus CARB citations and penalties.\n\n## How Diesel Dynamix helps\n\nDiesel Dynamix is an independent mobile testing service, not CARB. If your heavy-duty pickup or hotshot truck is covered, we come to you: your home, yard or jobsite anywhere we serve in Southern California, from [Los Angeles](/service-areas/los-angeles) and [Orange County](/service-areas/orange-county) to the [Inland Empire](/service-areas/inland-empire) and [San Diego](/service-areas/san-diego).\n\nWe explain your result in plain English, give you the next due date and can send reminders. Not sure if your truck is covered? Call or text (858) 342-8328 with the GVWR from your door label and we'll help you think it through, or [book a test](/book).",
  },
  {
    slug: 'motorhome-clean-truck-check',
    title: "Motorhome Clean Truck Check: RVs over 14,000 lb",
    excerpt: "Motorhome Clean Truck Check explained: which diesel RVs over 14,000 lb GVWR are covered, which test they need, and how we test at your home or storage lot.",
    published_at: '2026-10-24',
    body: "**Short answer:** Diesel and alternative-fuel motorhomes over 14,000 lb GVWR can fall under California's Clean Truck Check program, including many Class A diesel pushers and larger Super C motorhomes. Whether your specific RV is covered is CARB's call, so check CARB's rules or CTC-VIS for your vehicle. If it is covered, a mobile tester can test it where it is parked.\n\n## Does my diesel motorhome need Clean Truck Check?\n\nIt might. Clean Truck Check covers most diesel and alternative-fuel vehicles over 14,000 lb gross vehicle weight rating (GVWR) that operate in California, and motorhomes over that rating can be included where they fall under the program.\n\nTwo questions get you most of the way:\n\n1. **Is the GVWR over 14,000 lb?** Look at the weight label on the driver's side, usually on the door, door jamb or near the driver's seat. Many Class A diesel pushers and big Super C coaches are over the line. Smaller Class C and Class B motorhomes usually are not.\n2. **Is the engine diesel or alternative fuel?** Clean Truck Check is built around diesel and alternative-fuel engines.\n\nIf both answers are yes, look the motorhome up in CARB's CTC-VIS system and check CARB's rules for your vehicle. That is where you will see whether it must be reported, tested and paid for.\n\n## Are RVs exempt from Clean Truck Check?\n\nNot as a blanket rule. Being a motorhome rather than a work truck does not on its own take a vehicle out of the program. CARB's rules decide whether a particular RV is covered or has special treatment. We don't guess on that, and we recommend you don't either. Check CARB's rules, CTC-VIS, or our [exemptions guide](/blog/clean-truck-check-exemptions) for what to ask.\n\n## Which test does a motorhome need?\n\nThe test depends on the engine, not on the coach. It is the same as for any other heavy-duty vehicle:\n\n- **2013 and newer diesel engines:** CARB-verified [OBD test](/services/obd-testing). The tester connects to the vehicle's diagnostic system and checks for emissions faults and readiness.\n- **2012 and older diesel engines without OBD:** [smoke opacity test](/services/smoke-opacity-test) plus a visual inspection.\n- **2018 and newer alternative-fuel engines:** CARB-verified OBD test.\n- **2017 and older alternative-fuel engines without OBD:** visual inspection.\n\nUse the engine model year, which can differ from the year the coach was finished.\n\n### OBD test or smoke test for my motorhome?\n\nIf your diesel pusher has a 2013 or newer engine, expect an OBD test. An older diesel without OBD gets the opacity test and visual inspection. RV OBD testing works just like truck OBD testing.\n\n## Out-of-state motorhomes in California\n\nRegistration state does not decide coverage. Clean Truck Check applies to covered vehicles that operate in California, including out-of-state and international vehicles. If you winter in Southern California or travel through the state in a big diesel coach, check CARB's rules for your vehicle and look it up in CTC-VIS. Our post on [out-of-state trucks](/blog/clean-truck-check-out-of-state-trucks) explains how this works for non-California registrations.\n\n## Motorhome CTC-VIS registration\n\nCovered vehicles are reported in CARB's CTC-VIS system. The owner pays CARB's annual compliance fee per vehicle there. The amount is set by CARB and shown in CTC-VIS. You can also see your deadlines there. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) walks through account setup.\n\nMost covered vehicles currently test twice a year. Under CARB's original rule, OBD-equipped vehicles move to four tests a year from October 1, 2027, and a bill has proposed cutting testing to once a year, so check CTC-VIS for your own schedule.\n\nFor California-registered vehicles, missing a deadline can lead to a DMV registration hold. CARB can also issue citations and penalties.\n\n## Getting ready for a motorhome test\n\n1. **Confirm GVWR and engine year.** Note them before you book.\n2. **Check the dash.** A check engine light on, or readiness monitors not set, can cause an OBD test to fail. See [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).\n3. **Fix known emissions faults first.** DPF and emissions faults are common reasons for a fail. Deleted or tampered emissions equipment fails and is illegal.\n4. **Pick a spot.** The coach needs to be somewhere the tester can reach it and run the engine.\n5. **Have your CTC-VIS details handy.** It speeds up the visit.\n\nIf the motorhome fails, it needs repair and then a retest. We don't do repairs, but we explain what the result means so your mechanic knows where to start. See [what to do after a failed test](/blog/failed-clean-truck-check-what-to-do).\n\n## What happens during a mobile motorhome test\n\nThe visit is simple. The tester confirms the vehicle and VIN, then runs the test that fits the engine. For an OBD test, that means connecting to the diagnostic system with CARB-verified equipment while you stay with your coach. For an older diesel, it means a smoke opacity test plus a visual inspection, so the engine needs to run. Once it's done, you get the result in plain English and your next due date. If you'd like, we'll send a reminder before the next one.\n\n## Mobile motorhome testing in Southern California\n\nDriving a 40-foot coach to a test site is a hassle. Diesel Dynamix tests on site. We come to your home, and if your RV is at a storage lot or RV park, ask us about testing there when you book. We serve the Inland Empire, San Diego, Los Angeles, Orange County, Long Beach and El Centro, including [Riverside](/service-areas/riverside), [San Bernardino](/service-areas/san-bernardino) and [San Diego](/service-areas/san-diego).\n\n## How Diesel Dynamix helps\n\nDiesel Dynamix is an independent mobile testing service, not CARB or a government agency. For motorhome owners we:\n\n- Run the right test for your engine where your coach is parked.\n- Explain the result in plain English and give you the next due date.\n- Help with CTC-VIS questions and send reminders.\n\nCall or text (858) 342-8328, message us on WhatsApp, or [book a test](/book).",
  },
  {
    slug: 'obd-test-by-truck-brand',
    title: "Freightliner OBD test and other brands: CARB guide",
    excerpt: "Freightliner OBD test, plus Peterbilt, Kenworth, International, Volvo and Mack: which trucks get the CARB OBD test, which get a smoke test and how to prepare.",
    published_at: '2026-10-24',
    body: "**Short answer:** A Freightliner OBD test works the same way as a Peterbilt, Kenworth, International, Volvo or Mack OBD test. CARB decides the test by engine model year, not by brand: 2013 and newer diesel engines get a CARB-verified OBD test, and 2012 and older diesels without OBD get a smoke opacity test plus a visual inspection.\n\n## Does the truck brand change the Clean Truck Check?\n\nNo. Clean Truck Check is built around the engine, not the badge on the hood. A 2019 Freightliner Cascadia, a 2019 Peterbilt 579 and a 2019 Volvo VNL all get the same CARB-verified OBD test. A 2010 Kenworth T800 and a 2010 Mack Granite with non-OBD engines both get a smoke opacity test and visual inspection.\n\nThe rule for diesel trucks over 14,000 lb GVWR:\n\n- **2013 and newer diesel engines:** CARB-verified [OBD test](/services/obd-testing).\n- **2012 and older diesel engines without OBD:** [smoke opacity test](/services/smoke-opacity-test) plus a visual inspection.\n\nFor alternative-fuel trucks, such as natural gas models, it is 2018 and newer for the OBD test and a visual inspection for 2017 and older engines without OBD.\n\nGo by the **engine** model year, not the year on the title. If you are not sure, the engine's emission label or your dealer can tell you, and CTC-VIS shows the vehicle record.\n\n## Brand by brand\n\nBelow is how the common Southern California fleet trucks line up. The test method is the same across brands; what changes is the model year of the engine in your truck.\n\n### Freightliner (Cascadia, M2)\n\nFreightliner Cascadia and M2 trucks with 2013 or newer diesel engines get the Freightliner OBD test like any other OBD truck. Older Freightliners with non-OBD engines get the smoke opacity test and visual inspection. Whatever engine is under the hood, the test is chosen by engine year.\n\n### Peterbilt (579, 389)\n\nA Peterbilt 579 or 389 with a 2013 or newer diesel gets the CARB OBD test. That applies whatever engine the truck has. Older 389s and earlier models with pre-2013 non-OBD engines get the smoke test.\n\n### Kenworth (T680, T880)\n\nKenworth T680 and T880 trucks with 2013 or newer engines get the OBD test. Kenworth owners often ask about DPF regens and readiness monitors before the test; more on that below.\n\n### International (LT, ProStar)\n\nInternational LT trucks and ProStars with 2013 or newer diesels get the OBD test. Older Internationals, including trucks with earlier MaxxForce engines, are tested by engine model year like everything else: OBD if the engine is 2013 or newer, smoke and visual if it is older without OBD.\n\n### Volvo (VNL)\n\nVolvo VNL trucks, including those with Volvo D13 engines, get the OBD test when the engine is 2013 or newer.\n\n### Mack (Anthem, Granite)\n\nMack Anthem and Granite trucks with 2013 or newer engines, including the Mack MP8, get the OBD test. Older Granites with non-OBD engines get the opacity test and visual inspection.\n\n### Western Star, Hino, Isuzu and others\n\nThe same rule applies to Western Star, Hino, Isuzu and every other make that is over 14,000 lb GVWR. The brand does not create a different test.\n\n## Engines: Cummins, Detroit, PACCAR and older models\n\nCummins ISX and X15, Detroit DD15 and PACCAR MX-13 trucks all test the same way when the engine is 2013 or newer: a CARB-verified OBD test. Older engine families, such as the Detroit Series 60, Cummins N14 and Caterpillar C15, generally show up in older trucks. If the engine is 2012 or older without OBD, it gets the smoke opacity test and visual inspection. Always confirm with the engine's actual model year.\n\n## OBD port and connector questions\n\nThe tester connects to the truck's diagnostic port to read data. Port location and connector type vary by make, model and year, and older and newer trucks can use different connectors, such as 9-pin and 16-pin. You do not need to find the port for us. When you book, tell us the make, model, engine and year so we arrive ready for your truck.\n\nIf a truck will not communicate with the tester, the test can't be completed. That is a sign of a wiring, connector or module problem that needs a mechanic.\n\n## Readiness monitors, check engine lights and regens\n\nMost OBD fails have nothing to do with the brand. The common causes are the same for a Cascadia or a T680:\n\n- **Check engine light (MIL) on.** Active emissions faults can fail the test.\n- **Readiness monitors not set.** Clearing codes or disconnecting the battery can leave monitors not set, and the truck then needs normal driving before they are ready again.\n- **DPF or other emissions faults.** If your truck is showing DPF warnings, get them fixed before you test.\n- **Tampered or deleted equipment.** Deleted or tampered systems fail and are illegal.\n\nOn Kenworth DPF regens or a Freightliner drive cycle, follow the manufacturer's guidance or your mechanic's advice. We don't do repairs. Our guides on [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check) and [DPF deletes and smoke](/blog/dpf-deletes-and-smoke-clean-truck-check) go deeper.\n\n## Practical steps before your OBD test\n\n1. Confirm the engine model year so you know which test applies.\n2. Check that the check engine light is off.\n3. Don't clear codes or disconnect the battery right before the test.\n4. Get open emissions faults repaired first.\n5. Check your deadline in CTC-VIS. Most covered trucks currently test twice a year, and under CARB's original rule OBD trucks move to four tests a year from October 1, 2027.\n\n## How Diesel Dynamix helps\n\nDiesel Dynamix is an independent mobile tester, not CARB. Mixed fleets of Freightliners, Peterbilts, Kenworths, Internationals, Volvos and Macks are what we see every day across Southern California. We test them at your yard, terminal or the [Port of Long Beach](/service-areas/ports/port-of-long-beach) and [Port of Los Angeles](/service-areas/ports/port-of-los-angeles), explain any failure in plain English and keep records per VIN.\n\nFleets get per-truck pricing, recurring visits and reminders through [fleet testing](/services/fleet-testing). Call or text (858) 342-8328 or [book a test](/book).",
  },
  {
    slug: 'clean-truck-check-en-espanol',
    title: "Clean Truck Check en español: prueba de emisiones móvil",
    excerpt: "Prueba de emisiones para camiones en California: qué es el Clean Truck Check, qué prueba necesita su camión y cómo hacerla en su yarda. Le explicamos todo.",
    published_at: '2026-10-24',
    body: "**Respuesta corta:** el Clean Truck Check es el programa de CARB que exige pruebas de emisiones periódicas a la mayoría de los camiones diésel y de combustible alternativo de más de 14,000 libras GVWR que circulan en California. Los camiones 2013 y más nuevos hacen una prueba OBD, y los diésel 2012 y más viejos sin OBD hacen una prueba de humo (opacidad) con inspección visual. Diesel Dynamix hace la prueba de emisiones para camiones en su yarda, en el sur de California.\n\n## ¿Qué es el Clean Truck Check?\n\nEs el programa de inspección para vehículos pesados de CARB (California Air Resources Board). Mucha gente lo llama \"el smog para camiones diésel\", pero no es el mismo smog check de los carros. Es un programa aparte, con sus propias reglas, para vehículos de trabajo pesados.\n\nEl programa cubre a la mayoría de los vehículos diésel y de combustible alternativo de más de 14,000 libras de peso bruto vehicular (GVWR) que operan en California. Eso incluye tractocamiones, camiones de caja, camiones de volteo, grúas, autobuses, camiones de basura, camiones de construcción y agrícolas, y casas rodantes de más de 14,000 libras cuando entran en el programa. Si tiene dudas sobre un caso especial, revise las reglas de CARB para su vehículo.\n\n## Requisitos del Clean Truck Check\n\nLos requisitos principales son tres:\n\n1. **Registrar cada camión en CTC-VIS.** Es el sistema de CARB donde el dueño reporta sus vehículos.\n2. **Pagar la cuota anual de cumplimiento.** CARB cobra una cuota por cada vehículo cada año. El monto lo fija CARB y aparece en CTC-VIS.\n3. **Pasar la prueba de emisiones a tiempo.** Cada camión tiene su fecha límite en CTC-VIS.\n\n## ¿Qué prueba necesita mi camión?\n\nDepende del tipo de motor y del año del motor:\n\n- **Diésel 2013 y más nuevos:** prueba OBD verificada por CARB. El técnico se conecta al sistema de diagnóstico del camión.\n- **Diésel 2012 y más viejos sin OBD:** prueba de humo (prueba de opacidad) más una inspección visual.\n- **Combustible alternativo 2018 y más nuevos:** prueba OBD verificada por CARB.\n- **Combustible alternativo 2017 y más viejos sin OBD:** inspección visual.\n\nMás detalles en inglés: [prueba OBD](/services/obd-testing) y [prueba de opacidad](/services/smoke-opacity-test).\n\n## ¿Cada cuánto es el Clean Truck Check?\n\nHoy, la mayoría de los vehículos cubiertos hacen la prueba **dos veces al año**. Según la regla original de CARB, los vehículos con OBD pasarían a **cuatro pruebas al año a partir del 1 de octubre de 2027**. Hay una propuesta de ley para bajarlo a una vez al año, así que esto puede cambiar. Su fecha límite exacta siempre aparece en CTC-VIS.\n\n## ¿Cuánto cuesta el Clean Truck Check?\n\nHay dos costos diferentes:\n\n- **La cuota anual de CARB**, por vehículo, que se paga en CTC-VIS.\n- **El costo de la prueba**, que lo cobra el técnico que hace la prueba.\n\nNuestro precio depende de cuántos camiones son, del tipo de prueba y de la ubicación. Para flotillas damos precio por camión. Pida su cotización por teléfono o WhatsApp al (858) 342-8328.\n\n## Camiones de otro estado y camiones mexicanos\n\nSí aplica. El Clean Truck Check cubre a los camiones que circulan en California, sin importar dónde estén registrados. Eso incluye camiones de otros estados y camiones de México. Si usted cruza por Otay Mesa o Calexico, o entra a los puertos, su camión necesita estar al corriente. Más información en inglés: [camiones de otro estado](/blog/clean-truck-check-out-of-state-trucks).\n\n## Multas y DMV hold de CARB\n\nSi no cumple, hay consecuencias:\n\n- **DMV hold:** para camiones registrados en California, el DMV puede bloquear la renovación del registro hasta que el camión esté en cumplimiento.\n- **Multas y citaciones de CARB:** CARB puede poner citaciones y multas.\n\nSi ya se le pasó la fecha límite, no espere más. Lea [qué hacer si se le pasó la fecha](/blog/missed-clean-truck-check-deadline) (en inglés).\n\n## Si su camión falló la prueba de humo o la prueba OBD\n\nSi su camión falló, necesita una reparación y luego una nueva prueba. Las causas más comunes son:\n\n- La luz de check engine prendida.\n- Monitores de preparación (readiness monitors) que no están listos.\n- Fallas del DPF o del sistema de emisiones.\n- Equipo de emisiones alterado o quitado (delete).\n\nNosotros no hacemos reparaciones. Hacemos la prueba y le explicamos el resultado en palabras sencillas para que su mecánico sepa por dónde empezar. Tampoco ayudamos con deletes del DPF: un sistema quitado o alterado no pasa y es ilegal.\n\n## Cómo registrar su camión en CTC-VIS\n\nEl registro en CTC-VIS lo hace el dueño del vehículo en el sistema de CARB. Ahí reporta cada camión, paga la cuota anual y ve sus fechas límite. Si se le complica, nosotros le ayudamos con sus preguntas sobre CTC-VIS. Tenemos una [guía de registro en CTC-VIS](/blog/ctc-vis-registration-guide) en inglés.\n\n## Pasos prácticos para troqueros\n\n1. Revise el GVWR en la etiqueta de la puerta del chofer. Si es de más de 14,000 libras, probablemente su camión está cubierto.\n2. Confirme el año del motor para saber qué prueba le toca.\n3. Entre a CTC-VIS y revise su fecha límite.\n4. Asegúrese de que la luz de check engine esté apagada y de que no haya fallas de emisiones.\n5. Agende su prueba antes de la fecha límite.\n\n## Cómo le ayuda Diesel Dynamix\n\nDiesel Dynamix es un servicio independiente de pruebas móviles. No somos CARB ni una agencia del gobierno. Hacemos la prueba de emisiones a domicilio: vamos a su yarda, obra, terminal, puerto o casa. No tiene que manejar a ningún lado.\n\n- Le explicamos el resultado en palabras sencillas y le damos su próxima fecha.\n- Le ayudamos con preguntas de CTC-VIS y le mandamos recordatorios.\n- Para flotillas: precio por camión, visitas programadas, visitas temprano en la mañana y registros por VIN. Vea [pruebas para flotillas](/services/fleet-testing).\n\nDamos servicio en Los Ángeles, Long Beach y el [Puerto de Long Beach](/service-areas/ports/port-of-long-beach), el Condado de Orange, el Inland Empire, Riverside, San Bernardino, Ontario, Fontana, San Diego y El Centro en el Valle Imperial. Vea nuestras [áreas de servicio](/service-areas).\n\nLlame o mande texto al (858) 342-8328, escríbanos por WhatsApp o [agende en línea](/book).",
  },
  {
    slug: 'clean-truck-check-2026-2027-deadlines',
    title: "Clean Truck Check 2027 quarterly testing and deadlines",
    excerpt: "Clean Truck Check 2027 quarterly testing: what CARB's rule says, how your 2026 deadlines work, what may still change and how to plan your fleet's tests now.",
    published_at: '2026-10-24',
    body: "**Short answer:** Most trucks covered by Clean Truck Check currently test twice a year. Under CARB's original rule, OBD-equipped vehicles move to four tests a year (quarterly testing) starting October 1, 2027. A bill has proposed cutting testing to once a year, so the schedule may change; your own deadlines are always in CARB's CTC-VIS system.\n\n## Where Clean Truck Check stands in late 2026\n\nClean Truck Check is CARB's heavy-duty inspection and maintenance program, often called HD I/M. It covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California, including out-of-state and international trucks.\n\nToday, the picture for most owners is:\n\n- Each vehicle is reported in CTC-VIS and the owner pays CARB's annual compliance fee per vehicle.\n- Most covered vehicles test **twice a year**.\n- Each vehicle has its own deadlines, shown in CTC-VIS.\n- Missing a deadline can lead to a DMV registration hold for California-registered vehicles, plus CARB citations and penalties.\n\n## When is my Clean Truck Check due in 2026?\n\nYour deadline is specific to your vehicle, and the only reliable place to see it is CTC-VIS. Log in, find the vehicle by VIN and look at the next compliance deadline.\n\nPeople often ask whether the deadline is tied to the DMV registration month, and how the testing window works. CARB sets those details, and how they apply can depend on the vehicle and its registration. We don't want you to plan around a guess, so check the deadline and window shown for your vehicle in CTC-VIS, or check CARB's rules. If you want a second pair of eyes, we can help you read what CTC-VIS shows.\n\n## Clean Truck Check 2027: quarterly testing for OBD trucks\n\nUnder CARB's original rule, OBD-equipped vehicles move from twice-a-year testing to **four tests a year from October 1, 2027**. That affects:\n\n- 2013 and newer diesel engines, which use the CARB-verified OBD test.\n- 2018 and newer alternative-fuel engines, which also use the OBD test.\n\nFor a fleet, quarterly testing roughly doubles the number of OBD tests per truck each year. That means more scheduling, more chances to miss a deadline and more value in keeping trucks fault-free between tests.\n\nNon-OBD vehicles (2012 and older diesels getting a smoke opacity test and visual inspection, and 2017 and older alternative-fuel engines getting a visual inspection) are not part of that OBD change. Check CTC-VIS for their schedule.\n\n## What might change: the once-a-year bill\n\nA bill has proposed cutting Clean Truck Check testing to once a year. If it passes, the October 2027 quarterly schedule and today's twice-a-year schedule could change. Until something is final, plan on the rule as it stands and watch CARB updates and CTC-VIS.\n\nWe won't predict how it turns out. What we can say is that owners who keep testing on time under the current rule are not hurt by any change. Owners who wait for a change and miss a deadline can end up with a registration hold.\n\n## How to plan your 2026-2027 testing now\n\nYou don't need to wait for January 2027 or for the bill to settle. A few steps make the next year easier:\n\n1. **List every covered vehicle.** Include out-of-state units that run in California.\n2. **Pull each deadline from CTC-VIS.** Put them in one calendar.\n3. **Group trucks by deadline.** One visit can cover several trucks due around the same time.\n4. **Pay the annual compliance fee for each vehicle.** The fee is separate from the testing fee. See [the compliance fee explained](/blog/clean-truck-check-compliance-fee-explained).\n5. **Keep trucks ready to pass.** Fix check engine lights, readiness monitor issues and DPF faults between tests. See [readiness monitors and the check engine light](/blog/readiness-monitors-check-engine-light-clean-truck-check).\n6. **Set up recurring testing.** If quarterly testing takes effect, a standing schedule is easier than booking truck by truck.\n7. **Plan for retests.** A failed truck needs repair and a retest before the deadline. See [what to do after a failed test](/blog/failed-clean-truck-check-what-to-do).\n\n## What a missed deadline costs you\n\nDeadlines matter more as testing gets more frequent. For California-registered vehicles, a missed Clean Truck Check deadline can lead to a DMV registration hold. CARB can also issue citations and penalties. Out-of-state and international trucks are covered too when they operate in California, so their deadlines matter just as much. If a deadline has already passed, test as soon as you can. See [missed Clean Truck Check deadline](/blog/missed-clean-truck-check-deadline) and [DMV registration holds](/blog/dmv-registration-hold-clean-truck-check).\n\n## How early can I test before my deadline?\n\nCARB sets when a test counts toward a deadline. Check the testing window shown for your vehicle in CTC-VIS or in CARB's rules before you book far ahead. If you are close to a deadline, book now; there is little upside in waiting.\n\n## How Diesel Dynamix helps\n\nDiesel Dynamix is an independent mobile testing service in Southern California, not CARB. As testing gets more frequent, the time lost driving trucks to a test site adds up. We test at your yard, terminal, jobsite or port, so trucks stay close to work.\n\n- We give you the next due date after each test and can send reminders.\n- Fleets get recurring visits, early-morning visits, per-truck pricing and records per VIN. See [fleet testing](/services/fleet-testing).\n- We help with CTC-VIS questions and explain results in plain English.\n\nFor background on frequency, read [how often trucks need Clean Truck Check](/blog/how-often-do-trucks-need-clean-truck-check). To get on a schedule, call or text (858) 342-8328 or [book a test](/book).",
  },
  {
    slug: 'clean-truck-check-exemptions',
    title: "Clean Truck Check exemptions list: is your truck exempt?",
    excerpt: "Clean Truck Check exemptions list: which vehicles fall outside the program, which cases CARB decides, and how to confirm your truck's status before you skip.",
    published_at: '2026-10-24',
    body: "**Short answer:** The clearest way a vehicle falls outside Clean Truck Check is being rated 14,000 lb GVWR or less. Beyond that, exemptions for new trucks, zero-emission trucks, agricultural vehicles, emergency vehicles and non-operational trucks are set by CARB, and the details matter. Before you skip a test, confirm your vehicle's status in CTC-VIS or CARB's rules.\n\n## Why exemptions need a careful look\n\nClean Truck Check covers most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California. That includes out-of-state and international trucks, plus buses, refuse trucks, construction trucks, agricultural trucks and motorhomes over 14,000 lb where they fall under the program.\n\nExemptions are CARB's decision, not ours, and the rules can be specific about conditions, timing and paperwork. Getting it wrong can mean a missed deadline. For California-registered vehicles that can lead to a DMV registration hold, and CARB can issue citations and penalties. So this guide tells you what to ask and where to check, rather than guessing for you.\n\n## Is my truck exempt from Clean Truck Check?\n\nStart with these questions:\n\n1. **Is the GVWR 14,000 lb or less?** If so, it is not in Clean Truck Check. Check the label on the driver's door or door jamb.\n2. **Is it diesel or alternative fuel?** The program is built around these engines.\n3. **Does it operate in California?** Registration state does not matter.\n4. **Does it fit a special category?** If you think it does, confirm with CARB before you skip anything.\n\nIf the first three answers point to \"covered\", treat the truck as covered until CARB or CTC-VIS shows otherwise.\n\n## Common exemption questions\n\n### New trucks: how long are they exempt?\n\nOwners often hear that new trucks get a break for their first few model years. CARB sets whether and how that applies and when the first test is due. Look up the vehicle in CTC-VIS for its first deadline, or check CARB's rules. Don't assume a new truck has no deadline.\n\n### Zero-emission and electric trucks\n\nElectric and other zero-emission trucks don't burn diesel or alternative fuel, and owners often ask whether they still have to register in CTC-VIS. CARB decides what reporting applies. Check CARB's rules or CTC-VIS for your vehicle.\n\n### Agricultural and farm vehicles\n\nAgricultural trucks over 14,000 lb are included in the program where they fall under it. Being a farm truck alone does not make a vehicle exempt. CARB has specific rules for some agricultural vehicles, so check CARB's rules for your truck.\n\n### Emergency and military vehicles\n\nFire trucks, other emergency vehicles and military vehicles have their own treatment under CARB's rules. If you run one of these, check CARB's rules for your vehicle.\n\n### Two-engine street sweepers and special equipment\n\nSome vehicles, like street sweepers with an auxiliary engine, raise questions about which engine is tested. CARB's rules address special vehicles. Check them for your equipment.\n\n### Off-road vehicles\n\nClean Truck Check is about vehicles that operate on California roads. If your equipment is truly off-road, CARB's rules will say whether it falls under this program. Check before you skip testing on anything that is registered for road use.\n\n### Non-operational (PNO) trucks and trucks not driven in California\n\nIf a truck is on Planned Non-Operation (PNO) status with the DMV, or it doesn't operate in California, owners ask whether testing still applies. CARB sets how these cases are handled in CTC-VIS. Check CARB's rules and update the vehicle's information in CTC-VIS. Our [CTC-VIS registration guide](/blog/ctc-vis-registration-guide) explains how to manage vehicle records.\n\n### Low-use and seasonal trucks\n\nLow mileage or seasonal use does not by itself make a truck exempt. If CARB has a provision that fits your situation, it will be in CARB's rules. Until you confirm one applies, keep the truck on schedule.\n\n## Exemption myths to avoid\n\nA few assumptions cause problems every year:\n\n- **\"My truck is registered out of state, so it's exempt.\"** Not true. Out-of-state and international trucks that operate in California are covered.\n- **\"It's a motorhome, not a work truck.\"** Motorhomes over 14,000 lb can fall under the program. See [Clean Truck Check for motorhomes](/blog/motorhome-clean-truck-check).\n- **\"It passed last time, so I'm set.\"** Covered vehicles test on a recurring schedule, not once.\n- **\"I paid the fee, so I don't need a test.\"** The annual compliance fee and the test are separate requirements.\n\n## What to do if you think your truck is exempt\n\n1. **Read the GVWR.** If it's 14,000 lb or less, you're outside the program.\n2. **Look the vehicle up in CTC-VIS.** Check its status and deadlines.\n3. **Check CARB's rules** for the category you think applies.\n4. **Keep records** of what you found and any exemption you claim.\n5. **If you're unsure, test.** A passed test keeps you compliant while you sort out the question.\n\n## If your truck is not exempt\n\nThen it needs the test for its engine:\n\n- **2013 and newer diesel:** CARB-verified [OBD test](/services/obd-testing).\n- **2012 and older diesel without OBD:** [smoke opacity test](/services/smoke-opacity-test) plus a visual inspection.\n- **2018 and newer alternative fuel:** CARB-verified OBD test.\n- **2017 and older alternative fuel without OBD:** visual inspection.\n\nMost covered vehicles currently test twice a year. Under CARB's original rule, OBD-equipped vehicles move to four tests a year from October 1, 2027, and a bill has proposed cutting testing to once a year. See [2026-2027 deadlines](/blog/clean-truck-check-2026-2027-deadlines).\n\n## How Diesel Dynamix helps\n\nDiesel Dynamix is an independent mobile testing service, not CARB, so we don't grant or decide exemptions. What we do is test covered vehicles at your yard, jobsite, terminal, port or home across Southern California, explain results in plain English and give you the next due date. We can also walk through what CTC-VIS shows for your vehicles.\n\nFor more on who's covered, see [which vehicles need Clean Truck Check](/blog/which-vehicles-need-clean-truck-check) and our [Clean Truck Check FAQ](/clean-truck-check/faq). Call or text (858) 342-8328 or [book a test](/book).",
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

Regards,
Kameron
Diesel Dynamix
(858) 342-8328
service@dieseldynamix.com`,
  },
  {
    id: '6f1b2a10-0000-4000-8000-000000000002',
    name: 'Follow-up 1: quick check-in',
    kind: 'follow_up',
    subject: 'Re: Mobile Clean Truck Check testing for {{company}}',
    body: `Hi {{first_name}},

Just following up on my note about mobile Clean Truck Check testing. If your next testing window is coming up, we can usually schedule an on-site visit quickly.

Reply with your truck count and location and I’ll send a quote, or call/WhatsApp **(858) 342-8328**.

Regards,
Kameron
Diesel Dynamix
(858) 342-8328
service@dieseldynamix.com`,
  },
  {
    id: '6f1b2a10-0000-4000-8000-000000000003',
    name: 'Follow-up 2: last note',
    kind: 'follow_up',
    subject: 'Should I close your file, {{first_name}}?',
    body: `Hi {{first_name}},

I haven’t heard back, so I’ll assume the timing isn’t right. If anything changes, we’re here whenever {{company}} needs Clean Truck Check testing, anywhere in Southern California.

You can book online any time at [dieseldynamix.com/book](https://dieseldynamix.com/book) or call **(858) 342-8328**.

Regards,
Kameron
Diesel Dynamix
(858) 342-8328
service@dieseldynamix.com`,
  },
];
