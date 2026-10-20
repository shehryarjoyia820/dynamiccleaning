import { REGIONS, type ServiceArea } from '@/content/seed';
import { requireStaff } from '@/lib/admin';
import { deleteArea, saveArea } from '../../actions';
import { AdminTitle, SmallButton } from '../../ui';

export const metadata = { title: 'Service areas' };

type Row = ServiceArea & { published: boolean };

function AreaForm({ a }: { a?: Row }) {
  const k = a?.slug ?? 'new';
  return (
    <form action={saveArea} className="grid gap-3 sm:grid-cols-4">
      <div>
        <label className="label" htmlFor={`n-${k}`}>City / area name</label>
        <input id={`n-${k}`} name="name" defaultValue={a?.name} required className="field" />
      </div>
      <div>
        <label className="label" htmlFor={`s-${k}`}>URL slug</label>
        {/* Changing a slug would break links, so it is fixed after creation. */}
        <input id={`s-${k}`} name="slug" defaultValue={a?.slug} readOnly={!!a} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="e.g. long-beach" className="field read-only:bg-offwhite" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor={`r-${k}`}>Region</label>
        <select id={`r-${k}`} name="region" defaultValue={a?.region ?? REGIONS[0]} className="field">
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-4">
        <label className="label" htmlFor={`i-${k}`}>Local intro text (unique per city for SEO)</label>
        <textarea id={`i-${k}`} name="intro" defaultValue={a?.intro} required rows={3} className="field" />
      </div>
      <div>
        <label className="label" htmlFor={`la-${k}`}>Latitude</label>
        <input id={`la-${k}`} name="lat" type="number" step="0.01" defaultValue={a?.lat} required className="field" />
      </div>
      <div>
        <label className="label" htmlFor={`lo-${k}`}>Longitude</label>
        <input id={`lo-${k}`} name="lng" type="number" step="0.01" defaultValue={a?.lng} required className="field" />
      </div>
      <div>
        <label className="label" htmlFor={`o-${k}`}>Order</label>
        <input id={`o-${k}`} name="sort" type="number" defaultValue={a?.sort ?? 100} className="field" />
      </div>
      <label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold">
        <input type="checkbox" name="published" defaultChecked={a?.published ?? true} className="h-4 w-4" /> Live
      </label>
      <div className="flex items-center gap-4 sm:col-span-4">
        <SmallButton>{a ? 'Save' : 'Add area'}</SmallButton>
        {a ? (
          <>
            <a href={`/service-areas/${a.slug}`} target="_blank" className="text-sm font-semibold underline underline-offset-4">View page</a>
            <button formAction={deleteArea.bind(null, a.slug)} className="text-sm font-semibold text-[#B42318] underline underline-offset-4">Delete</button>
          </>
        ) : null}
      </div>
    </form>
  );
}

export default async function AreasAdmin() {
  const { db } = await requireStaff();
  const { data } = await db.from('service_areas').select('*').order('sort');
  return (
    <>
      <AdminTitle title="Service areas" />
      <section className="card mb-8">
        <h2 className="text-2xl">Add a city</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Find coordinates by right-clicking the city in Google Maps. The page goes live at /service-areas/your-slug.</p>
        <AreaForm />
      </section>
      <ul className="grid gap-4">
        {((data ?? []) as Row[]).map((a) => (
          <li key={a.slug} className="card">
            <AreaForm a={a} />
          </li>
        ))}
      </ul>
    </>
  );
}
