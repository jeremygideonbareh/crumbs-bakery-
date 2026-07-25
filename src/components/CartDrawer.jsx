import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Plus, Minus, Cake, Send, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { useCart, formatPrice } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const [checkoutMode, setCheckoutMode] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [date, setDate] = useState(null)
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!phone.trim() || !/^[\d\s+\-()]{6,20}$/.test(phone.trim())) {
      e.phone = 'Enter a valid phone number (6-20 digits)'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmitPreOrder = async () => {
    if (!validate()) return
    setProcessing(true)

    try {
      const ordersInsert = {
        items: items.map(item => ({
          cartId: item.cartId,
          name: item.name,
          price: formatPrice(item.price * item.quantity),
          quantity: item.quantity,
          variant: item.variant || null,
          ...(item.type === 'custom-cake' ? { customizations: item.customizations, customPrice: item.customPrice } : {}),
        })),
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim() || 'Pickup',
        },
        total: subtotal,
        message: notes.trim(),
        date: date ? date.toISOString().split('T')[0] : null,
      }
      const { error } = await supabase.from('orders').insert(ordersInsert)
      if (error) throw error

      toast.success('Pre-order submitted! Lily will confirm via WhatsApp shortly.', {
        description: `Total: ${formatPrice(subtotal)}`,
        duration: 5000,
      })
      clearCart()
      setCheckoutMode(false)
      setName(''); setPhone(''); setAddress(''); setDate(null); setNotes('')
      setErrors({})
      onClose()
    } catch {
      toast.error('Pre-order failed to save. Please try again or contact Lily.')
    }
    setProcessing(false)
  }

  const handleClose = () => {
    setCheckoutMode(false)
    setErrors({})
    onClose()
  }

  const getCustomSummary = (item) => {
    if (!item.customizations) return ''
    const c = item.customizations
    const parts = []
    if (c.base && typeof c.base === 'string') parts.push(c.base)
    if (c.size && typeof c.size === 'string') parts.push(c.size)
    if (c.filling && typeof c.filling === 'string') parts.push(c.filling)
    if (c.frosting && typeof c.frosting === 'string') parts.push(c.frosting)
    if (c.extras && Array.isArray(c.extras) && c.extras.length) {
      parts.push(`+${c.extras.length} extras`)
    }
    return parts.join(', ')
  }

  const hasItems = items.length > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[90vw] max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-primary/10 shrink-0">
              <h2 className="font-serif text-lg text-foreground">
                {checkoutMode
                  ? 'Pre-Order Details'
                  : `Your Cart (${items.length} item${items.length !== 1 ? 's' : ''})`}
              </h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.97]"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {!hasItems && !checkoutMode ? (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart size={32} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">Your cart is empty</p>
                <Link
                  to="/menus"
                  onClick={onClose}
                  className="text-sm font-medium text-teal hover:text-teal/80 underline underline-offset-2 transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            ) : checkoutMode ? (
              /* Checkout Form */
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                <button
                  onClick={() => { setCheckoutMode(false); setErrors({}) }}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft size={16} />
                  Back to cart
                </button>

                <div>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-lg border-2 p-2.5 text-sm text-foreground bg-transparent outline-none transition-colors ${
                      errors.name ? 'border-red-400 focus:border-red-500' : 'border-primary/10 focus:border-teal'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full rounded-lg border-2 p-2.5 text-sm text-foreground bg-transparent outline-none transition-colors ${
                      errors.phone ? 'border-red-400 focus:border-red-500' : 'border-primary/10 focus:border-teal'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <textarea
                    placeholder="Delivery Address / Pickup Location"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className={`w-full rounded-lg border-2 p-2.5 text-sm text-foreground bg-transparent outline-none resize-none transition-colors ${
                      errors.address ? 'border-red-400 focus:border-red-500' : 'border-primary/10 focus:border-teal'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Delivery Date (optional)</p>
                  <DatePicker
                    selected={date}
                    onChange={(d) => setDate(d)}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select a date"
                    className="w-full rounded-lg border-2 border-primary/10 p-2.5 text-sm text-foreground bg-transparent outline-none focus:border-teal transition-colors"
                    wrapperClassName="w-full"
                  />
                </div>

                <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Pre-Order Notes (optional)</p>
                  <textarea
                    placeholder="Any special instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border-2 border-primary/10 p-2.5 text-sm text-foreground bg-transparent outline-none resize-none focus:border-teal transition-colors"
                  />
                </div>
              </div>
            ) : (
              /* Items List */
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10"
                  >
                    {item.type === 'custom-cake' ? (
                      <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                        <Cake size={20} className="text-teal" />
                      </div>
                    ) : item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ShoppingCart size={16} className="text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.type === 'custom-cake' ? 'Custom Cake' : item.name}
                          </p>
                          {item.variant && (
                            <span className="inline-block text-[10px] bg-teal/10 text-teal font-medium rounded px-1.5 py-0.5 mt-0.5">
                              {item.variant}
                            </span>
                          )}
                          {item.type === 'custom-cake' && getCustomSummary(item) && (
                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[180px]">
                              {getCustomSummary(item)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                        <span className="text-sm font-medium text-foreground shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-7 h-7 rounded-md border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all active:scale-[0.92]"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-foreground select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-7 h-7 rounded-md border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all active:scale-[0.92]"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="w-7 h-7 rounded-md border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-200 transition-all active:scale-[0.92] ml-2"
                          aria-label="Remove item"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer - Subtotal + Action */}
            {hasItems && (
              <div className="shrink-0 border-t border-primary/10 px-4 py-3 space-y-3">
                {!checkoutMode ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Subtotal</span>
                      <span className="font-serif text-base font-medium text-foreground">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <button
                      onClick={() => setCheckoutMode(true)}
                      className="w-full bg-teal text-white font-medium text-sm py-3 rounded-lg hover:bg-teal/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      Continue to Pre-Order
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSubmitPreOrder}
                    disabled={processing}
                    className="w-full bg-teal text-white font-medium text-sm py-3 rounded-lg hover:bg-teal/90 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Pre-Order
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
