import { motion } from 'framer-motion';

const cards = [
  {
    title: 'BAKE CLUB',
    desc: 'PDF Recipes, Behind-the-Scenes content, site-wide discounts.',
    cta: 'SIGN UP NOW',
    href: '#',
    image:
      'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&q=80',
  },
  {
    title: 'YOUTUBE',
    desc: 'New Recipe videos uploaded every week on our channel.',
    cta: 'CHECK IT OUT',
    href: '#',
    image:
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80',
  },
  {
    title: 'COOKIE CLUB',
    desc: 'Everything in Bake Club plus a box of Cookies delivered every month!',
    cta: 'GET THOSE COOKIES',
    href: '#',
    image:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80',
  },
];

export default function PromoCards() {
  return (
    <section className="py-10 md:py-18 px-4 md:px-6 bg-accent">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
           <span className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
             Join the Community
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mt-1 tracking-tight">
            CRUMBS PERKS
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative block overflow-hidden aspect-[16/9] md:aspect-[4/3] border border-primary/10 hover:border-primary/30 transition-all"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5">
                <h3 className="text-white font-display text-lg md:text-xl mb-1">
                  {card.title}
                </h3>
                <p className="text-white/80 font-work text-[13px] mb-3 max-w-[90%] leading-relaxed">
                  {card.desc}
                </p>
                <span className="inline-block text-white text-xs uppercase tracking-[0.15em] font-work font-semibold border-b border-white/40 pb-0.5 w-fit group-hover:border-white transition-all">
                  {card.cta}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
