import { Check, X } from 'lucide-react';
import { Reveal, SectionHeading } from '@/components/blocks';

const ROWS = [
  ['Where the test happens', 'At a test site you drive to', 'At your yard, jobsite or terminal'],
  ['Driver time', 'Drive there, wait, drive back', 'Driver keeps working'],
  ['Several trucks', 'One trip per truck', 'Whole fleet in one visit'],
  ['Scheduling', 'Their hours', 'Planned around your dispatch'],
  ['Next deadline', 'Up to you to track', 'Recurring visits on request'],
];

/** Why mobile testing: the trade-off at a glance. */
export function MobileVsShop() {
  return (
    <section className="bg-white py-section">
      <div className="container">
        <SectionHeading eyebrow="Why mobile testing" title="Skip the trip to the test site" center />
        <Reveal className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-ink/10 shadow-card">
          <table className="w-full text-left">
            <caption className="sr-only">Test site compared with Diesel Dynamix mobile testing</caption>
            <thead>
              <tr>
                <th scope="col" className="w-1/3 bg-offwhite px-4 py-4 sm:px-6"><span className="sr-only">Compare</span></th>
                <th scope="col" className="bg-offwhite px-4 py-4 font-display text-lg uppercase text-muted sm:px-6">Test site</th>
                <th scope="col" className="bg-charcoal px-4 py-4 font-display text-lg uppercase text-amber sm:px-6">Diesel Dynamix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {ROWS.map(([k, shop, us]) => (
                <tr key={k}>
                  <th scope="row" className="px-4 py-4 text-sm font-semibold sm:px-6 sm:text-base">{k}</th>
                  <td className="px-4 py-4 text-sm text-muted sm:px-6 sm:text-base">
                    <span className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-[#B42318]" aria-hidden />{shop}</span>
                  </td>
                  <td className="bg-amber/10 px-4 py-4 text-sm font-semibold sm:px-6 sm:text-base">
                    <span className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-ink" aria-hidden />{us}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
