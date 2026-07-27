import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Eye, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminApi } from '@/hooks/useAdminApi'

const statusColors = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-green-50 text-green-600',
  rejected: 'bg-red-50 text-red-600',
  completed: 'bg-blue-50 text-blue-600',
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
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pre-Orders</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage cake pre-orders</p>
      </div>

      <div className="mb-6 bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800">
        <p className="font-medium mb-1">📋 Pre-order instructions</p>
        <p>New pre-orders come in with <strong>Pending</strong> status. Check the details, then <strong>Approve</strong> or <strong>Reject</strong>. Payment is handled outside the website — contact the customer directly to arrange.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Pre-Order</th>
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
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No pre-orders yet</td></tr>
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
                            className="p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600">
                            <Eye size={14} />
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(order.id, 'approved')}
                                className="p-1.5 hover:bg-green-50 rounded text-green-500" title="Approve pre-order">
                                <CheckCircle size={14} />
                              </button>
                              <button onClick={() => updateStatus(order.id, 'rejected')}
                                className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Reject pre-order">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {order.status === 'approved' && (
                            <>
                              <button onClick={() => updateStatus(order.id, 'completed')}
                                className="p-1.5 hover:bg-blue-50 rounded text-blue-500" title="Mark completed">
                                <CheckCircle size={14} />
                              </button>
                              <button onClick={() => updateStatus(order.id, 'rejected')}
                                className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Reject pre-order">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {order.status === 'rejected' && (
                            <button onClick={() => updateStatus(order.id, 'pending')}
                              className="p-1.5 hover:bg-amber-50 rounded text-amber-500" title="Reopen">
                              <RotateCcw size={14} />
                            </button>
                          )}
                          {order.status === 'completed' && (
                            <button onClick={() => updateStatus(order.id, 'pending')}
                              className="p-1.5 hover:bg-amber-50 rounded text-amber-500" title="Reopen">
                              <RotateCcw size={14} />
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
                    <h2 className="font-semibold text-gray-900">Pre-Order #{order.id}</h2>
                    <button onClick={() => setSelectedOrder(null)} className="text-red-400 hover:text-red-600"><XCircle size={18} /></button>
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
                        {customer.phone && (
                          <a
                            href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=Hi!%20This%20is%20Lily%20from%20Crumbs%20Bakery%20regarding%20your%20pre-order%20%23${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1 text-xs text-green-600 hover:text-green-700 font-medium"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp
                          </a>
                        )}
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
