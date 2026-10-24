import { PORTS } from '@/content/ports';
import { getFaqs, getPosts, getServiceAreas, getSettings } from '@/lib/content';
import { DISCLAIMER, SITE } from '@/lib/site';

export const revalidate = 3600;

/**
 * llms.txt: a plain-text summary for AI assistants and answer engines
 * (https://llmstxt.org). Built from the same content as the site.
 */
export async function GET() {
  const [areas, faqs, posts, settings] = await Promise.all([getServiceAreas(), getFaqs(), getPosts(), getSettings()]);
  const u = SITE.url;
  const text = `# ${SITE.name}

> ${SITE.name} provides mobile CARB Clean Truck Check testing anywhere in Southern California. We test heavy-duty diesel and alternative-fuel trucks on-site at the customer's yard, jobsite or terminal: OBD tests, smoke opacity tests and visual inspections, for owner-operators and fleets.

- Phone / WhatsApp: ${SITE.phoneDisplay}
- Email (bookings and questions): ${SITE.emailService}
- Service area: Southern California only (Los Angeles, Orange, Riverside, San Bernardino, San Diego and Imperial counties), including the Port of Los Angeles and Port of Long Beach
- CEO: ${SITE.ceo}
- ${DISCLAIMER}

## Clean Truck Check test methods
${settings.requirements.map((r) => `- ${r.vehicle}: ${r.method}`).join('\n')}

Testing frequency: ${settings.frequency_text}

## Key pages
- [Clean Truck Check explained](${u}/clean-truck-check): requirements, deadlines, CTC-VIS, out-of-state trucks, fines and DMV holds
- [Mobile CARB testing](${u}/services)
- [CARB OBD test](${u}/services/obd-testing)
- [Smoke opacity test](${u}/services/smoke-opacity-test)
- [Fleet testing](${u}/services/fleet-testing)
- [How testing works](${u}/services/how-testing-works)
- [FAQ](${u}/clean-truck-check/faq)
- [Book testing](${u}/book)

## Service areas
${areas.map((a) => `- [Clean Truck Check ${a.name}](${u}/service-areas/${a.slug}) (${a.region})`).join('\n')}
${PORTS.map((p) => `- [Clean Truck Check ${p.name}](${u}/service-areas/ports/${p.slug})`).join('\n')}

## Frequently asked questions
${faqs.map((f) => `### ${f.question}\n${f.answer}`).join('\n\n')}

## Guides
${posts.map((p) => `- [${p.title}](${u}/blog/${p.slug}): ${p.excerpt}`).join('\n')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
