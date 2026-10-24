import Link from 'next/link';
import { CtaBand, FaqList, OfficialSourceNote, PageHero, QuickAnswer } from '@/components/blocks';
import { Checklist, PageBody } from '@/components/page-parts';
import { JsonLd, faqSchema, pageMeta } from '@/components/seo';

// Keywords: CARB OBD test California, Clean Truck Check OBD test, mobile OBD testing for trucks,
// alternative fuel truck emissions test California.
export const metadata = pageMeta({
  title: 'CARB OBD Test California | Clean Truck Check OBD Testing',
  description:
    'Mobile CARB OBD test for California Clean Truck Check: 2013+ diesel and 2018+ alternative-fuel trucks tested on-site at your yard. Book Diesel Dynamix.',
  path: '/services/obd-testing',
});

const FAQS = [
  {
    id: 'obd-which',
    category: 'OBD',
    sort: 1,
    question: 'Which trucks need a Clean Truck Check OBD test?',
    answer: 'Diesel trucks with 2013 and newer engines and alternative-fuel trucks with 2018 and newer engines that have on-board diagnostics (OBD) use a CARB-verified OBD test.',
  },
  {
    id: 'obd-mobile',
    category: 'OBD',
    sort: 2,
    question: 'Can the OBD test be done at my yard?',
    answer: 'Yes. An OBD test only needs access to the truck’s diagnostic port, so Diesel Dynamix performs it on-site at your yard, jobsite or terminal anywhere in Southern California.',
  },
  {
    id: 'obd-codes',
    category: 'OBD',
    sort: 3,
    question: 'What if my truck has a check-engine light or active fault codes?',
    answer: 'Active emissions-related fault codes can cause an OBD test to fail. Have the faults diagnosed and repaired first; we can test right after the repair is done.',
  },
];

export default function ObdPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <PageHero
        eyebrow="Testing types · OBD"
        title="CARB OBD test in Southern California"
        intro="The Clean Truck Check OBD test for 2013+ diesel and 2018+ alternative-fuel trucks, done on-site by our mobile testers."
        crumbs={[
          { name: 'Services', path: '/services' },
          { name: 'CARB OBD Test', path: '/services/obd-testing' },
        ]}
      />
      <PageBody>
        <div className="not-prose mb-8">
          <QuickAnswer question="What is the Clean Truck Check OBD test?">
            It is a CARB-verified test that reads emissions data from a truck’s on-board diagnostics. It applies to 2013+ diesel and 2018+ alternative-fuel
            engines, and Diesel Dynamix performs it at your location anywhere in Southern California.
          </QuickAnswer>
        </div>
        <h2>How the CARB OBD test works</h2>
        <p>
          Our tester connects CARB-verified equipment to the truck’s diagnostic port and records the emissions-system data the Clean Truck Check program requires.
          The engine does not need to be driven, and most OBD tests are quick once we are connected.
        </p>
        <h2>Mobile OBD testing for trucks and fleets</h2>
        <Checklist
          items={[
            'We come to your yard, jobsite or terminal: no trip to a test center',
            'One truck or many in a single visit, scheduled around dispatch',
            'Results explained in plain English, with next steps if anything fails',
            'Recurring visits so every truck stays inside its testing window',
          ]}
        />
        <h2>Alternative fuel truck emissions test in California</h2>
        <p>
          Natural gas and other alternative-fuel trucks with 2018 and newer engines also use the OBD test. Older alternative-fuel engines without OBD need a visual
          inspection instead. See <Link href="/services/smoke-opacity-test">non-OBD truck testing</Link>.
        </p>
        <h2>Before your OBD test</h2>
        <ul>
          <li>Fix any active check-engine or emissions warning lights.</li>
          <li>Have the VIN, keys and cab access ready for each truck.</li>
          <li>Check your testing deadline in CARB’s CTC-VIS system.</li>
        </ul>
        <h2>OBD test FAQ</h2>
        <div className="not-prose mt-4">
          <FaqList faqs={FAQS} />
        </div>
        <div className="not-prose mt-8">
          <OfficialSourceNote />
        </div>
      </PageBody>
      <CtaBand title="Book a mobile OBD test" />
    </>
  );
}
