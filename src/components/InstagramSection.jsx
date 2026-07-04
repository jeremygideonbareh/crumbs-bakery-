import { motion } from 'framer-motion';

const images = [
  'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=300&q=80',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80',
  'https://images.unsplash.com/photo-1486427944544-d2c246c4c5f5?w=300&q=80',
  'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=300&q=80',
  'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&q=80',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&q=80',
  'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=300&q=80',
  'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=300&q=80',
  'https://images.unsplash.com/photo-1588195538326-c5b1e1b48098?w=300&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80',
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&q=80',
];

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
    <section className="bg-background scroll-mt-24">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-72 shrink-0 p-6 md:p-8 bg-primary/10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-work text-lg md:text-xl font-bold text-foreground mb-5"
          >
            INSTAGRAM
          </motion.h2>

          <p className="font-work text-[13px] text-muted-foreground mb-6 leading-relaxed">
            Tag us in your photos for a chance to be featured on our page!
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className="flex items-center gap-3 px-3 py-3.5 text-sm text-foreground/80 hover:text-foreground hover:bg-primary/10 transition-all active:scale-[0.97]"
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-medium text-[13px] uppercase tracking-[0.1em]">
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-primary/10">
            <p className="font-work text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
              FOLLOW US
            </p>
            <p className="font-display text-xl text-foreground">
              @CRUMBSBAKERY
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {images.map((src, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (i % 12) * 0.05 }}
              className="group relative aspect-square overflow-hidden bg-primary/5"
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay with stats */}
              <div className="absolute inset-0 bg-black/60 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-5">
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
