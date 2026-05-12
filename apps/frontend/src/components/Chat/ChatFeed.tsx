import React from 'react';

import { useChatContext } from '../../context/ChatContextCore';

export const ChatFeed: React.FC = () => {
  const { state } = useChatContext();
  const { messages, isTyping, error } = state;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 animate-fade-in">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
          <div className="w-12 h-12 border border-neutral-800 flex items-center justify-center rounded-full opacity-50">
            <span className="font-mono text-xs">AI</span>
          </div>
          <p className="text-sm text-neutral-500 font-medium tracking-tight">
            How can I help you build an audience today?
          </p>
        </div>
      )}

      {messages.map((m) => (
        <div key={m.id} className="flex flex-col space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {m.role === 'user' ? 'Operator' : 'Grok-1.5'}
            </span>
          </div>
          <div className="text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap font-medium">
            {m.content}
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex flex-col space-y-2 animate-pulse">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">
            Thinking...
          </span>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full" />
            <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full" />
            <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full" />
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col space-y-2 p-4 rounded-md bg-neutral-900/30 border border-neutral-900 animate-fade-in">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            System Error
          </span>
          <p className="text-sm text-neutral-400 font-medium italic">{error}</p>
        </div>
      )}
    </div>
  );
};
