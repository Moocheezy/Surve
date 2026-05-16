'use client';

import { Scissors, Check } from 'lucide-react';

interface SubdivisionToolProps {
  onSubdivide: () => void;
  parcelCount: number;
}

export default function SubdivisionTool({ onSubdivide, parcelCount }: SubdivisionToolProps) {
  return (
    <div className="bg-white border-2 border-black p-1 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] gap-2">
      <div className="px-4 py-2 bg-zinc-100 border border-black text-[10px] font-black uppercase">
        {parcelCount} Parcels Defined
      </div>
      <button
        onClick={onSubdivide}
        className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase flex items-center gap-2 hover:bg-zinc-800 transition-colors"
      >
        <Scissors size={14} /> Auto-Subdivide Site
      </button>
    </div>
  );
}
