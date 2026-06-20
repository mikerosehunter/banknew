import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../lib/api';
import { Trash2, Plus, FolderTree } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    label: '',
    icon: '',
    description: ''
  });

  const fetchCats = () => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCategory(formData);
      setFormData({ label: '', icon: '', description: '' });
      fetchCats();
    } catch (err) {
      alert(`Error creating category: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this category? Articles in this category will not be deleted, but may need to be reassigned.')) return;
    try {
      await deleteCategory(slug);
      fetchCats();
    } catch (err) {
      alert(`Error deleting category: ${err.message}`);
    }
  };

  return (
    <div className="p-8 space-y-6 text-white max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Categories</h1>
        <p className="text-slate-400">Manage article categories for your blog.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form */}
        <div className="md:col-span-1">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input 
                  type="text" 
                  name="label" 
                  required
                  value={formData.label} 
                  onChange={handleChange}
                  className="input-dark w-full" 
                  placeholder="e.g. Account Security"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Icon (Emoji)</label>
                <input 
                  type="text" 
                  name="icon" 
                  value={formData.icon} 
                  onChange={handleChange}
                  className="input-dark w-full" 
                  placeholder="e.g. 🛡️"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows={3}
                  value={formData.description} 
                  onChange={handleChange}
                  className="input-dark w-full" 
                  placeholder="What is this category about?"
                />
              </div>

              <button 
                type="submit" 
                disabled={saving || !formData.label}
                className="btn-primary w-full justify-center"
              >
                <Plus size={18} />
                {saving ? 'Saving...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-2">
          <div className="glass-card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8">No categories found.</td></tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat.slug}>
                      <td>
                        <div className="flex items-center gap-2 font-medium text-white mb-1">
                          <span>{cat.icon || <FolderTree size={14}/>}</span>
                          {cat.label}
                        </div>
                        <div className="text-xs text-slate-500">{cat.slug}</div>
                      </td>
                      <td className="text-sm text-slate-400 max-w-xs truncate">{cat.description}</td>
                      <td>
                        <span className="px-2 py-1 bg-slate-800 rounded text-xs">{cat.count || 0}</span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(cat.slug)}
                          className="text-red-400 hover:text-red-300 p-2"
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
