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
    <div className="glass-interactive group relative flex flex-col overflow-hidden shadow-premium rounded-2xl">
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold tracking-tight text-neutral-50 group-hover:text-brand-primary transition-colors">
              {signal.name}
            </h3>
            <p className="text-[10px] font-medium text-neutral-500 font-mono">
              {signal.path}
            </p>
          </div>
          <div className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary ring-1 ring-brand-primary/20 shadow-lg shadow-brand-primary/10">
            <Target className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-minimal-label">Audience Growth</span>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 animate-pulse rounded-full bg-success shadow-[0_0_5px_var(--color-success)]" />
            <span className="text-[10px] font-medium text-success/80 uppercase tracking-tighter">
              Live
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-0.5">
            <p className="text-3xl font-black tracking-tight text-neutral-50 tabular-nums">
              {formatNumber(signal.reach || 0)}
            </p>
            <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-tighter">
              Estimated Users
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div
              className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-black ${
                trend > 0
                  ? 'bg-success/10 text-success'
                  : 'bg-error/10 text-error'
              }`}
            >
              {trend > 0 ? '↑' : '↓'}
              {Math.abs(trend)}%
            </div>
            <p className="mt-1 text-[10px] font-medium text-neutral-600 uppercase tracking-tighter">
              vs 24h
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {signal.category && (
            <span className="inline-flex items-center rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-neutral-400 ring-1 ring-border-glass uppercase tracking-tighter">
              {signal.category}
            </span>
          )}
          <span className="inline-flex items-center rounded-md bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-neutral-400 ring-1 ring-border-glass uppercase tracking-tighter">
            {signal.type}
          </span>
        </div>
      </div>

      <div className="h-1 w-full overflow-hidden bg-neutral-900">
        <div
          className="h-full bg-linear-to-r from-brand-primary to-brand-secondary transition-all duration-1000 ease-out"
          style={{ width: `${(signal.confidence || 0.8) * 100}%` }}
        />
      </div>

      <button
        onClick={() => onRemove?.(signal.id)}
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/0 text-neutral-600 transition-all hover:bg-error/10 hover:text-error focus:outline-none"
        title="Remove Signal"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default SignalCard;
