import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <section id="contact" className="relative py-28 md:py-36 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.2em] uppercase font-medium mb-4">
            Get in Touch
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] text-foreground">
            Find us in <span className="text-primary italic">Shillong</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Stop by for a treat, give us a call, or order online. We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
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
                  className="flex items-start gap-4 rounded-xl border border-primary/10 bg-white p-5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-foreground hover:text-primary transition-colors whitespace-pre-line"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-foreground whitespace-pre-line">{info.value}</p>
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
              className="flex gap-3 pt-2"
            >
              <Button onClick={onOrder} className="flex-1">
                Order Now
              </Button>
              <a href="https://maps.google.com/?q=Crumbs+Bakery+%26+Cafe+Shillong" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="neutral" className="w-full">
                  Get Directions
                </Button>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="rounded-xl overflow-hidden border border-primary/10 h-[400px] shadow-sm"
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
