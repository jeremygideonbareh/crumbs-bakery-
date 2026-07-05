import { motion } from 'framer-motion'

const PEXELS = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200&q=80&fit=crop`

const items = Array.from({ length: 10 }, (_, i) => ({
  label: 'SHEET CAKES',
  image: [
    PEXELS(140831),
    PEXELS(2144200),
    PEXELS(1793037),
  ][i % 3],
}))

export default function SheetCakesMarquee() {
  return (
    <section className="overflow-hidden bg-header py-3 md:py-4">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
        className="flex gap-6 whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-6">
            <img
              src={item.image}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-foreground md:text-base">
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
