import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

const STORAGE_KEY = 'crumbs_cart'

function generateCartId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        item && typeof item === 'object' && item.cartId && item.productId
    )
  } catch {
    return []
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

/**
 * Strips currency symbols (₹, commas) from a price string and returns a number.
 * Accepts strings like "₹1,100" or numbers.
 */
export function parsePrice(value) {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  if (typeof value !== 'string') return 0
  const cleaned = value.replace(/[₹,\s]/g, '')
  const num = Number(cleaned)
  return Number.isNaN(num) ? 0 : num
}

/**
 * Formats a number to Indian currency format, e.g. 1200 → "₹1,200".
 */
export function formatPrice(value) {
  const num = typeof value === 'string' ? parsePrice(value) : value
  if (typeof num !== 'number' || Number.isNaN(num)) return '₹0'
  return '₹' + num.toLocaleString('en-IN')
}

const CartContext = createContext(null)

const ACTION = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QTY: 'UPDATE_QTY',
  CLEAR: 'CLEAR',
}

function cartReducer(state, action) {
  switch (action.type) {
    case ACTION.ADD_ITEM: {
      const { product, variant } = action.payload
      const variantKey = variant ?? null

      const existingIndex = state.findIndex(
        (item) => item.productId === product.id && item.variant === variantKey
      )

      if (existingIndex !== -1) {
        const next = [...state]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        }
        return next
      }

      const rawPrice = product.type === 'custom-cake' ? product.customPrice ?? product.price : product.price
      const price = product.type === 'custom-cake' ? rawPrice : parsePrice(rawPrice)
      const newItem = {
        cartId: generateCartId(),
        productId: product.id,
        name: product.name,
        price,
        image: product.image ?? null,
        type: product.type || 'product',
        variant: variantKey,
        quantity: 1,
        customizations: product.customizations ?? null,
        customPrice: product.customPrice ?? null,
      }

      return [...state, newItem]
    }

    case ACTION.REMOVE_ITEM:
      return state.filter((item) => item.cartId !== action.payload.cartId)

    case ACTION.UPDATE_QTY: {
      const { cartId, qty } = action.payload
      if (qty < 1) return state.filter((item) => item.cartId !== cartId)
      return state.map((item) =>
        item.cartId === cartId ? { ...item, quantity: qty } : item
      )
    }

    case ACTION.CLEAR:
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, null, loadCartFromStorage)

  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const addToCart = useCallback((product, variant) => {
    if (!product || !product.id) {
      toast.error('Invalid product')
      return
    }
    dispatch({ type: ACTION.ADD_ITEM, payload: { product, variant } })
    toast.success(`${product.name} added to cart`)
  }, [])

  const removeFromCart = useCallback((cartId) => {
    dispatch({ type: ACTION.REMOVE_ITEM, payload: { cartId } })
  }, [])

  const updateQuantity = useCallback((cartId, qty) => {
    if (typeof qty !== 'number' || qty < 0) return
    dispatch({ type: ACTION.UPDATE_QTY, payload: { cartId, qty } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: ACTION.CLEAR })
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const value = {
    items,
    itemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
