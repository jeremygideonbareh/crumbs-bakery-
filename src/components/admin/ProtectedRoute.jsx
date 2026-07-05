import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/pages/admin/AdminLogin'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdminAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
