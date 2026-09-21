import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function TopBar({ onLogout }) {
  const location = useLocation();
  const titleMap = {
    '/admin': 'Dashboard',
    '/admin/articles': 'All Articles',
    '/admin/categories': 'Categories',
  };
  const title = titleMap[location.pathname] || 'Dashboard';

  return (
    <header className="h-20 flex-shrink-0 border-b border-white/[0.06] flex items-center justify-between px-8"
            style={{ background: 'rgba(8,14,26,0.6)', backdropFilter: 'blur(12px)' }}>
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-xs text-slate-400">Content Management System</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {onLogout && (
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-red-500/10 border border-white/[0.05] hover:border-red-500/20 text-slate-300 hover:text-red-400 transition-all text-xs font-medium"
              title="Lock & Log Out"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          )}

          <div className="ml-2 w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
