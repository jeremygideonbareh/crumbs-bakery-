import { motion } from 'framer-motion'

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-header text-foreground text-xs md:text-[11px] uppercase tracking-[0.2em] py-2.5 text-center font-work font-semibold overflow-hidden"
    >
      <span className="inline-flex items-center gap-2 px-2 whitespace-nowrap md:whitespace-normal md:px-0">
        <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full shrink-0" />
        FREE DELIVERY ON ORDERS ₹500+
        <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full shrink-0" />
        ORDER BY 2PM FOR SAME DAY
        <span className="hidden sm:inline"> DELIVERY</span>
      </span>
    </motion.div>
  )
}
