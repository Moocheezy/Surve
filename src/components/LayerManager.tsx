'use client';

import { LayerId, LayerState } from '@/types';
import { Layers, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface LayerManagerProps {
  layers: LayerState[];
  onToggleVisibility: (id: LayerId) => void;
  onToggleLock: (id: LayerId) => void;
}

export default function LayerManager({ layers, onToggleVisibility, onToggleLock }: LayerManagerProps) {
  return (
    <div className="absolute top-20 left-20 z-40 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-56">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={16} />
        <span className="text-[10px] font-black uppercase">Studio Layers</span>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`flex items-center justify-between p-2 border border-black transition-colors ${
              layer.visible ? 'bg-zinc-50' : 'bg-zinc-200 opacity-50'
            }`}
          >
            <span className="text-[9px] font-bold uppercase">{layer.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onToggleVisibility(layer.id)}
                className="p-1 hover:bg-black hover:text-white transition-colors"
              >
                {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
              <button
                onClick={() => onToggleLock(layer.id)}
                className="p-1 hover:bg-black hover:text-white transition-colors"
              >
                {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
