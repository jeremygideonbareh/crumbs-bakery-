import { motion } from 'framer-motion'

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-header text-header-foreground text-[10px] md:text-[11px] uppercase tracking-[0.2em] py-2.5 text-center font-work font-semibold"
    >
      <span className="inline-flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-header-foreground/60 rounded-full" />
        FREE DELIVERY IN SHILLONG ON ORDERS ₹500+
        <span className="w-1.5 h-1.5 bg-header-foreground/60 rounded-full" />
        ORDER BY 2PM FOR SAME DAY DELIVERY
      </span>
    </motion.div>
  )
}
