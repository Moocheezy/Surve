'use client';

import { useState } from 'react';
import { Search, Lock, Unlock, Map as MapIcon } from 'lucide-react';

interface MapPortalProps {
  onLock: (mapData: { address: string; scale: number }) => void;
  isLocked: boolean;
}

export default function MapPortal({ onLock, isLocked }: MapPortalProps) {
  const [address, setAddress] = useState('');

  return (
    <div className="relative w-full h-full bg-zinc-100 flex flex-col">
      {/* Map Control Overlay */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-white border-2 border-black p-1 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Search size={18} className="mx-2" />
          <input
            type="text"
            placeholder="Search Location..."
            className="outline-none bg-transparent text-sm font-bold uppercase p-2 w-64"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button
          onClick={() => onLock({ address, scale: 1.0 })}
          className={`px-4 py-2 flex items-center gap-2 border-2 border-black font-bold uppercase text-xs transition-all ${
            isLocked
              ? 'bg-black text-white'
              : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
          }`}
        >
          {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          {isLocked ? 'Locked' : 'Lock Site'}
        </button>
      </div>

      {/* Simulated Map Layer */}
      <div className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${isLocked ? 'opacity-30 grayscale' : 'opacity-100'}`}>
        {/* Using a public tile server for actual map context (OpenStreetMap stylized) */}
        <div
          className="absolute inset-0 bg-[#e5e5e5] opacity-50 transition-all duration-700"
          style={{
            backgroundImage: `url('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png')`,
            backgroundSize: '256px',
            filter: 'contrast(0.8) brightness(1.2)'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />

        {/* Actual Dynamic Context Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!isLocked && (
            <div className="bg-white border-4 border-black p-6 text-center space-y-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <MapIcon size={32} className="mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest">Active Site Engine</p>
                <p className="text-[10px] font-mono opacity-50 uppercase">{address || "Coordinates: 32.7767° N, 96.7970° W"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Status Bar */}
      <div className="bg-white border-t-2 border-black px-4 py-2 flex justify-between items-center text-[10px] font-bold uppercase">
        <div className="flex gap-4">
          <span>Scale: 1:1000</span>
          <span>Lat: 32.7767° N</span>
          <span>Lng: 96.7970° W</span>
        </div>
        <div>
          {isLocked ? 'Site Context Locked' : 'Searching Site...'}
        </div>
      </div>
    </div>
  );
}
