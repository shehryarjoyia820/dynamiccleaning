import type { MetadataRoute } from 'next';
import { PORTS } from '@/content/ports';
import { getPosts, getServiceAreas } from '@/lib/content';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

const STATIC = [
  '',
  '/about',
  '/clean-truck-check',
  '/why-california-enforces-it',
  '/mobile-testing-services',
  '/how-testing-works',
  '/fleet-testing',
  '/obd-testing',
  '/smoke-opacity-test',
  '/service-areas',
  '/faq',
  '/gallery',
  '/blog',
  '/book',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies',
  '/disclaimer',
  '/accessibility',
  '/do-not-sell',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [areas, posts] = await Promise.all([getServiceAreas(), getPosts()]);
  const now = new Date();
  return [
    ...STATIC.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, priority: p === '' ? 1 : p === '/book' ? 0.9 : 0.7 })),
    ...areas.map((a) => ({ url: `${SITE.url}/service-areas/${a.slug}`, lastModified: now, priority: 0.8 })),
    ...PORTS.map((p) => ({ url: `${SITE.url}/ports/${p.slug}`, lastModified: now, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.published_at), priority: 0.6 })),
  ];
}
