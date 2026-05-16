'use client';

import { Suggestion } from '@/types';
import { AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuggestionsProps {
  suggestions: Suggestion[];
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
        <Sparkles size={14} />
        <span>AI Copilot Insights</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {suggestions.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl border flex gap-3 ${
                s.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                  : s.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-200'
              }`}
            >
              <div className="mt-0.5">
                {s.type === 'warning' && <AlertTriangle size={18} className="text-amber-500" />}
                {s.type === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
                {s.type === 'info' && <Info size={18} className="text-blue-500" />}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-tight">{s.message}</p>
                {s.action && (
                  <p className="text-xs opacity-60 font-semibold uppercase tracking-wider">
                    Next Step: {s.action}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
          {suggestions.length === 0 && (
            <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center">
              <p className="text-slate-500 text-sm italic">Optimizing for current constraints...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
