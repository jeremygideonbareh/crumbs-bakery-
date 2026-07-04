import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle, Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

const contactInfo = [
  { icon: MapPin, label: 'Location', value: 'Jaiaw Chapel Rd, opposite Jaiaw Presbyterian, Shillong, Meghalaya 793002', href: 'https://maps.google.com/?q=Crumbs+Bakery+%26+Cafe+Shillong' },
  { icon: Phone, label: 'Phone', value: '096127 72089', href: 'tel:+919612772089' },
  { icon: Mail, label: 'Email', value: 'hello@crumbs.in', href: 'mailto:hello@crumbs.in' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat: 8:00 AM – 9:30 PM\nSun: 10:00 AM – 6:00 PM' },
]

const faqs = [
  { q: 'Do you offer gluten-free options?', a: 'Yes! We have gluten-free cupcakes, brownies, and select cake flavours. Check individual product pages or contact us for details.' },
  { q: 'How far in advance should I order?', a: 'We recommend 24-48 hours for standard orders. Custom cakes may require 3-5 days. Contact us for rush orders.' },
  { q: 'What areas do you deliver to?', a: 'We deliver anywhere in Shillong. Same-day delivery available for orders placed before 2PM.' },
  { q: 'Can I customise a cake?', a: 'Absolutely! Use our custom cake builder or contact us directly to design your perfect cake.' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in name, email, and message.')
      return
    }
    setSending(true)
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name, email: form.email, phone: form.phone, message: form.message,
    })
    if (error) {
      toast.error('Something went wrong. Please try again.')
      setSending(false)
      return
    }
    toast.success('Message sent! We\'ll get back to you within an hour.')
    setForm({ name: '', email: '', phone: '', message: '' })
    setSending(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      {/* Hero */}
      <section className="relative pt-16 md:pt-20 bg-primary/20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium"
          >
            Get in Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] text-foreground mt-3"
          >
            We'd love to hear from you
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto"
          >
            Whether it's a custom cake order, a catering enquiry, or just to say hello — drop us a message and we'll get back to you within an hour.
          </motion.p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-10 md:py-16 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-2xl text-foreground tracking-tight mb-5">
                SEND US A MESSAGE
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-work font-semibold mb-1">Name</label>
                    <input id="contact-name" name="name" type="text" value={form.name} onChange={handleChange} className="w-full border border-primary/20 bg-white px-3 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:border-header transition-colors" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-work font-semibold mb-1">Email</label>
                    <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-primary/20 bg-white px-3 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:border-header transition-colors" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-work font-semibold mb-1">Phone</label>
                  <input id="contact-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full border border-primary/20 bg-white px-3 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:border-header transition-colors" placeholder="+91 9XXXX XXXXX" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-work font-semibold mb-1">Message</label>
                  <textarea id="contact-message" name="message" rows={4} value={form.message} onChange={handleChange} className="w-full border border-primary/20 bg-white px-3 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:border-header transition-colors resize-none" placeholder="Tell us about your order, event, or enquiry..." />
                </div>
                <Button type="submit" disabled={sending} className="w-full md:w-auto text-sm gap-2">
                  <Send size={14} />
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-3 md:space-y-4"
            >
              <h2 className="font-display text-2xl text-foreground tracking-tight mb-5">
                VISIT OR CALL
              </h2>
              {contactInfo.map((info, i) => {
                const Icon = info.icon
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="flex items-start gap-3 rounded-xl border border-primary/10 bg-white p-3 md:p-4 shadow-sm"
                  >
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-work font-semibold mb-0.5">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-[13px] text-foreground hover:text-foreground transition-colors whitespace-pre-line">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-[13px] text-foreground whitespace-pre-line">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-primary/10 h-[200px] md:h-[220px] shadow-sm mt-5">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.079772766145!2d91.8766284!3d25.5855879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37507f89317d134b%3A0xfb2b38342e332fbf!2sCrumbs%20Bakery%20%26%20Cafe!5e0!3m2!1sen!2sin!4v1"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Crumbs Bakery & Cafe location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 md:py-14 px-4 md:px-6 bg-primary/10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-6 md:mb-8 tracking-tight">
            QUICK ANSWERS
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-primary/10 rounded-sm open:border-header/30 transition-all">
                <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer text-[13px] font-bold uppercase tracking-[0.03em] text-foreground font-work active:scale-[0.97]">
                  {faq.q}
                  <span className="shrink-0 ml-2 transition-transform duration-300 group-open:rotate-180 text-muted-foreground">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-primary/10 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  )
}
