import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { SectionEyebrow, CharReveal } from './RevealText'
import { useReviews } from '@/hooks/useReviews'

export default function Reviews() {
  const { reviews, loading } = useReviews()
  return (
    <section id="reviews" className="relative py-8 md:py-28 lg:py-36 px-4 md:px-6 scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-10 md:mb-16"
        >
          <SectionEyebrow>Testimonials</SectionEyebrow>
          <h2 className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.2] text-balance text-foreground">
            <CharReveal>What our </CharReveal>
            <span className="text-foreground italic"><CharReveal delay={0.3}>community</CharReveal></span>
            <CharReveal delay={0.5}> says</CharReveal>
          </h2>
          <div className="mt-4 md:mt-6 flex items-center justify-center gap-3">
            <div className="flex -space-x-1">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-[9px] md:text-[10px] font-medium text-foreground">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-[9px] md:text-[10px] font-medium text-foreground">+</div>
            </div>
            <p className="text-[13px] md:text-sm text-muted-foreground">
              <span className="text-foreground font-medium">4.8</span> avg from 9+ reviews
            </p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl border border-primary/10 bg-white p-4 md:p-6 flex flex-col shadow-sm"
            >
              <div className="flex items-center gap-0.5 mb-2 md:mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[13px] md:text-sm text-foreground leading-relaxed flex-1 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-3 md:mt-4 flex items-center justify-between pt-3 md:pt-4 border-t border-primary/10">
                <div>
                  <p className="text-[13px] md:text-sm font-medium text-foreground">{review.name}</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground">{review.source} · {review.when}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
