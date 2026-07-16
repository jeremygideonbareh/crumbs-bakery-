import { useState, useEffect } from 'react'
import { Pencil, Trash2, X, Check, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAdminApi } from '@/hooks/useAdminApi'

const emptyCategory = { slug: '', name: '', description: '', hero_image: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyCategory)
  const api = useAdminApi()

  useEffect(() => { loadCategories() }, [])

  async function loadCategories() {
    setLoading(true)
    try {
      const { data } = await api.categories.list()
      setCategories(data ?? [])
    } catch (err) { console.error(err); toast.error('Failed to load categories') }
    finally { setLoading(false) }
  }

  const openNew = () => { setForm(emptyCategory); setEditing('new') }
  const openEdit = (cat) => { setForm(cat); setEditing(cat.id) }
  const close = () => { setEditing(null); setForm(emptyCategory) }

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    if (!form.name || !form.slug) return
    try {
      const payload = { ...form }
      delete payload.id
      if (editing === 'new') {
        await api.categories.create(payload)
      } else {
        await api.categories.update(editing, payload)
      }
      close(); await loadCategories()
    } catch (err) { console.error(err); toast.error('Failed to save category') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try { await api.categories.delete(id); await loadCategories() }
    catch (err) { console.error(err); toast.error('Failed to delete category') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your product categories</p>
        </div>
        <Button onClick={openNew} size="sm" className="gap-1"><Plus size={14} /> Add Category</Button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editing === 'new' ? 'New Category' : 'Edit Category'}</h2>
              <button onClick={close} className="p-1 hover:bg-gray-100 rounded"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
                <input name="slug" value={form.slug} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hero Image URL</label>
                <input name="hero_image" value={form.hero_image} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
              <Button variant="neutral" onClick={close} size="sm">Cancel</Button>
              <Button onClick={handleSave} disabled={!form.name || !form.slug} size="sm" className="gap-1"><Check size={14} /> Save</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Slug</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No categories</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {cat.hero_image ? (
                        <img src={cat.hero_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                      )}
                      <span className="font-medium text-gray-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-blue-50 rounded text-blue-500"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
