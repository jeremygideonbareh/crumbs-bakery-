import { motion } from 'framer-motion'
import { SectionEyebrow, SectionHeading, WordReveal } from './RevealText'

const values = [
  {
    title: 'Handcrafted Daily',
    desc: 'Every item is made from scratch each morning using traditional techniques and the finest ingredients.',
    icon: '🥖',
  },
  {
    title: 'Quality First',
    desc: 'We never compromise on taste. Our 4.8 rating reflects our commitment to excellence in every bite.',
    icon: '⭐',
  },
  {
    title: 'Community Rooted',
    desc: 'Proudly serving Shillong from our Jaiaw location — we believe in building connections over good food.',
    icon: '🤝',
  },
]

const patternSVG = encodeURIComponent(`
<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <circle cx="10" cy="10" r="1.5" fill="#e8a0b4" opacity="0.15"/>
  <circle cx="50" cy="30" r="1" fill="#e8a0b4" opacity="0.12"/>
  <circle cx="30" cy="50" r="1.5" fill="#e8a0b4" opacity="0.1"/>
  <circle cx="40" cy="10" r="0.8" fill="#e8a0b4" opacity="0.12"/>
  <circle cx="20" cy="40" r="1" fill="#e8a0b4" opacity="0.08"/>
  <path d="M0 30 Q15 25 30 30 Q45 35 60 30" stroke="#e8a0b4" stroke-width="0.5" fill="none" opacity="0.08"/>
  <path d="M0 50 Q15 45 30 50 Q45 55 60 50" stroke="#e8a0b4" stroke-width="0.5" fill="none" opacity="0.06"/>
</svg>
`)

export default function About() {
  return (
    <section id="about" className="relative py-20 md:py-28 lg:py-36 px-4 md:px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-[#FFF5F0]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${patternSVG}")`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F0] via-transparent to-[#FFF5F0] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F0]/80 via-transparent to-[#FFF5F0]/80 pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <SectionEyebrow>About Us</SectionEyebrow>
            <SectionHeading className="text-lg sm:text-xl md:text-4xl lg:text-5xl whitespace-nowrap">
              A little bakery with big flavours
            </SectionHeading>
            <div className="mt-6 md:mt-8 space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
              <p>
                <WordReveal delay={0.2}>
                  Nestled in the quiet lanes of Jaiaw, Shillong, Crumbs Bakery & Cafe was born from a simple belief — that great baked goods have the power to turn an ordinary day into something special.
                </WordReveal>
              </p>
              <p>
                <WordReveal delay={0.4}>
                  From our signature tiramisu that customers travel across town for, to cream puffs that melt in your mouth, every recipe has been developed and refined with care. We source the finest ingredients, bake in small batches, and serve everything with a smile.
                </WordReveal>
              </p>
              <p>
                <WordReveal delay={0.6}>
                  Whether you're stopping by for a quick coffee and cookie, ordering a custom cake for a celebration, or settling in for an afternoon treat — you're family here.
                </WordReveal>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group rounded-xl border border-primary/20 bg-white/90 backdrop-blur-sm p-5 md:p-6 hover:border-primary/40 hover:bg-white transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span className="text-xl shrink-0 mt-0.5">{v.icon}</span>
                  <div>
                    <h3 className="font-medium text-foreground text-base md:text-lg">{v.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
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
