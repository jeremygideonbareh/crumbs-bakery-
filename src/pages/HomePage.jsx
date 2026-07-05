import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HeroSection } from '@/components/ui/hero-section-2'
import CategoryGrid from '@/components/CategoryGrid'
import About from '@/components/About'
import SheetCakesMarquee from '@/components/SheetCakesMarquee'
import BrowseByBake from '@/components/BrowseByBake'
import SignatureItems from '@/components/SignatureItems'
import ImageCarousel from '@/components/ImageCarousel'
import ProductCarousel from '@/components/ProductCarousel'
import DeliverySection from '@/components/DeliverySection'
import Gallery from '@/components/Gallery'
import InstagramSection from '@/components/InstagramSection'
import PromoCards from '@/components/PromoCards'
import NewsSection from '@/components/NewsSection'
import FaqSection from '@/components/FaqSection'
import { Button } from '@/components/ui/button'
import { useOrderContext } from '@/components/Layout'

const HERO_IMAGE = 'https://images.pexels.com/photos/263564/pexels-photo-263564.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80&fit=crop'

export default function HomePage() {
  const { onOrder } = useOrderContext()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
    >
      <HeroSection
        slogan="SHILLONG'S BEST-KEPT SECRET"
        title={
          <>
            Where every <br />
            <span className="text-foreground italic">crumb</span> tells a story
          </>
        }
        subtitle="Handcrafted tiramisu, cream puffs, cheesecakes, and artisanal bakes — made fresh daily in the heart of Shillong."
        callToAction={{ text: 'ORDER CUSTOM CAKE' }}
        onOrder={onOrder}
        backgroundImage={HERO_IMAGE}
        contactInfo={{
          website: 'crumbsbakery.in',
          phone: '+91 96127 72089',
          address: 'Jaiaw, Shillong, Meghalaya',
        }}
      />

      <CategoryGrid />
      <About />
      <SheetCakesMarquee />
      <BrowseByBake />
      <SignatureItems />
      <ImageCarousel />
      <ProductCarousel />
      <DeliverySection />
      <Gallery />
      <InstagramSection />
      <PromoCards />

      {/* Condensed Reviews preview */}
      <section className="py-8 md:py-16 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-6xl text-center">
          <span className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Testimonials
          </span>
          <h2 className="font-serif text-xl sm:text-2xl md:text-4xl font-medium leading-[1.2] text-foreground mt-2">
            What our community says
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto">
            Rated <strong>4.8</strong> from 9+ reviews on Google &amp; Zomato
          </p>
          <Link to="/reviews">
            <Button variant="neutral" className="mt-6 text-sm">
              Read All Reviews
            </Button>
          </Link>
        </div>
      </section>

      <NewsSection />

      <section className="bg-background py-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="border-t border-primary/10 pt-6 pb-2 text-center">
            <p className="text-xs text-muted-foreground font-work mb-3">
              Have a question? Need a custom order?
            </p>
            <Link to="/contact">
              <Button variant="default" size="lg" className="text-sm">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FaqSection />

      {/* Condensed Contact preview */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-6xl text-center">
          <span className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Visit Us
          </span>
          <h2 className="font-serif text-xl sm:text-2xl md:text-4xl font-medium leading-[1.2] text-foreground mt-2">
            Find us in Shillong
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
            Jaiaw, Shillong, Meghalaya — dine in, takeaway, or order delivery.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link to="/contact">
              <Button className="text-sm">Contact Us</Button>
            </Link>
            <a href="https://maps.google.com/?q=Crumbs+Bakery+%26+Cafe+Shillong" target="_blank" rel="noopener noreferrer">
              <Button variant="neutral" className="text-sm">Directions</Button>
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
