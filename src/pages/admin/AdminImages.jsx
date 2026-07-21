import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, RefreshCw, Loader2, Image as ImageIcon, ExternalLink, Copy, Check, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const BUCKET = 'site-images'

export default function AdminImages() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => { loadFiles() }, [])

  async function loadFiles() {
    setLoading(true)
    try {
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })
      if (error) throw error
      setFiles(data || [])
    } catch (err) {
      console.error('Failed to load images:', err)
      toast.error('Failed to load images. Is the site-images bucket created?')
    } finally { setLoading(false) }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'jpeg'
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
      const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
        cacheControl: '3600', upsert: false,
      })
      if (error) throw error
      toast.success('Image uploaded!')
      await loadFiles()
    } catch (err) {
      console.error('Upload failed:', err)
      toast.error('Upload failed. Make sure the site-images bucket exists.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDelete(name) {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      const { error } = await supabase.storage.from(BUCKET).remove([name])
      if (error) throw error
      toast.success('Image deleted')
      await loadFiles()
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error('Failed to delete image')
    }
  }

  function getPublicUrl(name) {
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(name)
    return publicUrl
  }

  function handleCopy(url) {
    navigator.clipboard.writeText(url)
    setCopiedId(url)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Images</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage site images</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <Button onClick={loadFiles} variant="neutral" size="sm" className="gap-1">
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} size="sm" className="gap-1">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>

      {/* Swap pipeline info card */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileText size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">swap-images.mjs Pipeline</h3>
            <p className="text-xs text-amber-700 mt-1">
              Images uploaded here go to Supabase Storage (site-images bucket). For local image generation,
              run <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">node scripts/swap-images.mjs</code> 
              from the project root. That script generates new variants in <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">public/images/</code> 
              from raw files in <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">public/images/raw/</code>.
            </p>
            <p className="text-xs text-amber-700 mt-1">
              After running the pipeline, use the <strong>Local</strong> picker in image fields to select newly generated images.
            </p>
          </div>
        </div>
      </div>

      {/* Images grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-gray-300" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No uploaded images yet</p>
            <p className="text-xs text-gray-300 mt-1">Upload an image or check that the site-images bucket exists in Supabase Dashboard</p>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => {
              const url = getPublicUrl(file.name)
              return (
                <motion.div
                  key={file.id || file.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                >
                  <div className="aspect-square relative">
                    <img
                      src={url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const p = e.target.parentElement
                        if (p) {
                          p.classList.add('flex', 'items-center', 'justify-center')
                          const icon = document.createElement('div')
                          icon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
                          p.appendChild(icon)
                        }
                      }}
                    />
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleCopy(url)}
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === url ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-700" />}
                      </button>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink size={14} className="text-gray-700" />
                      </a>
                      <button
                        onClick={() => handleDelete(file.name)}
                        className="p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-gray-500 truncate" title={file.name}>{file.name}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
