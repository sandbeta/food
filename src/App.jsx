import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './components/CartContext'
import Home from './pages/Home'
import Menu from './pages/Menu'
import DishDetail from './pages/DishDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import OrderDetail from './pages/OrderDetail'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import AdminDishes from './pages/AdminDishes'
import AdminOrders from './pages/AdminOrders'
import TabBar from './components/TabBar'
import D3CartOrb from './components/D3CartOrb'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ minHeight: '100dvh' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <CartProvider>
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          minHeight: '100dvh',
          background: 'var(--color-bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative ambient blobs */}
        <div style={{
          position: 'fixed', top: -80, left: -60, width: 200, height: 200,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{
          position: 'fixed', bottom: -60, right: -60, width: 180, height: 180,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,149,0,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0
        }} />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/menu" element={<AnimatedPage><Menu /></AnimatedPage>} />
            <Route path="/dish/:id" element={<AnimatedPage><DishDetail /></AnimatedPage>} />
            <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
            <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
            <Route path="/orders" element={<AnimatedPage><MyOrders /></AnimatedPage>} />
            <Route path="/orders/:id" element={<AnimatedPage><OrderDetail /></AnimatedPage>} />
            <Route path="/favorites" element={<AnimatedPage><Favorites /></AnimatedPage>} />
            <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
            <Route path="/admin" element={<AnimatedPage><Admin /></AnimatedPage>} />
            <Route path="/admin/dishes" element={<AnimatedPage><AdminDishes /></AnimatedPage>} />
            <Route path="/admin/orders" element={<AnimatedPage><AdminOrders /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>

        {!isAdmin && <TabBar />}
        {!isAdmin && <D3CartOrb />}
      </div>
    </CartProvider>
  )
}
