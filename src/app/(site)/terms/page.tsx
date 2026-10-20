import { PageHero } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { DISCLAIMER, LINKS, SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Terms of Use',
  description: 'Terms of use for the Diesel Dynamix website and mobile Clean Truck Check testing services.',
  path: '/terms',
});

// Template text: have it reviewed by the client's legal counsel before launch.
export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" intro="Last updated October 20, 2026" crumbs={[{ name: 'Terms', path: '/terms' }]}>
        <span />
      </PageHero>
      <PageBody aside={<span />}>
        <h2>Independent provider</h2>
        <p>{DISCLAIMER}</p>
        <h2>Information on this website</h2>
        <p>
          We explain Clean Truck Check in plain language to help truck owners. This information is general, may change, and is not legal advice. Program rules, deadlines and exemptions are set by CARB.
          Always confirm your obligations on <a href={LINKS.carbCtc} target="_blank" rel="noopener noreferrer">CARB’s official website</a> and in CTC-VIS.
        </p>
        <h2>Bookings</h2>
        <p>
          Submitting a booking request does not guarantee an appointment until we confirm it with you. Prices, scheduling and any cancellation terms are confirmed at booking. Test results depend on the
          condition of the vehicle; we cannot guarantee that a vehicle will pass.
        </p>
        <h2>Use of the website</h2>
        <p>Do not misuse this website, including submitting false information, attempting to access the admin area without permission, or interfering with its operation.</p>
        <h2>Limitation of liability</h2>
        <p>To the extent permitted by law, {SITE.name} is not liable for indirect or consequential losses arising from use of this website.</p>
        <h2>Contact</h2>
        <p>
          Questions? Email <a href={LINKS.mailInfo}>{SITE.emailInfo}</a> or call <a href={LINKS.tel}>{SITE.phoneDisplay}</a>.
        </p>
      </PageBody>
    </>
  );
}
