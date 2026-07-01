import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'CAKES', href: '#cakes' },
  { label: 'CUPCAKES', href: '#cupcakes' },
  { label: 'COOKIES', href: '#cookies' },
  { label: 'BROWNIES', href: '#brownies' },
  { label: 'ABOUT', href: '#about' },
  { label: 'REVIEWS', href: '#reviews' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Navbar({ onOrder }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-header ${
        scrolled ? 'shadow-lg' : 'shadow-none'
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3.5">
          <a href="#" className="font-serif text-xl md:text-2xl text-foreground font-bold tracking-wide">
          Crumbs Bakery &amp; Cafe
        </a>

        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.15em] font-semibold text-foreground/80 hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onOrder}
            className="bg-white text-foreground font-bold text-[11px] uppercase tracking-[0.15em] px-4 py-2 rounded-sm hover:bg-foreground hover:text-white transition-colors"
          >
            ORDER NOW
          </button>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden overflow-hidden bg-header relative z-50"
            >
              <div className="flex flex-col items-center gap-1 pb-6 px-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="w-full text-center text-xs uppercase tracking-[0.15em] font-semibold text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-colors rounded-sm py-3.5"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={() => { setOpen(false); if (onOrder) onOrder() }}
                  className="w-full bg-white text-foreground font-bold text-xs uppercase tracking-[0.15em] px-5 py-3.5 rounded-sm hover:bg-foreground hover:text-white transition-colors mt-3"
                >
                  ORDER NOW
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
