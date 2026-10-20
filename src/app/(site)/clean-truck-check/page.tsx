import Link from 'next/link';
import { CtaBand, OfficialSourceNote, PageHero, RequirementsTable } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';
import { getSettings } from '@/lib/content';
import { LINKS } from '@/lib/site';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Clean Truck Check Explained',
  description:
    'A plain-English guide to California’s Clean Truck Check program: which trucks are covered, which test each truck needs, how often to test and how to stay compliant.',
  path: '/clean-truck-check',
});

export default async function CleanTruckCheckPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero
        eyebrow="Clean Truck Check explained"
        title="California Clean Truck Check, in plain English"
        intro="What the program is, whether it applies to your truck, and which test you need."
        crumbs={[{ name: 'Clean Truck Check Explained', path: '/clean-truck-check' }]}
      />
      <PageBody>
        <h2>What is Clean Truck Check?</h2>
        <p>
          Clean Truck Check is the California Air Resources Board’s heavy-duty inspection and maintenance program. It replaces the old “smoke check only” approach with
          periodic testing that confirms a truck’s emissions-control system is working, and gets it repaired if it is not.
        </p>
        <h2>Which trucks are covered?</h2>
        <p>
          Most diesel and alternative-fuel vehicles with a gross vehicle weight rating over 14,000 lb that operate in California are covered. That includes trucks registered
          in other states or in Mexico when they drive in California. Some vehicles, such as certain emergency and military vehicles, are exempt.
        </p>
        <h2>Which test does my truck need?</h2>
        <p>The test depends on the engine’s model year and whether it has on-board diagnostics (OBD):</p>
        <div className="not-prose my-6">
          <RequirementsTable rows={settings.requirements} frequency={settings.frequency_text} />
        </div>
        <h2>How often do I have to test?</h2>
        <p>{settings.frequency_text}</p>
        <h2>What else does the program require?</h2>
        <ul>
          <li>Vehicle owners report their vehicles and pay an annual compliance fee in CARB’s CTC-VIS system.</li>
          <li>Tests must be performed by a credentialed tester using CARB-verified equipment.</li>
          <li>Results are submitted to CARB; a failed test means repairs and a passing retest are needed.</li>
          <li>CARB uses roadside monitoring and enforcement to identify high-emitting and non-compliant trucks.</li>
        </ul>
        <h2>How Diesel Dynamix helps</h2>
        <p>
          We handle the testing part at your location, so you do not lose a day driving to a test site. See <Link href="/mobile-testing-services">our mobile testing services</Link> or{' '}
          <Link href="/how-testing-works">how a test visit works</Link>.
        </p>
        <div className="not-prose mt-8">
          <OfficialSourceNote />
        </div>
        <p className="text-sm text-muted">
          Official sources: <a href={LINKS.carbCtc} target="_blank" rel="noopener noreferrer">CARB Clean Truck Check program</a> ·{' '}
          <a href={LINKS.carbFaq} target="_blank" rel="noopener noreferrer">CARB Clean Truck Check FAQ</a>
        </p>
      </PageBody>
      <CtaBand />
    </>
  );
}
