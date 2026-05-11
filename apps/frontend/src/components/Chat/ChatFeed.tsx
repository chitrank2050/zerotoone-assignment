import React from 'react';

import { Bot, Sparkles, User as UserIcon } from 'lucide-react';

import { useChatContext } from '../../context/ChatContextCore';

export const ChatFeed: React.FC = () => {
  const { state } = useChatContext();
  const { messages, isTyping, error } = state;

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6">
          <div className="w-20 h-20 bg-brand-primary/5 rounded-[2.5rem] flex items-center justify-center border border-brand-primary/10 shadow-inner ring-4 ring-brand-primary/5">
            <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tighter text-neutral-50">
              Ready to Build?
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-medium">
              Describe your target segment. The AI will extract signals and
              calculate reach in real-time.
            </p>
          </div>
        </div>
      )}

      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
        >
          <div
            className={`flex gap-4 max-w-2xl ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                m.role === 'user'
                  ? 'bg-neutral-800 border border-neutral-700'
                  : 'bg-brand-primary/10 border border-brand-primary/20'
              }`}
            >
              {m.role === 'user' ? (
                <UserIcon
                  className="w-5 h-5 text-neutral-400"
                  aria-hidden="true"
                />
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
                  ? 'bg-brand-primary text-white shadow-premium'
                  : 'glass border border-border-glass text-neutral-200'
              }`}
            >
              <p className="text-sm leading-relaxed font-medium">{m.content}</p>
            </div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start animate-fade-up">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand-primary" aria-hidden="true" />
            </div>
            <div className="glass px-6 py-4 flex items-center gap-1.5 rounded-2xl border border-border-glass">
              <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-2xl text-minimal-label text-center animate-shake">
          {error}
        </div>
      )}
    </div>
  );
};
