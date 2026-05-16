'use client';

import { Typology, SolverParams } from '@/types';
import { Settings, Maximize, Sliders } from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  params: SolverParams;
  setParams: (params: SolverParams) => void;
}

export default function Sidebar({ params, setParams }: SidebarProps) {
  const typologies: Typology[] = ['Residential', 'Industrial', 'Retail', 'Mixed-Use'];

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8 h-full overflow-y-auto text-slate-200">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-slate-800">
          <Image src="/logo.png" alt="SURVE Logo" fill className="object-cover" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">SURVE</h1>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400 font-medium text-sm uppercase tracking-wider">
          <Settings size={16} />
          <span>Site Parameters</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Typology</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={params.typology}
              onChange={(e) => setParams({ ...params, typology: e.target.value as Typology })}
            >
              {typologies.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>Site Width (ft)</label>
              <span className="text-blue-400">{params.siteWidth}</span>
            </div>
            <input
              type="range" min="100" max="1000" step="10"
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              value={params.siteWidth}
              onChange={(e) => setParams({ ...params, siteWidth: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>Site Length (ft)</label>
              <span className="text-blue-400">{params.siteLength}</span>
            </div>
            <input
              type="range" min="100" max="1000" step="10"
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              value={params.siteLength}
              onChange={(e) => setParams({ ...params, siteLength: Number(e.target.value) })}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400 font-medium text-sm uppercase tracking-wider">
          <Sliders size={16} />
          <span>Constraints</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>Setback (ft)</label>
              <span className="text-blue-400">{params.setback}</span>
            </div>
            <input
              type="range" min="0" max="100" step="5"
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              value={params.setback}
              onChange={(e) => setParams({ ...params, setback: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>Target Height (ft)</label>
              <span className="text-blue-400">{params.targetHeight}</span>
            </div>
            <input
              type="range" min="20" max="400" step="10"
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              value={params.targetHeight}
              onChange={(e) => setParams({ ...params, targetHeight: Number(e.target.value) })}
            />
          </div>
        </div>
      </section>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Maximize size={18} />
          Solve Site
        </button>
      </div>
    </div>
  );
}
