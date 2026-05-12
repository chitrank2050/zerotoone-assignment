import React from 'react';

import { useChatContext } from '../../context/ChatContextCore';

export const ChatFeed: React.FC = () => {
  const { state } = useChatContext();
  const { messages, isTyping, error } = state;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-48 space-y-12 animate-fade-in">
      {messages.length === 0 && !error && !isTyping && (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
          <div className="w-16 h-16 border border-white/10 flex items-center justify-center rounded-3xl bg-neutral-900/50 backdrop-blur-sm shadow-2xl">
            <span className="font-mono text-lg font-bold tracking-tighter text-neutral-100">
              AI
            </span>
          </div>
          <p className="text-sm text-neutral-400 font-medium tracking-tight leading-relaxed">
            How can I help you build an audience today?
          </p>
        </div>
      )}

      {messages
        .filter((m) => m.content.length > 0)
        .map((m) => (
          <div
            key={m.id}
            className={`flex flex-col space-y-3 max-w-3xl animate-fade-in ${
              m.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            } last-of-type:pb-40`}
          >
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">
                {m.role === 'user' ? 'You' : 'Gemini'}
              </span>
            </div>
            <div
              className={`text-sm leading-relaxed whitespace-pre-wrap font-medium p-5 rounded-[1.25rem] shadow-sm border border-white/20 ${
                m.role === 'user'
                  ? 'bg-neutral-800 text-neutral-100 rounded-tr-none'
                  : 'bg-neutral-900/50 text-neutral-200 rounded-tl-none backdrop-blur-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

      {isTyping &&
        !messages.some((m) => m.role === 'agent' && m.content.length > 0) && (
          <div className="flex flex-col space-y-3 mr-auto items-start animate-fade-in">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">
                Groq
              </span>
            </div>
            <div className="bg-neutral-900/30 border border-white/20 p-6 rounded-[1.25rem] rounded-tl-none backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

      {error && (
        <div className="flex flex-col space-y-3 mx-auto items-center max-w-md animate-fade-in">
          <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl text-center backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 block mb-2">
              System Error
            </span>
            <p className="text-xs text-red-300/80 font-medium italic leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
