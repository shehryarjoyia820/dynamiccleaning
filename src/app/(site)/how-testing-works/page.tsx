import { CtaBand, PageHero, Reveal, SectionHeading } from '@/components/blocks';
import { HowItWorks } from '@/components/home/interactive';
import { Checklist } from '@/components/page-parts';
import { pageMeta } from '@/components/seo';

export const metadata = pageMeta({
  title: 'How Mobile Clean Truck Check Testing Works',
  description: 'Step by step: how Diesel Dynamix schedules and performs on-site Clean Truck Check testing, and what to have ready before we arrive.',
  path: '/how-testing-works',
});

export default function HowPage() {
  return (
    <>
      <PageHero
        eyebrow="How testing works"
        title="From first call to results"
        intro="A simple process built around your schedule."
        crumbs={[
          { name: 'Mobile Testing Services', path: '/mobile-testing-services' },
          { name: 'How Testing Works', path: '/how-testing-works' },
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
      <CtaBand title="Ready to schedule?" />
    </>
  );
}
