import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand, FaqList, PageHero, QuickAnswer, Reveal, RequirementsTable } from '@/components/blocks';
import { BookingForm } from '@/components/forms';
import { Checklist } from '@/components/page-parts';
import { JsonLd, faqSchema, pageMeta, serviceSchema } from '@/components/seo';
import { PORTS } from '@/content/ports';
import { getSettings } from '@/lib/content';
import { SITE } from '@/lib/site';

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return PORTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const port = PORTS.find((p) => p.slug === slug);
  if (!port) return {};
  return pageMeta({
    title: `Clean Truck Check ${port.name} | Mobile Drayage Truck Testing`,
    description: `Mobile Clean Truck Check testing for ${port.name} drayage trucks. OBD and smoke opacity tests at your yard. Call ${SITE.phoneDisplay}.`,
    path: `/ports/${port.slug}`,
  });
}

export default async function PortPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const port = PORTS.find((p) => p.slug === slug);
  if (!port) notFound();
  const settings = await getSettings();
  const faqs = [
    {
      id: 'yard',
      category: port.name,
      sort: 1,
      question: `Can you do Clean Truck Check testing near the ${port.name}?`,
      answer: `Yes. Diesel Dynamix is a mobile service, so we test drayage trucks at your yard, staging lot or parking area near the ${port.name}. You do not need to drive to a test site.`,
    },
    {
      id: 'port-program',
      category: port.name,
      sort: 2,
      question: 'Is Clean Truck Check the same as the port’s truck program?',
      answer:
        'No. Port truck registries and clean truck programs are separate from CARB’s Clean Truck Check. Drayage trucks generally need to meet both. We handle the Clean Truck Check emissions testing part.',
    },
    {
      id: 'out-of-state',
      category: port.name,
      sort: 3,
      question: 'Do out-of-state trucks serving the port need Clean Truck Check?',
      answer:
        'Generally yes. Clean Truck Check covers most heavy-duty trucks over 14,000 lb GVWR that operate in California, including out-of-state and Mexico-registered trucks. Confirm your vehicle in CARB’s CTC-VIS system.',
    },
  ];

  return (
    <>
      <JsonLd data={serviceSchema(port.city)} />
      <JsonLd data={faqSchema(faqs)} />
      <PageHero
        eyebrow="Port drayage testing"
        title={`Clean Truck Check at the ${port.name}`}
        intro={port.intro}
        crumbs={[
          { name: 'Service Areas', path: '/service-areas' },
          { name: port.name, path: `/ports/${port.slug}` },
        ]}
      />
      <section className="py-section">
        <div className="container grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid content-start gap-8">
            <QuickAnswer question={`Where can I get Clean Truck Check near the ${port.name}?`}>
              Diesel Dynamix tests trucks on-site near the {port.name}. Call or WhatsApp <a href={`tel:${SITE.phoneE164}`} className="font-semibold text-accent-ink underline">{SITE.phoneDisplay}</a> or book online and we come to your yard.
            </QuickAnswer>
            <Reveal className="prose-dd">
              <h2>Mobile testing for {port.name} trucks</h2>
              <Checklist items={port.points} />
              <p>
                Need testing elsewhere? See <Link href={`/service-areas/${port.areaSlug}`}>Clean Truck Check in {port.city.split(' / ')[0]}</Link> or our{' '}
                <Link href="/fleet-testing">fleet testing</Link> options.
              </p>
            </Reveal>
            <div>
              <h2 className="text-display-md">Which test does a drayage truck need?</h2>
              <div className="mt-5">
                <RequirementsTable rows={settings.requirements} frequency={settings.frequency_text} />
              </div>
            </div>
            <div>
              <h2 className="text-display-md">{port.name} FAQ</h2>
              <div className="mt-5">
                <FaqList faqs={faqs} />
              </div>
            </div>
          </div>
          <Reveal className="rounded-xl bg-white p-6 shadow-card sm:p-8 lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-3xl">Book port-area testing</h2>
            <p className="mb-5 mt-1 text-muted">One truck or a full drayage fleet.</p>
            <BookingForm defaultLocation={port.city.split(' / ')[0]} source={`port:${port.slug}`} />
          </Reveal>
        </div>
      </section>
      <CtaBand title={`Trucks at the ${port.name}? We come to you.`} />
    </>
  );
}
