import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import Loader from './components/Loader'
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
  const [loading, setLoading] = useState(true)
  const [orderOpen, setOrderOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF5F0]"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 } }}
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
