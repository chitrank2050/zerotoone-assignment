import React from 'react';

import {
  BarChart3,
  MessageSquare,
  Settings,
  Target,
  User as UserIcon,
} from 'lucide-react';

export const NavItem: React.FC<{
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

export const Sidebar: React.FC = () => (
  <aside className="w-20 lg:w-64 border-r border-border-glass bg-surface-glass backdrop-blur-xl flex flex-col p-4 z-20">
    <div className="flex items-center gap-3 px-2 mb-10">
      <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
        <Target className="text-white w-6 h-6" aria-hidden="true" />
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
            <UserIcon
              className="w-4 h-4 text-brand-primary"
              aria-hidden="true"
            />
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
);
