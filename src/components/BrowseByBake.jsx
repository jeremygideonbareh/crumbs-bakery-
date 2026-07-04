import { motion } from 'framer-motion'

const bakes = [
  {
    label: 'CAKES',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  },
  {
    label: 'CUPCAKES',
    image:
      'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&q=80',
  },
  {
    label: 'COOKIES',
    image:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80',
  },
  {
    label: 'BROWNIES',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
  },
  {
    label: 'CORPORATE',
    image:
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80',
  },
]

export default function BrowseByBake() {
  return (
    <section className="bg-ink-marshmallow px-4 py-10 md:py-18">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center font-display text-3xl font-bold tracking-wider text-foreground md:mb-10 md:text-4xl lg:text-[44px]">
          BROWSE BY BAKE
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-muted-foreground md:mb-10 md:text-base">
          From classic cakes to custom creations — find your perfect bake below.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {bakes.map((bake, i) => (
            <motion.a
              key={bake.label}
              href="#menu"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative aspect-square w-[calc(50%-8px)] overflow-hidden sm:w-[calc(33.333%-12px)] md:w-[calc(20%-16px)]"
            >
              <img
                src={bake.image}
                alt={bake.label}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="font-work text-[13px] font-bold uppercase tracking-[0.2em] text-white md:text-sm">
                  {bake.label}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
