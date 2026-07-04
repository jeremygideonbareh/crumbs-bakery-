import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqItems = [
  {
    title: "OVER 10 YEARS AS SHILLONG'S BEST BAKERY",
    image:
      'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&q=80',
    content:
      "Crumbs Bakery began life in the heart of Jaiaw way back in 2014 and we've dedicated ourselves to making incredible Cakes, Cupcakes, Cookies and Brownies ever since. We're known as one of the best bakeries in Shillong and every member of our team works tirelessly every day to ensure all our bakes are perfect.",
  },
  {
    title: 'CUSTOMER SERVICE THAT GOES ABOVE & BEYOND',
    image:
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80',
    content:
      'Our team is passionate about cake, and even more passionate about offering exceptional customer service. We understand every order is special and will always go above and beyond to ensure your experience is perfect.',
  },
  {
    title: 'EVERYTHING FRESHLY BAKED IN SMALL BATCHES',
    image:
      'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400&q=80',
    content:
      "We only ever bake to order and we always work in small batches — it takes longer but it means we can keep a fastidious eye on the quality of everything that goes into our cakes and bakes.",
  },
  {
    title: 'USING THE FINEST INGREDIENTS AVAILABLE',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
    content:
      'All our Cakes, Cupcakes, Cookies and Brownies are made using the best ingredients we can get — from free-range eggs to the finest chocolate, the quality of ingredients has always been at the forefront of what we do.',
  },
  {
    title: 'TRUSTED BY THOUSANDS OF HAPPY CUSTOMERS',
    image:
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&q=80',
    content:
      "With hundreds of five-star reviews, we take pride in delivering exceptional treats every time. Whether it's a custom cake, a box of cookies, or a cupcake from our cafe, you can be sure the quality will be unmatched.",
  },
  {
    title: 'DESIGN YOUR OWN CAKE ONLINE',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
    content:
      "You can use our custom cake builder to design your dream cake. Choose flavours, fillings, frosting, and decorations — make it uniquely yours and our bakers will bring your creation to life.",
  },
  {
    title: 'SAFE & SPEEDY DELIVERY IN SHILLONG',
    image:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80',
    content:
      'We offer guaranteed safe delivery anywhere in Shillong, so you can be sure your cake will arrive looking just as perfect as when it left the bakery.',
  },
  {
    title: 'INDEPENDENTLY OWNED & OPERATED',
    image:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80',
    content:
      "Since we started out, Crumbs Bakery has been independently owned and operated. We're a local Shillong business, and every order supports local families and the community.",
  },
  {
    title: 'BESPOKE CAKE OPTIONS AVAILABLE',
    image:
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80',
    content:
      'From fully custom cakes to edible printed images and piped messages, we offer the widest range of customisations to ensure your cake is perfect for you. Contact us — we love to talk cake!',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className="bg-secondary px-4 py-10 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center font-display text-3xl font-bold tracking-wider text-foreground md:mb-12 md:text-4xl lg:text-[44px]"
        >
          WHAT MAKES CRUMBS SPECIAL?
        </motion.h2>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-3 md:gap-5 border border-border bg-white p-3.5 md:p-4 text-left transition-all hover:border-primary/30 min-h-[56px] md:min-h-0 active:scale-[0.97]"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full md:h-14 md:w-14">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <span className="flex-1 font-work text-[13px] md:text-sm font-bold uppercase tracking-[0.05em] text-foreground leading-snug">
                  {item.title}
                </span>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-x border-b border-border bg-white px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground md:px-5 md:pb-5">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
