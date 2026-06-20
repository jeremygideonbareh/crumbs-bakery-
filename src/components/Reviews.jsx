import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const reviews = [
  {
    name: 'Merry',
    text: 'My favorites from this bakery is definitely the cream puffs and THE TIRAMISU! That tiramisu is proportionate for its price and the quality is on point. You can taste the bittersweet coffee mixed with the cream and the cake … ugh foodgasm!',
    rating: 5,
    source: 'Google',
    when: 'Nov 2025',
  },
  {
    name: 'Ebenezer Douglas',
    text: "Love that everything was served hot, especially the snacks. Great quality and service every time.",
    rating: 5,
    source: 'Google',
    when: 'Feb 2026',
  },
  {
    name: 'Audrey LZM',
    text: 'Loved the atmosphere and the cheesecake! They offer different flavours and the place has such a warm, welcoming vibe.',
    rating: 5,
    source: 'Google',
    when: '2026',
  },
  {
    name: 'Juri Galvan',
    text: 'They offer homemade bread. I had the carrot cake and absolutely delicious. Doesn\'t have too much sugar, just right. Also the cookies are amazing!',
    rating: 5,
    source: 'Google',
    when: '2026',
  },
  {
    name: 'A Happy Customer',
    text: "I'm delighted with the cake I ordered for my daughter's birthday! Every aspect, from the design to the taste, was amazing.",
    rating: 5,
    source: 'Google',
    when: '2024',
  },
  {
    name: 'Dhakshanamoorthy',
    text: 'Nice desserts. I like the quality and packaging. Nice staffs and ambience too. Highly recommend.',
    rating: 5,
    source: 'Zomato',
    when: '2017',
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="relative py-28 md:py-36 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.2em] uppercase font-medium mb-4">
            Testimonials
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] text-foreground">
            What our <span className="text-primary italic">community</span> says
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex -space-x-1">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-[10px] font-medium text-primary">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-[10px] font-medium text-primary">+</div>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">4.8</span> average rating from 9+ reviews
            </p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl border border-primary/10 bg-white p-6 flex flex-col shadow-sm"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed flex-1 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-primary/10">
                <div>
                  <p className="text-sm font-medium text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.source} · {review.when}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
