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
    <div className="border-t border-border-subtle bg-neutral-950 p-6 animate-fade-in">
      <form
        onSubmit={handleSend}
        className="flex items-center gap-4 max-w-4xl mx-auto"
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
          placeholder="Command system..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-100 placeholder:text-neutral-600 font-mono"
        />
        <button
          type="submit"
          disabled={!input.trim() || state.isTyping}
          aria-label="Send message"
          className="text-neutral-500 hover:text-neutral-100 transition-colors disabled:opacity-20"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
      <div className="flex justify-center mt-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-neutral-600 rounded-full" />
          <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] font-medium">
            Protocol 1.5
          </p>
        </div>
      </div>
    </div>
  );
};
