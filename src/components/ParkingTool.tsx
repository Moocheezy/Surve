'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Point } from '@/components/SiteBoundaryTool';
import { Car, Check, Trash2 } from 'lucide-react';

interface ParkingArea {
  id: string;
  points: Point[];
  capacity: number;
}

interface ParkingToolProps {
  onParkingComplete: (area: ParkingArea) => void;
  active: boolean;
}

export default function ParkingTool({ onParkingComplete, active }: ParkingToolProps) {
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fill();

        // Draw stripes pattern
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        for(let i=0; i<canvas.width; i+=10) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
      }

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
    }
  }, [points, isDrawing]);

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

  if (!active && points.length === 0) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`w-full h-full ${isDrawing ? 'pointer-events-auto cursor-crosshair' : ''}`}
      />

      {isDrawing && (
        <div className="absolute bottom-16 left-4 z-30 pointer-events-auto flex gap-2">
            <button
                onClick={() => {
                    setIsDrawing(false);
                    if (points.length > 2) {
                        onParkingComplete({
                            id: Date.now().toString(),
                            points,
                            capacity: Math.floor(points.length * 2.5) // Simulated
                        });
                        setPoints([]);
                    }
                }}
                className="bg-black text-white p-3 border-2 border-black flex items-center gap-2 text-xs font-bold uppercase"
            >
                <Check size={16} /> Confirm Parking
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
  );
}
