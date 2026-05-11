import { useState } from 'react';

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
        className="glass-interactive relative group p-1.5 pr-3 flex items-center gap-2 focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all duration-300 shadow-premium rounded-2xl"
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
          placeholder="Describe your audience segment…"
          className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-sm text-neutral-100 placeholder:text-neutral-500 font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || state.isTyping}
          aria-label="Send message"
          className="w-12 h-12 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale"
        >
          <Send className="w-5 h-5" aria-hidden="true" />
        </button>
      </form>
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-border-glass">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_var(--color-success)]" />
          <p className="text-minimal-label">Gemini 1.5 Protocol Active</p>
        </div>
      </div>
    </div>
  );
};
