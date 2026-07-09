import { motion } from 'framer-motion'
import { ABOUT_DEFAULTS } from '@/data/contentDefaults'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function About({ data: propData }) {
  const columns = propData || ABOUT_DEFAULTS

  return (
    <section id="about" className="py-8 md:py-20 px-4 md:px-6 bg-background scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid md:grid-cols-3 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {columns.map((col) => (
            <motion.div
              key={col.heading}
              variants={cardVariants}
              className="flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-5">
                <img
                  src={col.image}
                  alt={col.heading}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="font-display text-xl md:text-2xl tracking-wider text-foreground mb-3">
                {col.heading}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5 flex-1">
                {col.body}
              </p>
              <a
                href={col.href || '#'}
                className="inline-block py-3 text-sm uppercase tracking-[0.15em] font-bold text-foreground underline underline-offset-4 decoration-2 decoration-secondary/50 hover:decoration-secondary transition-all"
              >
                {col.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
