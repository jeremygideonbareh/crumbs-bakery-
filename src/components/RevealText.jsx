import { motion } from 'framer-motion'

export function WordReveal({ children, className, delay = 0 }) {
  if (typeof children !== 'string') return <span className={className}>{children}</span>
  const words = children.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: delay + i * 0.04, ease: [0.25, 0.4, 0.25, 1] }}
          className="inline-block"
        >
          {word} 
        </motion.span>
      ))}
    </span>
  )
}

export function CharReveal({ children, className, delay = 0 }) {
  if (typeof children !== 'string') return <span className={className}>{children}</span>
  const chars = children.split('')
  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, delay: delay + i * 0.015, ease: [0.25, 0.4, 0.25, 1] }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

export function SectionEyebrow({ children, delay = 0 }) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs tracking-wider uppercase font-medium mb-5"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {children}
    </motion.p>
  )
}

export function SectionHeading({ children, className, delay = 0 }) {
  return (
    <h2 className={`font-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.2] text-balance text-foreground break-words ${className || ''}`}>
      <CharReveal delay={delay}>{children}</CharReveal>
    </h2>
  )
}
