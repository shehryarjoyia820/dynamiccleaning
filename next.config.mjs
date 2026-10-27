/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The SQL files are read at runtime by /admin/setup to initialise the database.
  // Public guide/city pages and the sitemap can apply pending upgrades too, so new content publishes on its own.
  outputFileTracingIncludes: {
    '/admin/**': ['./supabase/**/*.sql'],
    '/api/**': ['./supabase/**/*.sql'],
    '/blog/**': ['./supabase/**/*.sql'],
    '/service-areas/**': ['./supabase/**/*.sql'],
    '/sitemap.xml': ['./supabase/**/*.sql'],
    '/opengraph-image': ['./public/brand/logo-primary-dark.svg'],
  },
  experimental: {
    // Proposal PDFs (max 4 MB) and CSV imports go through server actions.
    serverActions: { bodySizeLimit: '5mb' },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async redirects() {
    // Service area is Southern California only; retired city pages point to the area list.
    const retired = ['bakersfield', 'fresno', 'visalia', 'modesto', 'stockton', 'merced', 'oakland', 'san-jose', 'sacramento', 'hayward', 'redding', 'eureka', 'santa-barbara', 'san-luis-obispo', 'salinas'];
    return [
      { source: '/service-areas/imperial-valley', destination: '/service-areas/el-centro', permanent: true },
      { source: '/ports/port-of-oakland', destination: '/service-areas', permanent: true },
      { source: '/service-areas/ports/port-of-oakland', destination: '/service-areas', permanent: true },
      // Pages moved under their menu section (Oct 2026): /services/..., /clean-truck-check/..., /service-areas/ports/...
      { source: '/mobile-testing-services', destination: '/services', permanent: true },
      { source: '/obd-testing', destination: '/services/obd-testing', permanent: true },
      { source: '/smoke-opacity-test', destination: '/services/smoke-opacity-test', permanent: true },
      { source: '/how-testing-works', destination: '/services/how-testing-works', permanent: true },
      { source: '/fleet-testing', destination: '/services/fleet-testing', permanent: true },
      { source: '/why-california-enforces-it', destination: '/clean-truck-check/why-california-enforces-it', permanent: true },
      { source: '/faq', destination: '/clean-truck-check/faq', permanent: true },
      { source: '/ports', destination: '/service-areas', permanent: true },
      { source: '/ports/:slug', destination: '/service-areas/ports/:slug', permanent: true },
      ...retired.map((c) => ({ source: `/service-areas/${c}`, destination: '/service-areas', permanent: true })),
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

export default nextConfig;
