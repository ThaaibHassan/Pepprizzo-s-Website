import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CartSidebar from './CartSidebar'
import { useCartStore } from '../stores/cartStore'

const Layout = () => {
  const { isOpen, closeCart } = useCartStore()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="pt-16 flex-1">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  )
}

export default Layout
