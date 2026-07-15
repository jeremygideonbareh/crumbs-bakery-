import { motion } from 'framer-motion'
import CategoryHero from '@/components/CategoryHero'
import MenusGallery from '@/components/MenusGallery'
import usePageSection from '@/hooks/usePageSection'
import * as DEFAULTS from '@/data/contentDefaults'

const HERO = `${import.meta.env.BASE_URL}images/cakes%20menu.jpeg`

export default function MenusPage() {
  const menus = usePageSection('menus', DEFAULTS.MENUS_DEFAULTS)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
    >
      <CategoryHero
        title="MENUS"
        subtitle="Browse our full menu boards"
        image={HERO}
      />
      <MenusGallery data={menus.data} />
    </motion.div>
  )
}
