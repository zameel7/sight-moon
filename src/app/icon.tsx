import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070b1a',
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 35%, #fffaf0 0%, #f3e6c4 55%, #c9b98f 100%)',
            boxShadow: '0 0 90px 30px rgba(243, 230, 196, 0.35)',
            display: 'flex',
          }}
        />
      </div>
    ),
    size,
  );
}
