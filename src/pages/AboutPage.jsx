import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import usePageSection from '@/hooks/usePageSection'
import { sanitizeHtml } from '@/lib/sanitize'

const LOCAL = (name) => `${import.meta.env.BASE_URL}images/${encodeURIComponent(name)}`

function splitParagraphs(text) {
  if (!text) return []
  return text.split(/\n\n+/).filter(Boolean)
}

export default function AboutPage() {
  const { data: hero } = usePageSection('about_hero', {
    subtitle: 'Our Story',
    title: 'Handcrafted with love <br /> <span class="italic">in the heart of Shillong</span>',
  })

  const { data: story } = usePageSection('about_story', {
    heading: 'FROM A DREAM TO A BAKERY',
    body: `Crumbs Bakery &amp; Cafe started in 2014 with a simple dream — to bring handcrafted, world-class bakes to the heart of Shillong. What began as a small kitchen in Jaiaw has grown into one of the city's most beloved bakeries.\n\nEvery cake, cupcake, cookie, and brownie we make starts with the finest ingredients and a recipe developed over years of practice. We believe in the power of small batches — it takes longer, but it means every single bake gets the attention it deserves.\n\nToday, we're a team of passionate bakers, decorators, and service professionals who wake up every morning excited to create something beautiful and delicious for our community.`,
    image: LOCAL('bespoke-cake-800.jpeg'),
  })

  const { data: timeline } = usePageSection('about_timeline', [
    { year: '2014', event: 'Crumbs Bakery opens its doors in Jaiaw, Shillong' },
    { year: '2016', event: 'Launched custom cake design service for birthdays & weddings' },
    { year: '2018', event: 'Expanded to full-service cafe with dine-in seating' },
    { year: '2020', event: 'Launched online ordering & contact-free delivery' },
    { year: '2024', event: "Named one of Shillong's best bakeries — 500+ happy customers served" },
    { year: '2026', event: 'Continuing to bake, innovate, and spread sweetness every day' },
  ])

  const { data: values } = usePageSection('about_values', [
    { title: 'Fresh Ingredients', desc: 'We source the finest local and imported ingredients — free-range eggs, Belgian chocolate, real butter.' },
    { title: 'Small Batches', desc: 'Every bake is made in small batches to ensure quality, consistency, and attention to detail.' },
    { title: 'Handcrafted', desc: 'No shortcuts, no mixes. Every cake, cupcake, cookie, and brownie is made from scratch by hand.' },
    { title: 'Community First', desc: "We're a Shillong business supporting local families, local suppliers, and our community." },
  ])

  const { data: team } = usePageSection('about_team', [
    { name: 'Jemma', role: 'Founder & Head Baker', image: LOCAL('delivery-bakery.jpeg') },
    { name: 'Priya', role: 'Pastry Chef', image: LOCAL('cakes-menu.jpeg') },
    { name: 'Arun', role: 'Operations Manager', image: LOCAL('blueberry-cheesecake.jpeg') },
    { name: 'Maya', role: 'Customer Experience', image: LOCAL('fresh-bakes-4.jpeg') },
  ])

  const { data: cta } = usePageSection('about_cta', {
    heading: 'VISIT US TODAY',
    body: 'Stop by our Jaiaw cafe for a treat, or order online for delivery anywhere in Shillong.',
    button1_text: 'Find Us',
    button1_link: '/contact',
    button2_text: 'Browse Menu',
    button2_link: '/cakes',
  })

  const timelineItems = Array.isArray(timeline) ? timeline : []
  const valuesList = Array.isArray(values) ? values : []
  const teamMembers = Array.isArray(team) ? team : []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      {/* Hero */}
      <section className="relative pt-16 md:pt-20 bg-primary/20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
          {hero?.subtitle && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-work text-[13px] uppercase tracking-[0.2em] text-muted-foreground font-medium"
            >
              {hero.subtitle}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-foreground mt-3"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(hero?.title) }}
          />
        </div>
      </section>

      {/* Story */}
      <section className="py-10 md:py-16 px-4 md:px-6 bg-background">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {story?.image && (
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={story.image}
                  alt="Crumbs Bakery"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div>
              {story?.heading && (
                <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-tight mb-4">
                  {story.heading}
                </h2>
              )}
              {story?.body && (
                <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {splitParagraphs(story.body).map((p, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(p) }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      {timelineItems.length > 0 && (
        <section className="py-10 md:py-16 px-4 md:px-6 bg-primary/10">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-8 md:mb-10 tracking-tight">
              OUR JOURNEY
            </h2>
            <div className="space-y-4">
              {timelineItems.map((item, i) => (
                <motion.div
                  key={item.year || i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-start gap-4 md:gap-6"
                >
                  <span className="shrink-0 font-display text-lg md:text-xl text-header w-14 md:w-16 pt-0.5">{item.year}</span>
                  <div className="w-px bg-header/30 shrink-0 self-stretch" />
                  <p className="text-sm md:text-base text-foreground/80 font-work">{item.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {valuesList.length > 0 && (
        <section className="py-10 md:py-16 px-4 md:px-6 bg-background">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-8 md:mb-10 tracking-tight">
              WHAT WE STAND FOR
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {valuesList.map((v, i) => (
                <motion.div
                  key={v.title || i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-white border border-primary/10 p-4 md:p-5 rounded-sm"
                >
                  <h3 className="font-work text-sm font-bold text-foreground mb-1.5">{v.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {teamMembers.length > 0 && (
        <section className="py-10 md:py-16 px-4 md:px-6 bg-primary/10">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-8 md:mb-10 tracking-tight">
              MEET THE TEAM
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.name || i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="text-center"
                >
                  {member.image && (
                    <div className="aspect-square overflow-hidden rounded-full mb-3 mx-auto max-w-[120px] md:max-w-[140px]">
                      <img src={member.image} alt={member.name || ''} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <h3 className="font-work text-sm font-bold text-foreground">{member.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {cta?.heading && (
        <section className="py-10 md:py-16 px-4 md:px-6 bg-background text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-tight mb-4">
              {cta.heading}
            </h2>
            {cta?.body && (
              <p className="text-sm text-muted-foreground mb-6">{cta.body}</p>
            )}
            <div className="flex items-center justify-center gap-3">
              {cta?.button1_text && (
                <Link to={cta.button1_link || '#'}>
                  <Button className="text-sm">{cta.button1_text}</Button>
                </Link>
              )}
              {cta?.button2_text && (
                <Link to={cta.button2_link || '#'}>
                  <Button variant="neutral" className="text-sm">{cta.button2_text}</Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  )
}
