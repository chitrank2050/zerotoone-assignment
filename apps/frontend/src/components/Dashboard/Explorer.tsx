import React, { useState } from 'react';

import { useChatContext } from '../../context/ChatContextCore';
import { SignalCard } from '../SignalCard';

export const Explorer: React.FC = () => {
  const { state, actions } = useChatContext();
  const { signals, totalReach } = state;
  const [isCommitted, setIsCommitted] = useState(false);

  return (
    <aside className="w-80 border-l border-white/20 bg-neutral-950 hidden xl:flex flex-col z-20 animate-fade-in text-neutral-100">
      <div className="p-8 border-b border-white/20">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Targeting Signals
        </h3>
        {signals.length > 0 && (
          <p className="text-[9px] text-neutral-500 mt-1 uppercase tracking-widest">
            {signals.length} active signal{signals.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
            <div className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]">
              Describe your audience
            </p>
            <p className="text-[9px] mt-1 tracking-wide">
              Signals will appear here
            </p>
          </div>
        ) : (
          signals.map((s) => (
            <SignalCard key={s.id} signal={s} onRemove={actions.removeSignal} />
          ))
        )}
      </div>

      <div className="p-8 border-t border-white/20">
        <div className="mb-6">
          <p className="text-meta mb-2">Estimated Reach</p>
          <h4
            className={`text-4xl font-bold tabular-nums tracking-tighter ${totalReach > 0 ? 'text-neutral-50' : 'text-neutral-700'}`}
          >
            {totalReach > 0
              ? new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(totalReach)
              : '—'}
          </h4>
          {totalReach > 0 && (
            <p className="text-[9px] text-neutral-500 mt-1 uppercase tracking-widest">
              unique users · estimated
            </p>
          )}
        </div>
        <button
          disabled={signals.length === 0 || isCommitted}
          onClick={() => {
            setIsCommitted(true);
            setTimeout(() => setIsCommitted(false), 3000);
          }}
          className={`w-full py-3 border text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed ${
            isCommitted
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'border-neutral-100 text-neutral-100 hover:bg-neutral-100 hover:text-neutral-950'
          }`}
        >
          {isCommitted ? 'Parameters Committed ✓' : 'Commit Parameters'}
        </button>
      </div>
    </aside>
  );
};
