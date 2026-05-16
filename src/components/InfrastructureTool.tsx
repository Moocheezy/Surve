'use client';

import { useState } from 'react';
import { Truck, Car, Grid3X3, Settings2 } from 'lucide-react';

interface InfrastructureToolProps {
  onInfrastructureChange: (data: Record<string, unknown>) => void;
}

export default function InfrastructureTool({ onInfrastructureChange }: InfrastructureToolProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    { id: 'road', icon: Truck, label: 'Road Builder' },
    { id: 'parking', icon: Car, label: 'Parking Area' },
    { id: 'dev', icon: Grid3X3, label: 'Development Area' },
    { id: 'setback', icon: Settings2, label: 'Setback Offset' },
  ];

  const roadTypes = ['Highway', 'Arterial', 'Local', 'Specialized'];

  return (
    <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
      <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-[10px] font-black uppercase mb-2 px-2">Design Tools</h3>
        <div className="flex flex-col gap-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              className={`flex items-center gap-3 px-4 py-2 text-[9px] font-bold uppercase transition-all ${
                activeTool === tool.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              <tool.icon size={14} />
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      {activeTool && (
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase">{activeTool} Settings</span>
            <button onClick={() => setActiveTool(null)} className="text-[10px] font-bold underline">Close</button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-zinc-500">Width / Size</label>
              <input type="range" className="w-full h-1 bg-zinc-200 appearance-none accent-black cursor-pointer" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-zinc-500">Type / Standard</label>
              {activeTool === 'road' ? (
                <select
                  className="w-full bg-zinc-100 border border-black p-1 text-[8px] font-bold uppercase outline-none"
                  onChange={(e) => onInfrastructureChange({ type: e.target.value })}
                >
                  {roadTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <select className="w-full bg-zinc-100 border border-black p-1 text-[8px] font-bold uppercase outline-none">
                  <option>Standard A</option>
                  <option>Premium B</option>
                  <option>Compact C</option>
                </select>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
