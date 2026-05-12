import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import * as Chat from './components/Chat';
import * as Dashboard from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

/**
 * AI Audience Builder - Principal Grade Dashboard
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const DashboardLayout = () => {
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
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
