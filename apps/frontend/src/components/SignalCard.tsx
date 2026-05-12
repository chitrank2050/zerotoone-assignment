import { MapPin, ShoppingCart, TrendingUp, Users, X } from 'lucide-react';

import type { Signal } from '@audience-builder/shared';

interface SignalCardProps {
  signal: Signal;
  onRemove?: (id: string) => void;
}

const TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  location: { icon: MapPin, color: 'text-blue-400', label: 'Location' },
  transaction: {
    icon: ShoppingCart,
    color: 'text-emerald-400',
    label: 'Purchase',
  },
  demographic: { icon: Users, color: 'text-violet-400', label: 'Demographic' },
  interest: { icon: TrendingUp, color: 'text-amber-400', label: 'Interest' },
  cg: { icon: Users, color: 'text-violet-400', label: 'Consumer Graph' },
};

export const SignalCard = ({ signal, onRemove }: SignalCardProps) => {
  const displayName = signal.label || signal.name || 'Unknown Signal';
  const cfg = TYPE_CONFIG[signal.type] || TYPE_CONFIG.interest;
  const Icon = cfg.icon;

  const formatReach = (n: number) =>
    new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(n);

  return (
    <div className="group relative p-4 rounded-xl border border-white/10 bg-neutral-900/40 hover:border-white/20 transition-all animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`mt-0.5 shrink-0 ${cfg.color}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[11px] font-bold tracking-tight text-neutral-100 truncate">
              {displayName}
            </h3>
            {signal.path && (
              <p className="text-[9px] text-neutral-600 mt-0.5 truncate font-mono">
                {signal.path}
              </p>
            )}
            <span
              className={`inline-block text-[8px] font-bold uppercase tracking-widest mt-1.5 ${cfg.color} opacity-70`}
            >
              {cfg.label}
            </span>
          </div>
        </div>
        <button
          onClick={() => onRemove?.(signal.id)}
          className="shrink-0 text-neutral-700 hover:text-neutral-300 transition-colors p-0.5"
          aria-label="Remove signal"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {signal.reach && signal.reach > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline justify-between">
          <span className="text-[9px] text-neutral-600 uppercase tracking-widest">
            Reach
          </span>
          <span className="text-sm font-bold text-neutral-200 tabular-nums">
            {formatReach(signal.reach)}
          </span>
        </div>
      )}

      {/* Hover accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl" />
    </div>
  );
};

export default SignalCard;
