import { useState } from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function TopBar() {
  const location = useLocation();
  const titleMap = {
    '/admin': 'Dashboard',
    '/admin/articles': 'Content Hub',
    '/admin/settings': 'Settings',
  };
  const title = titleMap[location.pathname] || 'Dashboard';

  return (
    <header className="h-20 flex-shrink-0 border-b border-white/[0.06] flex items-center justify-between px-8"
            style={{ background: 'rgba(8,14,26,0.6)', backdropFilter: 'blur(12px)' }}>
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-xs text-dark-400">Content Management System</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 group-focus-within:text-brand-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="input-dark pl-10 w-72"
          />
        </div>

        <div className="flex items-center gap-3 border-l border-white/[0.06] pl-6">
          <button className="relative w-10 h-10 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] flex items-center justify-center text-dark-300 transition-all">
            <Bell size={18} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] flex items-center justify-center text-dark-300 transition-all">
            <Settings size={18} />
          </button>
          
          <div className="ml-2 w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold border border-brand-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
