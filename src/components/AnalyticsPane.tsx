'use client';

import { Scheme } from '@/types';
import { TrendingUp, Users, Car, Square, DollarSign, Percent, LucideIcon } from 'lucide-react';

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
    <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-6 h-full overflow-y-auto">
      <div className="flex items-center gap-2 text-slate-400 font-medium text-sm uppercase tracking-wider">
        <TrendingUp size={16} />
        <span>Real-time Analytics</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
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

        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
          <h4 className="text-blue-400 text-sm font-bold mb-1">Deal Verdict</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Based on the current parameters, this {scheme.typology} development is yielding {proForma.yieldOnCost}% on cost.
            {proForma.yieldOnCost > 6 ? ' This deal pencils well.' : ' Consider increasing density or reducing setbacks.'}
          </p>
        </div>
      </div>
    </div>
  );
}
