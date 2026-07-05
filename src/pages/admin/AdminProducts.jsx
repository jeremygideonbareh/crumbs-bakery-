import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, Image, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

const emptyProduct = {
  name: '',
  slug: '',
  price: '',
  image: '',
  description: '',
  variants: '[]',
  badge: '',
  category_slug: 'cakes',
  active: true,
  sort_order: 0,
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = closed, 'new' = create, object = edit
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('sort_order'),
        supabase.from('categories').select('*'),
      ])
      setProducts(productsRes.data ?? [])
      setCategories(categoriesRes.data ?? [])
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setForm(emptyProduct)
    setEditing('new')
  }

  const openEdit = (product) => {
    setForm({
      ...product,
      variants: JSON.stringify(product.variants ?? []),
    })
    setEditing(product.id)
  }

  const closeEditor = () => {
    setEditing(null)
    setForm(emptyProduct)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleSave = async () => {
    if (!form.name || !form.price) {
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        variants: form.variants ? JSON.parse(form.variants) : [],
      }
      delete payload.id

      if (editing === 'new') {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', editing)
        if (error) throw error
      }
      closeEditor()
      await loadData()
    } catch (err) {
      console.error('Failed to save product:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await supabase.from('products').delete().eq('id', id)
      await loadData()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <Button onClick={openNew} size="sm" className="gap-1">
          <Plus size={14} /> Add Product
        </Button>
      </div>

      {/* Editor modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                {editing === 'new' ? 'New Product' : 'Edit Product'}
              </h2>
              <button onClick={closeEditor} className="p-1 hover:bg-gray-100 rounded">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input name="name" value={form.name} onChange={handleNameChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                  <input name="slug" value={form.slug} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
                  <input name="price" value={form.price} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="₹1,200" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input name="image" value={form.image} onChange={handleChange} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="https://images.unsplash.com/..." />
                  <Image size={18} className="text-gray-400 self-center" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select name="category_slug" value={form.category_slug} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge</label>
                  <input name="badge" value={form.badge} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Best Seller" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Variants (JSON array)</label>
                <input name="variants" value={form.variants} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder='["Ivory","Pink","Blue"]' />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                  <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="active" type="checkbox" checked={form.active} onChange={handleChange} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
              <Button variant="neutral" onClick={closeEditor} size="sm">Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.name || !form.price} size="sm" className="gap-1">
                <Check size={14} /> {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Products table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No products yet. Click "Add Product" to begin.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          {product.badge && (
                            <span className="text-[10px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">{product.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{product.category_slug}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{product.price}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${product.active ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-blue-50 rounded text-blue-500 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
