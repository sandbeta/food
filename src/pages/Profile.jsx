import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'

const MENU_ITEMS = [
  { label: '我的收藏', emoji: '⭐', path: '/favorites' },
  { label: '管理后台', emoji: '⚙️', path: '/admin' },
  { label: '设置', emoji: '🔧', path: '#' },
  { label: '关于', emoji: '💡', path: '#' },
]

export default function Profile() {
  const [stats, setStats] = useState({ orders: 0, total: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(d => {
      setStats({ orders: d.length, total: d.reduce((s, o) => s + o.total_price, 0) })
    })
  }, [])

  return (
    <div>
      <Header title="我的" />

      <div className="px-4 pb-4 space-y-4">
        {/* 头像卡片 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="d3-card-face p-5 text-center">
          <motion.div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, #FF8F5A, #FF6B35)',
              boxShadow: '0 6px 20px rgba(255,107,53,0.3), inset 0 2px 4px rgba(255,255,255,0.3)'
            }}
            whileHover={{ scale: 1.05, rotate: 5 }}>
            🍳
          </motion.div>
          <h2 className="text-lg font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>美食家</h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">一起发现美味</p>
        </motion.div>

        {/* 统计 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3">
          <div className="d3-card-face p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>{stats.orders}</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-1">订单总数</div>
          </div>
          <div className="d3-card-face p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>{stats.total}</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-1">累计消费</div>
          </div>
        </motion.div>

        {/* 菜单列表 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="d3-card-face overflow-hidden">
          {MENU_ITEMS.map((item, i) => (
            <motion.div key={item.label}
              whileTap={{ scale: 0.98 }}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer ${i < MENU_ITEMS.length - 1 ? 'border-b border-[var(--color-border)]' : ''}`}>
              <span className="text-xl">{item.emoji}</span>
              <span className="flex-1 text-sm font-bold text-[var(--color-text)]">{item.label}</span>
              <span className="text-[var(--color-text-secondary)] text-lg">›</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
