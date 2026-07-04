import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CategoryHero({ title, subtitle, image, count }) {
  return (
    <section className="relative pt-16 md:pt-20">
      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/60 text-[11px] md:text-xs font-work uppercase tracking-[0.1em] mb-2">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/80">{title}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-wide">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/70 text-sm md:text-base font-work max-w-xl mt-1.5 md:mt-2 leading-relaxed">
                {subtitle}
              </p>
            )}
            {count && (
              <p className="text-white/50 text-xs md:text-sm font-work mt-1">
                {count} products
              </p>
            )}
          </motion.div>
        </div>
      </div>
      <div className="h-1 bg-header" />
    </section>
  )
}
