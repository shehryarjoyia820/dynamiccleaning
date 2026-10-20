'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { LEAD_STATUSES, fromLaInput, requireStaff, userError } from '@/lib/admin';
import { CONTENT_TAG, serviceClient } from '@/lib/supabase/clients';
import { REGIONS } from '@/content/seed';
import { SITE } from '@/lib/site';
import { htmlToText, sanitizeBlogHtml } from '@/lib/sanitize';

const slug = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes');
const get = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function contentChanged(...paths: string[]) {
  revalidateTag(CONTENT_TAG);
  for (const p of paths) revalidatePath(p);
}

function fail(message: string): Promise<never> {
  return userError(message);
}

// ---------------------------------------------------------------- Leads

export async function updateLead(id: string, form: FormData) {
  const { db } = await requireStaff();
  const status = z.enum(LEAD_STATUSES).parse(get(form, 'status'));
  const assigned = get(form, 'assigned_to') || null;
  const appt = get(form, 'appointment_at');
  const { error } = await db
    .from('leads')
    .update({ status, assigned_to: assigned, appointment_at: appt ? fromLaInput(appt) : null })
    .eq('id', id);
  if (error) return fail(error.message);
  revalidatePath('/admin');
  revalidatePath(`/admin/leads/${id}`);
}

export async function setLeadStatus(id: string, status: string) {
  const { db } = await requireStaff();
  const { error } = await db.from('leads').update({ status: z.enum(LEAD_STATUSES).parse(status) }).eq('id', id);
  if (error) return fail(error.message);
  revalidatePath('/admin');
}

export async function addNote(leadId: string, form: FormData) {
  const { db, user } = await requireStaff();
  const body = z.string().trim().min(1).max(4000).parse(get(form, 'body'));
  const { error } = await db.from('lead_notes').insert({ lead_id: leadId, author_id: user.id, body });
  if (error) return fail(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(id: string) {
  const { db } = await requireStaff({ admin: true });
  const { error } = await db.from('leads').delete().eq('id', id);
  if (error) return fail(error.message);
  revalidatePath('/admin');
  redirect('/admin');
}

/** Bulk delete from the leads list (admins only). */
export async function deleteLeads(form: FormData) {
  const { db } = await requireStaff({ admin: true });
  const ids = form.getAll('ids').map(String).filter(Boolean).slice(0, 500);
  if (!ids.length) return fail('Select at least one lead.');
  const { error } = await db.from('leads').delete().in('id', ids);
  if (error) return fail(error.message);
  revalidatePath('/admin');
}

// ---------------------------------------------------------------- FAQs

export async function saveFaq(form: FormData) {
  const { db } = await requireStaff();
  const row = {
    id: get(form, 'id') || crypto.randomUUID(),
    question: z.string().min(3).max(300).parse(get(form, 'question')),
    answer: z.string().min(3).max(4000).parse(get(form, 'answer')),
    category: z.string().min(1).max(60).parse(get(form, 'category') || 'General'),
    sort: z.coerce.number().int().parse(get(form, 'sort') || '100'),
    published: form.get('published') === 'on',
  };
  const { error } = await db.from('faqs').upsert(row);
  if (error) return fail(error.message);
  contentChanged('/faq', '/', '/admin/content/faqs');
}

export async function deleteFaq(id: string) {
  const { db } = await requireStaff();
  const { error } = await db.from('faqs').delete().eq('id', id);
  if (error) return fail(error.message);
  contentChanged('/faq', '/', '/admin/content/faqs');
}

// ---------------------------------------------------------------- Service areas

export async function saveArea(form: FormData) {
  const { db } = await requireStaff();
  const row = {
    slug: slug.parse(get(form, 'slug')),
    name: z.string().min(2).max(80).parse(get(form, 'name')),
    region: z.enum(REGIONS as [string, ...string[]]).parse(get(form, 'region')),
    intro: z.string().min(20).max(2000).parse(get(form, 'intro')),
    lat: z.coerce.number().min(32).max(42.1).parse(get(form, 'lat')),
    lng: z.coerce.number().min(-124.5).max(-114).parse(get(form, 'lng')),
    sort: z.coerce.number().int().parse(get(form, 'sort') || '100'),
    published: form.get('published') === 'on',
  };
  const { error } = await db.from('service_areas').upsert(row);
  if (error) return fail(error.message);
  contentChanged('/service-areas', `/service-areas/${row.slug}`, '/', '/admin/content/areas');
}

export async function deleteArea(s: string) {
  const { db } = await requireStaff();
  const { error } = await db.from('service_areas').delete().eq('slug', s);
  if (error) return fail(error.message);
  contentChanged('/service-areas', '/', '/admin/content/areas');
}

// ---------------------------------------------------------------- Posts

export async function savePost(form: FormData) {
  const { db } = await requireStaff();
  const original = get(form, 'original_slug');
  const row = {
    slug: slug.parse(get(form, 'slug')),
    title: z.string().min(3).max(200).parse(get(form, 'title')),
    excerpt: z.string().max(400).parse(get(form, 'excerpt')),
    body: z.string().max(50000).parse(get(form, 'body')),
    body_html: sanitizeBlogHtml(z.string().max(300000).parse(get(form, 'body_html'))) || null,
    cover_url: z.union([z.literal(''), z.string().url().startsWith('https://')]).parse(get(form, 'cover_url')) || null,
    cover_alt: z.string().max(300).parse(get(form, 'cover_alt')) || null,
    published_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(get(form, 'published_at')),
    published: form.get('published') === 'on',
  };
  if (row.cover_url && !row.cover_alt) return fail('Add alt text for the featured image (describe what it shows).');
  if (row.body_html) row.body = htmlToText(row.body_html).slice(0, 50000);
  if (!row.body && !row.body_html) return fail('The post body is empty.');
  const { error } = await db.from('posts').upsert(row);
  if (error) return fail(error.message);
  if (original && original !== row.slug) await db.from('posts').delete().eq('slug', original);
  contentChanged('/blog', `/blog/${row.slug}`, '/admin/content/posts');
  redirect('/admin/content/posts');
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

/** Uploads a blog image (featured or inline) to the public bucket and returns its URL. */
export async function uploadBlogImage(form: FormData): Promise<{ url?: string; error?: string }> {
  await requireStaff();
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) return { error: 'Choose an image.' };
  if (!IMAGE_TYPES.includes(file.type)) return { error: 'Use a JPG, PNG, WebP, GIF or AVIF image.' };
  if (file.size > 4 * 1024 * 1024) return { error: 'Images must be 4 MB or smaller.' };
  const db = serviceClient();
  if (!db) return { error: 'Storage is not configured.' };
  const base = file.name.toLowerCase().replace(/.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'image';
  const ext = file.type.split('/')[1].replace('jpeg', 'jpg');
  const path = `${new Date().toISOString().slice(0, 7)}/${base}-${Date.now().toString(36)}.${ext}`;
  const { error } = await db.storage.from('blog-images').upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) return { error: error.message };
  return { url: db.storage.from('blog-images').getPublicUrl(path).data.publicUrl };
}

export async function deletePost(s: string) {
  const { db } = await requireStaff();
  const { error } = await db.from('posts').delete().eq('slug', s);
  if (error) return fail(error.message);
  contentChanged('/blog', '/admin/content/posts');
  redirect('/admin/content/posts');
}

// ---------------------------------------------------------------- Regulatory settings

export async function saveSettings(form: FormData) {
  const { db } = await requireStaff();
  const vehicles = form.getAll('req_vehicle').map(String);
  const methods = form.getAll('req_method').map(String);
  const requirements = vehicles
    .map((v, i) => ({ vehicle: v.trim(), method: (methods[i] ?? '').trim() }))
    .filter((r) => r.vehicle && r.method);

  const values = form.getAll('counter_value').map(String);
  const labels = form.getAll('counter_label').map(String);
  const suffixes = form.getAll('counter_suffix').map(String);
  const counters = values
    .map((v, i) => ({ value: Number(v), label: (labels[i] ?? '').trim(), suffix: (suffixes[i] ?? '').trim() || undefined }))
    .filter((c) => c.label && Number.isFinite(c.value));

  const rows = [
    { key: 'frequency_text', value: z.string().min(10).max(2000).parse(get(form, 'frequency_text')) },
    { key: 'requirements', value: requirements },
    { key: 'counters', value: counters },
    { key: 'email_footer_address', value: z.string().max(300).parse(get(form, 'email_footer_address')) },
  ].map((r) => ({ ...r, updated_at: new Date().toISOString() }));
  const { error } = await db.from('site_settings').upsert(rows);
  if (error) return fail(error.message);
  contentChanged('/', '/clean-truck-check', '/service-areas', '/admin/content/settings');
}

// ---------------------------------------------------------------- Team (admins only)

export async function inviteStaff(form: FormData) {
  await requireStaff({ admin: true });
  const svc = serviceClient();
  if (!svc) return fail('SUPABASE_SERVICE_ROLE_KEY is not set');
  const email = z.string().email().parse(get(form, 'email'));
  const full_name = z.string().min(1).max(120).parse(get(form, 'full_name'));
  const role = z.enum(['admin', 'staff']).parse(get(form, 'role'));
  const { data, error } = await svc.auth.admin.inviteUserByEmail(email, { redirectTo: `${SITE.url}/admin/welcome?next=/admin/account` });
  if (error || !data.user) return fail(error?.message ?? 'Invite failed');
  const { error: pErr } = await svc.from('profiles').upsert({ id: data.user.id, full_name, role });
  if (pErr) return fail(pErr.message);
  revalidatePath('/admin/team');
}

export async function removeStaff(id: string) {
  const { user } = await requireStaff({ admin: true });
  if (id === user.id) return fail('You cannot remove yourself');
  const svc = serviceClient();
  if (!svc) return fail('SUPABASE_SERVICE_ROLE_KEY is not set');
  await svc.from('profiles').delete().eq('id', id);
  revalidatePath('/admin/team');
}

export async function signOut() {
  const { db } = await requireStaff();
  await db.auth.signOut();
  redirect('/admin/login');
}
