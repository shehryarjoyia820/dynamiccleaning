import data from '@/content/page-seo.json';
import type { Faq } from '@/content/seed';

/**
 * Keyword-targeted SEO/AEO content per page (titles, descriptions, extra sections, FAQs and nearby
 * areas), written from the Southern California keyword research. Keyed by page path.
 */
export type PageSeo = {
  path: string;
  title?: string;
  description?: string;
  sections?: { heading: string; body: string }[];
  faqs?: { q: string; a: string }[];
  nearby?: string[];
};

const MAP = new Map<string, PageSeo>((data.pages as PageSeo[]).map((p) => [p.path, p]));

export function pageSeo(path: string): PageSeo | undefined {
  return MAP.get(path);
}

/** FAQ answers are shown as plain text: keep link text, drop Markdown link targets and bold marks. */
const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '');

/** The page's own FAQs plus its keyword FAQs (no repeated questions), for one FAQ list and one FAQPage schema. */
export function withSeoFaqs(path: string, faqs: Faq[]): Faq[] {
  const seen = new Set(faqs.map((f) => f.question.trim().toLowerCase()));
  const extra = (pageSeo(path)?.faqs ?? [])
    .filter((f) => !seen.has(f.q.trim().toLowerCase()))
    .map((f, i) => ({ id: `seo-${i}`, question: plain(f.q), answer: plain(f.a), category: 'General', sort: 1000 + i }));
  return [...faqs, ...extra];
}
