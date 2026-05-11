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
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer group ${
      active
        ? 'bg-brand-primary text-white shadow-premium'
        : 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 border border-transparent'
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
  <aside className="w-20 lg:w-64 border-r border-border-glass glass flex flex-col p-4 z-20">
    <div className="flex items-center gap-3 px-2 mb-12">
      <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-premium">
        <Target className="text-white w-6 h-6" aria-hidden="true" />
      </div>
      <span className="font-bold text-xl hidden lg:block tracking-tighter text-neutral-50">
        AudienceAI
      </span>
    </div>

    <nav className="flex-1 space-y-2">
      <NavItem
        icon={<MessageSquare className="w-5 h-5" />}
        label="Active Build"
        active
      />
      <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Analytics" />
      <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
    </nav>

    <div className="mt-auto pt-6 border-t border-border-glass">
      <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-brand-primary to-brand-secondary p-px">
          <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
            <UserIcon
              className="w-4 h-4 text-brand-primary"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-semibold truncate text-neutral-100">
            Planner #01
          </p>
          <p className="text-minimal-label truncate">Principal Grade</p>
        </div>
      </div>
    </div>
  </aside>
);
