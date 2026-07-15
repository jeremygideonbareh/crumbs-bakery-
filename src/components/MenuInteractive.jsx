import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  Search,
  MapPin,
  Phone,
  ExternalLink,
  Sparkles,
  ChevronDown,
  X,
  ShoppingCart,
} from 'lucide-react'
import { MENU_CATEGORIES as FALLBACK_CATEGORIES, MENU_HEADER as FALLBACK_HEADER, DELIVERY_INFO } from '@/data/menuData'

const accentMap = {
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
    badge: 'bg-rose-100 text-rose-600',
    light: 'bg-rose-50/50',
  },
}

function Floaties() {
  const icons = ['🌸', '✨', '🧁', '🍰', '💕', '🌺']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
      {icons.map((icon, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl"
          style={{ left: `${10 + (i * 17) % 80}%`, top: `${5 + (i * 23) % 90}%` }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        >
          {icon}
        </motion.span>
      ))}
    </div>
  )
}

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

function SubcategoryChips({ subcategories, activeSub, onSelect }) {
  const scrollRef = useRef(null)
  return (
    <div
      ref={scrollRef}
      className="flex gap-1.5 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <button
        onClick={() => onSelect('All')}
        className={`shrink-0 px-3 py-1.5 rounded-full font-work text-xs font-medium transition-all ${
          activeSub === 'All'
            ? 'bg-foreground text-background shadow-sm'
            : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground/80'
        }`}
      >
        All
      </button>
      {subcategories.map((sub) => (
        <button
          key={sub}
          onClick={() => onSelect(sub)}
          className={`shrink-0 px-3 py-1.5 rounded-full font-work text-xs font-medium transition-all whitespace-nowrap ${
            activeSub === sub
              ? 'bg-foreground text-background shadow-sm'
              : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground/80'
          }`}
        >
          {sub}
        </button>
      ))}
    </div>
  )
}

function SearchBar({ query, onChange, totalItems, filteredCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="relative mb-4"
    >
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none" />
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
      {query && filteredCount < totalItems && (
        <p className="mt-1.5 text-xs text-foreground/40 font-work text-center">
          {filteredCount} of {totalItems} items match
        </p>
      )}
    </motion.div>
  )
}

function OrderPopover({ phone, social, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border border-foreground/10 bg-white shadow-lg p-2"
    >
      <p className="text-[10px] font-work text-foreground/40 uppercase tracking-wider px-2 pb-1">Order via</p>
      <a
        href={`tel:${phone}`}
        className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-work text-foreground/80 hover:bg-foreground/5 transition-colors"
      >
        <Phone size={14} className="text-foreground/40" />
        Call {phone}
      </a>
      <a
        href={`https://instagram.com/${social.replace('@', '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-work text-foreground/80 hover:bg-foreground/5 transition-colors"
      >
        <ExternalLink size={14} className="text-foreground/40" />
        DM on Instagram
      </a>
    </motion.div>
  )
}

function ItemCard({ item, index, phone, social }) {
  const [expanded, setExpanded] = useState(false)
  const [showOrder, setShowOrder] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.4, 0.25, 1] }}
      layout
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
          {/* Subcategory badge + name */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {item.subcategory && (
                <span className="inline-block text-[10px] font-work text-foreground/40 uppercase tracking-wider mb-1">
                  {item.subcategory}
                </span>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base md:text-lg font-medium text-foreground leading-snug">
                  {item.name}
                </h3>
              </div>

              {/* Description */}
              <AnimatePresence>
                {expanded && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="mt-2 text-xs md:text-sm text-foreground/60 leading-relaxed overflow-hidden"
                  >
                    {item.desc}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Price */}
              <p className="mt-2 font-work text-sm md:text-base font-semibold text-foreground">
                {item.price}
              </p>

              {/* Color options */}
              {item.options && expanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex flex-wrap gap-1.5"
                >
                  {item.options.map((opt) => {
                    const colorMap = {
                      Ivory: 'bg-stone-100 border-stone-300',
                      Pink: 'bg-pink-200 border-pink-300',
                      Lilac: 'bg-purple-200 border-purple-300',
                      Green: 'bg-green-200 border-green-300',
                      Peach: 'bg-orange-200 border-orange-300',
                      Yellow: 'bg-yellow-200 border-yellow-300',
                      Blue: 'bg-blue-200 border-blue-300',
                    }
                    const isSelected = selectedOption === opt
                    return (
                      <button
                        key={opt}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedOption(opt === selectedOption ? null : opt)
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-work font-medium border transition-all ${
                          colorMap[opt] || 'bg-foreground/5 border-foreground/10'
                        } ${
                          isSelected
                            ? 'ring-2 ring-foreground/40 scale-105'
                            : 'hover:scale-105'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </motion.div>
              )}

              {/* Expand hint */}
              {!expanded && (
                <p className="mt-1.5 text-[10px] font-work text-foreground/30 flex items-center gap-1">
                  Tap for details
                  <ChevronDown size={10} />
                </p>
              )}
            </div>
          </div>

          {/* Add to Order button */}
          <div className="mt-3 flex items-center justify-end relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowOrder(!showOrder)
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/90 hover:bg-primary text-white text-xs font-work font-medium transition-all active:scale-95"
            >
              <ShoppingCart size={13} />
              Add to Order
            </button>
            <AnimatePresence>
              {showOrder && (
                <OrderPopover
                  phone={phone || FALLBACK_HEADER.phone}
                  social={social || FALLBACK_HEADER.social}
                  onClose={() => setShowOrder(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

function DeliveryInfo() {
  const info = DELIVERY_INFO
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 md:mt-10"
    >
      <div className="rounded-2xl border border-foreground/10 bg-white/60 backdrop-blur-sm p-5 md:p-6">
        <h3 className="font-serif text-lg md:text-xl font-medium text-foreground text-center mb-4">
          {info.title}
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {info.methods.map((method) => (
            <div
              key={method.name}
              className="rounded-xl border border-foreground/5 bg-white/40 p-4 text-center"
            >
              <p className="font-serif text-base font-medium text-foreground mb-1">
                {method.name === 'Hand Delivery' ? '🚚' : '🏪'} {method.name}
              </p>
              <p className="text-xs md:text-sm text-foreground/60 font-work leading-relaxed">
                {method.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function MenuInteractive({
  categories: propCategories,
  header: propHeader,
}) {
  const categories = propCategories || FALLBACK_CATEGORIES
  const header = propHeader || FALLBACK_HEADER
  const category = categories[0]

  const [activeSub, setActiveSub] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = useMemo(() => {
    if (!category) return []
    let items = category.items
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          (item.subcategory && item.subcategory.toLowerCase().includes(q))
      )
    }
    if (activeSub !== 'All') {
      items = items.filter((item) => item.subcategory === activeSub)
    }
    return items
  }, [searchQuery, activeSub, category])

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="font-serif text-lg text-foreground/60">Menu coming soon</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <MenuHeader header={header} />

      {/* Search */}
      <SearchBar
        query={searchQuery}
        onChange={setSearchQuery}
        totalItems={category.items.length}
        filteredCount={filteredItems.length}
      />

      {/* Subcategory filter */}
      {!searchQuery.trim() && category.subcategories && (
        <div className="mb-4">
          <SubcategoryChips
            subcategories={category.subcategories}
            activeSub={activeSub}
            onSelect={setActiveSub}
          />
        </div>
      )}

      {/* Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-3">🔍</span>
          <p className="font-serif text-lg text-foreground/60">
            {searchQuery
              ? `No items found for &ldquo;${searchQuery}&rdquo;`
              : 'No items in this category'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 md:space-y-3 pb-4">
          {filteredItems.map((item, i) => (
            <ItemCard
              key={item.name}
              item={item}
              index={i}
              phone={header.phone}
              social={header.social}
            />
          ))}
        </div>
      )}

      {/* Delivery Info */}
      <DeliveryInfo />
    </div>
  )
}
