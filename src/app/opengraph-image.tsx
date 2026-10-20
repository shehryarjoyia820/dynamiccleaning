import { ImageResponse } from 'next/og';

export const alt = 'Diesel Dynamix: mobile Clean Truck Check testing across California';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #16181D 0%, #2A2E36 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="88" height="88" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#0E0F12" />
            <path d="M13 40a21 21 0 0 1 42 0" fill="none" stroke="#FF6B1A" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M48.9 25.2a21 21 0 0 1 6.1 14.8" fill="none" stroke="#1E9E5A" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M34 40 46.5 25" stroke="#FFF" strokeWidth="5" strokeLinecap="round" />
            <circle cx="34" cy="40" r="5.5" fill="#FFF" />
            <path d="M13 51h42" stroke="#FF6B1A" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, letterSpacing: 2 }}>
            <span>DIESEL&nbsp;</span>
            <span style={{ color: '#FF6B1A' }}>DYNAMIX</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, textTransform: 'uppercase' }}>
            Stay compliant. Keep moving.
          </div>
          <div style={{ fontSize: 36, marginTop: 24, color: '#C9CED8' }}>
            Mobile CARB Clean Truck Check testing anywhere in California
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#FF6B1A', fontWeight: 700 }}>(858) 342-8328 · dieseldynamix.com</div>
      </div>
    ),
    size,
  );
}
