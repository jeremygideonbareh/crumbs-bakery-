import { motion } from 'framer-motion'
import { DELIVERY_DEFAULTS } from '@/data/contentDefaults'

export default function DeliverySection({ data: propData }) {
  const d = propData || DELIVERY_DEFAULTS

  return (
    <section className="bg-background px-4 py-8 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-center font-display text-2xl font-bold tracking-wider text-foreground md:text-3xl lg:text-4xl"
        >
          {d.heading}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted-foreground md:mb-10"
        >
          {d.description}
        </motion.p>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {(d.areas || []).map((area, i) => (
            <motion.div
              key={area.name || i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden"
            >
              <img
                src={area.image}
                alt={area.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="px-2 text-center font-work text-[13px] font-bold uppercase tracking-[0.15em] text-white md:text-sm">
                  {area.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            {d.footer_text}
          </p>
          <a
            href={d.cta_href || '#contact'}
            className="inline-block border-2 border-foreground/20 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-foreground transition-all hover:border-primary hover:text-foreground active:scale-[0.97]"
          >
            {d.cta_text}
          </a>
        </div>
      </div>
    </section>
  )
}
