import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../lib/api';
import { FileText, Building2, Globe, Shield, ArrowUpRight, FolderTree } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-300">Loading CMS...</div>;

  return (
    <div className="p-8 space-y-8 text-white max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">CMS Overview</h1>
        <p className="text-slate-400">Content Management & Institution Intelligence System.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-white/[0.06] bg-[#0f172a]/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <FileText className="text-blue-400" size={24} />
            </div>
            <Link to="/admin/articles" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <h3 className="text-4xl font-bold mb-1">{stats?.articles || 0}</h3>
          <p className="text-slate-400 text-sm">Total Guides in Database</p>
        </div>

        <div className="glass-card p-6 border border-white/[0.06] bg-[#0f172a]/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Globe className="text-emerald-400" size={24} />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>
          <h3 className="text-4xl font-bold mb-1">{stats?.published || 0}</h3>
          <p className="text-slate-400 text-sm">Live Published Guides</p>
        </div>

        <div className="glass-card p-6 border border-white/[0.06] bg-[#0f172a]/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Building2 className="text-purple-400" size={24} />
            </div>
            <Link to="/admin/categories" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Manage <ArrowUpRight size={14} />
            </Link>
          </div>
          <h3 className="text-4xl font-bold mb-1">{stats?.banks || 0}</h3>
          <p className="text-slate-400 text-sm">Monitored Institutions & Topics</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/admin/articles" 
          className="glass-card p-6 border border-white/[0.06] hover:border-blue-500/40 bg-[#0f172a]/60 hover:bg-[#1e293b]/60 transition-all group block"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <FileText size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                Browse Content Library
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">
                Inspect live published articles, SEO metadata, categories, and database records.
              </p>
            </div>
            <ArrowUpRight size={18} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
        </Link>

        <Link 
          to="/admin/categories" 
          className="glass-card p-6 border border-white/[0.06] hover:border-purple-500/40 bg-[#0f172a]/60 hover:bg-[#1e293b]/60 transition-all group block"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <FolderTree size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                Category & Bank Silos
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">
                Review institution mapping, problem categories, and sitemap hierarchy.
              </p>
            </div>
            <ArrowUpRight size={18} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
        </Link>
      </div>

      {/* System Security Notice */}
      <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/[0.03] rounded-2xl flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
          <Shield size={20} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-emerald-300">Protected Administrator Session Active</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Admin console is guarded by master authentication key. Automated writing triggers have been decommissioned to maintain manual review integrity and editorial standards.
          </p>
        </div>
      </div>
    </div>
  );
}
