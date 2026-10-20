import { ImageResponse } from 'next/og';

export const alt = 'Diesel Dynamix: mobile Clean Truck Check testing across Southern California';
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
          <svg width="96" height="96" viewBox="0 0 64 64" fill="none">
            <path d="M12 16H2a2 2 0 0 0 0 4h10a2 2 0 0 0 0-4ZM12 30H6a2 2 0 0 0 0 4h6a2 2 0 0 0 0-4ZM12 44h-2a2 2 0 0 0 0 4h2a2 2 0 0 0 0-4Z" fill="#F5A524" />
            <path fillRule="evenodd" clipRule="evenodd" d="M18 8H36C42.3652 8 48.4697 10.5286 52.9706 15.0294C57.4714 19.5303 60 25.6348 60 32C60 38.3652 57.4714 44.4697 52.9706 48.9706C48.4697 53.4714 42.3652 56 36 56H18V8ZM28 18H36C39.713 18 43.274 19.475 45.8995 22.1005C48.525 24.726 50 28.287 50 32C50 35.713 48.525 39.274 45.8995 41.8995C43.274 44.525 39.713 46 36 46H28V18Z" fill="#F5A524" />
            <path d="M30.5 32.5 36 38l9-13" stroke="#F4F4F2" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', fontSize: 52, fontWeight: 800, letterSpacing: 2 }}>
            <span>DIESEL&nbsp;</span>
            <span style={{ color: '#F5A524' }}>DYNAMIX</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, textTransform: 'uppercase' }}>
            Stay compliant. Keep moving.
          </div>
          <div style={{ fontSize: 36, marginTop: 24, color: '#C9CED8' }}>
            Mobile CARB Clean Truck Check testing anywhere in Southern California
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#F5A524', fontWeight: 700 }}>(858) 342-8328 · dieseldynamix.com</div>
      </div>
    ),
    size,
  );
}
