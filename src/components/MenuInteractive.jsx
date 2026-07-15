import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  Search,
  MapPin,
  Phone,
  ExternalLink,
  Sparkles,
  ChevronDown,
  Heart,
  X,
  Star,
} from 'lucide-react'
import { MENU_CATEGORIES as FALLBACK_CATEGORIES, MENU_HEADER as FALLBACK_HEADER } from '@/data/menuData'

const accentMap = {
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
    badge: 'bg-rose-100 text-rose-600',
    light: 'bg-rose-50/50',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-600',
    light: 'bg-amber-50/50',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-400',
    badge: 'bg-purple-100 text-purple-600',
    light: 'bg-purple-50/50',
  },
}

// Cute floating decorations
function Floaties() {
  const icons = ['🌸', '✨', '🧁', '🍰', '💕', '🌺']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
      {icons.map((icon, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl"
          style={{
            left: `${10 + (i * 17) % 80}%`,
            top: `${5 + (i * 23) % 90}%`,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        >
          {icon}
        </motion.span>
      ))}
    </div>
  )
}

// ─── HEADER CARD ─────────────────────────────────────────────────────

function MenuHeader({ header }) {
  if (!header) header = FALLBACK_HEADER
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-teal/10 p-6 md:p-8 mb-6 md:mb-8"
    >
      <Floaties />

      <div className="relative z-10">
        {/* Bakery Name + Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-5"
        >
          <h1 className="font-display text-3xl md:text-5xl tracking-wide text-foreground">
            {header.bakery}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <Sparkles size={14} className="text-foreground/60" />
            <p className="font-work text-xs md:text-sm text-foreground/70 italic">
              &ldquo;{header.tagline}&rdquo;
            </p>
            <Sparkles size={14} className="text-foreground/60" />
          </div>
        </motion.div>

        {/* Info Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-foreground/80"
        >
          <span className="inline-flex items-center gap-1.5 font-work">
            <MapPin size={14} className="shrink-0 text-foreground/60" />
            {header.address}
          </span>
          <span className="inline-flex items-center gap-1.5 font-work">
            <Phone size={14} className="shrink-0 text-foreground/60" />
            {header.phone}
          </span>
          <a
            href={`https://instagram.com/${(header.social || '').replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-work text-foreground/80 hover:text-foreground transition-colors"
          >
            <ExternalLink size={14} className="shrink-0" />
            {header.social}
          </a>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
        />
      </div>
    </motion.div>
  )
}

// ─── CATEGORY TAB BAR ─────────────────────────────────────────────────

function CategoryTabs({ categories, activeId, onSelect }) {
  const scrollRef = useRef(null)
  const activeRef = useRef(null)

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current
      const el = activeRef.current
      const scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [activeId])

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:flex-wrap md:justify-center"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <LayoutGroup>
        {categories.map((cat) => {
          const isActive = cat.id === activeId
          const accent = accentMap[cat.accent] || accentMap.rose

          return (
            <motion.button
              key={cat.id}
              ref={isActive ? activeRef : null}
              layout
              onClick={() => onSelect(cat.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full font-work text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-foreground shadow-sm'
                  : 'text-foreground/60 hover:text-foreground/80 hover:bg-foreground/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-full ${accent.bg} border ${accent.border}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-lg leading-none">{cat.emoji}</span>
              <span className="relative z-10">
                {cat.name}
                <span className="ml-1.5 text-xs opacity-60">({cat.items.length})</span>
              </span>
            </motion.button>
          )
        })}
      </LayoutGroup>
    </div>
  )
}

// ─── ITEM CARD ────────────────────────────────────────────────────────

function ItemCard({ item, index, accentKey }) {
  const accent = accentMap[accentKey] || accentMap.rose
  const [expanded, setExpanded] = useState(false)
  const [liked, setLiked] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.25, 0.4, 0.25, 1] }}
      layout
      className="group"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div
          className={`relative rounded-xl border border-foreground/10 bg-white/80 backdrop-blur-sm p-4 md:p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-md ${
            expanded ? 'shadow-md border-foreground/20' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Left: Name + Badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base md:text-lg font-medium text-foreground leading-snug">
                  {item.name}
                </h3>
                {item.highlight && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-work font-medium ${accent.badge}`}
                  >
                    <Star size={10} />
                    {item.highlight}
                  </span>
                )}
              </div>

              {/* Description */}
              <AnimatePresence>
                {expanded && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="mt-2 text-xs md:text-sm text-foreground/60 leading-relaxed overflow-hidden"
                  >
                    {item.desc}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Price (always visible) */}
              <p className="mt-2 font-work text-sm md:text-base font-semibold text-foreground">
                {item.price}
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLiked(!liked)
                }}
                className={`p-1.5 rounded-full transition-all ${
                  liked
                    ? 'text-rose-400 scale-110'
                    : 'text-foreground/20 hover:text-foreground/40'
                }`}
                aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={16}
                  className={liked ? 'fill-rose-400' : ''}
                />
              </button>
              <ChevronDown
                size={16}
                className={`text-foreground/30 transition-transform duration-300 ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

// ─── CATEGORY SECTION ────────────────────────────────────────────────

function CategorySection({ category, isActive }) {
  const accent = accentMap[category.accent] || accentMap.rose

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* Category header */}
          <div className="flex items-center gap-2 mb-4 md:mb-5">
            <div className={`flex items-center justify-center size-8 rounded-lg ${accent.bg}`}>
              <span className="text-lg">{category.emoji}</span>
            </div>
            <div>
              <h2 className="font-serif text-lg md:text-xl font-medium text-foreground">
                {category.name}
              </h2>
              {category.subtitle && (
                <p className="text-xs text-foreground/50 font-work">{category.subtitle}</p>
              )}
            </div>
          </div>

          {/* Items list */}
          <div className="space-y-2.5 md:space-y-3">
            {category.items.map((item, i) => (
              <ItemCard
                key={item.name}
                item={item}
                index={i}
                accentKey={category.accent}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── SEARCH BAR ──────────────────────────────────────────────────────

function SearchBar({ query, onChange, totalItems, filteredCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="relative mb-4 md:mb-5"
    >
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search menu items..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-foreground/10 bg-white/60 backdrop-blur-sm text-sm font-work text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all"
        />
        {query && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-foreground/30 hover:text-foreground/60 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {query && (
        <p className="mt-1.5 text-xs text-foreground/40 font-work text-center">
          {filteredCount} of {totalItems} items match
        </p>
      )}
    </motion.div>
  )
}

// ─── SEARCH RESULTS ──────────────────────────────────────────────────

function SearchResults({ results, query }) {
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <span className="text-4xl block mb-3">🔍</span>
        <p className="font-serif text-lg text-foreground/60">
          No items found for &ldquo;{query}&rdquo;
        </p>
        <p className="text-sm text-foreground/40 font-work mt-1">
          Try searching for a different flavor or category
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2.5"
    >
      <p className="text-xs text-foreground/40 font-work mb-3">
        Found {results.length} item{results.length > 1 ? 's' : ''}
      </p>
      {results.map((item, i) => (
        <motion.div
          key={`${item.categoryId}-${item.name}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="rounded-xl border border-foreground/10 bg-white/80 backdrop-blur-sm p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm leading-none">{item.emoji}</span>
                <h3 className="font-serif text-base font-medium text-foreground">
                  {item.name}
                </h3>
                <span className="text-[10px] font-work text-foreground/40 uppercase tracking-wider">
                  {item.categoryName}
                </span>
              </div>
              <p className="mt-1 text-xs text-foreground/60 leading-relaxed">{item.desc}</p>
              <p className="mt-1.5 font-work text-sm font-semibold text-foreground">
                {item.price}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ─── STATS BAR ───────────────────────────────────────────────────────

function StatsBar({ categories, activeId }) {
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="flex items-center justify-center gap-6 md:gap-10 mb-5 md:mb-6"
    >
      <div className="text-center">
        <p className="font-display text-lg md:text-xl text-foreground">{totalItems}</p>
        <p className="text-[10px] font-work text-foreground/40 uppercase tracking-wider">Items</p>
      </div>
      <div className="text-center">
        <p className="font-display text-lg md:text-xl text-foreground">{categories.length}</p>
        <p className="text-[10px] font-work text-foreground/40 uppercase tracking-wider">
          Categories
        </p>
      </div>
      <div className="text-center">
        <p className="font-display text-lg md:text-xl text-foreground">
          ₹{Math.min(...categories.flatMap((c) => c.items.map((i) => parseInt(i.price.replace(/[^\d]/g, '')))))}
        </p>
        <p className="text-[10px] font-work text-foreground/40 uppercase tracking-wider">
          Starting from
        </p>
      </div>
    </motion.div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────

export default function MenuInteractive({
  categories: propCategories,
  header: propHeader,
}) {
  const categories = propCategories || FALLBACK_CATEGORIES
  const header = propHeader || FALLBACK_HEADER

  const [activeId, setActiveId] = useState(categories[0]?.id)
  const [searchQuery, setSearchQuery] = useState('')

  const activeCategory = categories.find((c) => c.id === activeId)

  // Flatten search results across all categories
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null

    const q = searchQuery.toLowerCase().trim()
    const results = []

    for (const cat of categories) {
      for (const item of cat.items) {
        if (
          item.name.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          (item.highlight && item.highlight.toLowerCase().includes(q))
        ) {
          results.push({
            ...item,
            categoryId: cat.id,
            categoryName: cat.name,
            emoji: cat.emoji,
          })
        }
      }
    }

    return results
  }, [searchQuery, categories])

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const filteredCount = searchResults ? searchResults.length : totalItems

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <MenuHeader header={header} />

      {/* Stats */}
      <StatsBar categories={categories} activeId={activeId} />

      {/* Search */}
      <SearchBar
        query={searchQuery}
        onChange={setSearchQuery}
        totalItems={totalItems}
        filteredCount={filteredCount}
      />

      {/* Search Results Overlay */}
      {searchQuery.trim() ? (
        <SearchResults results={searchResults || []} query={searchQuery} />
      ) : (
        <>
          {/* Category Tabs */}
          <div className="mb-5">
            <CategoryTabs
              categories={categories}
              activeId={activeId}
              onSelect={setActiveId}
            />
          </div>

          {/* Active Category Content */}
          {activeCategory && (
            <div className="pb-8">
              <CategorySection category={activeCategory} isActive={true} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
