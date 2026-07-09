import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useOrderContext } from './Layout'
import { PRODUCT_CAROUSEL_DEFAULTS } from '@/data/contentDefaults'

export default function ProductCarousel({ data: propData }) {
  const products = propData || PRODUCT_CAROUSEL_DEFAULTS
  const carouselRef = useRef(null)
  const { onOrder } = useOrderContext()

  return (
    <section className="py-8 md:py-18 px-4 bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium"
            >
              Featured Bakes
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground mt-1 tracking-tight"
            >
              OUR COLLECTION
            </motion.h2>
          </div>

          {/* Scroll hint - visible on desktop */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block font-work text-[11px] uppercase tracking-[0.15em] text-muted-foreground shrink-0"
          >
            &larr; Drag to scroll &rarr;
          </motion.p>
        </div>

        {/* Carousel - native scroll on mobile, Framer drag on desktop */}
        <div
          ref={carouselRef}
          className="flex gap-3 md:gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product, i) => (
            <motion.div
              key={product.name || i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="min-w-[180px] md:min-w-[260px] w-[180px] md:w-[260px] shrink-0 group snap-start"
            >
              <div className="relative aspect-square overflow-hidden bg-primary/5 rounded-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="mt-2.5 md:mt-3 px-0.5">
                <h3 className="font-work text-sm md:text-sm font-semibold text-foreground leading-tight mb-0.5 md:mb-1">
                  {product.name}
                </h3>
                <p className="font-work text-sm md:text-base font-bold text-foreground mb-2 md:mb-3">
                  {product.price}
                </p>
                <button onClick={onOrder} className="w-full font-work text-xs uppercase tracking-[0.15em] text-foreground border border-foreground/20 hover:bg-primary hover:text-foreground hover:border-primary px-4 py-3 md:py-2.5 transition-all duration-200 rounded-sm min-h-[44px] md:min-h-0 active:scale-[0.97]">
                  Add to Order
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:hidden text-center font-work text-xs uppercase tracking-[0.15em] text-muted-foreground mt-4"
        >
          Swipe to browse more &rarr;
        </motion.p>
      </div>
    </section>
  )
}
