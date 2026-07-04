import { motion } from 'framer-motion';

const articles = [
  {
    title: 'New Menu Items Have Landed at Crumbs Bakery!',
    image:
      'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&q=80',
    excerpt:
      'Coming to Crumbs Bakery this weekend — new cakes, fresh flavours, and exciting treats you won\'t want to miss!',
    date: 'June 24, 2026',
  },
  {
    title: 'Valrhona Chocolate Cookies Are Here!!',
    image:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80',
    excerpt:
      'There\'s a brand new, limited edition cookie — the Valrhona Choc Chip cookie, packed with delicious dark chocolate.',
    date: 'June 20, 2026',
  },
  {
    title: 'What\'s Happening in Store This Week',
    image:
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&q=80',
    excerpt:
      'There\'s a lot of choice on the counter this week — Malteser Cupcakes, fresh bakes, and some old favourites are back!',
    date: 'June 18, 2026',
  },
  {
    title: 'A Little Look in the Bakery',
    image:
      'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&q=80',
    excerpt:
      'A peek behind the scenes at our Jaiaw bakery — see the gorgeous cakes our team has been working on this week.',
    date: 'June 14, 2026',
  },
  {
    title: 'Recent Cakes from Our Bakery!',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    excerpt:
      'There have been so many gorgeous cakes flying out of the bakery this week — here\'s a look at a few of our favourites.',
    date: 'June 10, 2026',
  },
  {
    title: 'The Cutest New Cakes on Our Menu!',
    image:
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&q=80',
    excerpt:
      'We\'re obsessed with these new cakes and we think you will be too! Available to order now for pickup or delivery.',
    date: 'June 5, 2026',
  },
];

export default function NewsSection() {
  return (
    <section className="py-8 md:py-20 px-4 md:px-6 bg-primary">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium"
          >
            What&apos;s New
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-2 tracking-tight"
          >
            LATEST FROM CRUMBS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-work text-sm text-muted-foreground max-w-lg mx-auto mt-3"
          >
            Stay up to date with our newest creations, events, and bakery
            happenings.
          </motion.p>
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {articles.map((article, i) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
               className="group flex flex-col bg-white/50 dark:bg-primary/10 rounded-sm overflow-hidden border border-primary/10 hover:border-primary/20 transition-all"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <span className="font-work text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {article.date}
                </span>
                <h3 className="font-display text-lg text-foreground mb-2 leading-tight group-hover:text-foreground transition-colors">
                  {article.title}
                </h3>
                <p className="font-work text-sm text-muted-foreground leading-relaxed flex-1">
                  {article.excerpt}
                </p>
                <a
                  href="#"
                  className="font-work text-sm uppercase tracking-[0.15em] text-foreground hover:text-foreground transition-colors mt-4 inline-flex items-center gap-1.5 py-3"
                >
                  Read More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="#"
            className="font-work text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 py-3"
          >
            View All Posts
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.04-1.08l3.96 4.158V3.75A.75.75 0 0110 3z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
