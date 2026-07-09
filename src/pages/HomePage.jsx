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
import usePageSection from '@/hooks/usePageSection'
import * as DEFAULTS from '@/data/contentDefaults'

export default function HomePage() {
  const { onOrder } = useOrderContext()

  const hero = usePageSection('home_hero', DEFAULTS.HOME_HERO_DEFAULTS)
  const stats = usePageSection('hero_stats', DEFAULTS.HERO_STATS_DEFAULTS)
  const categories = usePageSection('category_grid', DEFAULTS.CATEGORY_GRID_DEFAULTS)
  const about = usePageSection('about', DEFAULTS.ABOUT_DEFAULTS)
  const browseByBake = usePageSection('browse_by_bake', DEFAULTS.BROWSE_BY_BAKE_DEFAULTS)
  const signatureItems = usePageSection('signature_items', DEFAULTS.SIGNATURE_ITEMS_DEFAULTS)
  const imageCarousel = usePageSection('image_carousel', DEFAULTS.IMAGE_CAROUSEL_DEFAULTS)
  const productCarousel = usePageSection('product_carousel', DEFAULTS.PRODUCT_CAROUSEL_DEFAULTS)
  const delivery = usePageSection('delivery', DEFAULTS.DELIVERY_DEFAULTS)
  const gallery = usePageSection('gallery', DEFAULTS.GALLERY_DEFAULTS)
  const instagram = usePageSection('instagram', DEFAULTS.INSTAGRAM_DEFAULTS)
  const promoCards = usePageSection('promo_cards', DEFAULTS.PROMO_CARDS_DEFAULTS)
  const news = usePageSection('news', DEFAULTS.NEWS_DEFAULTS)
  const faq = usePageSection('faq_section', DEFAULTS.FAQ_DEFAULTS)

  const h = hero.data || DEFAULTS.HOME_HERO_DEFAULTS

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
    >
      <HeroSection
        slogan={h.slogan}
        title={
          <span dangerouslySetInnerHTML={{ __html: h.title || '' }} />
        }
        subtitle={h.subtitle}
        callToAction={{ text: h.cta_text || 'ORDER CUSTOM CAKE' }}
        onOrder={onOrder}
        backgroundImage={h.background_image}
        contactInfo={{
          website: h.contact_website || '',
          phone: h.contact_phone || '',
          address: h.contact_address || '',
        }}
        stats={stats.data}
      />

      <CategoryGrid data={categories.data} />
      <About data={about.data} />
      <SheetCakesMarquee />
      <BrowseByBake data={browseByBake.data} />
      <SignatureItems data={signatureItems.data} />
      <ImageCarousel data={imageCarousel.data} />
      <ProductCarousel data={productCarousel.data} />
      <DeliverySection data={delivery.data} />
      <Gallery data={gallery.data} />
      <InstagramSection data={instagram.data} />
      <PromoCards data={promoCards.data} />

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

      <NewsSection data={news.data} />

      <section className="bg-primary py-4">
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

      <FaqSection data={faq.data} />

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
