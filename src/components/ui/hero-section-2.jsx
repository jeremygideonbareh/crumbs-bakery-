import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Globe, Phone, MapPin } from 'lucide-react'

const icons = {
  website: Globe,
  phone: Phone,
  address: MapPin,
}

function InfoIcon({ type }) {
  const Icon = icons[type]
  return (
    <div className="mr-2 flex-shrink-0">
      <Icon className="h-5 w-5 text-primary" />
    </div>
  )
}

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
          'relative flex w-full flex-col overflow-hidden bg-background text-foreground md:flex-row min-h-svh',
          className,
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...props}
      >
        {/* Left Side: Content */}
        <div className="flex w-full flex-col justify-between p-8 md:w-[45%] md:p-12 lg:p-16">
          {/* Top Section: Logo & Main Content */}
          <div>
            <motion.header className="mb-12" variants={itemVariants}>
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
                      <p className="text-xs tracking-wider text-muted-foreground">
                        {slogan}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.header>

            <motion.main variants={containerVariants}>
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] text-balance text-foreground font-serif"
                style={{ fontVariationSettings: '"SOFT" 80' }}
                variants={itemVariants}
              >
                {title}
              </motion.h1>
              <motion.div
                className="my-6 h-1 w-20 bg-primary"
                variants={itemVariants}
              />
              <motion.p
                className="mb-8 max-w-md text-sm md:text-base text-muted-foreground leading-relaxed"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
              <motion.div variants={itemVariants}>
                <button
                  onClick={onOrder}
                  className="text-lg font-bold tracking-widest text-primary transition-colors hover:text-primary/80"
                >
                  {callToAction.text}
                </button>
              </motion.div>
            </motion.main>
          </div>

          {/* Bottom Section: Footer Info */}
          <motion.footer className="mt-12 w-full" variants={itemVariants}>
            <div className="grid grid-cols-1 gap-6 text-xs text-muted-foreground sm:grid-cols-3">
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
        <div className="relative w-full min-h-[300px] md:w-[55%] md:h-full">
          {/* Gradient fade overlay on the left edge of the image — only affects first 30% */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#FFF5F0] via-[#FFF5F0]/50 via-20% to-transparent to-35% pointer-events-none" />

          <motion.div
            className="absolute inset-0 overflow-hidden"
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
