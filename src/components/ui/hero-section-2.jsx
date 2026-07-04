import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Globe, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const icons = {
  website: Globe,
  phone: Phone,
  address: MapPin,
}

function InfoIcon({ type }) {
  const Icon = icons[type]
  return (
    <div className="mr-2 flex-shrink-0">
      <Icon className="h-5 w-5 text-foreground" />
    </div>
  )
}

const statVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const statItemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

const SOCIAL_PROOF_STATS = [
  { number: '4.9 ★', label: 'Google Reviews' },
  { number: '500+', label: 'Happy Customers' },
  { number: '7+ Years', label: 'Serving Shillong' },
]

const HeroSection = React.forwardRef(
  ({ className, logo, slogan, title, subtitle, callToAction, backgroundImage, contactInfo, onOrder, ...props }, ref) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.2,
        },
      },
    }

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: 'easeOut',
        },
      },
    }

    return (
      <motion.section
        ref={ref}
        className={cn(
          'relative flex w-full flex-col overflow-hidden bg-background text-foreground md:flex-row md:min-h-screen',
          className,
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...props}
      >
        {/* Left Side: Content */}
        <div className="flex w-full flex-col justify-between px-5 pt-6 pb-0 md:w-[45%] md:p-12 lg:p-16 md:pb-0">
          <div>
            <motion.header className="mb-6 md:mb-12" variants={itemVariants}>
              {logo && (
                <div className="flex items-center">
                  {logo.url && (
                    <img src={logo.url} alt={logo.alt} className="mr-3 h-8" />
                  )}
                  <div>
                    {logo.text && (
                      <p className="text-lg font-bold text-foreground">{logo.text}</p>
                    )}
                    {slogan && (
                      <p className="text-[13px] tracking-wider text-muted-foreground">
                        {slogan}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.header>

            {/* SOCIAL PROOF COUNTERS */}
            <motion.div
              className="flex gap-4 md:gap-10 mb-6 md:mb-12"
              variants={statVariants}
              initial="hidden"
              animate="visible"
            >
              {SOCIAL_PROOF_STATS.map((stat) => (
                <motion.div key={stat.label} variants={statItemVariants}>
                  <p className="text-lg md:text-3xl font-bold text-foreground">{stat.number}</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground tracking-wide">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.main variants={containerVariants}>
              <motion.h1
                className="text-[2rem] leading-[1.1] sm:text-5xl md:text-7xl lg:text-8xl font-medium text-balance text-foreground font-serif"
                style={{ fontVariationSettings: '"SOFT" 80' }}
                variants={itemVariants}
              >
                {title}
              </motion.h1>
              <motion.div
                className="my-4 md:my-6 h-1 w-16 md:w-20 bg-accent"
                variants={itemVariants}
              />
              <motion.p
                className="mb-6 md:mb-8 max-w-md text-sm md:text-base text-muted-foreground leading-relaxed"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                variants={itemVariants}
              >
                <Button onClick={onOrder} size="lg" className="min-h-[44px] text-sm w-full sm:w-auto">
                  {callToAction.text}
                </Button>
                <a href="#menu" className="w-full sm:w-auto">
                  <Button variant="neutral" size="lg" className="min-h-[44px] text-sm w-full">
                    Explore Menu
                  </Button>
                </a>
              </motion.div>
            </motion.main>
          </div>

          <motion.footer className="mt-6 md:mt-12 w-full" variants={itemVariants}>
            <div className="grid grid-cols-1 gap-3 md:gap-6 text-xs md:text-xs text-muted-foreground sm:grid-cols-3">
              <div className="flex items-center">
                <InfoIcon type="website" />
                <span>{contactInfo.website}</span>
              </div>
              <div className="flex items-center">
                <InfoIcon type="phone" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <InfoIcon type="address" />
                <span>{contactInfo.address}</span>
              </div>
            </div>
          </motion.footer>
        </div>

        {/* Right Side: Image with clip-path animation + gradient fade */}
        <div className="relative w-full min-h-[40vh] md:w-[55%] md:min-h-screen">
          <div className="hidden md:block absolute inset-0 z-10 bg-gradient-to-r from-[#FFFFF0] via-[#FFFFF0]/50 via-20% to-transparent to-35% pointer-events-none" />

          {/* Mobile: simple fade-in */}
          <motion.div
            className="md:hidden absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </motion.div>

          {/* Desktop: clip-path reveal */}
          <motion.div
            className="hidden md:block absolute inset-0 overflow-hidden"
            initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
            animate={{
              clipPath: 'polygon(3% 0, 100% 0, 100% 100%, 0% 100%)',
            }}
            transition={{ duration: 1.2, ease: 'circOut' }}
          >
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </motion.div>
        </div>
      </motion.section>
    )
  },
)

HeroSection.displayName = 'HeroSection'

export { HeroSection }
