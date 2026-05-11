import React from 'react';

import { useChatContext } from '../../context/ChatContextCore';
import SignalCard from '../SignalCard';

export const Explorer: React.FC = () => {
  const { state, actions } = useChatContext();
  const { signals } = state;
  const totalReach = signals.reduce((acc, s) => acc + (s.reach || 0), 0);

  return (
    <aside className="w-80 border-l border-border-subtle bg-neutral-950 hidden xl:flex flex-col z-20 animate-fade-in text-neutral-100">
      <div className="p-8 border-b border-border-subtle">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
          Targeting Signals
        </h3>
      </div>

      <div className="flex-1 p-8 space-y-8 overflow-y-auto">
        {signals.length === 0 ? (
          <div className="py-12 text-center opacity-30">
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Null Set
            </p>
          </div>
        ) : (
          signals.map((s) => (
            <SignalCard key={s.id} signal={s} onRemove={actions.removeSignal} />
          ))
        )}
      </div>

      <div className="p-8 border-t border-border-subtle">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <p className="text-meta mb-1">Total Reach</p>
            <h4 className="text-4xl font-bold tabular-nums tracking-tighter text-neutral-50">
              {new Intl.NumberFormat().format(totalReach)}
            </h4>
          </div>
        </div>
        <button className="w-full py-3 border border-neutral-100 text-neutral-100 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-100 hover:text-neutral-950 transition-colors active:scale-[0.98] disabled:opacity-10">
          Commit Parameters
        </button>
      </div>
    </aside>
  );
};
