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
    <div className="p-8 pt-0">
      <form
        onSubmit={handleSend}
        className="glass relative group p-1.5 pr-3 flex items-center gap-2 focus-within:border-brand-primary/50 transition-[border-color,box-shadow,transform] duration-200 shadow-2xl rounded-2xl"
      >
        <label htmlFor="chat-input" className="sr-only">
          Audience description
        </label>
        <input
          id="chat-input"
          name="audience-request"
          autoComplete="off"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter natural language audience request…"
          className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-sm placeholder:opacity-40 font-medium focus:ring-2 focus:ring-brand-primary/20 rounded-xl"
        />
        <button
          type="submit"
          disabled={!input.trim() || state.isTyping}
          aria-label="Send message"
          className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/30 transition-[transform,filter] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
        >
          <Send className="w-5 h-5 text-white" aria-hidden="true" />
        </button>
      </form>
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <p className="text-[9px] opacity-40 tracking-[0.2em] uppercase font-black">
            Gemini 1.5 Protocol Active
          </p>
        </div>
      </div>
    </div>
  );
};
