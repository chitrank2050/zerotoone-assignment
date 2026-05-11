import { useMemo } from 'react';

import { X } from 'lucide-react';

import type { Signal } from '@audience-builder/shared';

interface SignalCardProps {
  signal: Signal;
  onRemove?: (id: string) => void;
}

/**
 * Super Minimal Signal Card
 */
export const SignalCard = ({ signal, onRemove }: SignalCardProps) => {
  // Deterministic trend based on ID
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
    <div className="group relative border-b border-border-subtle pb-6 last:border-0 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold tracking-tight text-neutral-100 uppercase">
            {signal.name}
          </h3>
          <p className="text-[10px] text-neutral-600 font-mono tracking-tighter">
            {signal.path}
          </p>
        </div>
        <button
          onClick={() => onRemove?.(signal.id)}
          className="text-neutral-700 hover:text-neutral-100 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tighter text-neutral-50 tabular-nums">
            {formatNumber(signal.reach || 0)}
          </p>
          <p className="text-meta">Reach Estimate</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-neutral-100 tabular-nums">
            {trend > 0 ? '+' : '-'}
            {Math.abs(trend)}%
          </p>
          <p className="text-[8px] text-neutral-600 uppercase tracking-widest mt-0.5">
            Variance
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
          {signal.category}
        </span>
        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
          {signal.type}
        </span>
      </div>

      {/* Subtle indicator bar */}
      <div
        className="absolute -bottom-px left-0 h-[1px] bg-neutral-100 transition-all duration-700 opacity-0 group-hover:opacity-30"
        style={{ width: `${(signal.confidence || 0.8) * 100}%` }}
      />
    </div>
  );
};

export default SignalCard;
