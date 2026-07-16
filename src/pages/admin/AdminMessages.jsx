import { useState, useEffect } from 'react'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminApi } from '@/hooks/useAdminApi'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const api = useAdminApi()

  useEffect(() => { loadMessages() }, [])

  async function loadMessages() {
    setLoading(true)
    try {
      const { data } = await api.messages.list()
      setMessages(data ?? [])
    } catch (err) { console.error(err); toast.error('Failed to load messages') }
    finally { setLoading(false) }
  }

  const toggleRead = async (id) => {
    try {
      await api.messages.toggleRead(id)
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: !m.read } : m))
    } catch (err) { console.error(err); toast.error('Failed to toggle message read status') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await api.messages.delete(id)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selected === id) setSelected(null)
    } catch (err) { console.error(err); toast.error('Failed to delete message') }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Contact form submissions</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Message list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-400">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No messages yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelected(msg.id)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    selected === msg.id ? 'bg-teal-50 border-l-2 border-teal-500' : 'hover:bg-gray-50'
                  } ${!msg.read ? 'bg-amber-50/30' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${!msg.read ? 'font-semibold' : 'font-medium'} text-gray-800 truncate`}>
                        {msg.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{msg.email} {msg.phone ? `· ${msg.phone}` : ''}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate">{msg.message}</p>
                      <p className="text-[10px] text-gray-300 mt-1">
                        {new Date(msg.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); toggleRead(msg.id) }}
                        className={`p-1.5 rounded ${msg.read ? 'text-gray-300 hover:text-gray-500' : 'text-teal-500'}`}>
                        {msg.read ? <MailOpen size={14} /> : <Mail size={14} />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id) }}
                        className="p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message detail */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {selected ? (
            (() => {
              const msg = messages.find((m) => m.id === selected)
              if (!msg) return <div className="p-6 text-center text-sm text-gray-400">Message not found</div>
              return (
                <div className="p-5">
                  <div className="mb-4">
                    <h2 className="font-semibold text-gray-900 text-lg">{msg.name}</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <a href={`mailto:${msg.email}`} className="text-teal-600 hover:underline">{msg.email}</a>
                      {msg.phone && (
                        <a href={`tel:${msg.phone}`} className="text-teal-600 hover:underline">{msg.phone}</a>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.created_at).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={() => { toggleRead(msg.id); if (!msg.read) loadMessages() }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
                      {msg.read ? 'Mark as Unread' : 'Mark as Read'}
                    </button>
                    <button onClick={() => { handleDelete(msg.id) }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500">
                      Delete
                    </button>
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="p-6 text-center text-sm text-gray-400 flex flex-col items-center justify-center h-full min-h-[300px]">
              <Mail size={32} className="text-gray-200 mb-2" />
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
