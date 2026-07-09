import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IMAGE_CAROUSEL_DEFAULTS } from '@/data/contentDefaults'

export default function ImageCarousel({ data: propData }) {
  const slides = propData || IMAGE_CAROUSEL_DEFAULTS
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i) => {
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
  }, [current])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, paused])

  const variants = {
    enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <section className="bg-background py-8 md:py-18 px-4 md:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-10"
        >
          <span className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Behind the Bakery
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mt-1 tracking-tight">
            OUR CREATIONS
          </h2>
        </motion.div>

        <div
          className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl group"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={current}
              src={slides[current].image}
              alt={slides[current].label}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-[0.97]"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-[0.97]"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={`label-${current}`}
            className="absolute top-4 md:top-6 left-4 md:left-6"
          >
            <span className="inline-block bg-white/90 backdrop-blur-sm text-foreground text-xs md:text-sm font-bold uppercase tracking-[0.15em] px-3 py-1.5 md:px-4 md:py-2 rounded-sm">
              {slides[current].label}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
