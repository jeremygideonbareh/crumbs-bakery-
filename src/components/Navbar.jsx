import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'CAKES', href: '/cakes' },
  { label: 'CUPCAKES', href: '/cupcakes' },
  { label: 'DESSERTS', href: '/desserts' },
  { label: 'ABOUT', href: '/about' },
  { label: 'REVIEWS', href: '/reviews' },
  { label: 'CONTACT', href: '/contact' },
]

export default function Navbar({ onOrder }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-header ${
        scrolled ? 'shadow-lg' : 'shadow-none'
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3.5">
        <Link to="/" className="font-serif text-xl md:text-2xl text-foreground font-bold tracking-wide py-3">
          Crumbs Bakery &amp; Cafe
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors ${
                  isActive ? 'text-foreground' : 'text-foreground/80 hover:text-foreground'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={onOrder}
            className="bg-white text-foreground font-bold text-[11px] uppercase tracking-[0.15em] px-4 py-2 rounded-sm hover:bg-foreground hover:text-white transition-all active:scale-[0.97]"
          >
            ORDER NOW
          </button>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground p-3 active:scale-[0.97] transition-transform"
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
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `w-full text-center text-[13px] uppercase tracking-[0.15em] font-semibold transition-colors rounded-sm py-4 active:scale-[0.97] ${
                        isActive ? 'text-foreground bg-foreground/10' : 'text-foreground/80 hover:text-foreground hover:bg-foreground/10'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <button
                  onClick={() => { setOpen(false); if (onOrder) onOrder() }}
                  className="w-full bg-white text-foreground font-bold text-xs uppercase tracking-[0.15em] px-5 py-4 rounded-sm hover:bg-foreground hover:text-white transition-all mt-3 active:scale-[0.97]"
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
