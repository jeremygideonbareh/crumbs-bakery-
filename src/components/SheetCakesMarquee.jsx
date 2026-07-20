import { useEffect, useRef } from 'react'
import { animate, useMotionValue } from 'framer-motion'

const PEXELS = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200&q=80&fit=crop`

const items = Array.from({ length: 10 }, (_, i) => ({
  label: 'SHEET CAKES',
  image: [
    LOCAL('cinnamon-rolls.jpeg'),
    LOCAL('bespoke-cake.jpeg'),
    LOCAL('vintage-custom.jpeg'),
  ][i % 3],
}))

const DURATION = 30000
const DISTANCE = '-50%'

function useMarqueeAnimation(ref) {
  const x = useMotionValue('0%')

  useEffect(() => {
    if (!ref.current) return
    const controls = animate(x, DISTANCE, {
      duration: DURATION / 1000,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    })

    return () => controls.stop()
  }, [x])

  return { x }
}

export default function SheetCakesMarquee() {
  const containerRef = useRef(null)
  const { x } = useMarqueeAnimation(containerRef)

  return (
    <section className="overflow-hidden bg-header py-3 md:py-4">
      <div
        ref={containerRef}
        className="flex gap-6 whitespace-nowrap"
        style={{ x }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-6">
            <img
              src={item.image}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-foreground md:text-base">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
