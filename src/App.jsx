import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CakesPage from './pages/CakesPage'
import CupcakesPage from './pages/CupcakesPage'
import DessertsPage from './pages/DessertsPage'
import AboutPage from './pages/AboutPage'
import ReviewsPage from './pages/ReviewsPage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cakes" element={<CakesPage />} />
        <Route path="/cupcakes" element={<CupcakesPage />} />
        <Route path="/desserts" element={<DessertsPage />} />
        <Route path="/cookies" element={<Navigate to="/desserts" replace />} />
        <Route path="/brownies" element={<Navigate to="/desserts" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
    </Routes>
  )
}
