import { motion } from 'framer-motion'

const items = Array.from({ length: 10 }, (_, i) => ({
  label: 'SHEET CAKES',
  image: [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80',
    'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=200&q=80',
    'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=200&q=80',
  ][i % 3],
}))

export default function SheetCakesMarquee() {
  return (
    <section className="overflow-hidden bg-header py-4">
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
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-white md:text-base">
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
