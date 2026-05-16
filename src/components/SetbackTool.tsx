'use client';

import { useState, useEffect } from 'react';
import { Point } from '@/components/SiteBoundaryTool';
import * as turf from '@turf/turf';

interface SetbackToolProps {
  siteBoundary: Point[];
  offsetMeters: number;
  active: boolean;
}

export default function SetbackTool({ siteBoundary, offsetMeters, active }: SetbackToolProps) {
  const [setbackPoints, setSetbackPoints] = useState<Point[]>([]);

  useEffect(() => {
    if (siteBoundary.length < 3) {
      setSetbackPoints([]);
      return;
    }

    try {
      const coords = [...siteBoundary, siteBoundary[0]].map(p => [p.x, p.y]);
      const poly = turf.polygon([coords]);
      // Negative buffer to create inner setback
      const buffered = turf.buffer(poly, -offsetMeters / 1000, { units: 'kilometers' });

      if (buffered && buffered.geometry.type === 'Polygon') {
        setSetbackPoints((buffered.geometry.coordinates[0] as any).map((c: any) => ({ x: c[0], y: c[1] })));
      } else if (buffered && buffered.geometry.type === 'MultiPolygon') {
         // Just take largest for now
         setSetbackPoints((buffered.geometry.coordinates[0][0] as any).map((c: any) => ({ x: c[0], y: c[1] })));
      } else {
        setSetbackPoints([]);
      }
    } catch (e) {
      console.error("Setback calculation failed", e);
      setSetbackPoints([]);
    }
  }, [siteBoundary, offsetMeters]);

  if (!active || setbackPoints.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <svg className="w-full h-full">
        <polygon
          points={setbackPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="rgba(255, 0, 0, 0.5)"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <text
          x={setbackPoints[0].x}
          y={setbackPoints[0].y}
          className="text-[8px] font-black fill-red-500 uppercase"
        >
          {offsetMeters}m Setback
        </text>
      </svg>
    </div>
  );
}
