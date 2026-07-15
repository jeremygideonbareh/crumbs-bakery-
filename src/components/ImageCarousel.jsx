import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IMAGE_CAROUSEL_DEFAULTS } from '@/data/contentDefaults'

export default function ImageCarousel({ data: propData }) {
  const slides = propData || IMAGE_CAROUSEL_DEFAULTS
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

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

        <div className="relative group">
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, i) => (
                <div key={i} className="relative min-w-0 flex-[0_0_100%] aspect-[16/9] md:aspect-[21/9]">
                  <img
                    src={slide.image}
                    alt={slide.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 md:top-6 left-4 md:left-6">
                    <span className="inline-block bg-white/90 backdrop-blur-sm text-foreground text-xs md:text-sm font-bold uppercase tracking-[0.15em] px-3 py-1.5 md:px-4 md:py-2 rounded-sm">
                      {slide.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-[0.97] z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-[0.97] z-10"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80 w-2'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
