import { useState, useEffect } from 'react';
import { getStats, generateArticles } from '../lib/api';
import { FileText, Building2, PlusCircle, Globe } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState('');

  useEffect(() => {
    getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenMessage('');
    try {
      const res = await generateArticles(10);
      setGenMessage(res.message);
      // reload stats after a bit
      setTimeout(() => getStats().then(setStats), 3000);
    } catch (err) {
      setGenMessage(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading CMS...</div>;

  return (
    <div className="p-8 space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">CMS Dashboard</h1>
        <p className="text-slate-400">Manage your WordPress-style content platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <FileText className="text-blue-400" size={24} />
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-1">{stats?.articles || 0}</h3>
          <p className="text-slate-400 text-sm">Total Articles</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <Globe className="text-green-400" size={24} />
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-1">{stats?.published || 0}</h3>
          <p className="text-slate-400 text-sm">Published Live</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Building2 className="text-purple-400" size={24} />
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-1">{stats?.banks || 0}</h3>
          <p className="text-slate-400 text-sm">Banks in DB</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-8 border border-brand-500/30 bg-brand-500/5 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Write New Article</h2>
          <p className="text-slate-400 max-w-2xl mb-6">
            Manually paste your ChatGPT generated content here to publish new SEO guides and track third-party errors.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="/admin/publish" 
              className="btn-primary inline-flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Open Article Editor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
