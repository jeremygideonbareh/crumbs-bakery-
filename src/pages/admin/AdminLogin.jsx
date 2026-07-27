import { createContext, useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cake, Lock, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

// Simple auth context — stores password for RPC-authenticated DB calls
const AuthContext = createContext({
  isAuthenticated: false,
  password: '',
  login: () => {},
  logout: () => {},
})

export function useAdminAuth() {
  return useContext(AuthContext)
}

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const login = (pw) => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('crumbs_admin', 'true')
      setIsAuthenticated(true)
      setPassword(pw)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('crumbs_admin')
    setIsAuthenticated(false)
    setPassword('')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, password, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const ADMIN_CONFIGURED = !!ADMIN_PASSWORD

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!ADMIN_CONFIGURED) {
      setError('Admin password not configured. Set VITE_ADMIN_PASSWORD in your environment.')
      return
    }
    if (login(password)) {
      navigate(from, { replace: true })
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {!ADMIN_CONFIGURED && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 font-medium">⚠️ Admin password not configured</p>
              <p className="text-[10px] text-red-600 mt-0.5">
                Set <code className="bg-red-100 px-1 rounded">VITE_ADMIN_PASSWORD</code> in your environment to enable admin access.
              </p>
            </div>
          )}

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 mb-4">
              <Cake size={28} className="text-teal-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Crumbs CMS</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard Login</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-gray-600 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1.5"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2">
              <LogIn size={14} />
              Sign In
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            This area is for the bakery owner only.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
