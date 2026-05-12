import React, { useState } from 'react';

import { Send } from 'lucide-react';

import { useChatContext } from '../../context/ChatContextCore';

export const ChatInput: React.FC = () => {
  const { state, actions } = useChatContext();
  const [input, setInput] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isTyping) return;

    const content = input;
    setInput('');
    await actions.sendMessage(content);
  };

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[650px] px-4 z-30">
      <form
        onSubmit={handleSend}
        className="flex flex-col gap-2 bg-neutral-900/60 border border-white/20 rounded-4xl p-6 focus-within:border-white/30 transition-all shadow-2xl backdrop-blur-3xl"
      >
        <div className="flex items-center gap-4">
          <input
            id="chat-input"
            name="audience-request"
            autoComplete="off"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your ideal audience segment..."
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-neutral-100 placeholder:text-neutral-500 font-medium py-1.5"
          />
          <button
            type="submit"
            disabled={!input.trim() || state.isTyping}
            aria-label="Send message"
            className="p-3.5 bg-neutral-100 text-neutral-950 rounded-2xl hover:bg-white transition-all disabled:opacity-30 disabled:bg-neutral-800 disabled:text-neutral-500 active:scale-95 shadow-lg group"
          >
            <Send
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="flex items-center gap-3 px-1 mt-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            <kbd className="px-2 py-1 border border-white/20 rounded-lg bg-neutral-800 text-neutral-200 shadow-lg">
              Enter
            </kbd>
            <span className="opacity-80">to build segment</span>
          </div>
        </div>
      </form>
    </div>
  );
};
