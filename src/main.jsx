import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from '@/lib/ErrorBoundary'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <ScrollToTop />
        <App />
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
)
