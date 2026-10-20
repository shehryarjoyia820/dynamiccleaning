import type { Metadata } from 'next';
import { LINKS, SITE } from '@/lib/site';
import type { Faq } from '@/content/seed';

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for </script> safety.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/brand/icon-color.svg`,
    image: `${SITE.url}/opengraph-image`,
    description: SITE.description,
    telephone: SITE.phoneE164,
    email: SITE.emailInfo,
    priceRange: '$$',
    areaServed: { '@type': 'State', name: 'California', sameAs: 'https://en.wikipedia.org/wiki/California' },
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
    areaServed: areaName ? { '@type': 'City', name: `${areaName}, California` } : { '@type': 'State', name: 'California' },
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
