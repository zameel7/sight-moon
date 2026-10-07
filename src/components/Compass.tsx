'use client';

interface CompassProps {
  azimuth: number;
  deviceHeading?: number | null;
  className?: string;
}

export function Compass({ azimuth, deviceHeading = null, className = '' }: CompassProps) {
  return (
    <div className={`compass ${className}`}>
      <svg viewBox="0 0 240 240" role="img" aria-label={`Moon direction ${azimuth.toFixed(1)} degrees from north`}>
        <g style={{ transform: `rotate(${deviceHeading != null ? -deviceHeading : 0}deg)`, transformOrigin: '120px 120px', transition: 'transform 100ms ease-out' }}>
          <circle cx="120" cy="120" r="108" fill="none" stroke="currentColor" strokeOpacity=".17" />
          <circle cx="120" cy="120" r="80" fill="none" stroke="currentColor" strokeOpacity=".08" strokeDasharray="2 5" />
          {Array.from({ length: 72 }, (_, i) => <line key={i} x1="120" y1="12" x2="120" y2={i % 6 === 0 ? 23 : 17} stroke="currentColor" strokeOpacity={i % 6 === 0 ? .5 : .2} transform={`rotate(${i * 5} 120 120)`} />)}
          <g fill="currentColor" textAnchor="middle" dominantBaseline="central" fontSize="12" fontFamily="sans-serif"><text x="120" y="39" fill="#df936b">N</text><text x="201" y="120">E</text><text x="120" y="201">S</text><text x="39" y="120">W</text></g>
          <g transform={`rotate(${azimuth} 120 120)`}><path d="M120 57 L130 127 L120 120 L110 127 Z" fill="#df936b" /><path d="M120 183 L110 127 L120 133 L130 127 Z" fill="currentColor" fillOpacity=".15" /><circle cx="120" cy="120" r="4" fill="#f7f6f2" /></g>
        </g>
      </svg>
      <p>{deviceHeading != null ? 'Live compass active' : 'North at the top'}</p>
    </div>
  );
}
