import React from 'react';

export const ChatHeader: React.FC = () => (
  <header className="h-16 border-b border-neutral-900 flex items-center justify-between px-8 z-10 bg-neutral-950/50 backdrop-blur-md">
    <div className="flex items-center gap-4">
      <h2 className="text-sm font-bold tracking-tight text-neutral-100 uppercase">
        Grok-1.5
      </h2>
      <div className="h-4 w-px bg-neutral-800" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">
        AI Orchestration
      </span>
    </div>
  </header>
);
