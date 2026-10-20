import { CtaBand, FaqList, OfficialSourceNote, PageHero, Reveal } from '@/components/blocks';
import { JsonLd, faqSchema, pageMeta } from '@/components/seo';
import { getFaqs } from '@/lib/content';

export const revalidate = 300;

export const metadata = pageMeta({
  title: 'Clean Truck Check FAQ | Cost, Deadlines, Out-of-State Trucks',
  description: 'Answers to common questions about California’s Clean Truck Check program and Diesel Dynamix mobile testing.',
  path: '/faq',
});

export default async function FaqPage() {
  const faqs = await getFaqs();
  const categories = Array.from(new Set(faqs.map((f) => f.category)));
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <PageHero eyebrow="FAQ" title="Frequently asked questions" intro="Can’t find your answer? Call or WhatsApp us and we will help." crumbs={[{ name: 'FAQ', path: '/faq' }]} />
      <section className="py-section">
        <div className="container grid max-w-4xl gap-12">
          {categories.map((c) => (
            <Reveal key={c}>
              <h2 className="text-display-md">{c}</h2>
              <div className="mt-5">
                <FaqList faqs={faqs.filter((f) => f.category === c)} />
              </div>
            </Reveal>
          ))}
          <OfficialSourceNote />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
