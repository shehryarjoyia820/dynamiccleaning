/**
 * Original vector hero scenes, used until real Diesel Dynamix photos arrive.
 * Inline SVG keeps the hero tiny (no image request) so LCP stays fast.
 */

function Wheel({ cx, cy, r = 40 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0B0C0F" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#3A3F49" />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#9AA1AE" />
    </g>
  );
}

export function SemiTruck({
  x,
  y,
  s = 1,
  body = '#2A2E36',
  trailer = '#20232A',
  accent = '#F5A524',
  puff = true,
  brand = true,
}: {
  x: number;
  y: number;
  s?: number;
  body?: string;
  trailer?: string;
  accent?: string;
  puff?: boolean;
  brand?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* trailer */}
      <rect x={-540} y={-20} width={640} height={240} rx={6} fill={trailer} stroke="#3A3F49" strokeWidth={3} />
      <rect x={-540} y={196} width={640} height={10} fill={accent} />
      {brand ? (
        <text x={-220} y={110} textAnchor="middle" fontFamily="var(--font-display), Arial Narrow, sans-serif" fontWeight={800} fontSize={64} letterSpacing={4} fill="#FFFFFF" opacity={0.92}>
          DIESEL <tspan fill={accent}>DYNAMIX</tspan>
        </text>
      ) : null}
      <rect x={-500} y={220} width={140} height={22} fill="#15171B" />
      {/* tractor */}
      <rect x={100} y={210} width={330} height={20} fill="#15171B" />
      <path d="M110 230V-20q0-20 20-20h120q20 0 25 20l15 80h10v170z" fill={body} />
      <path d="M290 70h110q20 0 25 20l7 110v30H290z" fill={body} />
      <path d="M258 -18l22 70h-48v-70z" fill="#9FB4C9" opacity={0.55} />
      <rect x={140} y={-10} width={70} height={60} rx={4} fill="#9FB4C9" opacity={0.35} />
      <rect x={426} y={98} width={10} height={100} rx={3} fill="#8A909C" />
      <rect x={420} y={204} width={26} height={26} rx={3} fill="#9AA1AE" />
      <rect x={424} y={92} width={14} height={10} rx={2} fill="#FFD9A8" />
      <rect x={196} y={186} width={84} height={34} rx={17} fill="#B9BFCA" />
      <rect x={272} y={-120} width={11} height={130} rx={4} fill="#9AA1AE" />
      {puff ? (
        <g fill="#1E9E5A" opacity={0.18}>
          <circle cx={262} cy={-150} r={16} />
          <circle cx={238} cy={-176} r={22} />
          <circle cx={204} cy={-200} r={28} />
        </g>
      ) : null}
      <path d="M110 120h180" stroke={accent} strokeWidth={6} />
      <Wheel cx={-450} cy={248} />
      <Wheel cx={-366} cy={248} />
      <Wheel cx={150} cy={248} />
      <Wheel cx={232} cy={248} />
      <Wheel cx={380} cy={248} />
    </g>
  );
}

function ServicePickup({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 120V64l40-4 34-50h92l26 50h96q14 0 14 14v46z" fill="#F4F4F2" />
      <path d="M84 20h70l20 40H58z" fill="#2A2E36" opacity={0.75} />
      <rect x={86} y={0} width={70} height={10} rx={3} fill="#F5A524" />
      <rect x={0} y={92} width={302} height={8} fill="#F5A524" />
      <text x={150} y={86} textAnchor="middle" fontFamily="var(--font-display), Arial Narrow, sans-serif" fontWeight={800} fontSize={20} fill="#16181D">
        MOBILE TESTING
      </text>
      <Wheel cx={60} cy={124} r={28} />
      <Wheel cx={240} cy={124} r={28} />
    </g>
  );
}

function Sky({ id, glow = '#F5A524' }: { id: string; glow?: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E0F12" />
          <stop offset="0.6" stopColor="#1C1F26" />
          <stop offset="1" stopColor="#2A2E36" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.72" cy="0.72" r="0.55">
          <stop offset="0" stopColor={glow} stopOpacity="0.45" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}-sky)`} />
      <rect width="1600" height="900" fill={`url(#${id}-glow)`} />
      <path d="M0 640 L180 560 L340 610 L520 520 L700 600 L900 540 L1080 610 L1260 530 L1440 590 L1600 550 V720 H0Z" fill="#1A1C22" />
    </>
  );
}

function Road() {
  return (
    <>
      <rect y="700" width="1600" height="200" fill="#121317" />
      <rect y="700" width="1600" height="6" fill="#2A2E36" />
      {/* dash period 160 divides the 800-unit shift, so the loop is seamless */}
      <g className="motion-safe:animate-road">
        <path d="M0 810 H3200" stroke="#FFC680" strokeWidth="8" strokeDasharray="80 80" opacity="0.55" />
      </g>
    </>
  );
}

export function SceneHighway() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <Sky id="s1" />
      <Road />
      <SemiTruck x={1000} y={455} />
    </svg>
  );
}

export function SceneOnSite() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <Sky id="s2" glow="#FFB36B" />
      <rect y="700" width="1600" height="200" fill="#17191E" />
      <g stroke="#2A2E36" strokeWidth="4">
        <path d="M0 760H1600M0 840H1600" />
      </g>
      {/* yard light */}
      <rect x="1460" y="300" width="10" height="400" fill="#3A3F49" />
      <rect x="1420" y="292" width="70" height="14" rx="4" fill="#9AA1AE" />
      <path d="M1425 306 L1360 700 H1560 L1490 306Z" fill="#FFE2B8" opacity="0.06" />
      <SemiTruck x={880} y={455} puff={false} />
      <ServicePickup x={1160} y={580} />
      {/* tester cable to truck */}
      <path d="M1200 650 C1150 690 1060 700 1040 640" fill="none" stroke="#F5A524" strokeWidth="5" strokeDasharray="10 8" />
      {/* location pin */}
      <g transform="translate(1290 470)">
        <circle r="34" fill="#F5A524" opacity="0.25" className="motion-safe:animate-pulse-ring" style={{ transformOrigin: 'center', transformBox: 'fill-box' }} />
        <path d="M0 -44c-20 0-34 15-34 33 0 24 34 55 34 55s34-31 34-55c0-18-14-33-34-33z" fill="#F5A524" />
        <circle cy="-12" r="12" fill="#16181D" />
      </g>
    </svg>
  );
}

export function SceneFleet() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <Sky id="s3" />
      <rect y="700" width="1600" height="200" fill="#15171B" />
      <g stroke="#FFC680" strokeWidth="5" opacity="0.35">
        <path d="M120 900 L260 700M520 900 L590 700M920 900 L930 700M1320 900 L1270 700" />
      </g>
      <SemiTruck x={560} y={380} s={0.62} body="#1F2228" trailer="#1A1C21" brand={false} puff={false} />
      <SemiTruck x={1020} y={400} s={0.7} body="#252830" trailer="#1C1E24" brand={false} puff={false} />
      <SemiTruck x={1180} y={470} s={0.86} />
      {/* checkmarks over trucks */}
      {[
        [470, 300],
        [960, 300],
        [1130, 330],
      ].map(([cx, cy]) => (
        <g key={cx} transform={`translate(${cx} ${cy})`}>
          <circle r="26" fill="#1E9E5A" />
          <path d="M-11 0 l7 8 l15 -16" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}
