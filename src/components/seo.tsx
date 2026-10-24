import type { Metadata } from 'next';
import { LINKS, SITE } from '@/lib/site';
import type { Faq } from '@/content/seed';
import { pageSeo } from '@/lib/page-seo';

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for </script> safety.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

const BRAND_SUFFIX = ` | ${SITE.name}`;
/** Google shows about 60 characters of a title; longer ones drop the brand suffix instead of getting cut. */
const TITLE_MAX = 60;
export const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: `${SITE.name}: mobile Clean Truck Check testing in Southern California` };

export function pageMeta({ title: baseTitle, description: baseDescription, path }: { title: string; description: string; path: string }): Metadata {
  // Keyword-researched title and description win when the page has one (src/content/page-seo.json).
  const seo = pageSeo(path);
  const title = seo?.title || baseTitle;
  const description = seo?.description || baseDescription;
  const fits = title.length + BRAND_SUFFIX.length <= TITLE_MAX;
  return {
    title: fits ? title : { absolute: title },
    description,
    alternates: { canonical: path },
    // A page-level openGraph replaces the site-wide one, so it repeats the shared fields and image.
    openGraph: { type: 'website', siteName: SITE.name, locale: 'en_US', title: fits ? title + BRAND_SUFFIX : title, description, url: path, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
  };
}

// Service area: Southern California only.
const SOCAL_COUNTIES = ['Los Angeles', 'Orange', 'Riverside', 'San Bernardino', 'San Diego', 'Imperial'].map((c) => ({
  '@type': 'AdministrativeArea',
  name: `${c} County, California`,
}));

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/brand/app-icon.svg`,
    image: `${SITE.url}/opengraph-image`,
    description: SITE.description,
    telephone: SITE.phoneE164,
    email: SITE.emailService,
    priceRange: '$$',
    areaServed: SOCAL_COUNTIES,
    founder: { '@type': 'Person', name: SITE.ceo, jobTitle: 'CEO' },
    contactPoint: [
      { '@type': 'ContactPoint', telephone: SITE.phoneE164, contactType: 'customer service', email: SITE.emailService, areaServed: 'US-CA', availableLanguage: ['English'] },
    ],
    makesOffer: {
      '@type': 'Offer',
      itemOffered: { '@id': `${SITE.url}/#service` },
    },
  };
}

export function serviceSchema(areaName?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': areaName ? undefined : `${SITE.url}/#service`,
    serviceType: 'Mobile Clean Truck Check emissions testing',
    name: areaName ? `Mobile Clean Truck Check testing in ${areaName}` : 'Mobile Clean Truck Check testing',
    provider: { '@id': `${SITE.url}/#business` },
    areaServed: areaName ? { '@type': 'City', name: `${areaName}, California` } : SOCAL_COUNTIES,
    description:
      'On-site CARB Clean Truck Check testing for heavy-duty diesel and alternative-fuel trucks: OBD testing, smoke opacity testing and visual inspections.',
    isRelatedTo: { '@type': 'GovernmentService', name: 'CARB Clean Truck Check', url: LINKS.carbCtc },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}
