import { motion } from 'framer-motion'
import CategoryHero from '@/components/CategoryHero'
import ProductGrid from '@/components/ProductGrid'
import { desserts } from '@/data/products'

const HERO = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=80'

export default function DessertsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      <CategoryHero
        title="DESSERTS"
        subtitle="From gooey cookies and fudgy brownies to cheesecakes, tiramisu, and more — every craving covered."
        image={HERO}
        count={desserts.length}
      />

      <section className="py-6 md:py-10 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm text-muted-foreground font-work mb-6 md:mb-8 max-w-2xl mx-auto">
            All our desserts are baked &amp; prepared by hand in small batches using the finest ingredients — Lescure Butter, free-range eggs, Belgian chocolate, and real vanilla.
          </p>
          <ProductGrid products={desserts} />
        </div>
      </section>

      <section className="bg-primary py-8 md:py-14 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-6 md:mb-8 tracking-tight">
            DESSERT DELIVERY IN SHILLONG
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">Hand Delivery</h3>
              <p className="text-[13px] text-muted-foreground">Fresh desserts delivered to your door anywhere in Shillong.</p>
            </div>
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">Cafe Pickup</h3>
              <p className="text-[13px] text-muted-foreground">Order online and collect from our Jaiaw cafe at your convenience.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
