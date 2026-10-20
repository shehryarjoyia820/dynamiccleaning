import Link from 'next/link';
import { CtaBand, FaqList, OfficialSourceNote, PageHero, QuickAnswer } from '@/components/blocks';
import { Checklist, PageBody } from '@/components/page-parts';
import { JsonLd, faqSchema, pageMeta } from '@/components/seo';

// Keywords: smoke opacity test California, diesel smoke test California, truck smoke opacity testing,
// mobile smoke test California, non-OBD truck testing California, how to pass CARB smoke test.
export const metadata = pageMeta({
  title: 'Smoke Opacity Test California | Mobile Diesel Smoke Test',
  description:
    'Mobile diesel smoke opacity test in Southern California for non-OBD trucks (2012 and older). On-site Clean Truck Check smoke testing plus tips to pass the CARB smoke test.',
  path: '/smoke-opacity-test',
});

const FAQS = [
  {
    id: 'smoke-which',
    category: 'Smoke',
    sort: 1,
    question: 'Which trucks need a smoke opacity test?',
    answer: 'Diesel trucks with 2012 and older engines that do not have OBD use a smoke opacity test plus a visual inspection for Clean Truck Check.',
  },
  {
    id: 'smoke-pass',
    category: 'Smoke',
    sort: 2,
    question: 'How do I pass the CARB smoke test?',
    answer:
      'Warm the engine to full operating temperature, fix exhaust leaks and smoke-related faults, keep the air filter and injectors in good condition, and make sure the diesel particulate filter (if equipped) is working. A well-maintained engine usually passes.',
  },
  {
    id: 'smoke-mobile',
    category: 'Smoke',
    sort: 3,
    question: 'Can a smoke test be done at my location?',
    answer: 'Yes. Diesel Dynamix brings smoke opacity testing equipment to your yard or jobsite anywhere in Southern California.',
  },
];

export default function SmokePage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <PageHero
        eyebrow="Testing types · Smoke opacity"
        title="Smoke opacity test in Southern California"
        intro="Mobile diesel smoke testing for non-OBD trucks, done at your yard as part of Clean Truck Check."
        crumbs={[
          { name: 'Mobile Testing Services', path: '/mobile-testing-services' },
          { name: 'Smoke Opacity Test', path: '/smoke-opacity-test' },
        ]}
      />
      <PageBody>
        <div className="not-prose mb-8">
          <QuickAnswer question="What is a diesel smoke opacity test?">
            A smoke opacity test measures how much soot a diesel engine emits during snap acceleration. California’s Clean Truck Check uses it, with a visual
            inspection, for 2012 and older diesel trucks without OBD. We perform it on-site.
          </QuickAnswer>
        </div>
        <h2>Truck smoke opacity testing, step by step</h2>
        <ol>
          <li>The engine is warmed to normal operating temperature.</li>
          <li>Our tester performs a visual inspection of the emissions-control components.</li>
          <li>A smoke opacity meter measures exhaust during a series of snap accelerations.</li>
          <li>We explain the result and, if needed, what to repair before a retest.</li>
        </ol>
        <h2>Mobile smoke test anywhere in Southern California</h2>
        <Checklist
          items={[
            'On-site testing at your yard, farm, jobsite or terminal',
            'Ideal for older fleets, ag trucks and specialty vehicles',
            'Combined visits with OBD testing for mixed fleets',
          ]}
        />
        <h2>How to pass the CARB smoke test</h2>
        <ul>
          <li><strong>Warm it up.</strong> A cold engine smokes more. Run it to full temperature before we test.</li>
          <li><strong>Fix known problems first.</strong> Exhaust leaks, worn injectors, a clogged air filter or a failing turbo all raise opacity.</li>
          <li><strong>Check the particulate filter.</strong> If your truck has a DPF, make sure it is present, intact and not overdue for cleaning.</li>
          <li><strong>Keep records.</strong> Recent maintenance makes diagnosing a failed result faster.</li>
        </ul>
        <h2>Non-OBD truck testing in California</h2>
        <p>
          Older alternative-fuel engines (2017 and older) without OBD need a visual inspection rather than a smoke test. Newer trucks use the{' '}
          <Link href="/obd-testing">CARB OBD test</Link>.
        </p>
        <h2>Smoke test FAQ</h2>
        <div className="not-prose mt-4">
          <FaqList faqs={FAQS} />
        </div>
        <div className="not-prose mt-8">
          <OfficialSourceNote />
        </div>
      </PageBody>
      <CtaBand title="Book a mobile smoke test" />
    </>
  );
}
