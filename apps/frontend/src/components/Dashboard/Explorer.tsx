import React from 'react';

import { Sparkles, Target } from 'lucide-react';

import { useChatContext } from '../../context/ChatContextCore';
import SignalCard from '../SignalCard';

export const Explorer: React.FC = () => {
  const { state, actions } = useChatContext();
  const { signals } = state;
  const totalReach = signals.reduce((acc, s) => acc + (s.reach || 0), 0);

  return (
    <aside className="w-80 border-l border-border-glass bg-surface-glass/30 backdrop-blur-xl hidden xl:flex flex-col z-20">
      <div className="p-6 border-b border-border-glass">
        <h3 className="font-bold flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-brand-primary" aria-hidden="true" />
          Intelligence Layer
        </h3>
        <p className="text-[10px] uppercase font-black tracking-widest opacity-30 mt-1">
          Extracted Targeting
        </p>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {signals.length === 0 ? (
          <div className="glass p-6 border-dashed opacity-40 text-center py-12 rounded-3xl flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Target className="w-6 h-6 opacity-50" aria-hidden="true" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">
              Awaiting Signals
            </p>
          </div>
        ) : (
          signals.map((s) => (
            <SignalCard key={s.id} signal={s} onRemove={actions.removeSignal} />
          ))
        )}
      </div>

      <div className="p-6 bg-brand-primary/5 border-t border-border-glass backdrop-blur-2xl">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">
              Total Estimates
            </p>
            <h4 className="text-4xl font-black tabular-nums tracking-tighter">
              {new Intl.NumberFormat().format(totalReach)}
            </h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">
              Sync
            </p>
            <p className="text-xs font-bold text-brand-primary">LATEST</p>
          </div>
        </div>
        <button className="w-full py-4 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/30 hover:brightness-110 hover:translate-y-[-2px] transition-[transform,filter] active:scale-95 disabled:grayscale disabled:opacity-50">
          Commit Segment
        </button>
      </div>
    </aside>
  );
};
