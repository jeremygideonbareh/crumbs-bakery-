import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import CategoryHero from '@/components/CategoryHero'
import ProductGrid from '@/components/ProductGrid'
import usePageSection from '@/hooks/usePageSection'
import { supabase } from '@/lib/supabase'
import { cakes as fallbackProducts } from '@/data/products'

const CATEGORIES = ['ALL', 'BIRTHDAY', 'CELEBRATION', 'SHEET', 'BESPOKE', 'CLASSIC', 'VINTAGE', 'KIDS', 'CORPORATE']

const LOCAL = (name) => `${import.meta.env.BASE_URL}images/${encodeURIComponent(name)}`
const FALLBACK_HERO = LOCAL('bespoke-cake.jpeg')

function normalizeProducts(productsData, fallback) {
  if (!Array.isArray(productsData) || productsData.length === 0) return fallback
  return productsData.map((p, i) => ({
    id: p.id || `p-${i}`,
    name: p.name || '',
    price: p.price || '',
    image: p.image || '',
    desc: p.desc || p.description || '',
    badge: p.badge || '',
    variants: typeof p.variants === 'string'
      ? p.variants.split(',').map(v => v.trim()).filter(Boolean)
      : (Array.isArray(p.variants) ? p.variants : []),
  }))
}

export default function CakesPage() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [dbProducts, setDbProducts] = useState(null)
  const { data: rawProductData } = usePageSection('cakes_product_grid', fallbackProducts)
  const { data: heroData } = usePageSection('cakes_hero', {
    title: 'CAKES',
    subtitle: 'Amazing cakes for any occasion. Freshly baked, expertly decorated and hand delivered in Shillong.',
    image: FALLBACK_HERO,
  })
  const { data: deliveryData } = usePageSection('cakes_delivery', {
    heading: 'CAKE DELIVERY IN SHILLONG',
    card1_heading: 'Hand Delivery',
    card1_desc: 'Safe, contact-free delivery anywhere in Shillong. Order by 2PM for same-day.',
    card2_heading: 'Collection',
    card2_desc: 'Pick up from our Jaiaw cafe — open Mon–Sat 9AM–8PM, Sun 10AM–6PM.',
  })

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('category_slug', 'cakes')
      .eq('active', true)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setDbProducts(data)
        }
      })
      .catch(() => {/* use fallback */})
  }, [])

  const products = useMemo(() => {
    const source = dbProducts || rawProductData || fallbackProducts
    return normalizeProducts(source, fallbackProducts)
  }, [dbProducts, rawProductData])

  const filteredCakes = activeCategory === 'ALL'
    ? products
    : products.filter((c) => c.name.includes(activeCategory))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      <CategoryHero
        title={heroData?.title}
        subtitle={heroData?.subtitle}
        image={heroData?.image}
        count={products.length}
      />

      <section className="py-6 md:py-10 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 pb-4 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] px-3 py-2 rounded-sm transition-all active:scale-[0.97] ${
                  activeCategory === cat
                    ? 'bg-header text-white'
                    : 'text-foreground/60 border border-foreground/20 hover:border-foreground/40'
                }`}
              >
                {cat === 'ALL' ? 'ALL CAKES' : `${cat} CAKES`}
              </button>
            ))}
          </div>

          <ProductGrid products={filteredCakes} />
        </div>
      </section>

      <section className="bg-primary py-8 md:py-14 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-6 md:mb-8 tracking-tight">
            {deliveryData?.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">{deliveryData?.card1_heading}</h3>
              <p className="text-[13px] text-muted-foreground">{deliveryData?.card1_desc}</p>
            </div>
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">{deliveryData?.card2_heading}</h3>
              <p className="text-[13px] text-muted-foreground">{deliveryData?.card2_desc}</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
