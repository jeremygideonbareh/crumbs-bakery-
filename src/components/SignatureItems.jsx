import { motion } from 'framer-motion'
import { Coffee, Cake, Cookie, Gift, Croissant, UtensilsCrossed } from 'lucide-react'

const items = [
  {
    name: 'Tiramisu',
    desc: 'Our signature — bittersweet coffee-soaked layers with silky mascarpone cream. The best in Shillong, hands down.',
    icon: Coffee,
    highlight: 'Customer Favorite',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Cream Puffs',
    desc: 'Light, airy choux pastry filled with velvety vanilla cream. Perfectly portioned for a quick indulgence.',
    icon: Croissant,
    highlight: 'Best Seller',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    name: 'Cheesecake',
    desc: 'New York-style baked cheesecake with a buttery graham crust. Available in multiple rotating flavours.',
    icon: Cake,
    highlight: 'Must Try',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Cookies',
    desc: 'Chewy, gooey, and loaded with chocolate chunks. Made with real butter and love in every batch.',
    icon: Cookie,
    highlight: 'Perfect Pair',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'Hot Snacks',
    desc: 'From savoury puffs to warm sandwiches — everything served hot, fresh, and satisfying.',
    icon: UtensilsCrossed,
    highlight: 'Quick Bite',
    color: 'bg-green-100 text-green-700',
  },
  {
    name: 'Custom Cakes',
    desc: 'Birthday, anniversary, or just because. Order a custom-designed cake for your special occasion.',
    icon: Gift,
    highlight: 'Celebrate',
    color: 'bg-rose-100 text-rose-700',
  },
]

export default function SignatureItems() {
  return (
    <section id="menu" className="relative py-28 md:py-36 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.2em] uppercase font-medium mb-4">
            Our Menu
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] text-foreground">
            Signature <span className="text-primary italic">bakes</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Every item crafted with care, using traditional recipes and the freshest ingredients.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-xl border border-primary/10 bg-white p-6 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-medium text-primary uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10">
                    {item.highlight}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Price range: ₹200–400 · Dine-in · Takeaway · Delivery
          </p>
        </motion.div>
      </div>
    </section>
  )
}
