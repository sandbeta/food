import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import KissIcon from '../components/KissIcon'
import { getCategoryEmoji } from '../lib/categoryIcons'

const baseUrl = import.meta.env.BASE_URL || '/'

/* ══════════════════════════════════════════
   FAVORITES — Glass Bento UI
   ══════════════════════════════════════════ */

export default function Favorites() {
  const [favorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('couple_order_favorites') || '[]') } catch { return [] }
  })

  return (
    <div className="page-container-tight">
      <div style={{ marginBottom: 14 }}>
        <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>我的收藏</h1>
        <p className="t-caption">{favorites.length} 道喜欢的菜</p>
      </div>

      {favorites.length === 0 ? (
        /* Empty */
        <div className="glass-card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '64px 16px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,107,53,0.06), transparent 70%)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
          </div>
          <div style={{
            fontSize: 56, marginBottom: 16, position: 'relative',
            animation: 'float 3s ease-in-out infinite',
          }}>
            ⭐
          </div>
          <p className="t-h2" style={{ marginBottom: 4, position: 'relative' }}>还没有收藏</p>
          <p className="t-caption" style={{ marginBottom: 24, position: 'relative' }}>去菜单里发现好吃的吧~</p>
          <Link to="/menu" className="btn btn-primary" style={{ position: 'relative' }}>去选菜</Link>
        </div>
      ) : (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {favorites.map((dish, i) => (
            <motion.div
              key={dish.id}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="glass-card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: 24 }}>{getCategoryEmoji(dish.category)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="t-h3" style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {dish.name}
                </h3>
                <p className="t-caption" style={{ fontSize: 11 }}>{dish.category}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <KissIcon className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                <span className="t-h3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                  {dish.price}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}