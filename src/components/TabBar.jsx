import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from './CartContext'

const TABS = [
  { path: '/home', label: '首页', emoji: '🏠' },
  { path: '/menu', label: '吃什么', emoji: '🍜' },
  { path: '/orders', label: '订单', emoji: '📋' },
  { path: '/profile', label: '我的', emoji: '🐰' },
]

export default function TabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalCount } = useCart()

  return (
    <nav
      className="safe-area-bottom"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 40,
        padding: '8px 16px',
        background: 'var(--color-surface)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path || 
          (tab.path === '/menu' && location.pathname.startsWith('/dish')) ||
          (tab.path === '/orders' && location.pathname.startsWith('/orders/'))
        
        return (
          <motion.button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '6px 12px',
              minWidth: 56,
              minHeight: 44,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              position: 'relative',
              borderRadius: 12,
            }}
            whileTap={{ scale: 0.92 }}
          >
            {isActive && (
              <motion.div
                layoutId="tabIndicator"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 28,
                  height: 3,
                  borderRadius: 2,
                  background: 'var(--color-primary)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.span
              style={{ fontSize: 20, lineHeight: 1 }}
              animate={isActive ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              {tab.emoji}
            </motion.span>
            <span
              className="t-tiny"
              style={{
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
              }}
            >
              {tab.label}
            </span>
            {tab.path === '/menu' && totalCount > 0 && (
              <motion.span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 4,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  background: 'var(--color-love)',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {totalCount}
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}
