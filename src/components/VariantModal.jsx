import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function VariantModal({ product, onSelect, onClose }) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
              <h2 className="font-medium text-foreground truncate pr-2">
                {product.name}
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-3.5 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground mb-4">Choose your variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => onSelect(variant)}
                    className="px-4 py-2.5 rounded-xl border-2 border-primary/10 hover:border-primary/30 active:scale-[0.97] text-sm font-medium transition-all min-h-[44px]"
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
