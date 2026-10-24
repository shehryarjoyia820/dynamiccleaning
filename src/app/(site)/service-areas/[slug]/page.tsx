import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cpu, Gauge, MapPin } from 'lucide-react';
import { CtaBand, FaqList, PageHero, QuickAnswer, Reveal, RequirementsTable, SectionHeading } from '@/components/blocks';
import { CaliforniaMap } from '@/components/california-map';
import { BookingForm } from '@/components/forms';
import { JsonLd, faqSchema, pageMeta, serviceSchema } from '@/components/seo';
import { PORTS } from '@/content/ports';
import { SERVICE_AREAS, type ServiceArea } from '@/content/seed';
import { getServiceArea, getServiceAreas, getSettings } from '@/lib/content';
import { SITE } from '@/lib/site';

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return SERVICE_AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = await getServiceArea(slug);
  if (!area) return {};
  // Keyword plan: "Clean Truck Check [city]", "mobile CARB testing [city]", "smoke test [city]".
  return pageMeta({
    title: `Clean Truck Check ${area.name}, CA | Mobile CARB Testing & Smoke Test`,
    description: `Clean Truck Check in ${area.name}: mobile CARB testing, OBD tests and smoke tests at your yard or jobsite. Same-week visits. Call ${SITE.phoneDisplay}.`,
    path: `/service-areas/${area.slug}`,
  });
}

function cityFaqs(a: ServiceArea) {
  return [
    {
      id: `${a.slug}-yard`,
      category: a.name,
      sort: 1,
      question: `Can Clean Truck Check be done at my yard in ${a.name}?`,
      answer: `Yes. Diesel Dynamix is a mobile service. We come to your yard, jobsite or parking location in ${a.name} and test your trucks on-site, so you never drive to a test center.`,
    },
    {
      id: `${a.slug}-smoke`,
      category: a.name,
      sort: 2,
      question: `Do you do smoke tests in ${a.name}?`,
      answer: `Yes. We perform smoke opacity tests with a visual inspection for 2012 and older diesel engines without OBD, and CARB-verified OBD tests for 2013 and newer engines, anywhere in ${a.name} and the rest of ${a.region}.`,
    },
    {
      id: `${a.slug}-fleet`,
      category: a.name,
      sort: 3,
      question: `Can you test a whole fleet in ${a.name}?`,
      answer: `Yes. Tell us how many trucks you have in ${a.name} and we will plan one visit to test as many as possible, with recurring testing so every truck stays inside its Clean Truck Check window.`,
    },
  ];
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [area, areas, settings] = await Promise.all([getServiceArea(slug), getServiceAreas(), getSettings()]);
  if (!area) notFound();
  const nearby = areas.filter((a) => a.region === area.region && a.slug !== area.slug);
  const ports = PORTS.filter((p) => p.areaSlug === area.slug);
  const faqs = cityFaqs(area);

  return (
    <>
      <JsonLd data={serviceSchema(area.name)} />
      <JsonLd data={faqSchema(faqs)} />
      <PageHero
        eyebrow={`${area.region} · Mobile CARB testing`}
        title={`Clean Truck Check in ${area.name}`}
        intro={area.intro}
        crumbs={[
          { name: 'Service Areas', path: '/service-areas' },
          { name: area.name, path: `/service-areas/${area.slug}` },
        ]}
      />
      <section className="py-section">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div className="grid content-start gap-8">
            <QuickAnswer question={`Where can I get a Clean Truck Check in ${area.name}?`}>
              Diesel Dynamix provides mobile Clean Truck Check testing in {area.name}, CA. We come to your truck for OBD tests, smoke opacity tests and visual
              inspections. Call or WhatsApp{' '}
              <a href={`tel:${SITE.phoneE164}`} className="font-semibold text-accent-ink underline">{SITE.phoneDisplay}</a>.
            </QuickAnswer>
            <div>
              <SectionHeading eyebrow={`Book in ${area.name}`} title="Request on-site testing" />
              <Reveal delay={100} className="mt-6 rounded-xl bg-white p-6 shadow-card sm:p-8">
                <BookingForm defaultLocation={area.name} source={`area:${area.slug}`} />
              </Reveal>
            </div>
          </div>
          <div className="grid content-start gap-10">
            <Reveal className="rounded-xl bg-[#0F141B] p-6">
              <CaliforniaMap areas={areas} highlight={area.slug} className="mx-auto max-w-sm" />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal className="card">
                <Cpu className="h-8 w-8 text-accent-ink" aria-hidden />
                <h2 className="mt-3 text-2xl">Mobile CARB testing in {area.name}</h2>
                <p className="mt-2 text-muted">
                  CARB-verified <Link href="/services/obd-testing" className="font-semibold text-accent-ink underline">OBD tests</Link> for 2013+ diesel and 2018+
                  alternative-fuel trucks, done at your {area.name} location.
                </p>
              </Reveal>
              <Reveal delay={80} className="card">
                <Gauge className="h-8 w-8 text-accent-ink" aria-hidden />
                <h2 className="mt-3 text-2xl">Smoke test in {area.name}</h2>
                <p className="mt-2 text-muted">
                  <Link href="/services/smoke-opacity-test" className="font-semibold text-accent-ink underline">Smoke opacity tests</Link> and visual inspections for
                  older non-OBD engines, on-site in {area.name}.
                </p>
              </Reveal>
            </div>
            <div>
              <h2 className="text-display-md">Which test does your truck need?</h2>
              <div className="mt-5">
                <RequirementsTable rows={settings.requirements} frequency={settings.frequency_text} />
              </div>
            </div>
            <div>
              <h2 className="text-display-md">{area.name} Clean Truck Check FAQ</h2>
              <div className="mt-5">
                <FaqList faqs={faqs} />
              </div>
            </div>
            {ports.length ? (
              <div>
                <h2 className="text-2xl">Port trucks</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {ports.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/service-areas/ports/${p.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 font-semibold hover:border-accent-ink hover:text-accent-ink">
                        <MapPin className="h-4 w-4" aria-hidden /> Clean Truck Check {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {nearby.length ? (
              <div>
                <h2 className="text-2xl">Also serving {area.region}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {nearby.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/service-areas/${a.slug}`} className="inline-block rounded-full border border-ink/15 bg-white px-4 py-2 font-semibold hover:border-accent-ink hover:text-accent-ink">
                        Clean Truck Check {a.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <CtaBand title={`Trucks in ${area.name}? We’ll come to you.`} />
    </>
  );
}
