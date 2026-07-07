import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './CartContext'

export default function D3CartOrb() {
  const navigate = useNavigate()
  const { totalCount, totalPrice } = useCart()

  if (totalCount === 0) return null

  return (
    <AnimatePresence>
      <motion.button
        onClick={() => navigate('/cart')}
        style={{
          position: 'fixed',
          bottom: 88,
          right: 'max(16px, calc((100vw - 480px) / 2 + 16px))',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          borderRadius: 28,
          border: 'none',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          fontWeight: 700,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        whileTap={{ scale: 0.95 }}
      >
        <span style={{ fontSize: 18 }}>🛒</span>
        <span>{totalCount} 件</span>
        <span style={{ opacity: 0.8, fontSize: 12 }}>·</span>
        <span>💋 {totalPrice}</span>
      </motion.button>
    </AnimatePresence>
  )
}
