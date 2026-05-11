import { useState, useEffect, useRef } from 'react';
import './App.css';
import { MessageSquare, Users, Settings, LogOut, Send, Plus, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

function App() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    }
  }, [activeConvId]);

  const fetchConversations = async () => {
    const res = await fetch(`${API_BASE}/chat/conversations`);
    const json = await res.json();
    if (json.success) setConversations(json.data);
  };

  const fetchMessages = async (id: string) => {
    const res = await fetch(`${API_BASE}/chat/conversations/${id}/messages`);
    const json = await res.json();
    if (json.success) setMessages(json.data);
  };

  const createConversation = async () => {
    const res = await fetch(`${API_BASE}/chat/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Build' }),
    });
    const json = await res.json();
    if (json.success) {
      setConversations([json.data, ...conversations]);
      setActiveConvId(json.data.id);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeConvId) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat/conversations/${activeConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [...prev, { role: 'agent', content: json.data }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
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
          <button className="icon-button"><LogOut size={18} /></button>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="chat-panel">
        <header className="chat-header">
          <h2>{activeConvId ? conversations.find(c => c.id === activeConvId)?.title : 'Select a build'}</h2>
          <div className="actions">
            <button className="secondary"><Settings size={18} /> Settings</button>
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
              <div className="message-content glass">
                {m.content}
              </div>
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
              placeholder={activeConvId ? "Describe your audience..." : "Select a build first"} 
              disabled={!activeConvId || isLoading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="send-button" disabled={!activeConvId || isLoading}>
              <Send size={18} />
            </button>
          </div>
        </footer>
      </main>

      {/* Right Panel: Signals & Estimation */}
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
