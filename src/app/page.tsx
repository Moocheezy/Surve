'use client';

import { useState } from 'react';
import MapPortal from '@/components/MapPortal';
import SiteBoundaryTool from '@/components/SiteBoundaryTool';
import InfrastructureTool from '@/components/InfrastructureTool';
import RoadBuilder from '@/components/RoadBuilder';
import ParkingTool from '@/components/ParkingTool';
import SetbackTool from '@/components/SetbackTool';
import SubdivisionTool from '@/components/SubdivisionTool';
import SGDiagramView from '@/components/SGDiagramView';
import LayerManager from '@/components/LayerManager';
import PrintStudio from '@/components/PrintStudio';
import UserMenu from '@/components/UserMenu';
import Image from 'next/image';

import { Point } from '@/components/SiteBoundaryTool';
import { Road, RoadType, LayerId, LayerState } from '@/types';
import { Parcel, subdivideSite } from '@/lib/subdivision';
import { generateSGData, SGData } from '@/lib/sg-diagram';

export default function Home() {
  const [isLocked, setIsLocked] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [siteBoundary, setSiteBoundary] = useState<Point[]>([]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [sgData, setSgData] = useState<SGData | null>(null);
  const [showSGDiagram, setShowSGDiagram] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [roads, setRoads] = useState<Road[]>([]);
  const [parkingAreas, setParkingAreas] = useState<any[]>([]);
  const [setbackDistance, setSetbackDistance] = useState(5);
  const [activeRoadType, setActiveRoadType] = useState<RoadType>('Local');
  const [activeTool, setActiveTool] = useState<string | null>(null);

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
            <button
              onClick={() => setIsPrintMode(false)}
              className={`text-[10px] font-black uppercase underline-offset-4 decoration-4 ${!isPrintMode ? 'underline' : 'opacity-30'}`}
            >
              Studio
            </button>
            <button
              onClick={() => setIsPrintMode(true)}
              className={`text-[10px] font-black uppercase underline-offset-4 decoration-4 ${isPrintMode ? 'underline' : 'opacity-30'}`}
            >
              Export
            </button>
            <button
              onClick={() => setShowInsights(true)}
              className="text-[10px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity"
            >
              Insights
            </button>
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
              active={activeTool === 'site'}
              onBoundaryComplete={(points) => {
                setSiteBoundary(points);
                setSgData(generateSGData(points));
              }}
            />
          )}

          {/* Canvas 3: Infrastructure (Urban Layer Assets) */}
          {isLocked && isLayerVisible('urban') && (
            <>
              {siteBoundary.length > 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                  <SubdivisionTool
                    parcelCount={parcels.length}
                    onSubdivide={() => {
                      const newParcels = subdivideSite(siteBoundary, roads);
                      setParcels(newParcels);
                    }}
                  />
                  <button
                    onClick={() => setShowSGDiagram(true)}
                    className="bg-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black uppercase hover:bg-zinc-100"
                  >
                    View Survey Record
                  </button>
                </div>
              )}

              <InfrastructureTool
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                onInfrastructureChange={(data: Record<string, unknown>) => {
                  if (data.type) setActiveRoadType(data.type as RoadType);
                  if (data.setback) setSetbackDistance(Number(data.setback));
                }}
              />

              {activeTool === 'road' && (
                <RoadBuilder
                  activeRoadType={activeRoadType}
                  onRoadComplete={(road) => {
                    setRoads([...roads, road]);
                    setActiveTool(null);
                  }}
                />
              )}

              <ParkingTool
                active={activeTool === 'parking'}
                onParkingComplete={(area) => {
                  setParkingAreas([...parkingAreas, area]);
                  setActiveTool(null);
                }}
              />

              <SetbackTool
                active={activeTool === 'setback'}
                siteBoundary={siteBoundary}
                offsetMeters={setbackDistance}
              />

              {/* Render persistent assets */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <svg className="w-full h-full">
                  {/* Parcels */}
                  {parcels.map(parcel => (
                    <polygon
                      key={parcel.id}
                      points={parcel.points.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(0,0,0,0.05)"
                      stroke="#000"
                      strokeWidth="1"
                      strokeDasharray="4,2"
                    />
                  ))}
                  {/* Parking */}
                  {parkingAreas.map(area => (
                    <polygon
                      key={area.id}
                      points={area.points.map((p: any) => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(0,0,0,0.1)"
                      stroke="#000"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  ))}
                  {/* Roads */}
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

          {/* Modals */}
          {showSGDiagram && sgData && (
            <SGDiagramView
              data={sgData}
              onClose={() => setShowSGDiagram(false)}
            />
          )}

          {showInsights && (
            <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-20 backdrop-blur-sm">
              <div className="bg-white border-[10px] border-black w-full max-w-2xl p-10">
                <h2 className="text-2xl font-black uppercase mb-6">Development Insights</h2>
                <div className="grid grid-cols-2 gap-8 font-mono text-sm">
                  <div className="space-y-2">
                    <p className="opacity-50 uppercase text-[10px]">Total Yield</p>
                    <p className="text-xl font-black underline">12,400 SQFT</p>
                  </div>
                  <div className="space-y-2">
                    <p className="opacity-50 uppercase text-[10px]">Efficiency</p>
                    <p className="text-xl font-black underline">84%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="opacity-50 uppercase text-[10px]">Parking Ratio</p>
                    <p className="text-xl font-black underline">1.2 / Unit</p>
                  </div>
                  <div className="space-y-2">
                    <p className="opacity-50 uppercase text-[10px]">Estimated Cap Rate</p>
                    <p className="text-xl font-black underline">5.8%</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInsights(false)}
                  className="mt-10 w-full py-4 bg-black text-white font-black uppercase"
                >
                  Close Insights
                </button>
              </div>
            </div>
          )}
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
