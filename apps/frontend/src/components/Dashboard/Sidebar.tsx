import React from 'react';

import { BarChart3, MessageSquare, Settings, Target } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}> = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-4 px-2 py-2 transition-all duration-200 cursor-pointer group ${
      active ? 'text-neutral-50' : 'text-neutral-500 hover:text-neutral-300'
    }`}
  >
    <span
      className="w-4 h-4 opacity-70 group-hover:opacity-100"
      aria-hidden="true"
    >
      {icon}
    </span>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden lg:block">
      {label}
    </span>
  </div>
);

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-20 lg:w-56 border-r border-white/20 bg-neutral-950 flex flex-col p-8 z-20 animate-fade-in text-neutral-100">
      <div className="flex items-center gap-3 mb-16">
        <div className="w-8 h-8 border border-white/20 flex items-center justify-center rounded-lg bg-neutral-900 shadow-inner">
          <Target className="text-neutral-100 w-4 h-4" aria-hidden="true" />
        </div>
        <span className="font-bold text-[11px] hidden lg:block tracking-[0.2em] uppercase">
          Audience
        </span>
      </div>

      <nav className="flex-1 space-y-6">
        <NavItem
          icon={<MessageSquare className="w-4 h-4" />}
          label="Chats"
          active
        />
        <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Taxonomy" />
        <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" />
      </nav>

      <div className="mt-auto pt-6 border-t border-white/20">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-2 py-2 text-neutral-500 hover:text-red-400 transition-colors duration-200 cursor-pointer group"
        >
          <span className="w-4 h-4 opacity-70 group-hover:opacity-100 flex items-center justify-center">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden lg:block">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};
