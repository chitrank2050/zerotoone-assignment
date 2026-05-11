import React from 'react';

import { BarChart3, MessageSquare, Settings, Target } from 'lucide-react';

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
    <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:block">
      {label}
    </span>
  </div>
);

export const Sidebar: React.FC = () => (
  <aside className="w-20 lg:w-56 border-r border-border-subtle bg-neutral-950 flex flex-col p-6 z-20 animate-fade-in text-neutral-100">
    <div className="flex items-center gap-3 mb-16">
      <div className="w-8 h-8 border border-neutral-100 flex items-center justify-center">
        <Target className="text-neutral-100 w-4 h-4" aria-hidden="true" />
      </div>
      <span className="font-bold text-xs hidden lg:block tracking-widest uppercase">
        Core
      </span>
    </div>

    <nav className="flex-1 space-y-6">
      <NavItem
        icon={<MessageSquare className="w-4 h-4" />}
        label="Intelligence"
        active
      />
      <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Analysis" />
      <NavItem icon={<Settings className="w-4 h-4" />} label="Config" />
    </nav>

    <div className="mt-auto pt-6 border-t border-border-subtle">
      <div className="flex flex-col gap-1 px-2 py-2 group cursor-default">
        <p className="text-[10px] font-bold uppercase tracking-tighter truncate">
          Planner:01
        </p>
        <p className="text-[8px] text-neutral-600 uppercase tracking-[0.2em]">
          Auth: Verified
        </p>
      </div>
    </div>
  </aside>
);
