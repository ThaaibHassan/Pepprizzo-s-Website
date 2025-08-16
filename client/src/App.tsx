import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import { useCartStore } from './stores/cartStore'
import { useSocketStore } from './stores/socketStore'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import LoyaltyPage from './pages/LoyaltyPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/Orders'
import AdminMenu from './pages/admin/Menu'
import AdminCustomers from './pages/admin/Customers'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'


function App() {
  const { user, checkAuth } = useAuthStore()
  const { initializeCart } = useCartStore()
  const { initializeSocket } = useSocketStore()

  useEffect(() => {
    // Check authentication status on app load
    checkAuth()
    
    // Initialize cart from localStorage
    initializeCart()
    
    // Initialize socket connection if user is authenticated
    if (user) {
      initializeSocket()
    }
  }, [checkAuth, initializeCart, initializeSocket, user])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders/:orderId" element={<OrderTrackingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin">
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
