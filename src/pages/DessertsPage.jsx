import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import CategoryHero from '@/components/CategoryHero'
import ProductGrid from '@/components/ProductGrid'
import usePageSection from '@/hooks/usePageSection'
import { supabase } from '@/lib/supabase'
import { desserts as fallbackProducts } from '@/data/products'

const LOCAL = (name) => `${import.meta.env.BASE_URL}images/${encodeURIComponent(name)}`
const FALLBACK_HERO = LOCAL('tiramisu-1200.jpeg')

function normalizeProducts(productsData, fallback) {
  if (!Array.isArray(productsData) || productsData.length === 0) return fallback
  return productsData.map((p, i) => ({
    id: p.id || `p-${i}`,
    name: p.name || '',
    price: p.price || '',
    image: p.image || '',
    desc: p.desc || p.description || '',
    badge: p.badge || '',
    variants: typeof p.variants === 'string'
      ? p.variants.split(',').map(v => v.trim()).filter(Boolean)
      : (Array.isArray(p.variants) ? p.variants : []),
  }))
}

export default function DessertsPage() {
  const [dbProducts, setDbProducts] = useState(null)
  const { data: rawProductData } = usePageSection('desserts_product_grid', fallbackProducts)
  const { data: heroData } = usePageSection('desserts_hero', {
    title: 'DESSERTS',
    subtitle: 'From gooey cookies and fudgy brownies to cheesecakes, tiramisu, and more — every craving covered.',
    image: FALLBACK_HERO,
  })
  const { data: deliveryData } = usePageSection('desserts_delivery', {
    heading: 'DESSERT DELIVERY IN SHILLONG',
    card1_heading: 'Hand Delivery',
    card1_desc: 'Fresh desserts delivered to your door anywhere in Shillong.',
    card2_heading: 'Cafe Pickup',
    card2_desc: 'Order online and collect from our Jaiaw cafe at your convenience.',
  })

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('category_slug', 'desserts')
      .eq('active', true)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setDbProducts(data)
        }
      })
      .catch(() => {/* use fallback */})
  }, [])

  const products = useMemo(() => {
    const source = dbProducts || rawProductData || fallbackProducts
    return normalizeProducts(source, fallbackProducts)
  }, [dbProducts, rawProductData])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      <CategoryHero
        title={heroData?.title}
        subtitle={heroData?.subtitle}
        image={heroData?.image}
        count={products.length}
      />

      <section className="py-6 md:py-10 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm text-muted-foreground font-work mb-6 md:mb-8 max-w-2xl mx-auto">
            All our desserts are baked &amp; prepared by hand in small batches using the finest ingredients — Lescure Butter, free-range eggs, Belgian chocolate, and real vanilla.
          </p>
          <ProductGrid products={products} />
        </div>
      </section>

      <section className="bg-primary py-8 md:py-14 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-6 md:mb-8 tracking-tight">
            {deliveryData?.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">{deliveryData?.card1_heading}</h3>
              <p className="text-[13px] text-muted-foreground">{deliveryData?.card1_desc}</p>
            </div>
            <div className="bg-white/80 p-4 md:p-5 rounded-sm">
              <h3 className="font-work text-sm font-bold text-foreground mb-1">{deliveryData?.card2_heading}</h3>
              <p className="text-[13px] text-muted-foreground">{deliveryData?.card2_desc}</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
