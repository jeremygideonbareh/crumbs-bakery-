import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useAdminApi } from '@/hooks/useAdminApi'

const sectionLabels = {
  general: 'General',
  hero: 'Hero Section',
  about: 'About Section',
  footer: 'Footer',
  contact: 'Contact Page',
  social: 'Social Media',
  products: 'Products',
}

const inputTypes = {
  text: 'text',
  richtext: 'text',
  image: 'text',
  color: 'color',
  number: 'number',
  boolean: 'checkbox',
}

export default function AdminSettings() {
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [values, setValues] = useState({})
  const api = useAdminApi()

  useEffect(() => { loadSettings() }, [])

  async function loadSettings() {
    setLoading(true)
    try {
      const { data } = await supabase.from('site_settings').select('*').order('sort_order')
      const items = data ?? []
      setSettings(items)
      const vals = {}
      items.forEach((item) => { vals[item.key] = item.value })
      setValues(vals)
    } catch (err) { console.error('Failed to load settings:', err) }
    finally { setLoading(false) }
  }

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const updates = settings
        .filter((s) => values[s.key] !== undefined)
        .map((s) => ({
          key: s.key,
          value: values[s.key] ?? '',
        }))

      const { error } = await api.settings.saveBatch(updates)
      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const grouped = settings.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading settings...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Edit text, images, and content across your site — no coding needed</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Saved!
            </motion.span>
          )}
          <Button onClick={loadSettings} variant="neutral" size="sm" className="gap-1">
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1">
            <Save size={14} /> {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">{sectionLabels[section] || section}</h2>
            </div>
            <div className="p-5 space-y-4">
              {items.map((item) => (
                <div key={item.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    {item.label || item.key}
                    <span className="text-[10px] text-gray-400 ml-2">({item.type})</span>
                  </label>
                  {item.type === 'boolean' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={values[item.key] === 'true'}
                        onChange={(e) => handleChange(item.key, e.target.checked ? 'true' : 'false')}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">Enabled</span>
                    </label>
                  ) : item.type === 'color' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={values[item.key] || '#000000'}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={values[item.key] || ''}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="#000000"
                      />
                    </div>
                  ) : item.type === 'richtext' ? (
                    <textarea
                      value={values[item.key] || ''}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs"
                    />
                  ) : (
                    <input
                      type={inputTypes[item.type] || 'text'}
                      value={values[item.key] || ''}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  )}
                  {item.type === 'image' && values[item.key] && (
                    <img src={values[item.key]} alt="" className="mt-2 w-32 h-20 object-cover rounded-lg border border-gray-100" onError={(e) => { e.target.style.display = 'none' }} />
                  )}
                  <p className="text-[10px] text-gray-400 mt-0.5">Key: {item.key} · Section: {item.section}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
