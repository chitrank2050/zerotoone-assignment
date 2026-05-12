import * as Chat from './components/Chat';
import * as Dashboard from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

/**
 * AI Audience Builder - Principal Grade Dashboard
 */
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <ChatProvider>
      <div className="flex h-screen overflow-hidden bg-neutral-950 text-neutral-100">
        <Dashboard.Sidebar />
        <Dashboard.Main>
          <Chat.Header />
          <Chat.Feed />
          <Chat.Input />
        </Dashboard.Main>
        <Dashboard.Explorer />
      </div>
    </ChatProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
