'use client';

import { useState } from 'react';
import { LayerState, Road, BuildingBlock } from '@/types';
import { Printer, X, CheckSquare, Square, Download, FileText } from 'lucide-react';

interface PrintStudioProps {
  layers: LayerState[];
  roads: Road[];
  onClose: () => void;
}

export default function PrintStudio({ layers, roads, onClose }: PrintStudioProps) {
  const [selectedLayers, setSelectedLayers] = useState<string[]>(layers.filter(l => l.visible).map(l => l.id));
  const [includeAssets, setIncludeAssets] = useState(true);

  const toggleLayer = (id: string) => {
    setSelectedLayers(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col font-sans border-[16px] border-black animate-in fade-in duration-300">
      <header className="h-20 border-b-8 border-black flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-4">
          <Printer size={32} />
          <h2 className="text-3xl font-black uppercase tracking-tighter">Print Studio</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-black hover:text-white transition-colors border-4 border-black"
        >
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Print Configuration Sidebar */}
        <div className="w-96 border-r-8 border-black p-10 space-y-10 overflow-y-auto bg-zinc-50">
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Select Layers to Print</h3>
            <div className="space-y-2">
              {layers.map(layer => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`w-full flex items-center justify-between p-4 border-4 border-black font-black uppercase text-xs transition-all ${
                    selectedLayers.includes(layer.id) ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {layer.name}
                  {selectedLayers.includes(layer.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Assets & Metadata</h3>
            <button
              onClick={() => setIncludeAssets(!includeAssets)}
              className={`w-full flex items-center justify-between p-4 border-4 border-black font-black uppercase text-xs transition-all ${
                includeAssets ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              Include Infrastructure Assets
              {includeAssets ? <CheckSquare size={16} /> : <Square size={16} />}
            </button>
          </section>

          <div className="pt-10 space-y-4">
            <button
              onClick={handlePrint}
              className="w-full py-6 bg-black text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-zinc-800 transition-colors shadow-[8px_8px_0px_0px_rgba(200,200,200,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
            >
              Confirm & Print
            </button>
            <button className="w-full py-4 border-4 border-black font-black uppercase text-xs flex items-center justify-center gap-2">
              <Download size={16} /> Export as DXF
            </button>
          </div>
        </div>

        {/* Print Preview Area */}
        <div className="flex-1 bg-zinc-200 p-20 flex items-center justify-center overflow-auto print:p-0 print:bg-white">
          <div className="bg-white aspect-[1/1.41] w-full max-w-2xl shadow-2xl border border-zinc-300 p-10 flex flex-col print:shadow-none print:border-none print:max-w-none print:w-full">
            <header className="flex justify-between items-start mb-10 border-b-2 border-black pb-4 uppercase">
              <div>
                <h1 className="text-2xl font-black">SURVE / Studio Export</h1>
                <p className="text-[10px] font-bold">Document v.2.0 / Generated {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black">Site ID: 4492-BX</p>
                <p className="text-[10px] font-bold">Scale: 1:2000</p>
              </div>
            </header>

            <div className="flex-1 border-2 border-black relative overflow-hidden bg-zinc-50 grayscale">
              {/* Simplified Print Preview Content */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <FileText size={120} strokeWidth={1} />
              </div>

              <div className="p-4 text-[8px] font-black uppercase space-y-1">
                <p>Layers Exported:</p>
                <ul className="list-disc pl-4">
                  {selectedLayers.map(l => <li key={l}>{l}</li>)}
                </ul>
              </div>
            </div>

            <footer className="mt-10 pt-4 border-t-2 border-black flex justify-between items-end">
              <div className="text-[8px] font-bold uppercase space-y-1">
                <p>© 2025 SURVE TECHNOLOGY INC.</p>
                <p>All Rights Reserved / Confidential</p>
              </div>
              <div className="w-12 h-12 border-2 border-black bg-black flex items-center justify-center text-white font-black text-xs">
                S
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
