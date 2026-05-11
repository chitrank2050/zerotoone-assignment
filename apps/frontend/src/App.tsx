import React, { useState } from 'react';

import {
  BarChart3,
  Bot,
  MessageSquare,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  User as UserIcon,
} from 'lucide-react';

import SignalCard from './components/SignalCard';
import { useChat } from './hooks/useChat';

/**
 * AI Audience Builder - Principal Grade Dashboard
 *
 * A high-density UI featuring:
 * - Real-time AI Chat Interface
 * - Signal Visualization Panel
 * - Observability Status Bar
 */
const App: React.FC = () => {
  const [input, setInput] = useState('');
  const { messages, signals, isTyping, error, sendMessage, removeSignal } =
    useChat();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const content = input;
    setInput('');
    await sendMessage(content);
  };

  const totalReach = signals.reduce((acc, s) => acc + (s.reach || 0), 0);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* --- 🛠️ Sidebar (Navigation) --- */}
      <aside className="w-20 lg:w-64 border-r border-border-glass bg-surface-glass backdrop-blur-xl flex flex-col p-4 z-20">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Target className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl hidden lg:block tracking-tight">
            AudienceAI
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<MessageSquare />} label="Active Build" active />
          <NavItem icon={<BarChart3 />} label="Analytics" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>

        <div className="mt-auto pt-6 border-t border-border-glass">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-brand-primary to-brand-secondary p-px">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-brand-primary" />
              </div>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold truncate">Planner #01</p>
              <p className="text-xs opacity-50 truncate uppercase tracking-tighter">
                Principal Grade
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- 🧠 Main Content (Chat Engine) --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {/* Header */}
        <header className="h-16 border-b border-border-glass flex items-center justify-between px-8 bg-surface-glass backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold tracking-tight">
              Campaign Intelligence
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold tracking-widest uppercase border border-brand-primary/20">
              Extraction: Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span>Observability: ON</span>
            </div>
          </div>
        </header>

        {/* Chat Feed */}
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
                Describe your target segment (e.g., "Tech-savvy gamers in
                Seattle who love organic coffee”). The AI will extract signals
                and calculate reach in real-time.
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
                  <p className="text-sm leading-relaxed font-medium">
                    {m.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-brand-primary" />
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

        {/* Input Dock */}
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
              disabled={!input.trim() || isTyping}
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
      </main>

      {/* --- 📊 Signal Explorer (Right Panel) --- */}
      <aside className="w-80 border-l border-border-glass bg-surface-glass/30 backdrop-blur-xl hidden xl:flex flex-col z-20">
        <div className="p-6 border-b border-border-glass">
          <h3 className="font-bold flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            Intelligence Layer
          </h3>
          <p className="text-[10px] uppercase font-black tracking-widest opacity-30 mt-1">
            Extracted Targeting
          </p>
        </div>

        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {signals.length === 0 ? (
            <div className="glass p-6 border-dashed opacity-40 text-center py-12 rounded-3xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 opacity-50" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">
                Awaiting Signals
              </p>
            </div>
          ) : (
            signals.map((s) => (
              <SignalCard key={s.id} signal={s} onRemove={removeSignal} />
            ))
          )}
        </div>

        <div className="p-6 bg-brand-primary/5 border-t border-border-glass backdrop-blur-2xl">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">
                Total Estimates
              </p>
              <h4 className="text-4xl font-black tabular-nums tracking-tighter">
                {new Intl.NumberFormat().format(totalReach)}
              </h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">
                Sync
              </p>
              <p className="text-xs font-bold text-brand-primary">LATEST</p>
            </div>
          </div>
          <button className="w-full py-4 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/30 hover:brightness-110 hover:translate-y-[-2px] transition-[transform,filter] active:scale-95 disabled:grayscale disabled:opacity-50">
            Commit Segment
          </button>
        </div>
      </aside>
    </div>
  );
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}> = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all cursor-pointer group ${
      active
        ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
        : 'hover:bg-white/5 opacity-50 hover:opacity-100 border border-transparent hover:border-white/5'
    }`}
  >
    <span className="w-5 h-5" aria-hidden="true">
      {icon}
    </span>
    <span className="text-xs font-bold uppercase tracking-widest hidden lg:block">
      {label}
    </span>
  </div>
);

export default App;
