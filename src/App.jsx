import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './components/CartContext'
import TabBar from './components/TabBar'
import D3CartOrb from './components/D3CartOrb'
import Home from './pages/Home'
import Menu from './pages/Menu'
import DishDetail from './pages/DishDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderDetail from './pages/OrderDetail'
import MyOrders from './pages/MyOrders'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import Admin from './pages/Admin'
import AdminDishes from './pages/AdminDishes'
import AdminOrders from './pages/AdminOrders'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <CartProvider>
      <div className="min-h-screen max-w-[480px] mx-auto relative overflow-hidden border-x border-[#EEEEEE]/60  bg-[#F7F8FA]">
        <div className="fixed top-[-100px] left-[calc(50%-280px)] w-80 h-80 rounded-full blur-[80px] opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF6B3520 0%, transparent 70%)' }} />
        <div className="fixed top-1/3 right-[calc(50%-280px)] w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF8F5A15 0%, transparent 70%)' }} />

        <main className="pb-28 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/dish/:id" element={<DishDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/dishes" element={<AdminDishes />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        {!isAdmin && <TabBar />}
        {!isAdmin && <D3CartOrb />}
      </div>
    </CartProvider>
  )
}

export default App
