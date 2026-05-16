'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AnalyticsPane from '@/components/AnalyticsPane';
import MassingCanvas from '@/components/MassingCanvas';
import { SolverParams } from '@/types';
import { solveSite } from '@/lib/solver';

export default function Home() {
  const [params, setParams] = useState<SolverParams>({
    siteWidth: 400,
    siteLength: 500,
    setback: 20,
    typology: 'Residential',
    targetHeight: 120,
  });

  const currentScheme = solveSite(params);

  return (
    <main className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans">
      <Sidebar params={params} setParams={setParams} />

      <div className="flex-1 flex flex-col p-4 relative">
        <header className="flex justify-between items-center mb-4 px-2">
          <div>
            <h2 className="text-slate-100 font-bold text-lg">{currentScheme.name}</h2>
            <p className="text-slate-500 text-sm">Site Solver / {currentScheme.typology}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 text-slate-200 rounded-md text-sm hover:bg-slate-700 transition-colors">
              Save Scheme
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500 transition-colors">
              Export PDF
            </button>
          </div>
        </header>

        <div className="flex-1 relative">
          <MassingCanvas scheme={currentScheme} />

          <div className="absolute bottom-6 left-6 flex gap-4 pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-lg flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-xs text-slate-300 font-medium">Building Massing</span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-lg flex items-center gap-3">
              <div className="w-3 h-3 bg-slate-500 rounded-full" />
              <span className="text-xs text-slate-300 font-medium">Surface Parking</span>
            </div>
          </div>
        </div>
      </div>

      <AnalyticsPane scheme={currentScheme} />
    </main>
  );
}
