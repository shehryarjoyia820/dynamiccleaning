import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand, PageHero, Reveal, RequirementsTable, SectionHeading } from '@/components/blocks';
import { CaliforniaMap } from '@/components/california-map';
import { BookingForm } from '@/components/forms';
import { JsonLd, pageMeta, serviceSchema } from '@/components/seo';
import { SERVICE_AREAS } from '@/content/seed';
import { getServiceArea, getServiceAreas, getSettings } from '@/lib/content';

export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return SERVICE_AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = await getServiceArea(slug);
  if (!area) return {};
  return pageMeta({
    title: `Mobile Clean Truck Check Testing in ${area.name}, CA`,
    description: `On-site CARB Clean Truck Check testing in ${area.name}. OBD, smoke opacity and visual inspections at your yard or jobsite. Call (858) 342-8328.`,
    path: `/service-areas/${area.slug}`,
  });
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [area, areas, settings] = await Promise.all([getServiceArea(slug), getServiceAreas(), getSettings()]);
  if (!area) notFound();
  const nearby = areas.filter((a) => a.region === area.region && a.slug !== area.slug);

  return (
    <>
      <JsonLd data={serviceSchema(area.name)} />
      <PageHero
        eyebrow={`${area.region} · Mobile testing`}
        title={`Clean Truck Check testing in ${area.name}`}
        intro={area.intro}
        crumbs={[
          { name: 'Service Areas', path: '/service-areas' },
          { name: area.name, path: `/service-areas/${area.slug}` },
        ]}
      />
      <section className="py-section">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <SectionHeading eyebrow={`Book in ${area.name}`} title="Request on-site testing" intro={`Tell us how many trucks you have in the ${area.name} area and we will confirm a time.`} />
            <Reveal delay={100} className="mt-8 rounded-xl bg-white p-6 shadow-card sm:p-8">
              <BookingForm defaultLocation={area.name} source={`area:${area.slug}`} />
            </Reveal>
          </div>
          <div className="grid content-start gap-10">
            <Reveal className="rounded-xl bg-[#1B1D23] p-6">
              <CaliforniaMap areas={areas} highlight={area.slug} className="mx-auto max-w-sm" />
            </Reveal>
            <div>
              <h2 className="text-display-md">Which test does your truck need?</h2>
              <div className="mt-5">
                <RequirementsTable rows={settings.requirements} frequency={settings.frequency_text} />
              </div>
            </div>
            {nearby.length ? (
              <div>
                <h2 className="text-2xl">Also serving {area.region}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {nearby.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/service-areas/${a.slug}`} className="inline-block rounded-full border border-ink/15 bg-white px-4 py-2 font-semibold hover:border-orange-ink hover:text-orange-ink">
                        {a.name}
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
