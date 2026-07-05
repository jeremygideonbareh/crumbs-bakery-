import { motion } from 'framer-motion'

// Pexels curated cinematic food photography
const PEXELS = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&q=80&fit=crop`

const columns = [
  {
    image: PEXELS(140831),
    heading: 'CRUMBS BAKERY & CAFE, SHILLONG',
    body: () => (
      <>
        Founded in the heart of Jaiaw, we make amazing{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Cakes</a>,{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Cupcakes</a>,{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Cookies</a> and{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Brownies</a>.
        You can find us in Shillong every day of the week, serving fresh treats made from scratch.
      </>
    ),
    cta: 'VISIT OUR CAFE',
    href: '#contact',
  },
  {
    image: PEXELS(1793037),
    heading: 'CAKES & BAKES IN SHILLONG',
    body: () => (
      <>
        You can order our exceptional{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Cakes</a> and{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Cupcakes</a>,
        as well as our famous{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">New York Cookies</a> and{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Brownies</a>,
        for pickup in Shillong or hand delivery within the city. Custom orders welcome.
      </>
    ),
    cta: 'ORDER NOW',
    href: '#order',
  },
  {
    image: PEXELS(65882),
    heading: 'DELIVERY ACROSS SHILLONG',
    body: () => (
      <>
        Enjoy fresh delivery on our{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Cakes</a>,{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Cookies</a>, and{' '}
        <a href="#menu" className="underline underline-offset-2 hover:text-foreground transition-colors">Brownies</a>{' '}
        anywhere in Shillong with safe, contact-free delivery. Order online and treat yourself or someone special.
      </>
    ),
    cta: 'ORDER DELIVERY',
    href: '#order',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function About() {
  return (
    <section id="about" className="py-8 md:py-20 px-4 md:px-6 bg-background scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid md:grid-cols-3 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {columns.map((col) => (
            <motion.div
              key={col.heading}
              variants={cardVariants}
              className="flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-5">
                <img
                  src={col.image}
                  alt={col.heading}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="font-display text-xl md:text-2xl tracking-wider text-foreground mb-3">
                {col.heading}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5 flex-1">
                <col.body />
              </p>
<a
                href={col.href}
                className="inline-block py-3 text-sm uppercase tracking-[0.15em] font-bold text-foreground underline underline-offset-4 decoration-2 decoration-secondary/50 hover:decoration-secondary transition-all"
              >
                {col.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
