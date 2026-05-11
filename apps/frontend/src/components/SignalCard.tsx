import React from 'react';

import { Target, TrendingUp, Users, X } from 'lucide-react';

import type { Signal } from '@audience-builder/shared';

interface SignalCardProps {
  signal: Signal;
  onRemove?: (id: string) => void;
}

/**
 * SignalCard - UX Grade
 *
 * Displays an extracted targeting signal with its reach metadata.
 * Uses the glassmorphic design system for a premium feel.
 */
export const SignalCard: React.FC<SignalCardProps> = ({ signal, onRemove }) => {
  // Generate a stable trend based on the signal ID to satisfy React's purity rules
  const trend = React.useMemo(() => {
    // Deterministic value based on ID length or character codes
    const seed = signal.id
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ((seed % 50) / 10).toFixed(1);
  }, [signal.id]);

  return (
    <div className="glass-card flex flex-col gap-3 group relative overflow-hidden animate-fade-in">
      {/* Remove Button (Hover only) */}
      {onRemove && (
        <button
          onClick={() => onRemove(signal.id)}
          className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
            <Target className="w-4 h-4 text-brand-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">{signal.name}</h4>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-0.5">
              {signal.category || 'Targeting Signal'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 opacity-40">
            <Users className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Reach
            </span>
          </div>
          <p className="text-lg font-black tabular-nums leading-none">
            {new Intl.NumberFormat().format(signal.reach || 0)}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 opacity-40">
            <TrendingUp className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Growth
            </span>
          </div>
          <p className="text-lg font-black tabular-nums leading-none text-green-500">
            +{trend}%
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-30">
          <span>AI Confidence</span>
          <span>94%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary shadow-[0_0_8px_rgba(var(--color-brand-primary-rgb),0.5)]"
            style={{ width: '94%' }}
          />
        </div>
      </div>
    </div>
  );
};
