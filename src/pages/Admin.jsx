import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'

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
    <div>
      <Header title="管理后台" />
      <div className="px-4 pb-4 space-y-4">
        {/* 数据概览 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3">
          <div className="d3-card-face p-3 text-center">
            <div className="text-xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>{stats.dishes}</div>
            <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">菜品</div>
          </div>
          <div className="d3-card-face p-3 text-center">
            <div className="text-xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>{stats.orders}</div>
            <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">订单</div>
          </div>
          <div className="d3-card-face p-3 text-center">
            <div className="text-xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>{stats.today}</div>
            <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">今日</div>
          </div>
        </motion.div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map(link => (
            <motion.button key={link.label} whileTap={{ scale: 0.95 }}
              onClick={() => navigate(link.path)}
              className="d3-card-face p-5 text-center flex flex-col items-center gap-2"
              style={{ borderLeft: `3px solid ${link.color}` }}>
              <span className="text-3xl">{link.emoji}</span>
              <span className="text-sm font-bold text-[var(--color-text)]">{link.label}</span>
            </motion.button>
          ))}
        </div>

        {/* 返回用户端 */}
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/home')}
          className="d3-btn-sm w-full py-3 text-center text-sm font-bold text-[var(--color-text-secondary)] bg-[var(--color-cream-dark)]">
          ← 返回用户端
        </motion.button>
      </div>
    </div>
  )
}
