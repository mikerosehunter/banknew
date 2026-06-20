import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Search, ExternalLink, AlertTriangle, FileText, Globe } from 'lucide-react';
import { getBanks } from '../lib/api';
import { categoryLabel, formatNumber } from '../lib/utils';

const CATEGORY_COLORS = {
  national: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  regional: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  online: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  investment: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  credit_union: 'bg-green-500/15 text-green-400 border-green-500/20',
  community: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

export default function Banks() {
  const [banks, setBanks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const LIMIT = 35;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, offset: page * LIMIT };
      if (search) params.search = search;
      if (category) params.category = category;
      const data = await getBanks(params);
      setBanks(data.banks || []);
      setTotal(data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, category, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-8 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Banks', value: total, icon: Building2, color: 'text-brand-400' },
          { label: 'National', value: banks.filter(b => b.category === 'national').length, icon: Globe, color: 'text-blue-400' },
          { label: 'Online Banks', value: banks.filter(b => b.category === 'online').length, icon: Globe, color: 'text-cyan-400' },
          { label: 'With Errors', value: banks.filter(b => b.error_count > 0).length, icon: AlertTriangle, color: 'text-orange-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="kpi-card">
            <Icon size={16} className={color} />
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-dark-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input type="text" placeholder="Search banks..." className="input-dark pl-9" value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <select className="input-dark w-auto min-w-[150px]" value={category}
          onChange={e => { setCategory(e.target.value); setPage(0); }}>
          <option value="">All Categories</option>
          {['national', 'regional', 'online', 'investment', 'credit_union', 'community'].map(c => (
            <option key={c} value={c}>{categoryLabel(c)}</option>
          ))}
        </select>
      </div>

      {/* Bank cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => <div key={i} className="h-40 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banks.map((bank, i) => (
            <motion.div key={bank.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
              className="glass-card p-5 hover:scale-[1.01] transition-transform cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg font-bold text-white border border-white/[0.08]">
                  {bank.name.charAt(0)}
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[bank.category] || 'bg-dark-600/50 text-dark-400 border-dark-600/30'}`}>
                  {categoryLabel(bank.category)}
                </span>
              </div>
              
              <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-brand-300 transition-colors">{bank.name}</h3>
              
              <a href={bank.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                className="text-xs text-dark-500 hover:text-brand-400 transition-colors flex items-center gap-1 mb-3">
                <ExternalLink size={10} />
                {bank.website?.replace(/https?:\/\//, '')}
              </a>
              
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <div className="text-dark-500">Errors</div>
                  <div className={`font-bold ${bank.error_count > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                    {bank.error_count || 0}
                  </div>
                </div>
                <div>
                  <div className="text-dark-500">Articles</div>
                  <div className="font-bold text-brand-400">{bank.article_count || 0}</div>
                </div>
                {bank.assets_billions > 0 && (
                  <div>
                    <div className="text-dark-500">Assets</div>
                    <div className="font-bold text-dark-300">${formatNumber(bank.assets_billions)}B</div>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/[0.05] flex gap-2">
                {bank.app_store_url && (
                  <a href={bank.app_store_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] text-dark-500 hover:text-dark-300 transition-colors">
                    iOS
                  </a>
                )}
                {bank.play_store_url && (
                  <a href={bank.play_store_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] text-dark-500 hover:text-dark-300 transition-colors">
                    Android
                  </a>
                )}
                {bank.support_url && (
                  <a href={bank.support_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] text-dark-500 hover:text-dark-300 transition-colors">
                    Support
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
