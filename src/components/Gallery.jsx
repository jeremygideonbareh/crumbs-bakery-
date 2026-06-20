import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1770158981584-2cfc14d75609?w=800&q=80',
    alt: 'Assortment of cakes and pastries on a platter',
    caption: 'Artisanal Cakes',
  },
  {
    src: 'https://images.unsplash.com/photo-1769615020962-1e5e2f6ec361?w=800&q=80',
    alt: 'Fresh pastries displayed in a bakery case',
    caption: 'Fresh Pastries',
  },
  {
    src: 'https://images.unsplash.com/photo-1775210603506-201ed7bec326?w=800&q=80',
    alt: 'Cakes and macarons in a display case',
    caption: 'Cakes & Macarons',
  },
  {
    src: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
    alt: 'Tiramisu dessert',
    caption: 'Signature Tiramisu',
  },
  {
    src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    alt: 'Cream puffs and eclairs',
    caption: 'Cream Puffs',
  },
  {
    src: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80',
    alt: 'Cheesecake with berries',
    caption: 'Cheesecakes',
  },
]

export default function Gallery() {
  const [selected, setSelected] = useState(null)

  const currentIndex = selected !== null ? images.findIndex((img) => img.src === selected.src) : -1

  const goNext = () => {
    const next = (currentIndex + 1) % images.length
    setSelected(images[next])
  }

  const goPrev = () => {
    const prev = (currentIndex - 1 + images.length) % images.length
    setSelected(images[prev])
  }

  return (
    <section id="gallery" className="relative py-28 md:py-36 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.2em] uppercase font-medium mb-4">
            Our Gallery
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] text-foreground">
            A taste of what we <span className="text-primary italic">bake</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Every creation is a work of art — made fresh, with love, in our Shillong bakery.
          </p>
        </motion.div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <motion.button
              key={img.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setSelected(img)}
              className="group relative w-full overflow-hidden rounded-xl break-inside-avoid block text-left"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
                {img.caption}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(null) }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>

            <motion.img
              key={selected.src}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={selected.src}
              alt={selected.alt}
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-4 py-2 rounded-full">
              {selected.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
