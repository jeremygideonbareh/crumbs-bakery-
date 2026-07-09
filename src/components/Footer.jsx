import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import usePageSection from '@/hooks/usePageSection'
import { FOOTER_DEFAULTS } from '@/data/contentDefaults'

const socialIcons = {
  Facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  YouTube: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  ),
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function Footer() {
  const { data } = usePageSection('footer', FOOTER_DEFAULTS)

  return (
    <footer className="bg-footer text-foreground">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Column 1 — Brand */}
          <motion.div variants={itemVariants}>
            <h3 className="font-display text-xl tracking-wider text-foreground mb-3">
              {data.brand_name}
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed mb-5 font-work">
              {data.brand_description}
            </p>
            <div className="flex items-center gap-3">
              {(data.social || []).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 md:w-9 md:h-9 flex items-center justify-center rounded-full border border-foreground/20 text-foreground/70 hover:bg-foreground/10 hover:text-foreground hover:border-foreground transition-all active:scale-[0.97]"
                >
                  {socialIcons[social.label] || socialIcons.Instagram}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 — Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display text-sm tracking-[0.2em] text-foreground mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              {(data.quick_links || []).map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-foreground/70 text-sm font-work hover:text-foreground transition-colors active:scale-[0.97] inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 — Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display text-sm tracking-[0.2em] text-foreground mb-4">
              CONTACT
            </h4>
            <ul className="space-y-3 text-foreground/70 text-sm font-work">
              <li>
                <span className="block text-foreground/50 text-[10px] uppercase tracking-[0.15em] mb-0.5">Address</span>
                {data.contact?.address}
              </li>
              <li>
                <span className="block text-foreground/50 text-[10px] uppercase tracking-[0.15em] mb-0.5">Phone</span>
                <a href={`tel:${data.contact?.phone || ''}`} className="hover:text-foreground transition-colors active:scale-[0.97] inline-block">
                  {data.contact?.phone}
                </a>
              </li>
              <li>
                <span className="block text-foreground/50 text-[10px] uppercase tracking-[0.15em] mb-0.5">Email</span>
                <a href={`mailto:${data.contact?.email || ''}`} className="hover:text-foreground transition-colors active:scale-[0.97] inline-block">
                  {data.contact?.email}
                </a>
              </li>
              <li>
                <span className="block text-foreground/50 text-[10px] uppercase tracking-[0.15em] mb-0.5">Hours</span>
                {data.contact?.hours?.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </li>
            </ul>
          </motion.div>

          {/* Column 4 — Follow Us */}
          <motion.div variants={itemVariants}>
            <h4 className="font-display text-sm tracking-[0.2em] text-foreground mb-4">
              FOLLOW US
            </h4>
            <p className="text-foreground/70 text-sm font-work mb-4">
              Stay connected for daily treats, behind-the-scenes, and special offers.
            </p>
            <div className="flex flex-wrap gap-2">
              {(data.social || []).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-sm border border-foreground/20 text-foreground/70 text-xs font-work hover:bg-foreground/10 hover:text-foreground hover:border-foreground transition-all active:scale-[0.97]"
                >
                  {socialIcons[social.label] || socialIcons.Instagram}
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="bg-header py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-white/70 text-[11px] md:text-xs font-work">
          <p>&copy; {new Date().getFullYear()} {data.brand_name}. All rights reserved.</p>
          <p>{data.bottom_text}</p>
        </div>
      </div>
    </footer>
  )
}
