import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Shield, PlusCircle } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/articles', icon: FileText, label: 'All Articles' },
  { path: '/admin/publish', icon: PlusCircle, label: 'Write Article' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
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
            <div className="text-sm font-bold text-white tracking-tight">BLO Admin</div>
            <div className="text-[10px] text-dark-500 font-medium uppercase tracking-widest">CMS System</div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
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
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
