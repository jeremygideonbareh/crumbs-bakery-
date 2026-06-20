import { motion } from 'framer-motion'

const values = [
  {
    title: 'Handcrafted Daily',
    desc: 'Every item is made from scratch each morning using traditional techniques and the finest ingredients.',
  },
  {
    title: 'Quality First',
    desc: 'We never compromise on taste. Our 4.8 rating reflects our commitment to excellence in every bite.',
  },
  {
    title: 'Community Rooted',
    desc: 'Proudly serving Shillong from our Jaiaw location — we believe in building connections over good food.',
  },
]

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-36 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase font-medium mb-4">
              About Us
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] text-foreground">
              A little bakery
              <br />
              <span className="text-primary italic">with big flavors</span>
            </h2>
            <div className="mt-8 space-y-4 text-muted-foreground text-base leading-relaxed">
              <p>
                Nestled in the quiet lanes of Jaiaw, Shillong, Crumbs Bakery & Cafe was born from a simple belief —
                that great baked goods have the power to turn an ordinary day into something special.
              </p>
              <p>
                From our signature tiramisu that customers travel across town for, to cream puffs that melt in your
                mouth, every recipe has been developed and refined with care. We source the finest ingredients,
                bake in small batches, and serve everything with a smile.
              </p>
              <p>
                Whether you're stopping by for a quick coffee and cookie, ordering a custom cake for a celebration,
                or settling in for an afternoon treat — you're family here.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-xl border border-primary/20 bg-white p-6 hover:border-primary/40 transition-colors shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary font-serif text-sm tabular-nums shrink-0">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-medium text-foreground text-lg">{v.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
