export const SITE = {
  name: 'Diesel Dynamix',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://dieseldynamix.com').replace(/\/$/, ''),
  tagline: 'Stay Compliant. Keep Moving.',
  description:
    'Mobile CARB Clean Truck Check testing anywhere in Southern California. Heavy-duty truck emissions testing at your yard: OBD tests, smoke opacity tests and visual inspections.',
  ceo: 'Kameron',
  phoneDisplay: '(858) 342-8328',
  phoneE164: '+18583428328',
  whatsapp: '18583428328',
  whatsappMessage: 'Hi Diesel Dynamix, I need Clean Truck Check testing for my truck(s).',
  emailService: 'service@dieseldynamix.com',
  areaServed: 'Southern California',
} as const;

export const LINKS = {
  tel: `tel:${SITE.phoneE164}`,
  // "?&body=" works on both iPhone and Android messaging apps.
  sms: `sms:${SITE.phoneE164}?&body=${encodeURIComponent('Hi Diesel Dynamix, I need a Clean Truck Check test. ')}`,
  whatsapp: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`,
  mailService: `mailto:${SITE.emailService}`,
  carbCtc: 'https://ww2.arb.ca.gov/our-work/programs/CTC',
  carbCtcVis: 'https://cleantruckcheck.arb.ca.gov/',
  carbFaq: 'https://ww2.arb.ca.gov/our-work/programs/CTC/faq',
};

export type NavItem = { href: string; label: string; children?: { href: string; label: string }[] };

export const NAV: NavItem[] = [
  {
    href: '/clean-truck-check',
    label: 'Clean Truck Check',
    children: [
      { href: '/clean-truck-check', label: 'Clean Truck Check Explained' },
      { href: '/clean-truck-check/why-california-enforces-it', label: 'Why California Enforces It' },
      { href: '/clean-truck-check/faq', label: 'FAQ' },
    ],
  },
  {
    href: '/services',
    label: 'Services',
    children: [
      { href: '/services', label: 'Mobile Testing Services' },
      { href: '/services/obd-testing', label: 'CARB OBD Test' },
      { href: '/services/smoke-opacity-test', label: 'Smoke Opacity Test' },
      { href: '/services/how-testing-works', label: 'How Testing Works' },
      { href: '/services/fleet-testing', label: 'Fleet Testing' },
    ],
  },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/contact', label: 'Contact' },
];

export const FOOTER_LINKS = [
  {
    title: 'Clean Truck Check',
    links: [
      { href: '/clean-truck-check', label: 'Program Explained' },
      { href: '/clean-truck-check/why-california-enforces-it', label: 'Why California Enforces It' },
      { href: '/clean-truck-check/faq', label: 'FAQ' },
      { href: '/blog', label: 'Blog & Updates' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/services', label: 'Mobile Testing' },
      { href: '/services/obd-testing', label: 'CARB OBD Test' },
      { href: '/services/smoke-opacity-test', label: 'Smoke Opacity Test' },
      { href: '/services/how-testing-works', label: 'How Testing Works' },
      { href: '/services/fleet-testing', label: 'Fleet Testing' },
      { href: '/service-areas', label: 'Service Areas' },
      { href: '/service-areas/ports/port-of-long-beach', label: 'Port of Long Beach' },
      { href: '/service-areas/ports/port-of-los-angeles', label: 'Port of Los Angeles' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/book', label: 'Book Testing' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export const DISCLAIMER =
  'Diesel Dynamix is an independent service provider. We are not the California Air Resources Board (CARB) and this is not a California government website.';
