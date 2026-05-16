'use client';

import { SGData } from '@/lib/sg-diagram';
import { FileText, Download } from 'lucide-react';

interface SGDiagramViewProps {
  data: SGData;
  onClose: () => void;
}

export default function SGDiagramView({ data, onClose }: SGDiagramViewProps) {
  return (
    <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-20 backdrop-blur-sm">
      <div className="bg-white border-[10px] border-black w-full max-w-4xl h-full flex flex-col shadow-[20px_20px_0px_0px_rgba(255,255,255,0.2)]">
        <header className="border-b-4 border-black p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <FileText size={24} />
            <h2 className="text-xl font-black uppercase tracking-tighter">Land Surveyor General Diagram</h2>
          </div>
          <button onClick={onClose} className="text-xs font-black uppercase underline decoration-2 underline-offset-4">Close Record</button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 font-mono text-[10px]">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <section>
                <h3 className="font-black text-xs border-b border-black mb-2 uppercase">Official Details</h3>
                <p>DIAGRAM NO: {data.diagramNumber}</p>
                <p>DESCRIPTION: {data.description}</p>
                <p>PROVINCE: Western Cape</p>
                <p>ADMINISTRATIVE DISTRICT: Cape Town</p>
              </section>

              <section>
                <h3 className="font-black text-xs border-b border-black mb-2 uppercase">Coordinate List (System: Lo27)</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/20">
                      <th className="py-1">Point</th>
                      <th className="py-1">Y (Easting)</th>
                      <th className="py-1">X (Northing)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.coordinates.map((c) => (
                      <tr key={c.label}>
                        <td className="py-1 font-bold">{c.label}</td>
                        <td className="py-1">{c.y.toLocaleString()}</td>
                        <td className="py-1">{c.x.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="font-black text-xs border-b border-black mb-2 uppercase">Side & Angle Data</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/20">
                      <th className="py-1">Side</th>
                      <th className="py-1">Distance (m)</th>
                      <th className="py-1">Direction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sides.map((s, i) => (
                      <tr key={i}>
                        <td className="py-1">{data.coordinates[i].label}-{data.coordinates[(i+1)%data.coordinates.length].label}</td>
                        <td className="py-1">{s.toFixed(2)}</td>
                        <td className="py-1">{data.angles[i]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="bg-black text-white p-4">
                <p className="text-[12px] font-black uppercase">Total Area:</p>
                <p className="text-2xl font-black">{data.areaHectares} Hectares</p>
              </section>
            </div>
          </div>

          <div className="mt-10 border-4 border-black p-10 aspect-video flex items-center justify-center bg-zinc-50 grayscale">
             <div className="text-center opacity-40">
                <div className="text-[40px] font-black mb-2 tracking-tighter">CAD VIEW</div>
                <p className="uppercase font-bold tracking-widest text-[8px]">Geometric Representation of Land Parcel</p>
             </div>
          </div>
        </div>

        <footer className="border-t-4 border-black p-6 bg-zinc-50 flex justify-between items-center">
          <p className="text-[8px] font-bold uppercase">This record is generated according to South African Land Surveying Standards.</p>
          <button className="flex items-center gap-2 px-6 py-2 bg-black text-white text-[10px] font-black uppercase">
            <Download size={14} /> Download Certified PDF
          </button>
        </footer>
      </div>
    </div>
  );
}
