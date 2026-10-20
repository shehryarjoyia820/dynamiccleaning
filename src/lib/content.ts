import 'server-only';
import { publicClient } from '@/lib/supabase/clients';
import {
  FAQS,
  POSTS,
  SERVICE_AREAS,
  SETTINGS,
  type Faq,
  type Post,
  type ServiceArea,
  type Settings,
} from '@/content/seed';

/**
 * Content reads. Each one tries Supabase first and falls back to the seed
 * file, so the site always renders even before the database is set up.
 */
async function query<T>(run: (db: NonNullable<ReturnType<typeof publicClient>>) => PromiseLike<{ data: T | null; error: unknown }>, fallback: T): Promise<T> {
  const db = publicClient();
  if (!db) return fallback;
  try {
    const { data, error } = await run(db);
    if (error || data == null) return fallback;
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

export function getServiceAreas(): Promise<ServiceArea[]> {
  return query(
    (db) =>
      db
        .from('service_areas')
        .select('slug,name,region,intro,lat,lng,sort')
        .eq('published', true)
        .order('sort') as unknown as PromiseLike<{ data: ServiceArea[] | null; error: unknown }>,
    SERVICE_AREAS,
  );
}

export async function getServiceArea(slug: string) {
  const areas = await getServiceAreas();
  return areas.find((a) => a.slug === slug) ?? null;
}

export function getFaqs(): Promise<Faq[]> {
  return query(
    (db) =>
      db
        .from('faqs')
        .select('id,question,answer,category,sort')
        .eq('published', true)
        .order('sort') as unknown as PromiseLike<{ data: Faq[] | null; error: unknown }>,
    FAQS,
  );
}

export function getPosts(): Promise<Post[]> {
  return query(
    (db) =>
      db
        .from('posts')
        .select('slug,title,excerpt,body,published_at')
        .eq('published', true)
        .order('published_at', { ascending: false }) as unknown as PromiseLike<{ data: Post[] | null; error: unknown }>,
    POSTS,
  );
}

export async function getPost(slug: string) {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getSettings(): Promise<Settings> {
  const rows = await query(
    (db) =>
      db.from('site_settings').select('key,value') as unknown as PromiseLike<{
        data: { key: string; value: unknown }[] | null;
        error: unknown;
      }>,
    [] as { key: string; value: unknown }[],
  );
  const merged: Settings = { ...SETTINGS };
  for (const row of rows) {
    if (row.key in merged) (merged as Record<string, unknown>)[row.key] = row.value;
  }
  return merged;
}
