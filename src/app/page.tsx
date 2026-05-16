'use client';

import { useState } from 'react';
import MapPortal from '@/components/MapPortal';
import SiteBoundaryTool from '@/components/SiteBoundaryTool';
import InfrastructureTool from '@/components/InfrastructureTool';
import UserMenu from '@/components/UserMenu';
import Image from 'next/image';

import { Point } from '@/components/SiteBoundaryTool';

export default function Home() {
  const [isLocked, setIsLocked] = useState(false);
  const [siteBoundary, setSiteBoundary] = useState<Point[]>([]);

  return (
    <main className="flex flex-col h-screen w-full bg-white text-black overflow-hidden font-sans border-[8px] border-black">
      {/* Top Header */}
      <header className="h-16 border-b-4 border-black flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative w-8 h-8 invert">
            <Image src="/logo.png" alt="SURVE" fill className="object-contain" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase">SURVE SITE SOLVER</h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6">
            <button className="text-[10px] font-black uppercase underline-offset-4 underline decoration-4">Studio</button>
            <button className="text-[10px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity">Archive</button>
            <button className="text-[10px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity">Insights</button>
          </nav>
          <UserMenu />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar - Minimalist Controls */}
        <div className="w-16 border-r-4 border-black flex flex-col items-center py-6 gap-8 shrink-0 bg-white">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-xs font-black">1</div>
          <div className={`w-8 h-8 flex items-center justify-center text-xs font-black border-2 border-black ${isLocked ? 'bg-black text-white' : 'text-black opacity-30'}`}>2</div>
          <div className={`w-8 h-8 flex items-center justify-center text-xs font-black border-2 border-black ${siteBoundary.length > 0 ? 'bg-black text-white' : 'text-black opacity-30'}`}>3</div>
          <div className="mt-auto w-8 h-8 flex items-center justify-center text-black opacity-30">?</div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 relative bg-zinc-50">
          {/* Canvas 1: Map Portal */}
          <MapPortal
            isLocked={isLocked}
            onLock={() => setIsLocked(true)}
          />

          {/* Canvas 2: Boundary Drawing (Visible when map is locked) */}
          {isLocked && (
            <SiteBoundaryTool
              isLocked={isLocked}
              onBoundaryComplete={(points) => setSiteBoundary(points)}
            />
          )}

          {/* Canvas 3: Infrastructure (Visible when boundary is set) */}
          {siteBoundary.length > 0 && (
            <InfrastructureTool onInfrastructureChange={() => {}} />
          )}
        </div>

        {/* Footer / Status Bar */}
        <div className="absolute bottom-4 right-6 z-40 bg-black text-white px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em]">
          V.2.0-STABLE / SYSTEM READY
        </div>
      </div>
    </main>
  );
}
