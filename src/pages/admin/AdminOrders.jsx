import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Eye, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminApi } from '@/hooks/useAdminApi'

const statusColors = {
  pending: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-blue-50 text-blue-600',
  completed: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const api = useAdminApi()

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    setLoading(true)
    try {
      const { data } = await api.orders.list()
      setOrders(data ?? [])
    } catch (err) { console.error(err); toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.orders.updateStatus(id, status)
      await loadOrders()
    } catch (err) { console.error(err); toast.error('Failed to update order status') }
  }

  const parseCustomer = (customer) => {
    try {
      return typeof customer === 'string' ? JSON.parse(customer) : customer || {}
    } catch {
      return { name: 'Unknown', phone: '', email: '' }
    }
  }

  const parseItems = (items) => {
    try { return typeof items === 'string' ? JSON.parse(items) : items }
    catch { return items }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage cake orders</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No orders yet</td></tr>
              ) : (
                orders.map((order) => {
                  const customer = parseCustomer(order.customer)
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">#{order.id}</td>
                      <td className="px-4 py-3 text-gray-800">{customer.name || 'Unknown'}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${customer.phone}`} className="text-teal-600 hover:underline text-xs">{customer.phone || '-'}</a>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">₹{order.total}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : '-')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-50 text-gray-500'}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                            <Eye size={14} />
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(order.id, 'confirmed')}
                                className="p-1.5 hover:bg-blue-50 rounded text-blue-500">
                                <CheckCircle size={14} />
                              </button>
                              <button onClick={() => updateStatus(order.id, 'cancelled')}
                                className="p-1.5 hover:bg-red-50 rounded text-red-500">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {order.status === 'confirmed' && (
                            <button onClick={() => updateStatus(order.id, 'completed')}
                              className="p-1.5 hover:bg-green-50 rounded text-green-500">
                              <CheckCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const order = orders.find((o) => o.id === selectedOrder)
              if (!order) return null
              const customer = parseCustomer(order.customer)
              const items = parseItems(order.items)
              return (
                <>
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Order #{order.id}</h2>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={18} /></button>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
                        <p className="font-medium text-gray-800">{customer.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-50'}`}>{order.status}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <a href={`tel:${customer.phone}`} className="text-teal-600 text-sm">{customer.phone || '-'}</a>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm text-gray-800">{customer.email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                        <p className="font-bold text-lg text-gray-900">₹{order.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Date Requested</p>
                        <p className="text-sm text-gray-800">{order.date || 'Not specified'}</p>
                      </div>
                    </div>
                    {order.message && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Message</p>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{order.message}</p>
                      </div>
                    )}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Cake Details</p>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                          {items.base && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Base</span>
                              <span className="font-medium text-gray-800">{items.base.name}</span>
                            </div>
                          )}
                          {items.size && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Size</span>
                              <span className="font-medium text-gray-800">{items.size.name}</span>
                            </div>
                          )}
                          {items.filling && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Filling</span>
                              <span className="font-medium text-gray-800">{items.filling.name}</span>
                            </div>
                          )}
                          {items.frosting && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Frosting</span>
                              <span className="font-medium text-gray-800">{items.frosting.name}</span>
                            </div>
                          )}
                          {items.extras && items.extras.length > 0 && (
                            <div>
                              <span className="text-gray-500">Extras</span>
                              <ul className="mt-1 space-y-0.5">
                                {items.extras.map((extra, i) => (
                                  <li key={i} className="flex justify-between pl-3">
                                    <span className="text-gray-700">{extra.name}</span>
                                    {extra.price > 0 && <span className="text-gray-500 text-xs">+₹{extra.price}</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {items.message && (
                            <div className="pt-2 border-t border-gray-200">
                              <span className="text-gray-500 text-xs block mb-1">Cake Message</span>
                              <span className="text-gray-800 italic">"{items.message}"</span>
                            </div>
                          )}
                        </div>
                      </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
