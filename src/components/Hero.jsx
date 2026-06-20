import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CharReveal, WordReveal } from './RevealText'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1775210603506-201ed7bec326?w=1920&q=80'

export default function Hero({ onOrder }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.55])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section
      ref={ref}
      className="relative min-h-svh flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: imgY }}
      >
        <img
          src={HERO_IMAGE}
          alt="Assortment of cakes and pastries"
          className="w-full h-[120%] object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-[#FFF5F0] via-[#FFF5F0]/40 to-[#FFF5F0]/15"
        style={{ opacity: overlayOpacity }}
      />

      <motion.div
        className="relative z-10 text-center px-5 md:px-6 max-w-4xl mx-auto w-full"
        style={{ y: contentY }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary text-xs md:text-base tracking-[0.2em] uppercase mb-4 md:mb-6 font-medium"
        >
          Shillong's Best-Kept Secret
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.05] text-balance text-foreground"
          style={{ fontVariationSettings: '"SOFT" 80' }}
        >
          <CharReveal>Where every </CharReveal>
          <br />
          <span className="text-primary italic">
            <CharReveal delay={0.3}>crumb</CharReveal>
          </span>{' '}
          <CharReveal delay={0.5}>tells a story</CharReveal>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-5 md:mt-8 text-muted-foreground text-sm md:text-lg max-w-xl mx-auto leading-relaxed px-2"
        >
          <WordReveal delay={0.7}>
            Handcrafted tiramisu, cream puffs, cheesecakes, and artisanal bakes — made fresh daily in the heart of Shillong.
          </WordReveal>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4"
        >
          <Button onClick={onOrder} size="lg" className="w-full sm:w-auto min-h-11 text-sm">
            Order Custom Cake
          </Button>
          <a href="#menu" className="w-full sm:w-auto">
            <Button variant="neutral" size="lg" className="w-full min-h-11 text-sm">
              Explore Menu
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 md:mt-16 flex items-center justify-center gap-5 md:gap-8 text-sm"
        >
          <div className="text-center">
            <p className="text-xl md:text-2xl font-serif text-primary font-medium">4.8</p>
            <p className="text-[10px] md:text-xs mt-0.5 text-muted-foreground">Rating</p>
          </div>
          <div className="w-px h-8 md:h-10 bg-border" />
          <div className="text-center">
            <p className="text-xl md:text-2xl font-serif text-primary font-medium">9+</p>
            <p className="text-[10px] md:text-xs mt-0.5 text-muted-foreground">Reviews</p>
          </div>
          <div className="w-px h-8 md:h-10 bg-border" />
          <div className="text-center">
            <p className="text-xl md:text-2xl font-serif text-primary font-medium">✨</p>
            <p className="text-[10px] md:text-xs mt-0.5 text-muted-foreground">5★ Rated</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
