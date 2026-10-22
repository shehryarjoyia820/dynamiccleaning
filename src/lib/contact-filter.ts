import 'server-only';
import { CITY_ZIPS } from '@/lib/campaigns';

export type ContactFilter = {
  list?: string;
  /** Priority 1-4, 0 = all */
  p?: number;
  source?: string;
  tag?: string;
  status?: string;
  /** Free text: email, name, company, city or ZIP code */
  q?: string;
};

const SOURCES = ['lead', 'subscriber', 'import', 'manual'];

/** Reads the filter from URL search params (shared by the Contacts page and its CSV export). */
export function readFilter(get: (k: string) => string | null | undefined): ContactFilter {
  const p = Number(get('p'));
  return {
    list: get('list')?.slice(0, 60) || undefined,
    p: [1, 2, 3, 4].includes(p) ? p : 0,
    source: SOURCES.includes(get('source') ?? '') ? get('source')! : undefined,
    tag: get('tag')?.slice(0, 60) || undefined,
    status: get('status')?.slice(0, 20) || undefined,
    q: (get('q') ?? '').trim().slice(0, 80) || undefined,
  };
}

/**
 * Search terms for the free-text box. A city name also matches its ZIP codes (imported lists
 * often misspell cities), and a 5-digit number matches that ZIP.
 */
export function searchOr(q: string, withDetails: boolean) {
  const clean = q.replace(/[%_,()*:"\\]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return null;
  const like = `%${clean}%`;
  const terms = [`email.ilike.${like}`, `name.ilike.${like}`, `company.ilike.${like}`];
  if (withDetails) {
    terms.push(`details->>City.ilike.${like}`);
    const zips = /^\d{5}$/.test(clean) ? [clean] : (CITY_ZIPS[clean.toLowerCase()] ?? []);
    for (const z of zips) terms.push(`details->>ZIP.like.${z}%`);
  }
  return terms.join(',');
}

// Minimal shape of a Supabase filter builder (each call returns the same builder type).
type Filterable = {
  eq(column: string, value: string | number): Filterable;
  contains(column: string, value: string[]): Filterable;
  or(filters: string): Filterable;
};

/** Applies the filter to a Supabase contacts query. `withPriority` = the list/priority columns exist. */
export function applyFilter<T>(query: T, f: ContactFilter, withPriority: boolean, opts: { skipPriority?: boolean } = {}): T {
  let q = query as unknown as Filterable;
  if (withPriority && f.list) q = q.eq('list_name', f.list);
  if (withPriority && f.p && !opts.skipPriority) q = q.eq('priority', f.p);
  if (f.source) q = q.eq('source', f.source);
  if (f.tag) q = q.contains('tags', [f.tag]);
  if (f.status) q = q.eq('status', f.status);
  const or = f.q ? searchOr(f.q, withPriority) : null;
  if (or) q = q.or(or);
  return q as T;
}
