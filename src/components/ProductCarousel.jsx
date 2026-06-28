import { useRef } from 'react';
import { motion } from 'framer-motion';

const products = [
  {
    name: 'VINTAGE HEART CAKE',
    price: '₹1,200',
    image:
      'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&q=80',
  },
  {
    name: 'DESIGN YOUR OWN BESPOKE CAKE',
    price: '₹2,500',
    image:
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80',
  },
  {
    name: 'VINTAGE CAKE - SINGLE COLOUR',
    price: '₹1,500',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  },
  {
    name: 'EDIBLE IMAGE PHOTO CAKE',
    price: '₹1,800',
    image:
      'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400&q=80',
  },
  {
    name: 'CLASSIC CHOCOLATE CAKE',
    price: '₹1,000',
    image:
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a01?w=400&q=80',
  },
  {
    name: 'FUNFETTI SPRINKLE CAKE',
    price: '₹1,400',
    image:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80',
  },
  {
    name: 'RASPBERRY RIPPLE CAKE',
    price: '₹1,600',
    image:
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80',
  },
  {
    name: 'BIRTHDAY CAKE',
    price: '₹1,200',
    image:
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80',
  },
  {
    name: 'CHOCOLATE BIRTHDAY CAKE',
    price: '₹1,300',
    image:
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&q=80',
  },
  {
    name: 'CUSTOM CUPCAKES (DOZEN)',
    price: '₹900',
    image:
      'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&q=80',
  },
  {
    name: 'COOKIE BOX (6 PACK)',
    price: '₹600',
    image:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80',
  },
  {
    name: 'BROWNIE BOX (6 PACK)',
    price: '₹700',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
  },
];

export default function ProductCarousel() {
  const carouselRef = useRef(null);

  return (
    <section className="py-14 md:py-18 px-4 bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-work text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium"
            >
              Featured Bakes
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-1 tracking-tight"
            >
              OUR COLLECTION
            </motion.h2>
          </div>

          {/* Scroll hint - visible on desktop */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block font-work text-[11px] uppercase tracking-[0.15em] text-muted-foreground shrink-0"
          >
            &larr; Drag to scroll &rarr;
          </motion.p>
        </div>

        {/* Carousel */}
        <motion.div
          ref={carouselRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing scrollbar-hide"
          drag="x"
          dragConstraints={carouselRef}
          dragElastic={0.1}
          whileTap={{ cursor: 'grabbing' }}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="min-w-[220px] md:min-w-[260px] w-[220px] md:w-[260px] shrink-0 group"
            >
              <div className="relative aspect-square overflow-hidden bg-header/5 rounded-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="mt-3 px-0.5">
                <h3 className="font-work text-xs md:text-sm font-semibold text-foreground leading-tight mb-1">
                  {product.name}
                </h3>
                <p className="font-work text-sm md:text-base font-bold text-header mb-3">
                  {product.price}
                </p>
                <button className="w-full font-work text-[11px] uppercase tracking-[0.15em] text-foreground border border-foreground/20 hover:bg-header hover:text-header-foreground hover:border-header px-4 py-2.5 transition-all duration-200 rounded-sm">
                  Add to Order
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile scroll hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:hidden text-center font-work text-[11px] uppercase tracking-[0.15em] text-muted-foreground mt-4"
        >
          Swipe to browse more &rarr;
        </motion.p>
      </div>
    </section>
  );
}
