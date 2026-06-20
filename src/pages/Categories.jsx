import { useState, useEffect, useMemo } from 'react';
import { getCategories, createCategory, deleteCategory } from '../lib/api';
import { Trash2, Plus, FolderTree, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const PAGE_SIZE = 10;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({ label: '', icon: '', description: '' });

  const fetchCats = () => {
    setLoading(true);
    getCategories()
      .then(data => setCategories(data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCats(); }, []);

  // Filter by search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    );
  }, [categories, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1); }, [search]);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCategory(formData);
      setFormData({ label: '', icon: '', description: '' });
      fetchCats();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async slug => {
    if (!window.confirm(`Delete category "${slug}"? Articles won't be deleted but may need reassigning.`)) return;
    try {
      await deleteCategory(slug);
      fetchCats();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-8 space-y-6 text-white max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Categories</h1>
        <p className="text-slate-400">
          {loading ? 'Loading…' : `${categories.length} total categories · ${filtered.length} matching`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Add Form ── */}
        <div className="md:col-span-1">
          <div className="glass-card p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus size={18} /> Add Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name *</label>
                <input
                  type="text" name="label" required
                  value={formData.label} onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="e.g. Login & Access Problems"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Icon (Emoji)</label>
                <input
                  type="text" name="icon"
                  value={formData.icon} onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="e.g. 🔐"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  name="description" rows={3}
                  value={formData.description} onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="What is this category about?"
                />
              </div>
              <button
                type="submit" disabled={saving || !formData.label}
                className="btn-primary w-full justify-center"
              >
                <Plus size={16} />
                {saving ? 'Saving...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>

        {/* ── Category List ── */}
        <div className="md:col-span-2 space-y-4">

          {/* Search Bar */}
          <div className="glass-card p-4">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search categories by name, slug, or description…"
                className="input-dark w-full"
                style={{ paddingLeft: '38px', paddingRight: search ? '38px' : '12px' }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
            {/* Stats row */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
              <span>
                Showing <strong style={{ color: '#e2e8f0' }}>{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong style={{ color: '#e2e8f0' }}>{filtered.length}</strong>
                {search && <span> for "<em>{search}</em>"</span>}
              </span>
              <span>{PAGE_SIZE} per page</span>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Articles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5">
                        <div style={{ height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10" style={{ color: '#64748b' }}>
                      {search ? `No categories matching "${search}"` : 'No categories found.'}
                    </td>
                  </tr>
                ) : (
                  paginated.map((cat, idx) => (
                    <tr key={cat.slug}>
                      <td style={{ color: '#64748b', fontSize: '12px', width: '40px' }}>
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td>
                        <div className="flex items-center gap-2 font-medium text-white mb-1">
                          <span style={{ fontSize: '18px' }}>{cat.icon || <FolderTree size={14} />}</span>
                          <span>{cat.label}</span>
                        </div>
                        <div className="text-xs text-slate-500">{cat.slug}</div>
                      </td>
                      <td className="text-sm text-slate-400" style={{ maxWidth: '200px' }}>
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {cat.description || <em style={{ opacity: 0.5 }}>No description</em>}
                        </span>
                      </td>
                      <td>
                        <span className="px-2 py-1 rounded text-xs" style={{ background: cat.count > 0 ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.06)', color: cat.count > 0 ? '#60a5fa' : '#64748b' }}>
                          {cat.count || 0}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(cat.slug)}
                          className="text-red-400 hover:text-red-300 p-2"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Footer */}
            {!loading && filtered.length > PAGE_SIZE && (
              <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: page === 1 ? '#475569' : '#e2e8f0', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) pageNum = i + 1;
                    else if (page <= 4) pageNum = i + 1;
                    else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                    else pageNum = page - 3 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        style={{
                          width: '32px', height: '32px', borderRadius: '6px', border: '1px solid',
                          borderColor: pageNum === page ? '#2563eb' : 'rgba(255,255,255,0.1)',
                          background: pageNum === page ? '#2563eb' : 'none',
                          color: pageNum === page ? 'white' : '#94a3b8',
                          cursor: 'pointer', fontSize: '13px', fontWeight: pageNum === page ? 700 : 400
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: page === totalPages ? '#475569' : '#e2e8f0', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
