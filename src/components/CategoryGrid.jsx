import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useOrderContext } from '@/components/Layout'

const categories = [
  {
    name: 'AMAZING CAKES',
    desc: "Shillong's best cakes — freshly baked, expertly decorated",
    cta: 'SHOP CAKES',
    href: '/cakes',
    isRoute: true,
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
  },
  {
    name: 'PERFECT CUPCAKES',
    desc: "Cupcake perfection from Shillong's finest bakery",
    cta: 'SHOP CUPCAKES',
    href: '/cupcakes',
    isRoute: true,
    image:
      'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&q=80',
  },
  {
    name: 'DECADENT DESSERTS',
    desc: 'Cookies, brownies, cheesecakes & more sweet treats',
    cta: 'SHOP DESSERTS',
    href: '/desserts',
    isRoute: true,
    image:
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
  },
  {
    name: 'CUSTOM ORDERS',
    desc: 'Design your dream cake for any celebration',
    cta: 'ORDER NOW',
    href: '#order',
    isRoute: false,
    image:
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&q=80',
  },
  {
    name: 'CAFE EXPERIENCE',
    desc: 'Visit our Jaiaw cafe for a cozy treat',
    cta: 'FIND US',
    href: '/contact',
    isRoute: true,
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  },
]

export default function CategoryGrid() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const navigate = useNavigate()
  const { onOrder } = useOrderContext()

  const isExpanded = (i) => i === hoveredIndex || i === activeIndex

  return (
    <section className="bg-background">
      <div className="flex h-[320px] flex-row md:h-[420px]">
        {categories.map((cat, index) => {
          const expanded = isExpanded(index)

          return (
            <motion.a
              key={cat.name}
              href={cat.href.startsWith('/') ? undefined : cat.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                if (cat.name === 'CUSTOM ORDERS') {
                  e.preventDefault()
                  if (onOrder) onOrder()
                  return
                }
                if (window.innerWidth < 768) {
                  e.preventDefault()
                  if (activeIndex === index) {
                    if (cat.href.startsWith('/')) navigate(cat.href)
                  } else {
                    setActiveIndex(index)
                  }
                  return
                }
                if (cat.href.startsWith('/')) {
                  e.preventDefault()
                  navigate(cat.href)
                }
              }}
              animate={{ flex: expanded ? 3 : 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative block cursor-pointer overflow-hidden active:scale-[0.97]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 transition-opacity duration-300" />

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                  />
                )}
              </AnimatePresence>

              <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-6">
                <span
                  className={`font-work font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 ${
                    expanded
                      ? 'translate-y-0 text-[11px] md:text-sm'
                      : 'mb-8 self-center text-[11px] [writing-mode:vertical-rl] [text-orientation:mixed] md:text-xs'
                  }`}
                >
                  {cat.name}
                </span>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <p className="max-w-[90%] text-xs leading-relaxed text-white/80 md:text-xs md:mb-3">
                        {cat.desc}
                      </p>
                      <span className="inline-block border-b-2 border-white/60 pb-0.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-white">
                        {cat.cta}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.a>
          )
        })}
      </div>
    </section>
  )
}
