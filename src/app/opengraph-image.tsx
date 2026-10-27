import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Diesel Dynamix: mobile Clean Truck Check testing across Southern California';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const svg = await readFile(join(process.cwd(), 'public/brand/logo-primary-dark.svg'));
  const logo = `data:image/svg+xml;base64,${svg.toString('base64')}`;
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
          background: 'linear-gradient(135deg, #0B0F14 0%, #161C24 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={logo} width={520} height={96} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, textTransform: 'uppercase' }}>
            Stay compliant. Keep moving.
          </div>
          <div style={{ fontSize: 36, marginTop: 24, color: '#C9CED8' }}>
            Mobile CARB Clean Truck Check testing anywhere in Southern California
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#4C8DFF', fontWeight: 700 }}>(858) 342-8328 · dieseldynamix.com</div>
      </div>
    ),
    size,
  );
}
