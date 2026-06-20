import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Check, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const STEPS = ['Pick Your Base', 'Choose Size', 'Filling & Frosting', 'Customize', 'Review & Order']

const cakeBases = [
  { id: 'chocolate', name: 'Chocolate', desc: 'Rich, moist chocolate sponge', price: 0, emoji: '🍫' },
  { id: 'vanilla', name: 'Vanilla', desc: 'Classic buttery vanilla', price: 0, emoji: '🍦' },
  { id: 'red-velvet', name: 'Red Velvet', desc: 'Velvety cocoa with cream cheese', price: 100, emoji: '❤️' },
  { id: 'carrot', name: 'Carrot Cake', desc: 'Spiced with walnuts & cream cheese', price: 80, emoji: '🥕' },
  { id: 'lemon', name: 'Lemon Drizzle', desc: 'Zesty lemon with glaze', price: 60, emoji: '🍋' },
  { id: 'fruit', name: 'Fruit Cake', desc: 'Mixed dried fruits & brandy', price: 120, emoji: '🍇' },
]

const sizes = [
  { id: 'half', name: 'Half Kg', desc: 'Serves 4–6', price: 400 },
  { id: 'one', name: '1 Kg', desc: 'Serves 8–12', price: 700 },
  { id: 'two', name: '2 Kg', desc: 'Serves 16–24', price: 1300 },
  { id: 'three', name: '3 Kg', desc: 'Serves 24–36', price: 1800 },
]

const fillings = [
  { id: 'buttercream', name: 'Vanilla Buttercream', desc: 'Silky & classic', price: 0 },
  { id: 'chocolate-ganache', name: 'Chocolate Ganache', desc: 'Rich dark chocolate', price: 100 },
  { id: 'cream-cheese', name: 'Cream Cheese', desc: 'Tangy & smooth', price: 80 },
  { id: 'whipped-cream', name: 'Whipped Cream & Berries', desc: 'Light & fruity', price: 120 },
  { id: 'caramel', name: 'Salted Caramel', desc: 'Sweet & salty', price: 100 },
]

const frostings = [
  { id: 'chocolate', name: 'Chocolate Buttercream', price: 0 },
  { id: 'vanilla', name: 'Vanilla Buttercream', price: 0 },
  { id: 'cream-cheese', name: 'Cream Cheese Frosting', price: 60 },
  { id: 'fondant', name: 'Fondant Icing', price: 150 },
  { id: 'mirror-glaze', name: 'Mirror Glaze', price: 200 },
]

const extras = [
  { id: 'sprinkles', name: 'Sprinkles', price: 30, emoji: '🎉' },
  { id: 'fresh-fruit', name: 'Fresh Fruit Topping', price: 80, emoji: '🍓' },
  { id: 'candles', name: 'Candles (set of 5)', price: 25, emoji: '🕯️' },
  { id: 'happy-birthday', name: 'Happy Birthday Topper', price: 50, emoji: '🎂' },
  { id: 'flowers', name: 'Edible Flowers', price: 100, emoji: '🌸' },
  { id: 'gold-leaf', name: 'Gold Leaf Decoration', price: 200, emoji: '✨' },
]

export default function OrderModal({ open, onClose }) {
  const [step, setStep] = useState(0)
  const [base, setBase] = useState(null)
  const [size, setSize] = useState(null)
  const [filling, setFilling] = useState(null)
  const [frosting, setFrosting] = useState(null)
  const [selectedExtras, setSelectedExtras] = useState([])
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')

  const total =
    (base?.price || 0) +
    (size?.price || 0) +
    (filling?.price || 0) +
    (frosting?.price || 0) +
    selectedExtras.reduce((sum, e) => sum + e.price, 0)

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    )
  }

  const handleNext = () => {
    if (step === 0 && !base) { toast.error('Please pick a cake base'); return }
    if (step === 1 && !size) { toast.error('Please choose a size'); return }
    if (step === 2 && (!filling || !frosting)) { toast.error('Please select filling and frosting'); return }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = () => {
    toast.success('Order placed! We\'ll contact you shortly.', {
      description: `Total: ₹${total} · ${size?.name || ''} ${base?.name || ''} cake`,
      duration: 5000,
    })
    setStep(0)
    setBase(null)
    setSize(null)
    setFilling(null)
    setFrosting(null)
    setSelectedExtras([])
    setMessage('')
    setDate('')
    onClose()
  }

  const resetAndClose = () => {
    setStep(0)
    setBase(null)
    setSize(null)
    setFilling(null)
    setFrosting(null)
    setSelectedExtras([])
    setMessage('')
    setDate('')
    onClose()
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) resetAndClose() }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-primary/10 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-primary" />
                <h2 className="font-serif text-base md:text-xl text-foreground">Custom Cake Order</h2>
              </div>
              <button onClick={resetAndClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            <div className="px-4 md:px-6 pt-3 md:pt-4 shrink-0">
              <div className="w-full h-1.5 md:h-2 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[9px] md:text-[10px] text-muted-foreground">
                {STEPS.map((s, i) => (
                  <span key={s} className={`${i <= step ? 'text-primary font-medium' : ''}`}>
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 overscroll-contain">
              {step === 0 && (
                <div>
                  <p className="font-serif text-lg md:text-2xl text-foreground mb-0.5 md:mb-1">{STEPS[0]}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-5">What kind of cake are you craving?</p>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {cakeBases.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setBase(b)}
                        className={`text-left p-3 md:p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                          base?.id === b.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        <span className="text-xl md:text-2xl">{b.emoji}</span>
                        <p className="font-medium text-foreground text-xs md:text-sm mt-1">{b.name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">{b.desc}</p>
                        {b.price > 0 && <p className="text-[10px] md:text-xs text-primary mt-0.5">+₹{b.price}</p>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <p className="font-serif text-lg md:text-2xl text-foreground mb-0.5 md:mb-1">{STEPS[1]}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-5">How many people are you serving?</p>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {sizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSize(s)}
                        className={`text-left p-3 md:p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                          size?.id === s.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        <p className="font-medium text-foreground text-sm md:text-base">{s.name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">{s.desc}</p>
                        <p className="text-xs md:text-sm text-primary font-medium mt-1">₹{s.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="font-serif text-lg md:text-2xl text-foreground mb-0.5 md:mb-1">{STEPS[2]}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-5">Pick your filling & frosting</p>

                  <p className="text-[10px] md:text-xs font-medium text-foreground uppercase tracking-wider mb-2">Filling</p>
                  <div className="grid grid-cols-2 gap-2 mb-4 md:mb-6">
                    {fillings.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilling(f)}
                        className={`text-left p-2.5 md:p-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                          filling?.id === f.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        <p className="font-medium text-foreground text-xs md:text-sm">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                        {f.price > 0 && <p className="text-[10px] text-primary">+₹{f.price}</p>}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] md:text-xs font-medium text-foreground uppercase tracking-wider mb-2">Frosting</p>
                  <div className="grid grid-cols-2 gap-2">
                    {frostings.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFrosting(f)}
                        className={`text-left p-2.5 md:p-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                          frosting?.id === f.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        <p className="font-medium text-foreground text-xs md:text-sm">{f.name}</p>
                        {f.price > 0 && <p className="text-[10px] text-primary">+₹{f.price}</p>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="font-serif text-lg md:text-2xl text-foreground mb-0.5 md:mb-1">{STEPS[3]}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-5">Add extra touches & personalise</p>

                  <p className="text-[10px] md:text-xs font-medium text-foreground uppercase tracking-wider mb-2">Extras</p>
                  <div className="grid grid-cols-2 gap-2 mb-4 md:mb-6">
                    {extras.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => toggleExtra(e)}
                        className={`text-left p-2.5 md:p-3 rounded-xl border-2 transition-all active:scale-[0.98] ${
                          selectedExtras.find((x) => x.id === e.id)
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        <span className="text-sm md:text-base">{e.emoji} <span className="font-medium text-foreground text-xs md:text-sm">{e.name}</span></span>
                        <p className="text-[10px] text-primary">+₹{e.price}</p>
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] md:text-xs font-medium text-foreground uppercase tracking-wider mb-2">Cake Message</p>
                  <input
                    type="text"
                    placeholder="e.g. Happy Birthday, Sarah! 🎂"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border-2 border-primary/10 p-2.5 md:p-3 text-xs md:text-sm text-foreground bg-transparent focus:border-primary outline-none mb-3 md:mb-4"
                  />

                  <p className="text-[10px] md:text-xs font-medium text-foreground uppercase tracking-wider mb-2">Pickup/Delivery Date</p>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border-2 border-primary/10 p-2.5 md:p-3 text-xs md:text-sm text-foreground bg-transparent focus:border-primary outline-none"
                  />
                </div>
              )}

              {step === 4 && (
                <div>
                  <p className="font-serif text-lg md:text-2xl text-foreground mb-0.5 md:mb-1">{STEPS[4]}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-5">Review your custom cake order</p>

                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex justify-between items-center p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <div><p className="font-medium text-foreground text-xs md:text-sm">Base</p><p className="text-[10px] md:text-xs text-muted-foreground">{base?.name}</p></div>
                      <span className="text-xs md:text-sm font-medium text-foreground">₹{base?.price || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <div><p className="font-medium text-foreground text-xs md:text-sm">Size</p><p className="text-[10px] md:text-xs text-muted-foreground">{size?.name} — {size?.desc}</p></div>
                      <span className="text-xs md:text-sm font-medium text-foreground">₹{size?.price || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <div><p className="font-medium text-foreground text-xs md:text-sm">Filling</p><p className="text-[10px] md:text-xs text-muted-foreground">{filling?.name}</p></div>
                      <span className="text-xs md:text-sm font-medium text-foreground">₹{filling?.price || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <div><p className="font-medium text-foreground text-xs md:text-sm">Frosting</p><p className="text-[10px] md:text-xs text-muted-foreground">{frosting?.name}</p></div>
                      <span className="text-xs md:text-sm font-medium text-foreground">₹{frosting?.price || 0}</span>
                    </div>
                    {selectedExtras.length > 0 && (
                      <div className="flex justify-between items-start p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <div><p className="font-medium text-foreground text-xs md:text-sm">Extras</p>
                          <p className="text-[10px] text-muted-foreground">{selectedExtras.map((e) => e.name).join(', ')}</p>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-foreground">₹{selectedExtras.reduce((s, e) => s + e.price, 0)}</span>
                      </div>
                    )}
                    {message && (
                      <div className="flex justify-between items-center p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <div><p className="font-medium text-foreground text-xs md:text-sm">Message</p><p className="text-[10px] text-muted-foreground italic truncate max-w-[200px]">"{message}"</p></div>
                      </div>
                    )}
                    {date && (
                      <div className="flex justify-between items-center p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <div><p className="font-medium text-foreground text-xs md:text-sm">Date</p><p className="text-[10px] text-muted-foreground">{new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-primary/10 border-2 border-primary">
                    <p className="font-serif text-base md:text-lg text-foreground">Total</p>
                    <p className="font-serif text-lg md:text-2xl text-primary font-medium">₹{total}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-primary/10 shrink-0">
              {step > 0 ? (
                <Button variant="neutral" onClick={handleBack} size="sm" className="text-xs md:text-sm min-h-10">
                  <ChevronLeft size={14} /> Back
                </Button>
              ) : (
                <div />
              )}
              {step < STEPS.length - 1 ? (
                <Button onClick={handleNext} size="sm" className="text-xs md:text-sm min-h-10">
                  Next <ChevronRight size={14} />
                </Button>
              ) : (
                <Button onClick={handleSubmit} size="sm" className="text-xs md:text-sm min-h-10">
                  <Check size={14} /> Place — ₹{total}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
