import { useState, useEffect } from 'react'
import { Check, X, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminApi } from '@/hooks/useAdminApi'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const api = useAdminApi()

  useEffect(() => { loadReviews() }, [])

  async function loadReviews() {
    setLoading(true)
    try {
      const { data } = await api.reviews.list()
      setReviews(data ?? [])
    } catch (err) { console.error(err); toast.error('Failed to load reviews') }
    finally { setLoading(false) }
  }

  const toggleApproval = async (id) => {
    try {
      await api.reviews.toggleApproval(id)
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: !r.approved } : r))
    } catch (err) { console.error(err); toast.error('Failed to toggle review approval') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await api.reviews.delete(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (err) { console.error(err); toast.error('Failed to delete review') }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Moderate customer reviews</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Review</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Source</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No reviews yet</td></tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className={`hover:bg-gray-50 transition-colors ${!review.approved ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{review.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-700 truncate">{review.text}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{review.source || 'Google'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        review.approved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleApproval(review.id)}
                          className={`p-1.5 rounded transition-colors ${
                            review.approved ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'
                          }`}>
                          {review.approved ? <X size={14} /> : <Check size={14} />}
                        </button>
                        <button onClick={() => handleDelete(review.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
