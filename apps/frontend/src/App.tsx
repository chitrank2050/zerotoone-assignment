/**
 * AudienceBuilder Dashboard - Main Interface
 *
 * High-performance React 19 application orchestrating real-time AI audience builds.
 *
 * Architecture:
 *   - Reactive State: Manages chat threads, estimation counts, and active signals.
 *   - AI Loop: Optimistic UI updates -> Gemini mapping -> Signal hydration.
 *   - Design System: Custom glassmorphism-based UI tailored for the Meterplex aesthetic.
 *
 * Components:
 *   - Sidebar: Session management & navigation.
 *   - Chat: Real-time natural language interface.
 *   - Estimation: Dynamic audience reachability dashboard.
 *
 * State: React Hooks (useState, useEffect, useRef).
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

import { Conversation, Message } from '@audience-builder/shared';

import './App.css';

const API_BASE = 'http://localhost:3000';

function App() {
  // --- Global State ---
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Refs for scrolling and DOM interaction
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Lifecycle: Bootstraps the application by loading the user's build history.
   */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/conversations`);
        const json = await res.json();
        if (json.success) setConversations(json.data);
      } catch (error) {
        console.error('[Hydration Error] Failed to load build history:', error);
      }
    };
    fetchConversations();
  }, []);

  /**
   * Lifecycle: Synchronizes the chat thread whenever a session is selected.
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
          console.error(
            '[Hydration Error] Failed to load message thread:',
            error,
          );
        }
      };
      fetchMessages(activeConvId);
    }
  }, [activeConvId]);

  /**
   * Action: Spawns a new audience build session.
   * Persistence: Instantly creates a record in LibSQL and selects it as active.
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
   * Action: Submits audience requirements to the AI engine.
   * Pattern: Optimistic Update -> AI Processing -> Signal Feedback.
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
      console.error('[AI Error] Message propagation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Layout Logic: Auto-scroll anchor for conversational continuity.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="layout">
      {/* ─── Sidebar: Navigation & Session History ─── */}
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <div className="logo">
            <Users size={24} color="#6366f1" />
            <span>AudienceBuilder</span>
          </div>
          <button className="new-chat" onClick={createConversation}>
            <Plus size={18} />
            <span>New Build</span>
          </button>
        </div>

        <nav className="history">
          <p className="section-title">Recent Builds</p>
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`history-item ${activeConvId === c.id ? 'active' : ''}`}
              onClick={() => setActiveConvId(c.id)}
            >
              <MessageSquare size={16} />
              <span>{c.title}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="info">
              <p className="name">John Doe</p>
              <p className="role">Planner</p>
            </div>
          </div>
          <button className="icon-button">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* ─── Main Chat Panel: AI Interaction Thread ─── */}
      <main className="chat-panel">
        <header className="chat-header">
          <h2>
            {activeConvId
              ? conversations.find((c) => c.id === activeConvId)?.title
              : 'Select a build'}
          </h2>
          <div className="actions">
            <button className="secondary">
              <Settings size={18} /> Settings
            </button>
          </div>
        </header>

        <div className="messages">
          {messages.length === 0 && !activeConvId && (
            <div className="empty-state">
              <Users size={48} color="var(--text-secondary)" />
              <p>Start a new build to begin</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <div className="message-content glass">{m.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="message agent">
              <div className="message-content glass loading">
                <Loader2 size={18} className="animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="chat-footer">
          <div className="input-container glass">
            <input
              type="text"
              placeholder={
                activeConvId
                  ? 'Describe your audience...'
                  : 'Select a build first'
              }
              disabled={!activeConvId || isLoading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="send-button"
              disabled={!activeConvId || isLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </footer>
      </main>

      {/* ─── Control Panel: Signal Approval & Reachability ─── */}
      <aside className="control-panel glass">
        <section className="estimation">
          <h3>Audience Estimate</h3>
          <div className="estimate-card">
            <p className="count">1.2M</p>
            <p className="label">Reachable Users</p>
          </div>
        </section>

        <section className="signals">
          <div className="section-header">
            <h3>Targeting Signals</h3>
            <span className="badge">0 active</span>
          </div>

          <div className="signal-list">
            <p className="empty-signals">No signals approved yet</p>
          </div>
        </section>

        <button className="approve-button primary">Approve & Build</button>
      </aside>
    </div>
  );
}

export default App;
