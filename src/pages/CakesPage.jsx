import { useState } from 'react'
import { motion } from 'framer-motion'
import CategoryHero from '@/components/CategoryHero'
import ProductGrid from '@/components/ProductGrid'
import { cakes } from '@/data/products'

const CATEGORIES = ['ALL', 'BIRTHDAY', 'CELEBRATION', 'SHEET', 'BESPOKE', 'CLASSIC', 'VINTAGE', 'KIDS', 'CORPORATE']

const HERO = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80'

export default function CakesPage() {
  const [activeCategory, setActiveCategory] = useState('ALL')

  const filteredCakes = activeCategory === 'ALL'
    ? cakes
    : cakes.filter((c) => c.name.includes(activeCategory))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      <CategoryHero
        title="CAKES"
        subtitle="Amazing cakes for any occasion. Freshly baked, expertly decorated and hand delivered in Shillong."
        image={HERO}
        count={cakes.length}
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
            CAKE DELIVERY IN SHILLONG
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">Hand Delivery</h3>
              <p className="text-[13px] text-muted-foreground">Safe, contact-free delivery anywhere in Shillong. Order by 2PM for same-day.</p>
            </div>
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">Collection</h3>
              <p className="text-[13px] text-muted-foreground">Pick up from our Jaiaw cafe — open Mon–Sat 9AM–8PM, Sun 10AM–6PM.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
