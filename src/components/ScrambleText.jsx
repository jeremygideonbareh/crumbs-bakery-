import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/`~ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export default function ScrambleText({ text, className, delay = 0, speed = 50 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    if (!inView) return

    const timeout = setTimeout(() => {
      let frame = 0
      const totalFrames = text.length * 3

      const interval = setInterval(() => {
        frame++
        const resolved = Math.floor(frame / 3)
        const scrambled = text.split('').map((char, i) => {
          if (i < resolved) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
        setDisplayText(scrambled)

        if (frame >= totalFrames) {
          setDisplayText(text)
          clearInterval(interval)
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [inView, text, delay, speed])

  return (
    <span ref={ref} className={className}>
      {displayText || text}
    </span>
  )
}
