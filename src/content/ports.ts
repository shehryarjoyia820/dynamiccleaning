/** Port landing pages: high truck-traffic areas targeted by the SEO plan. */
export type Port = {
  slug: string;
  name: string;
  city: string;
  areaSlug: string;
  lat: number;
  lng: number;
  intro: string;
  points: string[];
};

export const PORTS: Port[] = [
  {
    slug: 'port-of-long-beach',
    name: 'Port of Long Beach',
    city: 'Long Beach',
    areaSlug: 'long-beach',
    lat: 33.75,
    lng: -118.21,
    intro:
      'Drayage trucks serving the Port of Long Beach rack up miles fast and can’t afford a day off the road. Diesel Dynamix brings mobile Clean Truck Check testing to your Long Beach, Wilmington or Carson yard, so your tractors stay compliant between container moves.',
    points: [
      'On-site OBD tests for 2013+ drayage tractors, at your yard or staging lot',
      'Smoke opacity tests for older non-OBD trucks still in local service',
      'Fleet visits planned around vessel schedules and terminal appointments',
      'Testing for out-of-state trucks hauling to and from the port',
    ],
  },
  {
    slug: 'port-of-los-angeles',
    name: 'Port of Los Angeles',
    city: 'San Pedro / Wilmington',
    areaSlug: 'los-angeles',
    lat: 33.74,
    lng: -118.27,
    intro:
      'The Port of Los Angeles is the busiest container port in the U.S., and the trucks that serve it face constant compliance checks. We test drayage tractors and local fleets on-site in San Pedro, Wilmington and the Harbor Gateway so Clean Truck Check never stalls your turns.',
    points: [
      'Mobile Clean Truck Check testing at Harbor-area yards and truck parking',
      'Single-truck appointments for owner-operators between port runs',
      'Multi-truck fleet days with results explained for every VIN',
      'Early-morning scheduling before terminal gates open',
    ],
  },
];
