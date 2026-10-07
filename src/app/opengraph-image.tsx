import { ImageResponse } from 'next/og';
import { siteName } from '@/lib/site';

export const alt = 'Sight Moon — find the moon in the sky tonight';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 96px',
          background: 'radial-gradient(ellipse at 75% 40%, #1a2347 0%, #0b1026 45%, #050814 100%)',
          color: '#f5efe0',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontSize: 34, letterSpacing: 8, color: '#c8cfdf', textTransform: 'uppercase' }}>
            {siteName}
          </div>
          <div style={{ fontSize: 78, lineHeight: 1.05, marginTop: 24, maxWidth: 640 }}>
            Find the moon in the sky tonight.
          </div>
          <div style={{ fontSize: 30, marginTop: 28, color: '#aab3c8', fontFamily: 'sans-serif' }}>
            Live compass · Moon phase · Rise &amp; set · Hilal sighting
          </div>
        </div>
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 35%, #fffaf0 0%, #f3e6c4 55%, #c9b98f 100%)',
            boxShadow: '0 0 140px 50px rgba(243, 230, 196, 0.28)',
            display: 'flex',
          }}
        />
      </div>
    ),
    size,
  );
}
