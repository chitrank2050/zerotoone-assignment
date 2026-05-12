import React from 'react';

import { useChatContext } from '../../context/ChatContextCore';

export const ChatFeed: React.FC = () => {
  const { state } = useChatContext();
  const { messages, isTyping, error } = state;

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-12 animate-fade-in">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-100">
            Null State
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed font-medium tracking-wide">
            Describe segment parameters. System will extract targeting signals.
          </p>
        </div>
      )}

      {messages.map((m) => (
        <div key={m.id} className="group flex flex-col space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-meta">
              {m.role === 'user' ? 'Operator' : 'System'}
            </span>
            <div className="h-px flex-1 bg-border-subtle opacity-50" />
          </div>
          <div className="pl-4 border-l border-border-subtle">
            <p className="text-sm leading-relaxed text-neutral-300 font-medium">
              {m.content}
            </p>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex items-center gap-3 animate-pulse">
          <span className="text-meta">System</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-neutral-400 rounded-full" />
            <div className="w-1 h-1 bg-neutral-400 rounded-full" />
            <div className="w-1 h-1 bg-neutral-400 rounded-full" />
          </div>
        </div>
      )}

      {error && (
        <div className="text-meta text-neutral-200 bg-neutral-900/50 p-4 border-minimal border-neutral-800/50">
          Error: {error}
        </div>
      )}
    </div>
  );
};
