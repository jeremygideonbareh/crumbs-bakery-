import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1775210603506-201ed7bec326?w=1920&q=80'

export default function Hero({ onOrder }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.7])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
        className="absolute inset-0 bg-gradient-to-t from-[#FFF5F0] via-[#FFF5F0]/60 to-[#FFF5F0]/30"
        style={{ opacity: overlayOpacity }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F0]/80 via-transparent to-[#FFF5F0]" />

      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ y: contentY }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary text-sm md:text-base tracking-[0.2em] uppercase mb-6 font-medium"
        >
          Shillong's Best-Kept Secret
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] text-balance text-foreground"
        >
          Where every
          <br />
          <span className="text-primary italic">crumb</span> tells a story
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Handcrafted tiramisu, cream puffs, cheesecakes, and artisanal bakes — made fresh daily in the heart of Shillong.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button onClick={onOrder} size="lg">
            Order Custom Cake
          </Button>
          <a href="#menu">
            <Button variant="neutral" size="lg">
              Explore Menu
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm"
        >
          <div className="text-center">
            <p className="text-2xl font-serif text-primary font-medium">4.8</p>
            <p className="text-xs mt-1 text-muted-foreground">Rating</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-serif text-primary font-medium">9+</p>
            <p className="text-xs mt-1 text-muted-foreground">Reviews</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-serif text-primary font-medium">✨</p>
            <p className="text-xs mt-1 text-muted-foreground">5★ Rated</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
