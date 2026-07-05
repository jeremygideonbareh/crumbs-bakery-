import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, MessageSquare, Star, Package, TrendingUp, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAdminApi } from '@/hooks/useAdminApi'

const statCards = [
  { key: 'orders', icon: ShoppingBag, label: 'Total Orders', color: 'bg-blue-50 text-blue-600' },
  { key: 'messages', icon: MessageSquare, label: 'New Messages', color: 'bg-amber-50 text-amber-600' },
  { key: 'reviews', icon: Star, label: 'Pending Reviews', color: 'bg-purple-50 text-purple-600' },
  { key: 'products', icon: Package, label: 'Products', color: 'bg-green-50 text-green-600' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, messages: 0, reviews: 0, products: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const api = useAdminApi()

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          { data: ordersCount },
          { data: messagesCount },
          { count: reviews },
          { count: products },
          { data: ordersData },
        ] = await Promise.all([
          api.orders.count(),
          api.messages.unreadCount(),
          supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('approved', false),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          api.orders.recent(5),
        ])
        setStats({
          orders: ordersCount ?? 0,
          messages: messagesCount ?? 0,
          reviews: reviews ?? 0,
          products: products ?? 0,
        })
        setRecentOrders(ordersData ?? [])
      } catch (err) {
        console.error('Failed to load dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your bakery's activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats[card.key]}
            </p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <h2 className="font-semibold text-gray-900 text-sm">Recent Orders</h2>
          </div>
          <span className="text-xs text-gray-400">Last 5</span>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-400">Loading...</div>
          ) : recentOrders.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No orders yet</div>
          ) : (
            recentOrders.map((order, i) => {
              const customer =
                typeof order.customer === 'string'
                  ? JSON.parse(order.customer)
                  : order.customer || {}
              return (
                <div key={order.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-xs font-bold text-teal-600">
                      {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {customer.name || 'Unknown'} — ₹{order.total}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === 'pending'
                        ? 'bg-amber-50 text-amber-600'
                        : order.status === 'confirmed'
                        ? 'bg-blue-50 text-blue-600'
                        : order.status === 'completed'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {order.status || 'pending'}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
