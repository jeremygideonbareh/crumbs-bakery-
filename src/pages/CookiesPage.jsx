import { motion } from 'framer-motion'
import CategoryHero from '@/components/CategoryHero'
import ProductGrid from '@/components/ProductGrid'
import { cookies } from '@/data/products'

const HERO = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200&q=80'

export default function CookiesPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      <CategoryHero
        title="COOKIES"
        subtitle="Gooey, chunky New York-style cookies baked fresh daily. Available for pickup or delivery."
        image={HERO}
        count={cookies.length}
      />

      <section className="py-6 md:py-10 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm text-muted-foreground font-work mb-6 md:mb-8 max-w-2xl mx-auto">
            Our New York cookies are legendary — crispy on the edges, soft and gooey in the middle. Made with real butter, Belgian chocolate, and a whole lot of love.
          </p>
          <ProductGrid products={cookies} />
        </div>
      </section>

      <section className="bg-primary py-8 md:py-14 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-6 md:mb-8 tracking-tight">
            COOKIE DELIVERY
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">Shillong Delivery</h3>
              <p className="text-[13px] text-muted-foreground">Hand-delivered anywhere in Shillong. Freshness guaranteed.</p>
            </div>
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">Cafe Pickup</h3>
              <p className="text-[13px] text-muted-foreground">Grab a box (or two) from our Jaiaw cafe — open daily.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
