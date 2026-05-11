import * as Chat from './components/Chat';
import * as Dashboard from './components/Dashboard';
import { ChatProvider } from './context/ChatContext';

/**
 * AI Audience Builder - Principal Grade Dashboard
 *
 * Refactored using Vercel Composition Patterns:
 * - Lifted state into ChatProvider
 * - Compound components for Dashboard and Chat
 * - Modular, readable architecture
 */
const App = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        {/* --- 🛠️ Sidebar (Navigation) --- */}
        <Dashboard.Sidebar />

        {/* --- 🧠 Main Content (Chat Engine) --- */}
        <Dashboard.Main>
          <Chat.Header />
          <Chat.Feed />
          <Chat.Input />
        </Dashboard.Main>

        {/* --- 📊 Signal Explorer (Right Panel) --- */}
        <Dashboard.Explorer />
      </div>
    </ChatProvider>
  );
};

export default App;
