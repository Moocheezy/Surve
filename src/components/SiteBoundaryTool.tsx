'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PenTool, Trash2, FileText, Check } from 'lucide-react';
import * as turf from '@turf/turf';

export interface Point {
  x: number;
  y: number;
}

interface SiteBoundaryToolProps {
  onBoundaryComplete: (points: Point[]) => void;
  isLocked: boolean;
  active: boolean;
}

export default function SiteBoundaryTool({ onBoundaryComplete, active }: SiteBoundaryToolProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(active);

  useEffect(() => {
    setIsDrawing(active);
  }, [active]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([...points, { x, y }]);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach((p, i) => {
        if (i > 0) ctx.lineTo(p.x, p.y);
      });

      if (!isDrawing && points.length > 2) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fill();
      }

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.setLineDash(isDrawing ? [5, 5] : []);
      ctx.stroke();

      // Draw vertices
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
      });
    }
  }, [points, isDrawing]);

  const analysis = useMemo(() => {
    if (points.length < 3) return null;
    const coords = [...points, points[0]].map(p => [p.x, p.y]);
    const poly = turf.polygon([coords]);
    const areaSqM = turf.area(poly);
    const areaSqFt = areaSqM * 10.7639;

    return {
      areaSqFt: Math.round(areaSqFt),
      hectares: (areaSqM / 10000).toFixed(2),
      perimeter: turf.length(poly, { units: 'meters' }).toFixed(2)
    };
  }, [points]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        draw();
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`w-full h-full ${isDrawing ? 'pointer-events-auto cursor-crosshair' : ''}`}
      />

      <div className="absolute bottom-16 left-4 z-30 pointer-events-auto flex flex-col gap-2">
        {isDrawing && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsDrawing(false);
                onBoundaryComplete(points);
              }}
              className="bg-black text-white p-3 border-2 border-black flex items-center gap-2 text-xs font-bold uppercase"
            >
              <Check size={16} /> Finish Site
            </button>
            <button
              onClick={() => setPoints([])}
              className="bg-white border-2 border-black p-3 flex items-center gap-2 text-xs font-bold uppercase"
            >
              <Trash2 size={16} /> Reset
            </button>
          </div>
        )}
      </div>

      {analysis && !isDrawing && (
        <div className="absolute top-24 left-4 z-30 pointer-events-auto bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-64">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} />
            <span className="text-[10px] font-black uppercase">Analysis Report</span>
          </div>
          <div className="space-y-1 text-[9px] font-bold uppercase text-zinc-600">
            <div className="flex justify-between"><span>Site Area:</span><span>{analysis.areaSqFt.toLocaleString()} SQFT</span></div>
            <div className="flex justify-between"><span>Metric Area:</span><span>{analysis.hectares} Hectares</span></div>
            <div className="flex justify-between"><span>Perimeter:</span><span>{analysis.perimeter}m</span></div>
            <div className="flex justify-between border-t border-black/10 pt-1 mt-1"><span>Zoning:</span><span className="text-black">MU-3 Mixed Use</span></div>
          </div>
          <button className="mt-4 w-full py-2 bg-zinc-100 border border-black text-[8px] font-black uppercase hover:bg-black hover:text-white transition-colors">
            Export Full Analysis
          </button>
        </div>
      )}
    </div>
  );
}
