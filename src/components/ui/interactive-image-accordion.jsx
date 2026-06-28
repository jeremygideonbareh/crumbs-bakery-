import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const galleryItems = [
  {
    id: 1,
    title: 'Artisanal Cakes',
    caption: 'Assortment of cakes and pastries',
    imageUrl:
      'https://images.unsplash.com/photo-1770158981584-2cfc14d75609?w=800&q=80',
  },
  {
    id: 2,
    title: 'Fresh Pastries',
    caption: 'Fresh pastries displayed in a bakery case',
    imageUrl:
      'https://images.unsplash.com/photo-1769615020962-1e5e2f6ec361?w=800&q=80',
  },
  {
    id: 3,
    title: 'Cakes & Macarons',
    caption: 'Cakes and macarons in a display case',
    imageUrl:
      'https://images.unsplash.com/photo-1775210603506-201ed7bec326?w=800&q=80',
  },
  {
    id: 4,
    title: 'Signature Tiramisu',
    caption: 'Our signature tiramisu dessert',
    imageUrl:
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
  },
  {
    id: 5,
    title: 'Cream Puffs',
    caption: 'Light cream puffs and eclairs',
    imageUrl:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
  },
  {
    id: 6,
    title: 'Cheesecakes',
    caption: 'Cheesecake with fresh berries',
    imageUrl:
      'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80',
  },
];

export default function GalleryAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-20 px-4 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="font-work text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            OUR GALLERY
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-2 tracking-tight">
            A taste of what we bake
          </h2>
          <p className="font-work text-sm text-muted-foreground max-w-lg mx-auto mt-3">
            Explore our selection of handcrafted cakes, pastries, and desserts
            made fresh daily.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="flex gap-1.5 md:gap-2 h-[400px] md:h-[500px]">
          {galleryItems.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleToggle(index)}
                className="relative overflow-hidden rounded-sm cursor-pointer group flex-1"
                animate={{
                  flex: isActive ? 4 : 1,
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                {/* Title - always visible, rotated when collapsed */}
                <div className="absolute inset-0 flex items-end p-4 md:p-5">
                  <AnimatePresence>
                    {isActive ? (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="text-left"
                      >
                        <h3 className="font-display text-xl md:text-2xl lg:text-3xl text-white mb-1 leading-tight">
                          {item.title}
                        </h3>
                        <p className="font-work text-xs md:text-sm text-white/80 max-w-xs leading-relaxed">
                          {item.caption}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <span className="block font-display text-white/90 text-base md:text-lg tracking-wide [writing-mode:vertical-lr] text-center mx-auto origin-center rotate-180 md:pb-4">
                          {item.title}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
