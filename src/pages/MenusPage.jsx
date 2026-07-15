import { motion } from 'framer-motion'
import { useMemo } from 'react'
import MenuInteractive from '@/components/MenuInteractive'
import usePageSection from '@/hooks/usePageSection'
import { MENU_CATEGORIES_DEFAULTS } from '@/data/contentDefaults'
import { MENU_HEADER } from '@/data/menuData'

function mergeImagesFromDefaults(items, defaultItems) {
  return items.map((item) => {
    if (item.image) return item
    const match = defaultItems.find((d) => d.name === item.name)
    return { ...item, image: match?.image || '' }
  })
}

function normalizeAdminData(adminData) {
  if (!adminData || !Array.isArray(adminData) || adminData.length === 0) return null
  return adminData.map((cat, i) => {
    const defaults = MENU_CATEGORIES_DEFAULTS[i]
    return {
      id: cat.id || `cat-${i}`,
      name: cat.name || 'Category',
      subtitle: cat.subtitle || '',
      emoji: cat.emoji || '🍰',
      accent: cat.accent || 'rose',
      subcategories: Array.isArray(cat.subcategories) ? cat.subcategories : undefined,
      items: Array.isArray(cat.items)
        ? mergeImagesFromDefaults(
            cat.items.map((item) => ({
              name: item.name || '',
              price: item.price || '',
              desc: item.desc || '',
              highlight: item.highlight || '',
              subcategory: item.subcategory || '',
              options: Array.isArray(item.options) ? item.options : undefined,
              image: item.image || '',
            })),
            defaults?.items || []
          )
        : [],
    }
  })
}

export default function MenusPage() {
  const { data: adminCategories } = usePageSection('menu_categories', MENU_CATEGORIES_DEFAULTS)
  const categories = useMemo(() => normalizeAdminData(adminCategories), [adminCategories])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="min-h-screen bg-background"
    >
      <div className="relative pt-16 md:pt-20 pb-2 md:pb-4">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-work uppercase tracking-[0.1em] mb-2">
              <a href="/" className="hover:text-foreground transition-colors">
                Home
              </a>
              <span>/</span>
              <span className="text-foreground/60">Menus</span>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="px-4 md:px-6 pb-16 md:pb-24">
        <MenuInteractive categories={categories} header={MENU_HEADER} />
      </section>
    </motion.div>
  )
}
