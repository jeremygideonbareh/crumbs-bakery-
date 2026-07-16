import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { getImageUrl } from '@/lib/image'
import { MENUS_DEFAULTS } from '@/data/contentDefaults'

function Lightbox({ images, index, onClose }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: index, loop: true })
  const [selectedIndex, setSelectedIndex] = useState(index)

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (emblaApi) emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const current = images[selectedIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close lightbox"
      >
        <X size={22} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); scrollPrev() }}
        className="absolute left-2 md:left-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); scrollNext() }}
        className="absolute right-2 md:right-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight size={22} />
      </button>

      <div className="w-full max-w-4xl mx-auto px-4" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 flex items-center justify-center">
                <div className="w-full flex items-center justify-center" style={{ touchAction: 'pinch-zoom' }}>
                  <img
                    src={img.image || img}
                    alt={img.label || `Menu ${i + 1}`}
                    className="max-h-[85vh] w-auto max-w-full object-contain rounded-sm shadow-2xl"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`size-2 rounded-full transition-all ${
                i === selectedIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to menu ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-3">
          <a
            href={current?.image || current}
            download
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/20 transition-colors min-h-[44px]"
          >
            <Download size={16} />
            Download {current?.label || 'Menu'}
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function MenusGallery({ data }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const items = data || MENUS_DEFAULTS

  if (items.length === 0) return null

  return (
    <section className="bg-background py-8 md:py-16 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-6 md:mb-10">
          <span className="font-work text-[11px] md:text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Our Menus
          </span>
          <h2 className="font-serif text-xl sm:text-2xl md:text-4xl font-medium leading-[1.2] text-foreground mt-2">
            Browse our menu boards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-primary/5 border border-primary/10 hover:border-primary/20 transition-all text-left"
            >
              <img
                src={getImageUrl(item.image || item)}
                alt={item.label || `Menu ${i + 1}`}
                className="size-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {item.label && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-10">
                  <span className="text-white text-xs md:text-sm font-work font-bold uppercase tracking-[0.1em]">
                    {item.label}
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={items}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
