import { useState, useEffect, useMemo } from 'react'
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
  Home,
  CakeSlice,
  Cake as Cupcake,
  Cookie,
  BookOpen,
  Info,
  Phone,
  ShoppingCart,
  ExternalLink,
  MapPin,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import SectionEditorModal from '@/components/admin/SectionEditorModal'
import { useAdminApi } from '@/hooks/useAdminApi'
import { PAGE_SECTIONS, PAGE_ORDER, getSectionLocation } from '@/data/adminSectionMap'

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
  product_grid: Package,
  menus: Image,
  footer: Settings,
  team: Star,
  order_cta: LayoutDashboard,
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
  product_grid: 'bg-teal-50 text-teal-600',
  menus: 'bg-amber-50 text-amber-600',
  footer: 'bg-gray-50 text-gray-600',
  team: 'bg-sky-50 text-sky-600',
  order_cta: 'bg-emerald-50 text-emerald-600',
}

const tabIcons = {
  home: Home,
  cakes: CakeSlice,
  cupcakes: Cupcake,
  desserts: Cookie,
  menu: BookOpen,
  about: Info,
  reviews: Star,
  contact: Phone,
  'order-now': ShoppingCart,
}

// Build a Set of all known section keys from the mapping for O(1) lookup
function buildKnownKeys() {
  const keys = new Set()
  for (const page of Object.values(PAGE_SECTIONS)) {
    for (const s of page.sections) {
      keys.add(s.key)
    }
  }
  return keys
}

const KNOWN_SECTION_KEYS = buildKnownKeys()

export default function AdminContent() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [previewData, setPreviewData] = useState({})
  const [activeTab, setActiveTab] = useState('home')
  const [products, setProducts] = useState([])
  const [reviewsData, setReviewsData] = useState({ list: [], unapprovedCount: 0 })
  const api = useAdminApi()

  const loadSections = async () => {
    setLoading(true)
    try {
      const { data } = await api.sections.list()
      setSections(data ?? [])
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

  // Load products when switching to a product category tab
  useEffect(() => {
    const page = PAGE_SECTIONS[activeTab]
    if (page?.productCategory) {
      api.products.list().then(({ data }) => {
        setProducts(data?.filter((p) => p.category_slug === page.productCategory) ?? [])
      }).catch((err) => {
        console.error('Failed to load products for tab:', err)
        toast.error('Failed to load products')
      })
    }
  }, [activeTab])

  // Load reviews data when on reviews tab
  useEffect(() => {
    if (activeTab === 'reviews') {
      Promise.all([
        api.reviews.list(),
        api.reviews.unapprovedCount(),
      ]).then(([listRes, countRes]) => {
        setReviewsData({
          list: listRes.data ?? [],
          unapprovedCount: countRes.data ?? 0,
        })
      }).catch((err) => {
        console.error('Failed to load reviews:', err)
        toast.error('Failed to load reviews')
      })
    }
  }, [activeTab])

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
    const keyCount = Object.keys(data).length
    if (keyCount === 0) return 'Using defaults'
    const keys = Object.keys(data).filter((k) => typeof data[k] === 'string' && data[k])
    const preview = keys.slice(0, 2).map((k) => data[k].substring(0, 40)).join(', ')
    return preview || `${keyCount} fields`
  }

  // Build combined display list: real sections + hardcoded markers in page order
  const displaySections = useMemo(() => {
    const page = PAGE_SECTIONS[activeTab]
    if (!page || page.externalUrl) return []

    const result = []

    for (const entry of page.sections) {
      if (entry.hardcoded) {
        // Hardcoded marker — show as non-editable placeholder
        result.push({
          id: `hardcoded-${entry.label.replace(/\s+/g, '-').toLowerCase()}`,
          section_label: entry.label,
          section_type: 'hardcoded',
          hardcoded: true,
        })
      } else if (entry.key) {
        // Real editable section — find matching data from API
        const match = sections.find((s) => s.section_key === entry.key)
        if (match) {
          result.push(match)
        } else {
          // Section key defined in mapping but no data yet — show as placeholder
          result.push({
            id: `pending-${entry.key}`,
            section_key: entry.key,
            section_label: entry.label,
            section_type: entry.type || 'pending',
            data: null,
            pending: true,
          })
        }
      }
    }

    // Also append any sections from API that don't match mapped entries
    const mappedKeys = new Set(page.sections.filter((s) => s.key).map((s) => s.key))
    for (const section of sections) {
      if (!mappedKeys.has(section.section_key) && !KNOWN_SECTION_KEYS.has(section.section_key)) {
        result.push(section)
      }
    }

    return result
  }, [sections, activeTab])

  const currentPage = PAGE_SECTIONS[activeTab]

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
          productGridItems={editing.section_type === 'product_grid' ? products : undefined}
        />
      )}

      {/* ── Page tabs ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-gray-100 pb-3">
        {PAGE_ORDER.map((pageKey) => {
          const page = PAGE_SECTIONS[pageKey]
          const Icon = tabIcons[pageKey] || Layout
          const isActive = activeTab === pageKey
          return (
            <button
              key={pageKey}
              onClick={() => setActiveTab(pageKey)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-teal-50 text-teal-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={14} />
              {page.label}
            </button>
          )
        })}
      </div>

      {/* ── Page description ────────────────────────────────────── */}
      {currentPage && (
        <p className="text-sm text-gray-500 mb-4">{currentPage.description}</p>
      )}

      {/* ── Product category summary ────────────────────────────── */}
      {currentPage?.productCategory && products.length > 0 && (
        <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-teal-800">
            <Package size={16} />
            <span>
              <strong>{products.length}</strong> product{products.length !== 1 ? 's' : ''} in{' '}
              &lsquo;{currentPage.productCategory}&rsquo;
            </span>
          </div>
          <a
            href="/admin/products"
            className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
          >
            Manage Products <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* ── Reviews tab summary ─────────────────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Star size={16} />
            <span>
              <strong>{reviewsData.list.length}</strong> review{reviewsData.list.length !== 1 ? 's' : ''}
              {reviewsData.unapprovedCount > 0 && (
                <span className="ml-1.5 text-amber-600">
                  ({reviewsData.unapprovedCount} unapproved)
                </span>
              )}
            </span>
          </div>
          <a
            href="/admin/reviews"
            className="text-xs text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1"
          >
            Manage Reviews <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* ── External URL tab (e.g., reviews) ────────────────────── */}
      {currentPage?.externalUrl && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <Star size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500 mb-3">
            Reviews are managed on a separate page.
          </p>
          <a href={currentPage.externalUrl}>
            <Button variant="neutral" size="sm" className="gap-1">
              Go to Reviews <ExternalLink size={14} />
            </Button>
          </a>
        </div>
      )}

      {/* ── Section list ────────────────────────────────────────── */}
      {!currentPage?.externalUrl && (
        <div className="grid gap-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading sections...</div>
          ) : displaySections.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No sections found for this page.
            </div>
          ) : (
            displaySections.map((section, i) => {
              const isHardcoded = section.hardcoded
              const isPending = section.pending
              const Icon = isHardcoded ? Layout : isPending ? Settings : (typeIcons[section.section_type] || Settings)
              const colorClass = isHardcoded
                ? 'bg-gray-100 text-gray-400'
                : isPending
                  ? 'bg-gray-50 text-gray-300'
                  : (typeColors[section.section_type] || 'bg-gray-50 text-gray-600')
              const hasData =
                !isHardcoded &&
                section.data &&
                typeof section.data === 'object' &&
                Object.keys(section.data).length > 0
              const location = getSectionLocation(section.section_key)

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-xl border p-4 flex items-center justify-between transition-colors ${
                    isHardcoded
                      ? 'bg-gray-50/50 border-gray-100/70'
                      : 'bg-white border-gray-100 shadow-sm hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${isHardcoded ? 'text-gray-400' : 'text-gray-900'}`}>
                        {section.section_label}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {isHardcoded ? (
                          <span className="text-[10px] text-gray-400 bg-gray-200/60 px-1.5 py-0.5 rounded uppercase">
                            Read-only
                          </span>
                        ) : isPending ? (
                          <span className="text-[10px] text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                            Pending
                          </span>
                        ) : (
                          <>
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
                            <span className="text-[10px] text-gray-400 truncate max-w-[160px]">
                              {getPreviewSummary(section)}
                            </span>
                          </>
                        )}
                      </div>
                      {/* Location badge */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-teal-400" />
                        <span className="text-[10px] text-teal-600/70 truncate max-w-[260px]">
                          {location.page} → {location.section}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!isHardcoded && (
                    <Button
                      onClick={() => handleEdit(section)}
                      variant="neutral"
                      size="sm"
                      className="gap-1 shrink-0 ml-3"
                    >
                      <Edit3 size={14} /> Edit
                    </Button>
                  )}
                </motion.div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
