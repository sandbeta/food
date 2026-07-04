import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import KissIcon from '../components/KissIcon'
import { getDishImage, getCategoryEmoji } from '../lib/categoryIcons'

export default function Favorites() {
  const [favorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('couple_order_favorites') || '[]') } catch { return [] }
  })

  return (
    <div>
      <Header title="我的收藏" subtitle={`${favorites.length} 道喜欢的菜`} />
      <div className="px-4 pb-4">
        {favorites.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
            <div className="text-7xl mb-5 animate-float">⭐</div>
            <p className="text-[var(--color-text)] font-bold mb-1">还没有收藏</p>
            <p className="text-[var(--color-text-secondary)] text-sm">去菜单里发现好吃的吧~</p>
            <Link to="/menu" className="d3-btn d3-btn-primary px-8 py-3 rounded-2xl text-sm font-bold mt-6">去选菜</Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {favorites.map((dish, i) => (
              <motion.div key={dish.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="d3-card-face p-3.5 flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: 'linear-gradient(145deg, #FFFFFF, #FAFAFA)' }}>🍽️</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{dish.name}</h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">{dish.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <KissIcon className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                  <span className="text-sm font-bold text-[var(--color-primary)]">{dish.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
