import React, { useState } from 'react';

import { ArrowRight, Lock, Mail, Target } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center p-6 z-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="flex flex-col items-center mb-12">
          <div className="w-12 h-12 border border-white/20 flex items-center justify-center rounded-2xl bg-neutral-900 shadow-2xl mb-6">
            <Target className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-neutral-100">
            Audience Builder
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 mt-2">
            AI Orchestration v2.5
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-neutral-300 transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-neutral-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm outline-none focus:border-white/20 transition-all placeholder:text-neutral-700"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-neutral-300 transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-neutral-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm outline-none focus:border-white/20 transition-all placeholder:text-neutral-700"
              required
            />
          </div>

          {error && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 text-center animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-neutral-100 text-neutral-950 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Enter System'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[9px] text-neutral-600 text-center mt-8 uppercase tracking-[0.2em]">
          Secure Access Only
        </p>
      </div>
    </div>
  );
};
