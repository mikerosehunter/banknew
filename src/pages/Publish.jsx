import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBanks, getCategories, createArticle } from '../lib/api';
import { Save, Send } from 'lucide-react';

export default function Publish() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    bank_id: '',
    category: 'login-issues',
    content: '',
    meta_description: '',
    status: 'published'
  });

  useEffect(() => {
    Promise.all([getBanks(), getCategories()]).then(([bRes, cRes]) => {
      setBanks(bRes.banks || []);
      setCategories(cRes || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createArticle(formData);
      navigate('/admin/articles');
    } catch (err) {
      alert(`Error saving article: ${err.message}`);
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading Editor...</div>;

  return (
    <div className="p-8 space-y-6 text-white max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Write Article</h1>
        <p className="text-slate-400">Paste your ChatGPT content here and publish directly to the blog.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Article Title</label>
            <input 
              type="text" 
              name="title" 
              required
              value={formData.title} 
              onChange={handleChange}
              className="input-dark w-full text-lg" 
              placeholder="e.g. Chase Bank Login Not Working: Complete Fix Guide"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bank (Optional)</label>
              <select 
                name="bank_id" 
                value={formData.bank_id} 
                onChange={handleChange}
                className="input-dark w-full"
              >
                <option value="">-- No specific bank --</option>
                {banks.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select 
                name="category" 
                required
                value={formData.category} 
                onChange={handleChange}
                className="input-dark w-full"
              >
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Article Content (Markdown)</label>
            <textarea 
              name="content" 
              required
              rows={15}
              value={formData.content} 
              onChange={handleChange}
              className="input-dark w-full font-mono text-sm" 
              placeholder="## Introduction&#10;&#10;Paste your article content here in Markdown format..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Meta Description / Excerpt (SEO)</label>
            <textarea 
              name="meta_description" 
              rows={2}
              value={formData.meta_description} 
              onChange={handleChange}
              className="input-dark w-full" 
              placeholder="A brief summary for Google search results..."
            />
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-300">Status:</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="input-dark w-32"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary"
            >
              {formData.status === 'published' ? <Send size={18}/> : <Save size={18}/>}
              {saving ? 'Saving...' : formData.status === 'published' ? 'Publish Now' : 'Save Draft'}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
