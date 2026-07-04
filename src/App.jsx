import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CakesPage from './pages/CakesPage'
import CupcakesPage from './pages/CupcakesPage'
import CookiesPage from './pages/CookiesPage'
import BrowniesPage from './pages/BrowniesPage'
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
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/brownies" element={<BrowniesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
    </Routes>
  )
}
