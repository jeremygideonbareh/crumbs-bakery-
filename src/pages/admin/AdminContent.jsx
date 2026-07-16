import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Edit3,
  RefreshCw,
  Layout,
  Image,
  Grid3X3,
  List,
  MessageSquare,
  Star,
  Settings,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import SectionEditorModal from '@/components/admin/SectionEditorModal'
import { useAdminApi } from '@/hooks/useAdminApi'

const typeIcons = {
  hero: Layout,
  stats: Star,
  card_grid: Grid3X3,
  content_columns: Grid3X3,
  gallery: Image,
  news_list: List,
  menu_items: List,
  carousel: Image,
  product_carousel: Grid3X3,
  delivery: LayoutDashboard,
  faq: MessageSquare,
  image_grid: Image,
  social: Star,
  menu_categories: List,
  menus: Image,
  footer: Settings,
}

const typeColors = {
  hero: 'bg-violet-50 text-violet-600',
  stats: 'bg-amber-50 text-amber-600',
  card_grid: 'bg-blue-50 text-blue-600',
  content_columns: 'bg-green-50 text-green-600',
  gallery: 'bg-pink-50 text-pink-600',
  news_list: 'bg-cyan-50 text-cyan-600',
  menu_items: 'bg-orange-50 text-orange-600',
  carousel: 'bg-indigo-50 text-indigo-600',
  product_carousel: 'bg-teal-50 text-teal-600',
  delivery: 'bg-yellow-50 text-yellow-600',
  faq: 'bg-purple-50 text-purple-600',
  image_grid: 'bg-rose-50 text-rose-600',
  social: 'bg-fuchsia-50 text-fuchsia-600',
  menu_categories: 'bg-orange-50 text-orange-600',
  menus: 'bg-amber-50 text-amber-600',
  footer: 'bg-gray-50 text-gray-600',
}

export default function AdminContent() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // section object being edited
  const [previewData, setPreviewData] = useState({})
  const api = useAdminApi()

  const loadSections = async () => {
    setLoading(true)
    try {
      const { data } = await api.sections.list()
      setSections(data ?? [])
      // Build a preview data map
      const previewMap = {}
      ;(data ?? []).forEach((s) => {
        previewMap[s.id] = s.data
      })
      setPreviewData(previewMap)
    } catch (err) {
      console.error('Failed to load sections:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSections()
  }, [])

  const handleEdit = (section) => {
    setPreviewData((prev) => ({ ...prev, [section.id]: section.data }))
    setEditing(section)
  }

  const handleSave = async (formData) => {
    if (!editing) return
    try {
      const { error } = await api.sections.update(
        editing.section_key,
        editing.section_label,
        editing.section_type,
        formData
      )
      if (error) throw error
      toast.success('Section saved successfully!')
      setEditing(null)
      await loadSections()
    } catch (err) {
      console.error('Failed to save section:', err)
      toast.error('Failed to save section')
    }
  }

  const getPreviewSummary = (section) => {
    const data = previewData[section.id]
    if (!data) return 'Using defaults'
    if (Array.isArray(data)) return `${data.length} item${data.length !== 1 ? 's' : ''}`
    const keys = Object.keys(data).filter((k) => typeof data[k] === 'string' && data[k])
    const preview = keys.slice(0, 2).map((k) => data[k].substring(0, 40)).join(', ')
    return preview || `${Object.keys(data).length} fields`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Content Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit every section of your website — text, images, cards, and more
          </p>
        </div>
        <Button onClick={loadSections} variant="neutral" size="sm" className="gap-1">
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {editing && (
        <SectionEditorModal
          section={editing}
          currentData={previewData[editing.id] || {}}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Section list */}
      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading sections...</div>
        ) : sections.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No sections found. Run the SQL migration first.
          </div>
        ) : (
          sections.map((section, i) => {
            const Icon = typeIcons[section.section_type] || Settings
            const colorClass = typeColors[section.section_type] || 'bg-gray-50 text-gray-600'
            const hasData =
              section.data &&
              typeof section.data === 'object' &&
              Object.keys(section.data).length > 0

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {section.section_label}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                        {section.section_type}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          hasData
                            ? 'bg-green-50 text-green-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {hasData ? 'Saved' : 'Using defaults'}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate max-w-[200px]">
                        {getPreviewSummary(section)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleEdit(section)}
                  variant="neutral"
                  size="sm"
                  className="gap-1 shrink-0 ml-3"
                >
                  <Edit3 size={14} /> Edit
                </Button>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
