import { useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import { Toaster } from 'sonner'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import OrderModal from './OrderModal'
import CartDrawer from './CartDrawer'
import { CartProvider } from '@/context/CartContext'

export function useOrderContext() {
  return useOutletContext()
}

export function useCartDrawer() {
  return useOutletContext()
}

export default function Layout() {
  const [orderOpen, setOrderOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <AnnouncementBar />
        <Navbar onOrder={() => setOrderOpen(true)} onCartClick={() => setCartOpen(true)} />
        <main>
          <Outlet context={{ onOrder: () => setOrderOpen(true), openCart: () => setCartOpen(true) }} />
        </main>
        <Footer />
        <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <Toaster richColors position="bottom-right" />
      </div>
    </CartProvider>
  )
}
