import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const MENU_ITEMS = [
  { label: '喜欢的菜', emoji: '⭐', path: '/favorites' },
  { label: '管理后台', emoji: '⚙️', path: '/admin' },
  { label: '设置', emoji: '🔧', path: '#' },
  { label: '关于', emoji: '💡', path: '#' },
]

/* ══════════════════════════════════════════
   PROFILE — Glass Bento UI
   ══════════════════════════════════════════ */

export default function Profile() {
  const [stats, setStats] = useState({ orders: 0, total: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        setStats({
          orders: d.length,
          total: d.reduce((s, o) => s + o.total_price, 0),
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="page-container-tight">
      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: 24, textAlign: 'center', marginBottom: 12 }}
      >
        <motion.div
          style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #FF8F5A, #FF6B35)',
            boxShadow: '0 6px 20px rgba(255,107,53,0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
            fontSize: 32,
          }}
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          🍳
        </motion.div>
        <h2 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>美食家</h2>
        <p className="t-caption" style={{ marginTop: 4 }}>一起发现美味</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}
      >
        <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
          <div className="t-h1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', fontSize: 24 }}>
            {stats.orders}
          </div>
          <div className="t-caption" style={{ marginTop: 4 }}>订单总数</div>
        </div>
        <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
          <div className="t-h1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', fontSize: 24 }}>
            {stats.total}
          </div>
          <div className="t-caption" style={{ marginTop: 4 }}>累计消费 💋</div>
        </div>
      </motion.div>

      {/* Menu List */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
        style={{ overflow: 'hidden' }}
      >
        {MENU_ITEMS.map((item, i) => (
          <motion.div
            key={item.label}
            whileTap={{ scale: 0.98 }}
            onClick={() => item.path !== '#' && navigate(item.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              cursor: item.path === '#' ? 'default' : 'pointer',
              borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.emoji}</span>
            <span className="t-body" style={{ flex: 1, fontWeight: 600 }}>{item.label}</span>
            <span style={{ color: 'var(--color-text-tertiary)', fontSize: 18 }}>›</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}