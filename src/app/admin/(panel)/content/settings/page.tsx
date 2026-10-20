import { getSettings } from '@/lib/content';
import { requireStaff } from '@/lib/admin';
import { LINKS } from '@/lib/site';
import { saveSettings } from '../../actions';
import { AdminTitle, SmallButton } from '../../ui';

export const metadata = { title: 'Regulatory text' };

export default async function SettingsAdmin() {
  await requireStaff();
  const s = await getSettings();
  // Two blank rows so staff can add entries without a developer.
  const reqRows = [...s.requirements, { vehicle: '', method: '' }, { vehicle: '', method: '' }];
  const counterRows = [...s.counters, { value: '' as unknown as number, label: '', suffix: '' }];

  return (
    <>
      <AdminTitle title="Regulatory text" />
      <p className="mb-6 max-w-3xl rounded-lg border-l-4 border-accent bg-white p-4 text-sm shadow-card">
        Program rules change. Check every edit against{' '}
        <a href={LINKS.carbCtc} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-ink underline">CARB’s Clean Truck Check pages</a> before saving.
        Changes appear on the site within a few seconds.
      </p>
      <form action={saveSettings} className="grid max-w-4xl gap-8">
        <section className="card">
          <h2 className="text-2xl">Testing frequency text</h2>
          <label htmlFor="frequency_text" className="sr-only">Testing frequency text</label>
          <textarea id="frequency_text" name="frequency_text" defaultValue={s.frequency_text} rows={5} required className="field mt-3" />
        </section>

        <section className="card">
          <h2 className="text-2xl">Testing requirements table</h2>
          <p className="mt-1 text-sm text-muted">Leave a row empty to remove it.</p>
          <div className="mt-4 grid gap-3">
            {reqRows.map((r, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2">
                <input name="req_vehicle" aria-label={`Row ${i + 1} vehicle`} defaultValue={r.vehicle} placeholder="Vehicle" className="field" />
                <input name="req_method" aria-label={`Row ${i + 1} test method`} defaultValue={r.method} placeholder="Test method" className="field" />
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl">Homepage counters</h2>
          <p className="mt-1 text-sm text-muted">Only real, verified numbers. Leave the label empty to remove a counter.</p>
          <div className="mt-4 grid gap-3">
            {counterRows.map((c, i) => (
              <div key={i} className="grid grid-cols-[7rem_1fr_5rem] gap-2">
                <input name="counter_value" type="number" aria-label={`Counter ${i + 1} value`} defaultValue={c.value} placeholder="Number" className="field" />
                <input name="counter_label" aria-label={`Counter ${i + 1} label`} defaultValue={c.label} placeholder="Label, e.g. Trucks tested" className="field" />
                <input name="counter_suffix" aria-label={`Counter ${i + 1} suffix`} defaultValue={c.suffix ?? ''} placeholder="+" className="field" />
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl">Email footer address</h2>
          <p className="mt-1 text-sm text-muted">
            US law (CAN-SPAM) requires a valid postal address in every proposal and follow-up email. A P.O. box or registered business address is fine.
          </p>
          <label htmlFor="email_footer_address" className="sr-only">Email footer address</label>
          <input id="email_footer_address" name="email_footer_address" defaultValue={s.email_footer_address} placeholder="Diesel Dynamix, 123 Main St, San Diego, CA 92101" className="field mt-3" />
        </section>

        <SmallButton className="justify-self-start px-6 py-3 text-base">Save all</SmallButton>
      </form>
    </>
  );
}
