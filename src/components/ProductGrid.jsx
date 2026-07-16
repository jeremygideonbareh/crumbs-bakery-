import { motion } from 'framer-motion'
import { useOrderContext } from './Layout'
import { getImageUrl } from '@/lib/image'

export default function ProductGrid({ products }) {
  const { onOrder } = useOrderContext()
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
          className="group flex flex-col bg-white rounded-sm overflow-hidden border border-primary/10 hover:border-primary/20 transition-all"
        >
          <div className="relative aspect-square overflow-hidden bg-primary/5">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            {product.badge && (
              <span className="absolute top-2 left-2 bg-header text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col flex-1 p-2.5 md:p-3">
            <h3 className="font-work text-[11px] md:text-xs font-bold uppercase tracking-[0.05em] text-foreground leading-tight">
              {product.name}
            </h3>
            {product.desc && (
              <p className="text-[10px] md:text-[11px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                {product.desc}
              </p>
            )}
            <p className="font-work text-sm md:text-base font-bold text-foreground mt-1 mb-1.5 md:mb-2">
              {product.price}
            </p>
            {product.variants && (
              <div className="flex flex-wrap gap-1 mb-1.5 md:mb-2">
                {product.variants.slice(0, 6).map((v) => (
                  <span
                    key={v}
                    className="text-[8px] md:text-[9px] uppercase tracking-wider text-muted-foreground border border-primary/20 px-1.5 py-0.5 rounded-sm"
                  >
                    {v}
                  </span>
                ))}
                {product.variants.length > 6 && (
                  <span className="text-[8px] text-muted-foreground">+{product.variants.length - 6}</span>
                )}
              </div>
            )}
            <button onClick={onOrder} className="mt-auto w-full font-work text-[10px] md:text-xs uppercase tracking-[0.15em] text-foreground border border-foreground/20 hover:bg-primary hover:text-foreground hover:border-primary px-3 py-2.5 md:py-2 transition-all duration-200 rounded-sm min-h-[36px] md:min-h-0 active:scale-[0.97]">
              Add to Order
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
