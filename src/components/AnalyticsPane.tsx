'use client';

import { Scheme } from '@/types';
import { TrendingUp, Users, Car, Square, DollarSign, Percent, LucideIcon, Maximize, Map as MapIcon } from 'lucide-react';

interface AnalyticsPaneProps {
  scheme: Scheme;
}

interface MetricProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
}

const Metric = ({ icon: Icon, label, value, unit, color }: MetricProps) => (
  <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl space-y-1">
    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
      <Icon size={14} className={color} />
      <span>{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-bold text-slate-100">{value}</span>
      {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
    </div>
  </div>
);

export default function AnalyticsPane({ scheme }: AnalyticsPaneProps) {
  const { proForma } = scheme;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-6">
      <div className="flex items-center gap-2 text-slate-400 font-medium text-sm uppercase tracking-wider">
        <TrendingUp size={16} />
        <span>Real-time Analytics</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Metric
          icon={Square}
          label="Total NRSF"
          value={proForma.totalNRSF.toLocaleString()}
          unit="sq ft"
          color="text-blue-400"
        />
        <Metric
          icon={Users}
          label="Est. Units"
          value={proForma.unitCount}
          unit="units"
          color="text-emerald-400"
        />
        <Metric
          icon={Car}
          label="Parking Stalls"
          value={proForma.parkingStalls}
          unit="stalls"
          color="text-orange-400"
        />
        <Metric
          icon={DollarSign}
          label="Hard Cost"
          value={`$${(proForma.estimatedCost / 1000000).toFixed(1)}`}
          unit="M"
          color="text-rose-400"
        />
        <Metric
          icon={Percent}
          label="Yield on Cost"
          value={proForma.yieldOnCost}
          unit="%"
          color="text-purple-400"
        />
        <Metric
          icon={Maximize}
          label="FAR"
          value={proForma.far}
          color="text-blue-300"
        />
        <Metric
          icon={MapIcon}
          label="Coverage"
          value={proForma.coverage}
          unit="%"
          color="text-slate-300"
        />
      </div>
    </div>
  );
}
