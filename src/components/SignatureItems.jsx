import { motion } from 'framer-motion'
import { SectionEyebrow, SectionHeading, CharReveal } from './RevealText'

const items = [
  {
    name: 'Tiramisu',
    desc: 'Our signature — bittersweet coffee-soaked layers with silky mascarpone cream. The best in Shillong, hands down.',
    highlight: 'Customer Favorite',
    price: '₹250',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Cream Puffs',
    desc: 'Light, airy choux pastry filled with velvety vanilla cream. Perfectly portioned for a quick indulgence.',
    highlight: 'Best Seller',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80',
    badge: 'bg-green-100 text-green-700',
  },
  {
    name: 'Cheesecake',
    desc: 'New York-style baked cheesecake with a buttery graham crust. Available in multiple rotating flavours.',
    highlight: 'Must Try',
    price: '₹350',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Cookies',
    desc: 'Chewy, gooey, and loaded with chocolate chunks. Made with real butter and love in every batch.',
    highlight: 'Perfect Pair',
    price: '₹120',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'Hot Snacks',
    desc: 'From savoury puffs to warm sandwiches — everything served hot, fresh, and satisfying.',
    highlight: 'Quick Bite',
    price: '₹150',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80',
    badge: 'bg-green-100 text-green-700',
  },
  {
    name: 'Custom Cakes',
    desc: 'Birthday, anniversary, or just because. Order a custom-designed cake for your special occasion.',
    highlight: 'Celebrate',
    price: '₹500+',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    badge: 'bg-rose-100 text-rose-700',
  },
]

export default function SignatureItems() {
  return (
    <section id="menu" className="relative py-8 md:py-28 lg:py-36 px-4 md:px-6 scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent" />

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-10 md:mb-16"
        >
          <SectionEyebrow>Our Menu</SectionEyebrow>
          <h2 className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.2] text-balance text-foreground break-words">
            <CharReveal>Signature </CharReveal>
            <span className="text-foreground italic"><CharReveal delay={0.3}>bakes</CharReveal></span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Every item crafted with care, using traditional recipes and the freshest ingredients.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-xl border border-secondary/10 bg-white overflow-hidden hover:border-secondary/30 hover:shadow-lg transition-all"
            >
              <div className="relative h-36 md:h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <span className={`absolute top-2.5 right-2.5 text-[11px] font-medium uppercase tracking-wider px-2 py-1 rounded-full shadow-sm ${item.badge}`}>
                  {item.highlight}
                </span>
                <span className="absolute bottom-2.5 left-2.5 text-white font-serif text-base md:text-lg font-medium drop-shadow-sm">
                  {item.price}
                </span>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-serif text-lg md:text-xl text-foreground mb-1.5">{item.name}</h3>
                <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 md:mt-12 text-center"
        >
          <p className="text-xs md:text-sm text-muted-foreground">
            Price range: ₹200–₹400 · Dine-in · Takeaway · Delivery
          </p>
        </motion.div>
      </div>
    </section>
  )
}
