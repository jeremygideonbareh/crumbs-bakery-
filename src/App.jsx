import { useState } from 'react'
import { motion } from 'framer-motion'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import { HeroSection } from './components/ui/hero-section-2'
import About from './components/About'
import SignatureItems from './components/SignatureItems'
import Gallery from './components/Gallery'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import Footer from './components/Footer'
import OrderModal from './components/OrderModal'
import AnnouncementBar from './components/AnnouncementBar'
import CategoryGrid from './components/CategoryGrid'
import SheetCakesMarquee from './components/SheetCakesMarquee'
import BrowseByBake from './components/BrowseByBake'
import ProductCarousel from './components/ProductCarousel'
import DeliverySection from './components/DeliverySection'
import InstagramSection from './components/InstagramSection'
import PromoCards from './components/PromoCards'
import NewsSection from './components/NewsSection'
import FaqSection from './components/FaqSection'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1775210603506-201ed7bec326?w=1920&q=80'

function App() {
  const [orderOpen, setOrderOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
      >
        <AnnouncementBar />
        <Navbar onOrder={() => setOrderOpen(true)} />

        <HeroSection
          onOrder={() => setOrderOpen(true)}
          slogan="SHILLONG'S BEST-KEPT SECRET"
          title={
            <>
              Where every <br />
              <span className="text-foreground italic">crumb</span> tells a story
            </>
          }
          subtitle="Handcrafted tiramisu, cream puffs, cheesecakes, and artisanal bakes — made fresh daily in the heart of Shillong."
          callToAction={{
            text: 'ORDER CUSTOM CAKE',
          }}
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
        <ProductCarousel />
        <DeliverySection />
        <Gallery />
        <InstagramSection />
        <PromoCards />
        <Reviews />
        <NewsSection />
        <FaqSection />
        <Contact onOrder={() => setOrderOpen(true)} />
        <Footer />
      </motion.div>

      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
      <Toaster richColors position="bottom-right" />
    </div>
  )
}

export default App
