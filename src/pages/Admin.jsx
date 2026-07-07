import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const QUICK_LINKS = [
  { label: '菜品管理', emoji: '🍽️', path: '/admin/dishes', color: '#FF6B35' },
  { label: '厨房看板', emoji: '👨‍🍳', path: '/admin/orders', color: '#E55A2B' },
]

export default function Admin() {
  const [stats, setStats] = useState({ dishes: 0, orders: 0, today: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetch('/api/dishes/all').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
    ]).then(([dishes, orders]) => {
      const today = orders.filter(o => {
        const d = new Date(o.created_at)
        const now = new Date()
        return d.toDateString() === now.toDateString()
      }).length
      setStats({ dishes: dishes.length, orders: orders.length, today })
    })
  }, [])

  return (
    <div className="page-container-tight">
      <div style={{ marginBottom: 14 }}>
        <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>管理后台</h1>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}
      >
        {[
          { label: '菜品', value: stats.dishes },
          { label: '订单', value: stats.orders },
          { label: '今日', value: stats.today },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: 14, textAlign: 'center' }}>
            <div className="t-h1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', fontSize: 22 }}>
              {s.value}
            </div>
            <div className="t-caption" style={{ marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
        {QUICK_LINKS.map(link => (
          <motion.button
            key={link.label}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(link.path)}
            className="glass-card"
            style={{
              padding: 20, textAlign: 'center', cursor: 'pointer',
              borderLeft: `3px solid ${link.color}`,
            }}
          >
            <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>{link.emoji}</span>
            <span className="t-h3">{link.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Back */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/home')}
        className="btn btn-ghost"
        style={{ width: '100%', color: 'var(--color-text-secondary)' }}
      >
        ← 返回用户端
      </motion.button>
    </div>
  )
}