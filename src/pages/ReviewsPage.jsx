import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const reviews = [
  { name: 'Merry', text: 'My favorites from this bakery is definitely the cream puffs and THE TIRAMISU! That tiramisu is proportionate for its price and the quality is on point.', rating: 5, source: 'Google', when: 'Nov 2025' },
  { name: 'Ebenezer Douglas', text: "Love that everything was served hot, especially the snacks. Great quality and service every time.", rating: 5, source: 'Google', when: 'Feb 2026' },
  { name: 'Audrey LZM', text: 'Loved the atmosphere and the cheesecake! They offer different flavours and the place has such a warm, welcoming vibe.', rating: 5, source: 'Google', when: '2026' },
  { name: 'Juri Galvan', text: "They offer homemade bread. I had the carrot cake and absolutely delicious. Doesn't have too much sugar, just right. Also the cookies are amazing!", rating: 5, source: 'Google', when: '2026' },
  { name: 'A Happy Customer', text: "I'm delighted with the cake I ordered for my daughter's birthday! Every aspect, from the design to the taste, was amazing.", rating: 5, source: 'Google', when: '2024' },
  { name: 'Dhakshanamoorthy', text: 'Nice desserts. I like the quality and packaging. Nice staffs and ambience too. Highly recommend.', rating: 5, source: 'Zomato', when: '2017' },
  { name: 'Sarah L.', text: 'Best red velvet cake in Shillong! The cream cheese frosting is perfectly balanced — not too sweet, not too tart.', rating: 5, source: 'Google', when: '2025' },
  { name: 'Rohan M.', text: 'Ordered a custom birthday cake and it exceeded all expectations. The design was perfect and the cake was delicious.', rating: 5, source: 'Google', when: '2026' },
  { name: 'Priya K.', text: 'The cookies are absolutely incredible. Had the Choc Chip and Biscoff — both were gooey, fresh, and huge!', rating: 5, source: 'Zomato', when: '2026' },
  { name: 'Anjali D.', text: 'Their tiramisu is a must-try. It rivals anything I have had in proper Italian restaurants. Truly world-class.', rating: 5, source: 'Google', when: '2025' },
  { name: 'Vikram S.', text: 'Great ambience, friendly staff, and the brownies are dangerously good. Highly recommend the caramel cornflake.', rating: 5, source: 'Google', when: '2026' },
  { name: 'Tanya R.', text: 'The cupckaes are moist and flavourful. Red velvet is our family favourite. Delivery was prompt and well-packaged.', rating: 5, source: 'Zomato', when: '2026' },
]

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredReviews = activeFilter === 'All'
    ? reviews
    : reviews.filter((r) => r.source === activeFilter)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      {/* Hero */}
      <section className="relative pt-16 md:pt-20 bg-primary/20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium"
          >
            Testimonials
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] text-foreground mt-3"
          >
            What our community says
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 mt-5"
          >
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">4.8</strong> avg from 12+ reviews
            </span>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-background border-b border-primary/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {['All', 'Google', 'Zomato'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] px-3 py-2 rounded-sm transition-all active:scale-[0.97] ${
                activeFilter === filter
                  ? 'bg-header text-white'
                  : 'text-foreground/60 border border-foreground/20 hover:border-foreground/40'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Reviews grid */}
      <section className="py-8 md:py-14 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {filteredReviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: (i % filteredReviews.length) * 0.04 }}
                className="rounded-xl border border-primary/10 bg-white p-4 md:p-5 flex flex-col shadow-sm"
              >
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[13px] text-foreground leading-relaxed flex-1 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{review.name}</p>
                    <p className="text-[11px] text-muted-foreground">{review.source} · {review.when}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-header bg-header/10 px-2 py-0.5 rounded-sm">
                    {review.rating}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-primary/10 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-tight mb-3">
            LEAVE A REVIEW
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Loved your experience at Crumbs? We'd love to hear about it! Leave us a review on Google or Zomato.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a href="https://search.google.com/local/writereview?placeid=PLACE_ID" target="_blank" rel="noopener noreferrer">
              <span className="inline-block border-2 border-foreground/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:border-header hover:bg-header hover:text-white transition-all rounded-sm active:scale-[0.97]">
                Google Review
              </span>
            </a>
            <a href="https://www.zomato.com/shillong/crumbs-bakery-and-cafe-jaiaw/review" target="_blank" rel="noopener noreferrer">
              <span className="inline-block border-2 border-foreground/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:border-header hover:bg-header hover:text-white transition-all rounded-sm active:scale-[0.97]">
                Zomato Review
              </span>
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
