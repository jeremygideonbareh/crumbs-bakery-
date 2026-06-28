import { motion } from 'framer-motion';

const images = Array.from({ length: 12 }, (_, i) =>
  `https://images.unsplash.com/photo-${
    [
      '1558636508',
      '1578985545',
      '1486427944',
      '1528975604',
      '1556909172',
      '1464349095',
      '1501339847',
      '1558301211',
      '1606890737',
      '1588195538',
      '1565958011',
      '1499636137',
    ][i]
  }?w=300&q=80`
);

const menuItems = [
  { label: 'OUR MENU', icon: '🍰' },
  { label: 'FRESH BAKES', icon: '🧁' },
  { label: 'F.A.Q.', icon: '❓' },
  { label: 'BAKING TIPS!', icon: '👩‍🍳' },
  { label: 'CUSTOM CAKES', icon: '🎂' },
  { label: 'FIND US!', icon: '📍' },
];

const postStats = [
  { likes: 124, comments: 8 },
  { likes: 89, comments: 12 },
  { likes: 234, comments: 21 },
  { likes: 56, comments: 3 },
  { likes: 178, comments: 15 },
  { likes: 312, comments: 42 },
  { likes: 97, comments: 6 },
  { likes: 145, comments: 11 },
  { likes: 203, comments: 18 },
  { likes: 67, comments: 5 },
  { likes: 189, comments: 14 },
  { likes: 88, comments: 7 },
];

export default function InstagramSection() {
  return (
    <section className="bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-72 shrink-0 p-6 md:p-8 bg-header/5">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-work text-lg md:text-xl font-bold text-foreground mb-5"
          >
            INSTAGRAM
          </motion.h2>

          <p className="font-work text-xs text-muted-foreground mb-6 leading-relaxed">
            Tag us in your photos for a chance to be featured on our page!
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-header/10 transition-all"
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-medium text-xs uppercase tracking-[0.1em]">
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-header/10">
            <p className="font-work text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
              FOLLOW US
            </p>
            <p className="font-display text-xl text-foreground">
              @CRUMBSBAKERY
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {images.map((src, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (i % 12) * 0.05 }}
              className="group relative aspect-square overflow-hidden bg-header/5"
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay with stats */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-5">
                <span className="flex items-center gap-1.5 text-white text-xs font-work">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {postStats[i % postStats.length].likes}
                </span>
                <span className="flex items-center gap-1.5 text-white text-xs font-work">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
                  </svg>
                  {postStats[i % postStats.length].comments}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
