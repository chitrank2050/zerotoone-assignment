/**
 * AudienceBuilder Dashboard - Main Interface (Tailwind Refactor)
 *
 * High-performance React 19 application orchestrating real-time AI audience builds.
 * Now powered by TailwindCSS v4 for utility-first styling.
 *
 * Architecture:
 *   - Layout: Flex/Grid hybrid for a modern sidebar-main-control shell.
 *   - UI: Glassmorphism surfaces (bg-white/80 + blur) and Indigo accents.
 *   - Components: Functional Tailwind classes for Sidebar, Chat, and Panels.
 */
import { useEffect, useRef, useState } from 'react';

import {
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  Send,
  Settings,
  Users,
} from 'lucide-react';

import type { Conversation, Message } from '@audience-builder/shared';

import './index.css';

// Tailwind v4 entry point

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000';

function App() {
  // --- Global State ---
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Lifecycle: Bootstraps the application build history.
   */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/conversations`);
        const json = await res.json();
        if (json.success) setConversations(json.data);
      } catch (error) {
        console.error('[Hydration Error] Failed to load builds:', error);
      }
    };
    fetchConversations();
  }, []);

  /**
   * Lifecycle: Synchronizes message threads on session selection.
   */
  useEffect(() => {
    if (activeConvId) {
      const fetchMessages = async (id: string) => {
        try {
          const res = await fetch(
            `${API_BASE}/chat/conversations/${id}/messages`,
          );
          const json = await res.json();
          if (json.success) setMessages(json.data);
        } catch (error) {
          console.error('[Hydration Error] Failed to load messages:', error);
        }
      };
      fetchMessages(activeConvId);
    }
  }, [activeConvId]);

  /**
   * Action: Spawns a new audience build session.
   */
  const createConversation = async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Build' }),
      });
      const json = await res.json();
      if (json.success) {
        setConversations((prev) => [json.data, ...prev]);
        setActiveConvId(json.data.id);
      }
    } catch (error) {
      console.error('[Creation Error] Failed to initialize build:', error);
    }
  };

  /**
   * Action: AI Integration - Natural language audience mapping.
   */
  const handleSend = async () => {
    if (!input.trim() || !activeConvId) return;

    const userMsg = { role: 'user' as const, content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/chat/conversations/${activeConvId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: input }),
        },
      );
      const json = await res.json();

      if (json.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'agent' as const, content: json.data },
        ]);
      }
    } catch (error) {
      console.error('[AI Error] Propagation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* ─── Sidebar ─── */}
      <aside className="w-72 flex flex-col bg-white border-r border-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Users size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              AudienceBuilder
            </span>
          </div>

          <button
            onClick={createConversation}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-100 font-semibold"
          >
            <Plus size={18} />
            <span>New Build</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4">
          <p className="px-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Recent Builds
          </p>
          <div className="space-y-1">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                  activeConvId === c.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MessageSquare
                  size={16}
                  className={
                    activeConvId === c.id ? 'text-indigo-600' : 'text-slate-400'
                  }
                />
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                JD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">John Doe</span>
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Planner
                </span>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col bg-slate-50">
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
          <h2 className="text-xl font-bold tracking-tight">
            {activeConvId
              ? conversations.find((c) => c.id === activeConvId)?.title
              : 'Select a build'}
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Settings size={18} />
            Settings
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.length === 0 && !activeConvId && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 mb-6">
                <Users size={64} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Ready to Build?
              </h3>
              <p className="text-slate-400 max-w-xs mx-auto">
                Select an existing build or create a new one to start defining
                your audience segments with AI.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 p-5 bg-white border border-slate-200 rounded-3xl rounded-tl-none shadow-sm text-sm text-slate-500 italic">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                Gemini is processing segment mapping...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-8 bg-gradient-to-t from-slate-50 to-transparent">
          <div className="max-w-4xl mx-auto flex items-center gap-3 p-2 bg-white rounded-2xl shadow-2xl shadow-indigo-100 border border-slate-200 ring-4 ring-slate-100">
            <input
              type="text"
              placeholder={
                activeConvId
                  ? 'Describe your ideal audience segment...'
                  : 'Select a build to begin'
              }
              disabled={!activeConvId || isLoading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-3 bg-transparent outline-none text-sm placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!activeConvId || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-md active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </footer>
      </main>

      {/* ─── Control Panel ─── */}
      <aside className="w-80 bg-white border-l border-slate-200 flex flex-col p-6 overflow-y-auto">
        <section className="mb-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Real-time Reach
          </h3>
          <div className="p-8 bg-slate-50 rounded-3xl text-center border border-slate-100">
            <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
              1.2M
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Reachable Users
            </p>
          </div>
        </section>

        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Targeting Signals
            </h3>
            <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-full">
              0 ACTIVE
            </span>
          </div>

          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-100 rounded-3xl p-6 text-center">
            <p className="text-sm text-slate-400 leading-relaxed italic">
              No signals have been mapped to the audience yet.
            </p>
          </div>
        </section>

        <button className="w-full py-4 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm tracking-tight transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]">
          Approve & Build Segment
        </button>
      </aside>
    </div>
  );
}

export default App;
