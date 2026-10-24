import { CtaBand, PageHero, Reveal, SectionHeading } from '@/components/blocks';
import { HowItWorks } from '@/components/home/interactive';
import { Checklist } from '@/components/page-parts';
import { JsonLd, pageMeta } from '@/components/seo';
import { SeoExtras } from '@/components/seo-extras';

const HOWTO = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to get a mobile Clean Truck Check test in Southern California',
  description: 'Book on-site CARB Clean Truck Check testing with Diesel Dynamix and have your trucks tested at your yard.',
  step: [
    { '@type': 'HowToStep', name: 'Contact us', text: 'Call, WhatsApp or book online with your truck count and location.' },
    { '@type': 'HowToStep', name: 'Schedule', text: 'Confirm a time window that fits your dispatch.' },
    { '@type': 'HowToStep', name: 'On-site testing', text: 'A tester runs the OBD, smoke opacity or visual test each truck needs at your yard.' },
    { '@type': 'HowToStep', name: 'Results and next steps', text: 'Results are submitted and next steps are explained for every truck.' },
  ],
};

export const metadata = pageMeta({
  title: 'How Mobile Clean Truck Check Testing Works | On-Site CARB Testing',
  description: 'Step by step: how Diesel Dynamix schedules and performs on-site Clean Truck Check testing, and what to have ready before we arrive.',
  path: '/services/how-testing-works',
});

export default function HowPage() {
  return (
    <>
      <JsonLd data={HOWTO} />
      <PageHero
        eyebrow="How testing works"
        title="How mobile Clean Truck Check works"
        intro="From first call to results: on-site CARB testing built around your schedule."
        crumbs={[
          { name: 'Services', path: '/services' },
          { name: 'How Testing Works', path: '/services/how-testing-works' },
        ]}
      />
      <section className="bg-white py-section">
        <div className="container">
          <HowItWorks />
        </div>
      </section>
      <section className="py-section">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Before we arrive" title="What to have ready" />
            <Reveal delay={100} className="prose-dd mt-6">
              <Checklist
                items={[
                  'The VIN for each truck to be tested.',
                  'Keys and access to the cab for each truck.',
                  'A safe, level place to park, with room for our tester to work.',
                  'For smoke opacity tests: an engine that can reach normal operating temperature.',
                  'Your CTC-VIS account details, if you have them handy.',
                  'Gate or yard access instructions for our team.',
                ]}
              />
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="On test day" title="What to expect" />
            <Reveal delay={100} className="prose-dd mt-6">
              <ol>
                <li>Our tester arrives in the agreed time window and checks in with your contact.</li>
                <li>Each truck is identified by VIN and the correct test is performed.</li>
                <li>Results are submitted and we tell you right away how each truck did.</li>
                <li>If a truck does not pass, we explain why and schedule a retest after repairs.</li>
              </ol>
            </Reveal>
          </div>
        </div>
      </section>
      <SeoExtras path={'/services/how-testing-works'} />
      <CtaBand title="Ready to schedule?" />
    </>
  );
}
