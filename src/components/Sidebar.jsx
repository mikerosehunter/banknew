import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, AlertTriangle, FileText, Building2, 
  Radio, Send, Shield, Activity, ChevronRight, Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/errors', icon: AlertTriangle, label: 'Error Intelligence' },
  { path: '/articles', icon: FileText, label: 'Content Hub' },
  { path: '/banks', icon: Building2, label: 'Bank Database' },
  { path: '/monitoring', icon: Radio, label: 'Monitoring' },
  { path: '/publish', icon: Send, label: 'CMS Publisher' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-white/[0.06]" 
           style={{ background: 'rgba(8,14,26,0.85)', backdropFilter: 'blur(20px)' }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" 
               style={{ background: 'linear-gradient(135deg, #00C6FF, #0072FF)', boxShadow: '0 4px 15px rgba(0,114,255,0.4)' }}>
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">BankWatch AI</div>
            <div className="text-[10px] text-dark-500 font-medium uppercase tracking-widest">Error Intelligence</div>
          </div>
        </div>
      </div>
      
      {/* Live status */}
      <div className="mx-4 mt-4 mb-2 px-3 py-2.5 rounded-xl bg-green-500/8 border border-green-500/15 flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs text-green-400 font-medium">Live Monitoring Active</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ path, icon: Icon, label, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={12} className="opacity-30" />
          </NavLink>
        ))}
      </nav>
      
      {/* Footer info */}
      <div className="px-4 py-4 border-t border-white/[0.05]">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03]">
          <Zap size={14} className="text-brand-400" />
          <div>
            <div className="text-xs text-dark-300 font-medium">AI Engine</div>
            <div className="text-[10px] text-dark-500">Google Gemini 1.5 Flash</div>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-dark-600 px-3 text-center">
          v1.0.0 · Monitors 35 US Banks
        </div>
      </div>
    </aside>
  );
}
