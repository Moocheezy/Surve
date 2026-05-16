'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PenTool, Trash2, FileText, Check } from 'lucide-react';

export interface Point {
  x: number;
  y: number;
}

interface SiteBoundaryToolProps {
  onBoundaryComplete: (points: Point[]) => void;
  isLocked: boolean;
}

export default function SiteBoundaryTool({ onBoundaryComplete }: SiteBoundaryToolProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <canvas
        ref={canvasRef}
        width={1000} // This should ideally be responsive
        height={800}
        onClick={handleCanvasClick}
        className={`w-full h-full ${isDrawing ? 'pointer-events-auto cursor-crosshair' : ''}`}
      />

      <div className="absolute bottom-16 left-4 z-30 pointer-events-auto flex flex-col gap-2">
        {!isDrawing ? (
          <button
            onClick={() => setIsDrawing(true)}
            className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 text-xs font-bold uppercase"
          >
            <PenTool size={16} /> Draw Site Boundary
          </button>
        ) : (
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

      {points.length > 2 && !isDrawing && (
        <div className="absolute top-24 left-4 z-30 pointer-events-auto bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-64">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} />
            <span className="text-[10px] font-black uppercase">Analysis Report</span>
          </div>
          <div className="space-y-1 text-[9px] font-bold uppercase text-zinc-600">
            <div className="flex justify-between"><span>Site Area:</span><span>45,200 SQFT</span></div>
            <div className="flex justify-between"><span>Zoning:</span><span>MU-3 Mixed Use</span></div>
            <div className="flex justify-between"><span>Max FAR:</span><span>4.5</span></div>
            <div className="flex justify-between"><span>Setbacks:</span><span>20FT Front / 10FT Side</span></div>
          </div>
          <button className="mt-4 w-full py-2 bg-zinc-100 border border-black text-[8px] font-black uppercase hover:bg-black hover:text-white transition-colors">
            Export Full Analysis
          </button>
        </div>
      )}
    </div>
  );
}
