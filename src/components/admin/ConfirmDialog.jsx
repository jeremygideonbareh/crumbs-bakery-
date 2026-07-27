import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title || 'Confirm'}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="neutral" onClick={onCancel} size="sm">Cancel</Button>
          <Button onClick={onConfirm} size="sm" className="gap-1 bg-red-600 hover:bg-red-700">{confirmLabel}</Button>
        </div>
      </motion.div>
    </div>
  )
}
