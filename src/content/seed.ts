/**
 * Default content. The live site reads these records from Supabase (editable
 * in /admin) and falls back to this file when the database is not configured
 * or unreachable. supabase/seed.sql loads the same records into the database.
 */

export type Region = 'Southern California' | 'Central Valley' | 'Bay Area & Northern California' | 'Central Coast';

export const REGIONS: Region[] = [
  'Southern California',
  'Central Valley',
  'Bay Area & Northern California',
  'Central Coast',
];

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
};

export type RequirementRow = { vehicle: string; method: string };

export type Counter = { value: number; suffix?: string; label: string };

export type Settings = {
  requirements: RequirementRow[];
  frequency_text: string;
  counters: Counter[];
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
    slug: 'imperial-valley',
    name: 'Imperial Valley',
    region: 'Southern California',
    lat: 32.79,
    lng: -115.56,
    sort: 5,
    intro:
      'Agricultural haulers and cross-border carriers in El Centro, Calexico and Brawley can get Clean Truck Check testing on-site. We travel to the Imperial Valley so your trucks never have to leave the field or the yard.',
  },
  {
    slug: 'bakersfield',
    name: 'Bakersfield',
    region: 'Central Valley',
    lat: 35.37,
    lng: -119.02,
    sort: 6,
    intro:
      'Oilfield service trucks, ag haulers and Highway 99 carriers in Bakersfield and Kern County can book mobile Clean Truck Check testing at their yard, so your trucks stay compliant without losing a working day.',
  },
  {
    slug: 'fresno',
    name: 'Fresno',
    region: 'Central Valley',
    lat: 36.74,
    lng: -119.79,
    sort: 7,
    intro:
      'Fresno is a hub for produce, packing and regional freight. We test single trucks and full fleets on-site across Fresno and Clovis, with scheduling around harvest-season peaks.',
  },
  {
    slug: 'visalia',
    name: 'Visalia',
    region: 'Central Valley',
    lat: 36.33,
    lng: -119.29,
    sort: 8,
    intro:
      'Dairy, citrus and farm-equipment haulers in Visalia, Tulare and the surrounding county can book on-site Clean Truck Check testing at the farm, the yard or the shop.',
  },
  {
    slug: 'modesto',
    name: 'Modesto',
    region: 'Central Valley',
    lat: 37.64,
    lng: -120.99,
    sort: 9,
    intro:
      'From food-processing fleets to independent owner-operators, Modesto and Stanislaus County trucks can be tested where they park. Tell us how many trucks you run and we will plan the visit.',
  },
  {
    slug: 'stockton',
    name: 'Stockton',
    region: 'Central Valley',
    lat: 37.96,
    lng: -121.29,
    sort: 10,
    intro:
      'Stockton’s port, rail yards and I-5 distribution centers mean a lot of heavy-duty traffic. Our mobile testers come to your Stockton or Lodi location for OBD and opacity testing.',
  },
  {
    slug: 'oakland',
    name: 'Oakland',
    region: 'Bay Area & Northern California',
    lat: 37.8,
    lng: -122.27,
    sort: 11,
    intro:
      'Port of Oakland drayage operators and East Bay fleets can have Clean Truck Check testing done on-site, avoiding Bay Area traffic and keeping trucks ready for the next turn.',
  },
  {
    slug: 'san-jose',
    name: 'San Jose',
    region: 'Bay Area & Northern California',
    lat: 37.34,
    lng: -121.89,
    sort: 12,
    intro:
      'Construction, delivery and municipal-contract fleets in San Jose and the South Bay can schedule mobile testing at the yard or jobsite, early morning or late afternoon.',
  },
  {
    slug: 'sacramento',
    name: 'Sacramento',
    region: 'Bay Area & Northern California',
    lat: 38.58,
    lng: -121.49,
    sort: 13,
    intro:
      'Sacramento sits where I-5 meets I-80, making it a natural base for regional carriers. We test trucks on-site across the Sacramento region, from West Sacramento to Rancho Cordova and Elk Grove.',
  },
  {
    slug: 'redding',
    name: 'Redding',
    region: 'Bay Area & Northern California',
    lat: 40.59,
    lng: -122.39,
    sort: 14,
    intro:
      'Logging, construction and long-haul trucks in Redding and Shasta County are covered too. We schedule Northern California routes so remote yards get the same on-site service as the big metros.',
  },
  {
    slug: 'eureka',
    name: 'Eureka',
    region: 'Bay Area & Northern California',
    lat: 40.8,
    lng: -124.16,
    sort: 15,
    intro:
      'North Coast fleets in Eureka, Arcata and Humboldt County are often hours from the nearest tester. We plan regular North Coast visits, so tell us early and we can group trucks into one trip.',
  },
  {
    slug: 'santa-barbara',
    name: 'Santa Barbara',
    region: 'Central Coast',
    lat: 34.42,
    lng: -119.7,
    sort: 16,
    intro:
      'Contractors, agricultural fleets and service trucks across Santa Barbara, Goleta and Santa Maria can get mobile Clean Truck Check testing without leaving the job.',
  },
  {
    slug: 'san-luis-obispo',
    name: 'San Luis Obispo',
    region: 'Central Coast',
    lat: 35.28,
    lng: -120.66,
    sort: 17,
    intro:
      'From wine-country haulers to Highway 101 carriers, San Luis Obispo County trucks can be tested on-site in SLO, Paso Robles and the Five Cities area.',
  },
  {
    slug: 'salinas',
    name: 'Salinas',
    region: 'Central Coast',
    lat: 36.68,
    lng: -121.66,
    sort: 18,
    intro:
      'The Salinas Valley moves a large share of the nation’s fresh produce. We test reefer tractors, farm trucks and local fleets on-site across Salinas, Monterey and Watsonville.',
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
    question: 'Does Clean Truck Check apply to my truck?',
    answer:
      'Most diesel and alternative-fuel vehicles over 14,000 lb GVWR that operate in California are covered, including out-of-state and Mexico-registered trucks that drive in the state. Some exemptions exist. Check your vehicle in CARB’s CTC-VIS system or ask us and we will help you work it out.',
  },
  {
    id: 'how-often',
    category: 'Program',
    sort: 3,
    question: 'How often do I need to test?',
    answer:
      'Most covered trucks currently test twice a year. Under the original rule, OBD-equipped vehicles move to four tests a year starting October 1, 2027, and a bill has proposed reducing testing to once a year. Requirements can change, so always confirm your deadlines in CARB’s CTC-VIS system.',
  },
  {
    id: 'mobile',
    category: 'Our service',
    sort: 4,
    question: 'Do you really come to me?',
    answer:
      'Yes. We are a mobile testing service. We come to your truck, yard, jobsite or terminal anywhere in California. You do not need to drive to a shop.',
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
    { value: 58, label: 'California counties covered' },
    { value: 18, label: 'Cities with local service pages' },
    { value: 4, label: 'Regions served statewide' },
  ],
};
