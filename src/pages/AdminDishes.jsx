import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AddDishModal from '../components/AddDishModal'
import KissIcon from '../components/KissIcon'

const CATEGORY_CONFIG = {
  '家常菜': { emoji: '🍳', color: '#D4A574' }, '硬菜': { emoji: '🥩', color: '#E88B8B' },
  '素菜': { emoji: '🥬', color: '#8BC49E' }, '主食': { emoji: '🍚', color: '#E8C974' },
  '汤类': { emoji: '🍲', color: '#8BA7C7' }, '小吃': { emoji: '🍢', color: '#D4A0D4' },
  '水果': { emoji: '🍎', color: '#F5A623' }, '饮品': { emoji: '🧋', color: '#7EC8E3' },
  '川菜': { emoji: '🌶️', color: '#E07050' }, '粤菜': { emoji: '🥢', color: '#C8A87C' },
  '湘菜': { emoji: '🔥', color: '#D46A4A' }, '鲁菜': { emoji: '🍤', color: '#5BA08E' },
  '苏菜': { emoji: '🪷', color: '#A8C5A0' }, '浙菜': { emoji: '🐟', color: '#6DB3D4' },
  '闽菜': { emoji: '🦐', color: '#E8976E' }, '徽菜': { emoji: '🍲', color: '#8B7B5E' },
  '东北菜': { emoji: '🥟', color: '#9CB4D4' }, '西北菜': { emoji: '🍖', color: '#C8966A' },
  '云贵菜': { emoji: '🍄', color: '#88B87E' }, '其他': { emoji: '🍽️', color: '#B0B0B0' },
}

export default function AdminDishes() {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDish, setEditingDish] = useState(null)

  const loadDishes = () => { fetch('/api/dishes/all').then(r => r.json()).then(d => { setDishes(d); setLoading(false) }) }
  useEffect(() => { loadDishes() }, [])

  const handleSave = async (form) => {
    if (editingDish) {
      await fetch(`/api/dishes/${editingDish.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/dishes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setShowModal(false); setEditingDish(null); loadDishes()
  }
  const handleDelete = async (id) => { if (!confirm('确定不要这道菜了？')) return; await fetch(`/api/dishes/${id}`, { method: 'DELETE' }); loadDishes() }
  const handleToggle = async (d) => { await fetch(`/api/dishes/${d.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ available: d.available ? 0 : 1 }) }); loadDishes() }

  return (
    <div className="page-container-tight">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>菜单管理</h1>
          <p className="t-caption">共 {dishes.length} 道菜</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setEditingDish(null); setShowModal(true) }}
          className="btn btn-primary"
          style={{ fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 14 }}
        >
          + 添加
        </motion.button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
          <motion.div style={{ fontSize: 48 }}
            animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >📋</motion.div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
            {[0, 1, 2].map(i => (
              <motion.div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
        </div>
      ) : dishes.length === 0 ? (
        <div className="glass-card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '64px 16px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🍽️</div>
          <p className="t-caption">还没有菜品，点右上角添加吧</p>
        </div>
      ) : (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {dishes.map(dish => {
            const cfg = CATEGORY_CONFIG[dish.category] || CATEGORY_CONFIG['其他']
            return (
              <motion.div
                key={dish.id}
                layout
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="glass-card"
                style={{ opacity: dish.available ? 1 : 0.4, overflow: 'hidden' }}
              >
                <div style={{ height: 2, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}30)` }} />
                <div style={{ padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 16, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `linear-gradient(135deg, ${cfg.color}20, ${cfg.color}08)`,
                    }}>
                      <span style={{ fontSize: 22 }}>{cfg.emoji}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <h3 className="t-h3" style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {dish.name}
                        </h3>
                        <span className="tag" style={{ fontSize: 10, padding: '2px 6px', flexShrink: 0 }}>{dish.category}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
                        <KissIcon className="w-3 h-3 text-[var(--color-secondary)]" />
                        <span className="t-h3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{dish.price}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggle(dish)}
                      className="btn btn-sm"
                      style={{
                        flex: 1, fontWeight: 700, fontSize: 11, borderRadius: 12, minHeight: 34,
                        background: dish.available ? 'linear-gradient(135deg, #6BCB77, #4AA85B)' : 'var(--color-border)',
                        color: dish.available ? 'white' : 'var(--color-text-secondary)',
                      }}
                    >
                      {dish.available ? '✓ 上架' : '已下架'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setEditingDish(dish); setShowModal(true) }}
                      className="btn btn-sm"
                      style={{
                        flex: 1, fontWeight: 700, fontSize: 11, borderRadius: 12, minHeight: 34,
                        background: 'linear-gradient(135deg, #6BA3E8, #4A82C8)', color: 'white',
                      }}
                    >
                      编辑
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(dish.id)}
                      className="btn btn-sm"
                      style={{
                        flex: 1, fontWeight: 700, fontSize: 11, borderRadius: 12, minHeight: 34,
                        background: 'linear-gradient(135deg, #E88B8B, #D46A6A)', color: 'white',
                      }}
                    >
                      删除
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <AddDishModal dish={editingDish} onClose={() => { setShowModal(false); setEditingDish(null) }} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  )
}