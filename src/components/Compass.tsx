'use client';

import { useEffect, useRef } from 'react';

interface CompassProps {
  azimuth: number;
  className?: string;
}

export function Compass({ azimuth, className = '' }: CompassProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw compass circle
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw cardinal directions
    ctx.fillStyle = '#6B7280';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // North
    ctx.fillText('N', centerX, centerY - radius + 25);
    // South
    ctx.fillText('S', centerX, centerY + radius - 15);
    // East
    ctx.fillText('E', centerX + radius - 15, centerY);
    // West
    ctx.fillText('W', centerX - radius + 15, centerY);

    // Draw degree markers
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    for (let i = 0; i < 360; i += 30) {
      const angle = (i * Math.PI) / 180;
      const startX = centerX + (radius - 15) * Math.sin(angle);
      const startY = centerY - (radius - 15) * Math.cos(angle);
      const endX = centerX + radius * Math.sin(angle);
      const endY = centerY - radius * Math.cos(angle);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Draw moon direction arrow
    const moonAngle = (azimuth * Math.PI) / 180;
    const arrowLength = radius - 30;
    const arrowEndX = centerX + arrowLength * Math.sin(moonAngle);
    const arrowEndY = centerY - arrowLength * Math.cos(moonAngle);

    // Arrow shaft
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(arrowEndX, arrowEndY);
    ctx.stroke();

    // Arrow head
    const headLength = 15;
    const angle1 = moonAngle - Math.PI / 6;
    const angle2 = moonAngle + Math.PI / 6;
    
    ctx.beginPath();
    ctx.moveTo(arrowEndX, arrowEndY);
    ctx.lineTo(
      arrowEndX - headLength * Math.sin(angle1),
      arrowEndY + headLength * Math.cos(angle1)
    );
    ctx.moveTo(arrowEndX, arrowEndY);
    ctx.lineTo(
      arrowEndX - headLength * Math.sin(angle2),
      arrowEndY + headLength * Math.cos(angle2)
    );
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fill();

  }, [azimuth]);

  // Convert degrees to cardinal direction
  const getCardinalDirection = (degrees: number): string => {
    // Convert negative azimuth to positive (west of north convention)
    let normalized = degrees;
    if (normalized < 0) {
      normalized = 360 + normalized;
    }
    
    // Ensure normalized is in 0-360 range
    normalized = normalized % 360;
    if (normalized < 0) normalized += 360;
    
    // Standard cardinal direction ranges
    if (normalized >= 337.5 || normalized < 22.5) return 'North';
    if (normalized >= 22.5 && normalized < 67.5) return 'Northeast';
    if (normalized >= 67.5 && normalized < 112.5) return 'East';
    if (normalized >= 112.5 && normalized < 157.5) return 'Southeast';
    if (normalized >= 157.5 && normalized < 202.5) return 'South';
    if (normalized >= 202.5 && normalized < 247.5) return 'Southwest';
    if (normalized >= 247.5 && normalized < 292.5) return 'West';
    if (normalized >= 292.5 && normalized < 337.5) return 'Northwest';
    
    return 'North';
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="border border-gray-300 rounded-lg bg-white w-full max-w-[200px] h-auto"
      />
              <div className="mt-2 text-center">
          <p className="text-xs md:text-sm text-gray-300">
            Moon direction: {azimuth.toFixed(1)}°
          </p>
          <p className="text-xs md:text-sm font-semibold text-white">
            {getCardinalDirection(azimuth)}
          </p>
        </div>
    </div>
  );
}
