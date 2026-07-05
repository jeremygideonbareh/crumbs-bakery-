import { motion } from 'framer-motion'

// Pexels curated cinematic food photography
const PEXELS = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400&q=80&fit=crop`

const bakes = [
  {
    label: 'CAKES',
    image: PEXELS(140831),
  },
  {
    label: 'CUPCAKES',
    image: PEXELS(14105),
  },
  {
    label: 'COOKIES',
    image: PEXELS(37353913),
  },
  {
    label: 'BROWNIES',
    image: PEXELS(2067396),
  },
  {
    label: 'CORPORATE',
    image: PEXELS(1793037),
  },
]

export default function BrowseByBake() {
  return (
    <section className="bg-primary px-4 py-8 md:py-18">
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
