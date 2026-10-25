import 'server-only';
import { publicClient, serviceClient } from '@/lib/supabase/clients';
import { ensureSchema } from '@/lib/db-init';
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
  return areas.find((a) => a.slug === slug) ?? (await freshRow<ServiceArea>('service_areas', slug, true));
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

export async function getPosts(): Promise<Post[]> {
  const run = (cols: string) =>
    query(
      (db) =>
        db
          .from('posts')
          .select(cols)
          .eq('published', true)
          .order('published_at', { ascending: false }) as unknown as PromiseLike<{ data: Post[] | null; error: unknown }>,
      null as Post[] | null,
    );
  // Rich columns arrive with the blog-media upgrade; fall back to the basic ones until then.
  return (await run('slug,title,excerpt,body,published_at,body_html,cover_url,cover_alt')) ?? (await run('slug,title,excerpt,body,published_at')) ?? POSTS;
}

export async function getPost(slug: string) {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? (await freshRow<Post>('posts', slug, true));
}

/**
 * A page that isn't in the cached content yet may have just been added by a pending database
 * upgrade (new guides, new city pages). Apply pending upgrades, then read that one row uncached,
 * so new content goes live on its first visit without anyone opening the admin.
 */
async function freshRow<T>(table: 'posts' | 'service_areas', slug: string, needsPublished: boolean): Promise<T | null> {
  const db = serviceClient();
  if (!db || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return null;
  try {
    await ensureSchema();
    let q = db.from(table).select('*').eq('slug', slug);
    if (needsPublished) q = q.eq('published', true);
    const { data } = await q.maybeSingle();
    return (data as T) ?? null;
  } catch {
    return null;
  }
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
