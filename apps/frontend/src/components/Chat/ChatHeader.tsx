import React from 'react';

import { ShieldCheck } from 'lucide-react';

export const ChatHeader: React.FC = () => (
  <header className="h-16 border-b border-border-glass flex items-center justify-between px-8 glass backdrop-blur-sm z-10">
    <div className="flex items-center gap-2">
      <h2 className="font-semibold tracking-tight text-neutral-100">
        Campaign Intelligence
      </h2>
      <span className="badge-status bg-brand-primary/10 text-brand-primary border-brand-primary/20">
        Extraction: Active
      </span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-minimal-label bg-neutral-900 px-3 py-1.5 rounded-full border border-border-glass">
        <ShieldCheck className="w-3.5 h-3.5 text-success" />
        <span>Observability: ON</span>
      </div>
    </div>
  </header>
);
