'use client';

import { useState } from 'react';
import MapPortal from '@/components/MapPortal';
import SiteBoundaryTool from '@/components/SiteBoundaryTool';
import InfrastructureTool from '@/components/InfrastructureTool';
import RoadBuilder from '@/components/RoadBuilder';
import LayerManager from '@/components/LayerManager';
import PrintStudio from '@/components/PrintStudio';
import UserMenu from '@/components/UserMenu';
import Image from 'next/image';

import { Point } from '@/components/SiteBoundaryTool';
import { Road, RoadType, LayerId, LayerState } from '@/types';

export default function Home() {
  const [isLocked, setIsLocked] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [siteBoundary, setSiteBoundary] = useState<Point[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [activeRoadType, setActiveRoadType] = useState<RoadType>('Local');

  const [layers, setLayers] = useState<LayerState[]>([
    { id: 'site', name: 'Site Planning', visible: true, locked: false },
    { id: 'urban', name: 'Urban Planning', visible: true, locked: false },
    { id: 'architecture', name: 'Architecture', visible: true, locked: false },
  ]);

  const toggleLayerVisibility = (id: LayerId) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const toggleLayerLock = (id: LayerId) => {
    setLayers(layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l));
  };

  const isLayerVisible = (id: LayerId) => layers.find(l => l.id === id)?.visible ?? true;

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
            <button
              onClick={() => setIsPrintMode(true)}
              className="text-[10px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity"
            >
              Export
            </button>
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
          {/* Canvas 1: Map Portal (Site Base) */}
          <div className={isLayerVisible('site') ? '' : 'hidden'}>
            <MapPortal
              isLocked={isLocked}
              onLock={() => setIsLocked(true)}
            />
          </div>

          {/* Canvas 2: Boundary Drawing (Urban Layer) */}
          {isLocked && isLayerVisible('urban') && (
            <SiteBoundaryTool
              isLocked={isLocked}
              onBoundaryComplete={(points) => setSiteBoundary(points)}
            />
          )}

          {/* Canvas 3: Infrastructure (Urban Layer Assets) */}
          {siteBoundary.length > 0 && isLayerVisible('urban') && (
            <>
              <InfrastructureTool
                onInfrastructureChange={(data: Record<string, unknown>) => {
                  if (data.type) setActiveRoadType(data.type as RoadType);
                }}
              />
              <RoadBuilder
                activeRoadType={activeRoadType}
                onRoadComplete={(road) => setRoads([...roads, road])}
              />

              {/* Render persistent roads */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <svg className="w-full h-full">
                  {roads.map(road => (
                    <g key={road.id}>
                      <polyline
                        points={road.centerline.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="#000"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points={road.centerline.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1"
                        strokeDasharray="15, 10"
                      />
                      {road.assets.map(asset => (
                        <circle
                          key={asset.id}
                          cx={asset.position.x}
                          cy={asset.position.y}
                          r={asset.type === 'Light' ? 2 : 4}
                          fill={asset.type === 'Light' ? '#000' : '#888'}
                        />
                      ))}
                    </g>
                  ))}
                </svg>
              </div>
            </>
          )}

          {/* Layer Manager */}
          <LayerManager
            layers={layers}
            onToggleVisibility={toggleLayerVisibility}
            onToggleLock={toggleLayerLock}
          />
        </div>

        {/* Footer / Status Bar */}
        <div className="absolute bottom-4 right-6 z-40 bg-black text-white px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em]">
          V.2.0-STABLE / SYSTEM READY
        </div>

        {/* Print Studio Overlay */}
        {isPrintMode && (
          <PrintStudio
            layers={layers}
            roads={roads}
            onClose={() => setIsPrintMode(false)}
          />
        )}
      </div>
    </main>
  );
}
