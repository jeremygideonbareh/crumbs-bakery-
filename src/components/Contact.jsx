import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionEyebrow, CharReveal } from './RevealText'

const contactInfo = [
  {
    icon: MapPin,
    label: 'Location',
    value: 'Jaiaw Chapel Rd, opposite Jaiaw\nPresbyterian, Shillong, Meghalaya 793002',
    href: 'https://maps.google.com/?q=Crumbs+Bakery+%26+Cafe+Shillong',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '096127 72089',
    href: 'tel:+919612772089',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon–Sun: 8:00 AM – 9:30 PM',
  },
  {
    icon: MessageCircle,
    label: 'Services',
    value: 'Dine-in · Takeaway · Delivery',
  },
]

export default function Contact({ onOrder }) {
  return (
    <section id="contact" className="relative py-8 md:py-28 lg:py-36 px-4 md:px-6 scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-10 md:mb-16"
        >
          <SectionEyebrow>Get in Touch</SectionEyebrow>
          <h2 className="font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.2] text-balance text-foreground break-words">
            <CharReveal>Find us in </CharReveal>
            <span className="text-foreground italic"><CharReveal delay={0.3}>Shillong</CharReveal></span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Stop by for a treat, give us a call, or order online. We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="space-y-3 md:space-y-4"
          >
            {contactInfo.map((info, i) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-3 md:gap-4 rounded-xl border border-primary/10 bg-white p-3 md:p-5 shadow-sm"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-[13px] md:text-sm text-foreground hover:text-foreground transition-colors whitespace-pre-line break-words"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-xs md:text-sm text-foreground whitespace-pre-line break-words">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex gap-2 md:gap-3 pt-1 md:pt-2"
            >
              <Button onClick={onOrder} className="flex-1 min-h-[44px] text-sm md:text-sm">
                Order Now
              </Button>
              <a href="https://maps.google.com/?q=Crumbs+Bakery+%26+Cafe+Shillong" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="neutral" className="w-full min-h-[44px] text-sm md:text-sm">
                  Directions
                </Button>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="rounded-xl overflow-hidden border border-primary/10 h-[300px] md:h-[400px] shadow-sm"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.079772766145!2d91.8766284!3d25.5855879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37507f89317d134b%3A0xfb2b38342e332fbf!2sCrumbs%20Bakery%20%26%20Cafe!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Crumbs Bakery & Cafe location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
