import { Outlet, Link } from 'react-router-dom';
import { Building2, Search, ArrowRight } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Public Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold group-hover:bg-blue-700 transition-colors">
              <Building2 size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Bank<span className="text-blue-600">Watch</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/banks" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">All Banks</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
              Admin Login <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale">
            <div className="w-6 h-6 rounded bg-slate-400 flex items-center justify-center text-white">
              <Building2 size={14} />
            </div>
            <span className="font-bold tracking-tight text-slate-600">BankWatch AI</span>
          </div>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Monitoring US bank login errors, app crashes, and service outages in real-time. Educational purposes only.
          </p>
          <div className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} BankLoginOnline. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
