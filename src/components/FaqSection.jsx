import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { FAQ_DEFAULTS } from '@/data/contentDefaults'

export default function FaqSection({ data: propData }) {
  const faqItems = propData || FAQ_DEFAULTS
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className="bg-announcement px-4 py-8 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center font-display text-3xl font-bold tracking-wider text-foreground md:mb-12 md:text-4xl lg:text-[44px]"
        >
          WHAT MAKES CRUMBS SPECIAL?
        </motion.h2>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={item.title || i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-3 md:gap-5 border border-border bg-white p-3.5 md:p-4 text-left transition-all hover:border-primary/30 min-h-[56px] md:min-h-0 active:scale-[0.97]"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full md:h-14 md:w-14">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <span className="flex-1 font-work text-[13px] md:text-sm font-bold uppercase tracking-[0.05em] text-foreground leading-snug">
                  {item.title}
                </span>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-x border-b border-border bg-white px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground md:px-5 md:pb-5">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
