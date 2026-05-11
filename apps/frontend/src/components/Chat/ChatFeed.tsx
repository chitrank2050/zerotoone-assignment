import React from 'react';

import { Bot, Sparkles, User as UserIcon } from 'lucide-react';

import { useChatContext } from '../../context/ChatContextCore';

export const ChatFeed: React.FC = () => {
  const { state } = useChatContext();
  const { messages, isTyping, error } = state;

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-4">
          <div className="w-20 h-20 bg-brand-primary/5 rounded-3xl flex items-center justify-center mb-4 border border-brand-primary/10 shadow-inner">
            <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />
          </div>
          <h3 className="text-3xl font-black tracking-tighter">
            Ready to Build?
          </h3>
          <p className="text-sm opacity-50 leading-relaxed font-medium">
            Describe your target segment (e.g., “Tech-savvy gamers in Seattle
            who love organic coffee”). The AI will extract signals and calculate
            reach in real-time.
          </p>
        </div>
      )}

      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
          <div
            className={`flex gap-4 max-w-2xl ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                m.role === 'user'
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-brand-primary/10 border border-brand-primary/20'
              }`}
            >
              {m.role === 'user' ? (
                <UserIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Bot
                  className="w-5 h-5 text-brand-primary"
                  aria-hidden="true"
                />
              )}
            </div>
            <div
              className={`p-4 rounded-2xl ${
                m.role === 'user'
                  ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                  : 'glass border border-white/10'
              }`}
            >
              <p className="text-sm leading-relaxed font-medium">{m.content}</p>
            </div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start animate-fade-in">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand-primary" aria-hidden="true" />
            </div>
            <div className="glass px-6 py-4 flex items-center gap-1.5 rounded-2xl border border-white/5">
              <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center animate-shake">
          {error}
        </div>
      )}
    </div>
  );
};
