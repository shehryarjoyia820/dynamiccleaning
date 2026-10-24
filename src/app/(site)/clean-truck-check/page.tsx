import Link from 'next/link';
import { CtaBand, OfficialSourceNote, PageHero, QuickAnswer, RequirementsTable } from '@/components/blocks';
import { PageBody } from '@/components/page-parts';
import { JsonLd, faqSchema, pageMeta } from '@/components/seo';
import { getSettings } from '@/lib/content';
import { LINKS } from '@/lib/site';

export const revalidate = 300;

// Keywords: what is Clean Truck Check, Clean Truck Check requirements, deadline, 2027 quarterly testing,
// CTC-VIS registration, out-of-state trucks, 14,000 lbs GVWR, fines, DMV registration hold.
export const metadata = pageMeta({
  title: 'What Is Clean Truck Check? Requirements & Deadlines in California',
  description:
    'What is Clean Truck Check? CARB’s requirements for trucks over 14,000 lbs GVWR, testing deadlines, 2027 quarterly testing, CTC-VIS registration, out-of-state trucks, fines and DMV registration holds.',
  path: '/clean-truck-check',
});

const FAQS = [
  {
    id: 'ctc-what',
    category: 'Program',
    sort: 1,
    question: 'What is Clean Truck Check?',
    answer:
      'Clean Truck Check is the California Air Resources Board (CARB) inspection and maintenance program for heavy-duty vehicles. Covered trucks must pass periodic emissions tests and keep their emissions-control systems repaired.',
  },
  {
    id: 'ctc-who',
    category: 'Program',
    sort: 2,
    question: 'Which trucks need Clean Truck Check?',
    answer:
      'Most diesel and alternative-fuel vehicles over 14,000 lbs GVWR that operate in California, including out-of-state and Mexico-registered trucks. Some vehicles are exempt.',
  },
  {
    id: 'ctc-ctcvis',
    category: 'Program',
    sort: 3,
    question: 'What is CTC-VIS?',
    answer:
      'CTC-VIS is CARB’s Clean Truck Check Vehicle Inspection System, where owners report their vehicles, pay the annual compliance fee and see their testing deadlines.',
  },
];

export default async function CleanTruckCheckPage() {
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <PageHero
        eyebrow="Clean Truck Check explained"
        title="What is Clean Truck Check?"
        intro="California’s Clean Truck Check requirements in plain English: who must test, which test you need, deadlines and what happens if you miss one."
        crumbs={[{ name: 'Clean Truck Check Explained', path: '/clean-truck-check' }]}
      />
      <PageBody>
        <div className="not-prose mb-8">
          <QuickAnswer question="What is Clean Truck Check in California?">
            Clean Truck Check is CARB’s emissions testing program for heavy-duty trucks over 14,000 lbs GVWR that drive in California. Covered trucks report in
            CTC-VIS, pay an annual fee and pass periodic OBD or smoke opacity tests.
          </QuickAnswer>
        </div>

        <h2>Clean Truck Check requirements</h2>
        <p>
          Clean Truck Check is the California Air Resources Board’s heavy-duty inspection and maintenance program. It goes beyond the old “smoke check only” approach with
          periodic testing that confirms a truck’s emissions-control system is working, and gets it repaired if it is not. To comply, owners generally need to:
        </p>
        <ul>
          <li>Report each vehicle in CARB’s CTC-VIS system and pay the annual compliance fee.</li>
          <li>Pass periodic emissions tests performed by a credentialed tester with CARB-verified equipment.</li>
          <li>Repair any emissions-control problems and pass a retest when a truck fails.</li>
        </ul>

        <h2>Clean Truck Check and the 14,000 lbs GVWR threshold</h2>
        <p>
          The program covers most diesel and alternative-fuel vehicles with a gross vehicle weight rating over 14,000 lbs that operate in California. Some vehicles, such as certain
          emergency and military vehicles, are exempt.
        </p>

        <h2>Clean Truck Check for out-of-state trucks</h2>
        <p>
          Trucks registered in other states or in Mexico are covered when they drive in California. Out-of-state carriers also report their vehicles in CTC-VIS and keep testing up to
          date. We test out-of-state trucks anywhere in Southern California, including at the <Link href="/service-areas/ports/port-of-long-beach">ports</Link>.
        </p>

        <h2>Which test does my truck need?</h2>
        <p>
          The test depends on the engine model year and whether it has on-board diagnostics. See our <Link href="/services/obd-testing">CARB OBD test</Link> and{' '}
          <Link href="/services/smoke-opacity-test">smoke opacity test</Link> pages.
        </p>
        <div className="not-prose my-6">
          <RequirementsTable rows={settings.requirements} frequency={settings.frequency_text} />
        </div>

        <h2>Clean Truck Check deadline and testing frequency</h2>
        <p>{settings.frequency_text}</p>

        <h2>Clean Truck Check 2027 quarterly testing</h2>
        <p>
          Under the original rule, OBD-equipped vehicles move from twice-a-year testing to four tests a year (quarterly) starting October 1, 2027. Because proposed legislation could
          change testing frequency, check CARB’s official pages and your CTC-VIS account before planning your schedule. Diesel Dynamix can set up recurring fleet visits that follow
          whatever schedule applies.
        </p>

        <h2>CTC-VIS registration</h2>
        <p>
          CTC-VIS (Clean Truck Check Vehicle Inspection System) is where you report vehicles, pay the annual compliance fee and see each truck’s deadlines.{' '}
          <a href={LINKS.carbCtcVis} target="_blank" rel="noopener noreferrer">Open CTC-VIS</a>.
        </p>

        <h2>Clean Truck Check fines, penalties and DMV registration holds</h2>
        <p>
          Trucks that are out of compliance can face DMV registration holds for California-registered vehicles, plus citations and penalties set by CARB. Amounts and procedures can
          change, so rely on CARB for current figures. The simplest protection is testing on time. See{' '}
          <Link href="/clean-truck-check/why-california-enforces-it">why California enforces it</Link>.
        </p>

        <h2>How Diesel Dynamix helps</h2>
        <p>
          We handle the testing at your location, so you do not lose a day driving to a test site. See <Link href="/services">mobile CARB testing</Link>,{' '}
          <Link href="/services/fleet-testing">fleet testing</Link> or <Link href="/services/how-testing-works">how a test visit works</Link>.
        </p>
        <div className="not-prose mt-8">
          <OfficialSourceNote />
        </div>
      </PageBody>
      <CtaBand />
    </>
  );
}
