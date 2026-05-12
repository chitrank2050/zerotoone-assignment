import React from 'react';

export const ChatHeader: React.FC = () => (
  <header className="h-16 border-b border-white/20 flex items-center justify-between px-8 z-10 bg-neutral-950">
    <div className="flex items-center gap-4">
      <h2 className="text-[11px] font-bold tracking-widest text-neutral-100 uppercase">
        Groq
      </h2>
      <div className="h-3 w-px bg-white/20" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
        AI Orchestration
      </span>
    </div>
  </header>
);
