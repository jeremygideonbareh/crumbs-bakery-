import { useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'

export function useOrderContext() {
  return useOutletContext()
}
import { Toaster } from 'sonner'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import OrderModal from './OrderModal'

export default function Layout() {
  const [orderOpen, setOrderOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <Navbar onOrder={() => setOrderOpen(true)} />
      <main>
        <Outlet context={{ onOrder: () => setOrderOpen(true) }} />
      </main>
      <Footer />
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
      <Toaster richColors position="bottom-right" />
    </div>
  )
}
