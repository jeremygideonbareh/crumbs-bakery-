import { motion } from 'framer-motion'
import CategoryHero from '@/components/CategoryHero'
import ProductGrid from '@/components/ProductGrid'
import { brownies } from '@/data/products'

const HERO = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200&q=80'

export default function BrowniesPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      <CategoryHero
        title="BROWNIES"
        subtitle="Rich, indulgent brownies baked fresh in small batches. Fudgy, chocolatey, and absolutely irresistible."
        image={HERO}
        count={brownies.length}
      />

      <section className="py-6 md:py-10 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm text-muted-foreground font-work mb-6 md:mb-8 max-w-2xl mx-auto">
            Every brownie starts with the finest Belgian chocolate and real butter. Baked to perfection — crisp top, fudgy centre, unforgettable taste.
          </p>
          <ProductGrid products={brownies} />
        </div>
      </section>

      <section className="bg-primary py-8 md:py-14 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-6 md:mb-8 tracking-tight">
            BROWNIE DELIVERY
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">Shillong Delivery</h3>
              <p className="text-[13px] text-muted-foreground">Fresh brownies delivered to your home or office in Shillong.</p>
            </div>
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">Cafe Pickup</h3>
              <p className="text-[13px] text-muted-foreground">Visit our Jaiaw cafe for fresh brownies daily — and maybe a coffee too!</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
