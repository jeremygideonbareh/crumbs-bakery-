import { useState, useRef } from 'react'
import { X, Upload, RefreshCw, Loader2, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ImagePicker({ files, bucket, onSelect, onUpload, onRefresh, onClose }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await onUpload(file)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function getPublicUrl(name) {
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(name)
    return publicUrl
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-900">Uploaded Images</h2>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
              title="Upload image"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            </button>
            <button
              onClick={onRefresh}
              className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Files Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {files.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">No uploaded images yet.</p>
              <p className="text-xs text-gray-300 mt-1">Upload an image using the button above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {files.map((file) => {
                const url = getPublicUrl(file.name)
                return (
                  <button
                    key={file.id || file.name}
                    onClick={() => onSelect(url)}
                    className="group relative rounded-lg overflow-hidden border-2 border-gray-200 aspect-square hover:border-teal-400 hover:shadow-md transition-all"
                  >
                    <img
                      src={url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const p = e.target.parentElement
                        if (p) {
                          p.classList.add('bg-gray-100')
                          const s = document.createElement('span')
                          s.className = 'text-[10px] text-gray-400 p-1 text-center block break-all'
                          s.textContent = file.name
                          p.appendChild(s)
                        }
                      }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[8px] text-white truncate">{file.name}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
