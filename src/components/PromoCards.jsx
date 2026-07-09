import { motion } from 'framer-motion'
import { PROMO_CARDS_DEFAULTS } from '@/data/contentDefaults'

export default function PromoCards({ data: propData }) {
  const cards = propData || PROMO_CARDS_DEFAULTS

  return (
    <section className="py-8 md:py-18 px-4 md:px-6 bg-accent">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Join the Community
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mt-1 tracking-tight">
            CRUMBS PERKS
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <motion.a
              key={card.title || i}
              href={card.href || '#'}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative block overflow-hidden aspect-[16/9] md:aspect-[4/3] border border-primary/10 hover:border-primary/30 transition-all"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5">
                <h3 className="text-white font-display text-lg md:text-xl mb-1">
                  {card.title}
                </h3>
                <p className="text-white/80 font-work text-[13px] mb-3 max-w-[90%] leading-relaxed">
                  {card.desc}
                </p>
                <span className="inline-block text-white text-xs uppercase tracking-[0.15em] font-work font-semibold border-b border-white/40 pb-0.5 w-fit group-hover:border-white transition-all">
                  {card.cta}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
