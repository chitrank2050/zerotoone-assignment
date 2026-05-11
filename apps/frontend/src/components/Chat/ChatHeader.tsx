import React from 'react';

import { ShieldCheck } from 'lucide-react';

export const ChatHeader: React.FC = () => (
  <header className="h-16 border-b border-border-glass flex items-center justify-between px-8 bg-surface-glass backdrop-blur-sm z-10">
    <div className="flex items-center gap-2">
      <h2 className="font-semibold tracking-tight">Campaign Intelligence</h2>
      <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold tracking-widest uppercase border border-brand-primary/20">
        Extraction: Active
      </span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
        <span>Observability: ON</span>
      </div>
    </div>
  </header>
);
