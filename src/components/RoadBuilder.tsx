'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Point } from '@/components/SiteBoundaryTool';
import { RoadType, Road } from '@/types';
import { buildRoad } from '@/lib/infrastructure';
import { Truck, Check, Trash2 } from 'lucide-react';

interface RoadBuilderProps {
  onRoadComplete: (road: Road) => void;
  activeRoadType: RoadType;
}

export default function RoadBuilder({ onRoadComplete, activeRoadType }: RoadBuilderProps) {
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

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 12; // Visual road width
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash(isDrawing ? [10, 5] : []);
      ctx.stroke();

      // Draw center lane marker
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach((p, i) => {
        if (i > 0) ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.setLineDash([15, 10]);
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
        width={1000}
        height={800}
        onClick={handleCanvasClick}
        className={`w-full h-full ${isDrawing ? 'pointer-events-auto cursor-crosshair' : ''}`}
      />

      <div className="absolute bottom-32 left-4 z-30 pointer-events-auto flex flex-col gap-2">
        {!isDrawing ? (
          <button
            onClick={() => setIsDrawing(true)}
            className="bg-black text-white p-3 shadow-[4px_4px_0px_0px_rgba(150,150,150,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 text-xs font-bold uppercase"
          >
            <Truck size={16} /> New {activeRoadType} Road
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsDrawing(false);
                if (points.length > 1) {
                  const newRoad = buildRoad(points, activeRoadType);
                  onRoadComplete(newRoad);
                  setPoints([]);
                }
              }}
              className="bg-black text-white p-3 border-2 border-black flex items-center gap-2 text-xs font-bold uppercase"
            >
              <Check size={16} /> Confirm Road
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
    </div>
  );
}
