import { motion } from 'framer-motion'
import { SectionEyebrow, CharReveal } from './RevealText'
import { getImageUrl } from '@/lib/image'
import { SIGNATURE_ITEMS_DEFAULTS } from '@/data/contentDefaults'

export default function SignatureItems({ data: propData }) {
  const items = propData || SIGNATURE_ITEMS_DEFAULTS

  return (
    <section id="menu" className="bg-primary py-8 md:py-28 lg:py-36 px-4 md:px-6 scroll-mt-24">

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-10 md:mb-16"
        >
          <SectionEyebrow>Our Menu</SectionEyebrow>
          <h2 className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.2] text-balance text-foreground break-words">
            <CharReveal>Signature </CharReveal>
            <span className="text-foreground italic"><CharReveal delay={0.3}>bakes</CharReveal></span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Every item crafted with care, using traditional recipes and the freshest ingredients.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.name || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-xl border border-secondary/10 bg-white overflow-hidden hover:border-secondary/30 hover:shadow-lg transition-all"
            >
              <div className="relative h-36 md:h-44 overflow-hidden">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <span className={`absolute top-2.5 right-2.5 text-[11px] font-medium uppercase tracking-wider px-2 py-1 rounded-full shadow-sm ${item.badge || 'bg-gray-100 text-gray-700'}`}>
                  {item.highlight}
                </span>
                <span className="absolute bottom-2.5 left-2.5 text-white font-serif text-base md:text-lg font-medium drop-shadow-sm">
                  {item.price}
                </span>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-serif text-lg md:text-xl text-foreground mb-1.5">{item.name}</h3>
                <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 md:mt-12 text-center"
        >
          <p className="text-xs md:text-sm text-muted-foreground">
            Price range: ₹200–₹400 · Dine-in · Takeaway · Delivery
          </p>
        </motion.div>
      </div>
    </section>
  )
}
