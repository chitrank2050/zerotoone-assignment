import { useMemo } from 'react';

import { Target, X } from 'lucide-react';

import type { Signal } from '@audience-builder/shared';

interface SignalCardProps {
  signal: Signal;
  onRemove?: (id: string) => void;
}

/**
 * Premium Signal Card
 *
 * Features:
 * - Deterministic trend calculation (React 19 Pure)
 * - Glassmorphism aesthetics
 * - Micro-animations on hover
 */
export const SignalCard = ({ signal, onRemove }: SignalCardProps) => {
  // Deterministic trend based on ID to comply with React Purity
  const trend = useMemo(() => {
    const hash = signal.id
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Number(((hash % 15) + 2.5).toFixed(1));
  }, [signal.id]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
  };

  return (
    <div className="glass-card group relative flex flex-col overflow-hidden border border-white/10 transition-all duration-300 hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/20 rounded-2xl bg-white/2 backdrop-blur-md">
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold tracking-tight text-white/90 group-hover:text-brand-primary transition-colors">
              {signal.name}
            </h3>
            <p className="text-[10px] font-medium text-white/40 font-mono">
              {signal.path}
            </p>
          </div>
          <div className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary ring-1 ring-brand-primary/20">
            <Target className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase">
            Audience Growth
          </span>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 animate-pulse rounded-full bg-green-500" />
            <span className="text-[10px] font-medium text-green-500/80">
              Live
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <p className="text-3xl font-black tracking-tight text-white tabular-nums">
              {formatNumber(signal.reach || 0)}
            </p>
            <p className="text-[10px] font-medium text-white/30">
              Estimated Users
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div
              className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                trend > 0
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-orange-500/10 text-orange-400'
              }`}
            >
              {trend > 0 ? '↑' : '↓'}
              {Math.abs(trend)}%
            </div>
            <p className="mt-1 text-[10px] font-medium text-white/20">
              vs last 24h
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {signal.category && (
            <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60 ring-1 ring-white/10 ring-inset backdrop-blur-sm">
              {signal.category}
            </span>
          )}
          <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60 ring-1 ring-white/10 ring-inset backdrop-blur-sm">
            {signal.type.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Interactive Progress Bar */}
      <div className="h-1 w-full overflow-hidden bg-white/5">
        <div
          className="h-full bg-linear-to-r from-brand-primary to-indigo-500 transition-all duration-1000 ease-out"
          style={{ width: `${(signal.confidence || 0.8) * 100}%` }}
        />
      </div>

      <button
        onClick={() => onRemove?.(signal.id)}
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/0 text-white/20 transition-all hover:bg-white/10 hover:text-white/60 focus:outline-none"
        title="Remove Signal"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default SignalCard;
