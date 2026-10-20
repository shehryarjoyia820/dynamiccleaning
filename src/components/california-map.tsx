import Link from 'next/link';
import type { ServiceArea } from '@/content/seed';
import { cn } from '@/lib/utils';

// Simplified California outline as [lon, lat], clockwise from the Oregon border at the coast.
const OUTLINE: [number, number][] = [
  [-124.21, 42.0], [-120.0, 42.0], [-120.0, 39.0], [-114.63, 35.0], [-114.57, 34.8], [-114.13, 34.3],
  [-114.43, 34.08], [-114.53, 33.6], [-114.72, 33.4], [-114.5, 33.0], [-114.72, 32.72], [-117.12, 32.53],
  [-117.25, 32.75], [-117.28, 33.05], [-117.4, 33.22], [-117.7, 33.46], [-118.0, 33.66], [-118.27, 33.71],
  [-118.41, 33.74], [-118.4, 33.9], [-118.52, 34.03], [-118.8, 34.0], [-119.1, 34.1], [-119.3, 34.28],
  [-119.7, 34.4], [-120.47, 34.45], [-120.65, 34.58], [-120.62, 34.9], [-120.64, 35.14], [-120.87, 35.37],
  [-121.28, 35.67], [-121.5, 35.95], [-121.9, 36.3], [-121.95, 36.58], [-121.8, 36.8], [-122.0, 36.96],
  [-122.4, 37.2], [-122.5, 37.5], [-122.51, 37.78], [-122.75, 37.93], [-123.02, 38.0], [-122.97, 38.24],
  [-123.05, 38.3], [-123.4, 38.6], [-123.74, 38.95], [-123.8, 39.45], [-123.85, 39.8], [-124.1, 40.1],
  [-124.41, 40.44], [-124.2, 40.8], [-124.15, 41.05], [-124.07, 41.45], [-124.2, 41.75], [-124.21, 42.0],
];

const LON0 = -124.6;
const LAT0 = 42.2;
const SX = 32; // degrees of longitude are shorter at ~37°N (cos ≈ 0.8)
const SY = 40;

export function project(lng: number, lat: number) {
  return [Math.round((lng - LON0) * SX * 10) / 10, Math.round((LAT0 - lat) * SY * 10) / 10] as const;
}

const PATH = 'M' + OUTLINE.map(([lng, lat]) => project(lng, lat).join(' ')).join(' L') + ' Z';
const W = Math.ceil((-113.9 - LON0) * SX);
const H = Math.ceil((LAT0 - 32.3) * SY);

// Zoomed to Southern California (lng -119.9 to -114.1, lat 35.0 to 32.3), the area Diesel Dynamix serves.
const [VX, VY] = project(-119.9, 35.0);
const [VX2, VY2] = project(-114.1, 32.3);
const VIEW = { x: VX - 4, y: VY - 6, w: VX2 - VX + 8, h: VY2 - VY + 8 };
// Strokes and markers were sized for the full-state view; scale them to the zoom.
const K = VIEW.w / (W + 20);

const REGION_COLORS: Record<string, string> = {
  'Southern California': '#F5A524',
  'Central Valley': '#FFB36B',
  'Bay Area & Northern California': '#FFFFFF',
  'Central Coast': '#1E9E5A',
};

export function CaliforniaMap({
  areas,
  highlight,
  className,
  linkMarkers = true,
}: {
  areas: ServiceArea[];
  highlight?: string;
  className?: string;
  linkMarkers?: boolean;
}) {
  return (
    <div data-reveal className={cn('relative', className)}>
      <svg viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} className="h-auto w-full" role="img" aria-labelledby="ca-map-title">
        <title id="ca-map-title">Map of Southern California showing Diesel Dynamix service locations</title>
        <path d={PATH} fill="#2A2E36" />
        <path className="ca-outline" d={PATH} fill="none" stroke="#F5A524" strokeWidth={2.5 * K} strokeLinejoin="round" />
        <text x={VIEW.x + 14} y={VIEW.y + VIEW.h - 14} fill="#9AA0AA" fontSize={11 * K} letterSpacing={2 * K} fontFamily="var(--font-display), sans-serif">
          PACIFIC OCEAN
        </text>
        {areas.map((a, i) => {
          const [x, y] = project(a.lng, a.lat);
          const on = !highlight || highlight === a.slug;
          const color = REGION_COLORS[a.region] ?? '#F5A524';
          const marker = (
            <g key={a.slug} transform={`translate(${x} ${y})`} opacity={on ? 1 : 0.45}>
              {on ? (
                <circle
                  r={7 * K}
                  fill={color}
                  opacity="0.5"
                  className="motion-safe:animate-pulse-ring"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: `${(i % 6) * 0.4}s` }}
                />
              ) : null}
              <circle r={(highlight === a.slug ? 7 : 4.5) * K} fill={color} stroke="#16181D" strokeWidth={1.5 * K} />
              {highlight === a.slug ? (
                <text x={12 * K} y={5 * K} fill="#fff" fontSize={16 * K} fontWeight="700" fontFamily="var(--font-display), sans-serif">
                  {a.name.toUpperCase()}
                </text>
              ) : null}
            </g>
          );
          return linkMarkers ? (
            <Link key={a.slug} href={`/service-areas/${a.slug}`} aria-label={`${a.name} service area`}>
              {marker}
            </Link>
          ) : (
            marker
          );
        })}
      </svg>
    </div>
  );
}

export { REGION_COLORS };
