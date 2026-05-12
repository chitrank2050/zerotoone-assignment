import React from 'react';

import { ShieldCheck } from 'lucide-react';

export const ChatHeader: React.FC = () => (
  <header className="h-16 border-b border-border-subtle flex items-center justify-between px-8 z-10">
    <div className="flex items-center gap-4">
      <h2 className="text-sm font-bold tracking-tight text-neutral-100 uppercase">
        Intelligence
      </h2>
      <div className="h-4 w-px bg-border-subtle" />
      <span className="text-meta">Status: Active</span>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 text-meta">
        <ShieldCheck className="w-3 h-3 text-neutral-400" />
        <span>Observability Enabled</span>
      </div>
    </div>
  </header>
);
