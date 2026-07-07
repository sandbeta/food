import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../components/CartContext'
import LovePrice from '../components/LovePrice'
import DishImage from '../components/DishImage'
import { getCategoryEmoji } from '../lib/categoryIcons'
import { getDishRecipe } from '../lib/dishRecipes'

const baseUrl = import.meta.env.BASE_URL || '/'

/* ══════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════ */

const CATEGORY_CONFIG = {
  '全部': { emoji: '✨', color: '#FF6B35' },
  '家常菜': { emoji: '🍳', color: '#F0A860' },
  '硬菜': { emoji: '🥩', color: '#FA5151' },
  '素菜': { emoji: '🥬', color: '#6BBF5C' },
  '主食': { emoji: '🍚', color: '#E8C84A' },
  '小吃': { emoji: '🍢', color: '#A06CD5' },
  '水果': { emoji: '🍎', color: '#F47A92' },
  '饮品': { emoji: '🧋', color: '#4AB8C8' },
  '汤类': { emoji: '🍲', color: '#E8A050' },
  '川菜': { emoji: '🌶️', color: '#E85040' },
  '粤菜': { emoji: '🥢', color: '#E8C060' },
  '湘菜': { emoji: '🔥', color: '#E88040' },
  '鲁菜': { emoji: '🍤', color: '#D09050' },
  '苏菜': { emoji: '🪷', color: '#9070C8' },
  '浙菜': { emoji: '🐟', color: '#50A8B8' },
  '闽菜': { emoji: '🦐', color: '#5898D0' },
  '徽菜': { emoji: '🍲', color: '#A08060' },
  '东北菜': { emoji: '🥟', color: '#80A858' },
  '西北菜': { emoji: '🍖', color: '#C89848' },
  '云贵菜': { emoji: '🍄', color: '#6BBF5C' },
  '其他': { emoji: '🍽️', color: '#A0A0A0' },
}

const CATEGORY_GROUPS = [
  { label: '家常', items: ['全部', '家常菜', '硬菜', '素菜', '主食', '小吃', '水果', '饮品', '汤类'] },
  { label: '八大菜系', items: ['川菜', '粤菜', '湘菜', '鲁菜', '苏菜', '浙菜', '闽菜', '徽菜'] },
  { label: '地方风味', items: ['东北菜', '西北菜', '云贵菜', '其他'] },
]

/* ══════════════════════════════════════════
   Skeleton — Loading State
   ══════════════════════════════════════════ */

function MenuSkeleton() {
  return (
    <div className="page-container-tight">
      <div className="glass-card p-3 flex items-center gap-3 mb-4">
        <div className="skeleton" style={{ width: 70, height: 70, borderRadius: 18, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-title" style={{ marginBottom: 8 }} />
          <div className="skeleton skeleton-text" style={{ width: '40%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton skeleton-badge" style={{ width: 56 }} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="glass-card p-3 flex items-center gap-3">
            <div className="skeleton" style={{ width: 70, height: 70, borderRadius: 18, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" style={{ width: '55%', marginBottom: 8 }} />
              <div className="skeleton skeleton-text" style={{ width: '35%', marginBottom: 6 }} />
              <div className="skeleton skeleton-text" style={{ width: '25%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MoodSelector
   ══════════════════════════════════════════ */

function MoodSelector({ mode, setMode }) {
  return (
    <div className="glass-card p-1 flex items-center gap-1 mb-3" style={{ borderRadius: 16 }}>
      <span className="t-caption" style={{ paddingLeft: 10, paddingRight: 4, fontWeight: 600 }}>今天想</span>
      {[{ value: 'her', label: '宝宝吃', icon: '🐰' }, { value: 'share', label: '一起吃', icon: '🐱🐰' }].map(opt => (
        <motion.button
          key={opt.value}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode(opt.value)}
          className="btn btn-sm flex-1"
          style={{
            minHeight: 36,
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 13,
            background: mode === opt.value
              ? (opt.value === 'her' ? 'linear-gradient(135deg, #FF8F5A, #FF6B35)' : 'linear-gradient(135deg, #576B95, #567BB5)')
              : 'transparent',
            color: mode === opt.value ? 'white' : 'var(--color-text-secondary)',
            boxShadow: mode === opt.value ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          <span>{opt.icon}</span>
          {opt.label}
        </motion.button>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════
   RecommendCard
   ══════════════════════════════════════════ */

function RecommendCard({ dishes, onAdd, spawnParticle }) {
  const randomDish = useMemo(() => {
    if (!dishes.length) return null
    return dishes[Math.floor(Math.random() * dishes.length)]
  }, [dishes])

  if (!randomDish) return null
  const cfg = CATEGORY_CONFIG[randomDish.category] || CATEGORY_CONFIG['其他']

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-4 mb-4"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', right: -24, top: -24, width: 96, height: 96,
        borderRadius: '50%', background: `radial-gradient(circle, ${cfg.color}15, transparent 70%)`,
        animation: 'float 3s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', left: -16, bottom: -16, width: 64, height: 64,
        borderRadius: '50%', background: `radial-gradient(circle, ${cfg.color}10, transparent 70%)`,
        animation: 'float 3s ease-in-out infinite', animationDelay: '1s',
      }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="tag tag-love" style={{ fontSize: 12, fontWeight: 700 }}>今日灵感</span>
        <span className="t-caption">不知道吃啥就选它</span>
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 60, height: 60, borderRadius: 18, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(145deg, ${cfg.color}12, #FFFFFF 60%, ${cfg.color}06)`,
          boxShadow: `inset 0 2px 8px ${cfg.color}10, 0 4px 12px ${cfg.color}12`,
        }}>
          <span style={{ fontSize: 28 }}>{cfg.emoji}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="t-h3" style={{ fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{randomDish.name}</h3>
          <p className="t-caption" style={{ WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {randomDish.description || '好吃的~'}
          </p>
          <div style={{ marginTop: 4 }}>
            <LovePrice price={randomDish.price} size="md" showLabel />
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            spawnParticle(rect.left + rect.width / 2, rect.top)
            onAdd(randomDish)
          }}
          className="btn btn-sm"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            color: 'white',
            fontWeight: 700,
            borderRadius: 14,
            padding: '8px 16px',
          }}
        >
          加一份
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════
   Toast — Success Feedback
   ══════════════════════════════════════════ */

function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 44,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: 'linear-gradient(135deg, #07C160, #06AD56)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 4px 16px rgba(7,193,96,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <span>✅</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════
   MENU PAGE — Glass Bento UI
   ══════════════════════════════════════════ */

export default function Menu() {
  const [dishes, setDishes] = useState([])
  const [activeCategory, setActiveCategory] = useState('全部')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [particles, setParticles] = useState([])
  const [toast, setToast] = useState({ visible: false, message: '' })
  const searchRef = useRef(null)
  const listRef = useRef(null)
  const { addItem, totalCount, mode, setMode } = useCart()
  const navigate = useNavigate()

  /* ── Fetch Categories ── */
  useEffect(() => {
    fetch('/api/dishes/categories').then(r => r.json()).catch(() => {})
  }, [])

  /* ── Fetch Dishes + Debounced Keyword ── */
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 300)
    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/dishes?category=${encodeURIComponent(activeCategory)}`)
      .then(r => r.json())
      .then(data => { setDishes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeCategory])

  /* ── Filter ── */
  const filteredDishes = useMemo(() => {
    const q = debouncedKeyword.trim().toLowerCase()
    if (!q) return dishes
    return dishes.filter(d => `${d.name} ${d.category} ${d.description || ''}`.toLowerCase().includes(q))
  }, [dishes, debouncedKeyword])

  /* ── Scroll to top on category change ── */
  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  /* ── Add to cart with toast ── */
  const handleAdd = useCallback((dish) => {
    addItem(dish)
    setToast({ visible: true, message: `已加入购物车` })
    setTimeout(() => setToast({ visible: false, message: '' }), 2000)
  }, [addItem])

  /* ── Particle ── */
  const spawnParticle = useCallback((x, y) => {
    const id = Date.now() + Math.random()
    setParticles(prev => [...prev, { id, x, y }])
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 950)
  }, [])

  return (
    <div>
      <Toast message={toast.message} visible={toast.visible} />

      {/* ═══ Section 1: MoodSelector + Search ═══ */}
        <div className="page-container-tight">
          <MoodSelector mode={mode} setMode={setMode} />

        {/* Search Bar */}
        <div
          ref={searchRef}
          className="glass-card"
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
            marginBottom: 14, transition: 'border-color 0.3s, box-shadow 0.3s',
            borderColor: searchFocused ? 'var(--color-primary)' : 'var(--color-border)',
            boxShadow: searchFocused ? '0 0 0 3px rgba(255,107,53,0.1)' : undefined,
          }}
        >
          <motion.svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
            style={{ color: searchFocused ? 'var(--color-primary)' : 'var(--color-text-tertiary)', flexShrink: 0 }}
            animate={searchFocused ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </motion.svg>
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="搜搜想吃的菜..."
            className="input-glass"
            style={{
              flex: 1, border: 'none', background: 'transparent', padding: 0, minHeight: 'auto',
              outline: 'none', fontSize: 14,
            }}
          />
          <AnimatePresence>
            {keyword && (
              <motion.button
                onClick={() => setKeyword('')}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="btn btn-ghost btn-sm"
                style={{ minHeight: 28, padding: '2px 10px', fontSize: 12, fontWeight: 600, color: 'var(--color-primary)' }}
              >
                清空
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ Section 2: Recommend Card (when not searching) ═══ */}
        {!loading && !debouncedKeyword && (
          <RecommendCard dishes={filteredDishes.length ? filteredDishes : dishes} onAdd={handleAdd} spawnParticle={spawnParticle} />
        )}

        {/* ═══ Section 3: Category Tags ═══ */}
        <div style={{ marginBottom: 12 }}>
          {/* Primary categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {CATEGORY_GROUPS[0].items.map(cat => {
              const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['其他']
              const active = activeCategory === cat
              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(cat)}
                  className={`tag ${active ? 'tag-active' : ''}`}
                  style={{
                    cursor: 'pointer', padding: '6px 12px', fontSize: 12, fontWeight: 700,
                    transition: 'all 0.25s',
                    boxShadow: active ? '0 2px 8px rgba(255,107,53,0.3)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 12 }}>{cfg.emoji}</span>
                  {cat}
                </motion.button>
              )
            })}
            {!showAllCategories && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllCategories(true)}
                className="tag"
                style={{ cursor: 'pointer', fontWeight: 600, borderColor: 'rgba(255,107,53,0.3)', color: 'var(--color-primary)' }}
              >
                更多菜系
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 4.5L6 7.5L9 4.5" />
                </svg>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 16, height: 14, borderRadius: 7, background: 'var(--color-primary)',
                  color: 'white', fontSize: 9, fontWeight: 800, lineHeight: 1,
                }}>
                  {CATEGORY_GROUPS.slice(1).reduce((sum, g) => sum + g.items.length, 0)}
                </span>
              </motion.button>
            )}
          </div>

          {/* Expanded categories */}
          <AnimatePresence>
            {showAllCategories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAllCategories(false)}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)' }}
                    >
                      收起
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 7.5L6 4.5L9 7.5" />
                      </svg>
                    </motion.button>
                  </div>
                  {CATEGORY_GROUPS.slice(1).map(group => (
                    <div key={group.label} style={{ marginBottom: 6 }}>
                      <span className="gradient-text" style={{ fontSize: 10, fontWeight: 800, display: 'block', marginBottom: 4 }}>
                        {group.label}
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {group.items.map(cat => {
                          const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['其他']
                          const active = activeCategory === cat
                          return (
                            <motion.button
                              key={cat}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCategoryChange(cat)}
                              className={`tag ${active ? 'tag-active' : ''}`}
                              style={{
                                cursor: 'pointer', padding: '6px 12px', fontSize: 12, fontWeight: 700,
                                boxShadow: active ? '0 2px 8px rgba(255,107,53,0.3)' : 'none',
                              }}
                            >
                              <span style={{ fontSize: 12 }}>{cfg.emoji}</span>
                              {cat}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ Section 4: Dish List ═══ */}
        {loading ? (
          <MenuSkeleton />
        ) : filteredDishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '48px 16px', position: 'relative', overflow: 'hidden',
            }}
          >
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
              width: 72, height: 72, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16, position: 'relative',
              background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(250,81,81,0.06))',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <span style={{ fontSize: 36 }}>🔍</span>
            </div>
            <p className="t-h2" style={{ marginBottom: 4 }}>没搜到这口</p>
            <p className="t-caption" style={{ textAlign: 'center', maxWidth: 200 }}>
              换个关键词试试~<br />也许换个名字就能找到啦
            </p>
          </motion.div>
        ) : (
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {filteredDishes.map(dish => {
              const cfg = CATEGORY_CONFIG[dish.category] || CATEGORY_CONFIG['其他']
              return (
                <motion.div
                  key={`${dish.id}-${dish.name}`}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileTap={{ scale: 0.985 }}
                  className="glass-card"
                  style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                  onClick={() => navigate(`/dish/${dish.id}`)}
                >
                  {/* Left color bar */}
                  <div style={{
                    position: 'absolute', left: 0, top: 12, bottom: 12, width: 3, borderRadius: '0 3px 3px 0',
                    background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}60)`,
                    opacity: 0.5, transition: 'opacity 0.2s',
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                    {/* Dish Image */}
                    <DishImage dish={dish} size={64} radius={18} />
                    {/* Dish Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <h3 className="t-h3" style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {dish.name}
                        </h3>
                        <span className="tag" style={{ fontSize: 10, padding: '2px 6px', flexShrink: 0 }}>
                          {dish.category}
                        </span>
                      </div>
                      {dish.description && (
                        <p className="t-caption" style={{ WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: 2 }}>
                          {dish.description}
                          {getDishRecipe(dish.id) && (
                            <span style={{ color: 'var(--color-primary)', marginLeft: 4, opacity: 0.7 }}>· 点击查看做法 →</span>
                          )}
                        </p>
                      )}
                      {!dish.description && getDishRecipe(dish.id) && (
                        <p className="t-caption" style={{ color: 'var(--color-primary)', opacity: 0.7, marginTop: 2 }}>
                          点击查看做法 →
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        <LovePrice price={dish.price} size="md" showLabel />
                        <motion.button
                          whileTap={{ scale: 0.82 }}
                          whileHover={{ scale: 1.08 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            const rect = e.currentTarget.getBoundingClientRect()
                            spawnParticle(rect.left + rect.width / 2, rect.top)
                            handleAdd(dish)
                          }}
                          className="btn btn-icon-sm"
                          aria-label={`添加${dish.name}`}
                          style={{
                            background: mode === 'her'
                              ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
                              : 'linear-gradient(135deg, var(--color-haze), #567BB5)',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(255,107,53,0.2)',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* ═══ +1 Particles ═══ */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -60, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'fixed', zIndex: 100, pointerEvents: 'none', left: p.x, top: p.y }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 2,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              color: 'white', fontSize: 12, fontWeight: 800, padding: '4px 10px',
              borderRadius: 12, boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
            }}>
              <span>+1</span>
              <span>💋</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ═══ Bottom Cart FAB ═══ */}
      {totalCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            position: 'fixed',
            bottom: 88,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: 448,
            zIndex: 40,
          }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/cart')}
            className="btn-primary"
            style={{
              width: '100%', minHeight: 48, borderRadius: 16, fontSize: 15, fontWeight: 800,
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 16, pointerEvents: 'none',
            }}>
              <div style={{
                position: 'absolute', top: '-50%', left: '-25%', width: '60%', height: '200%',
                transform: 'rotate(20deg)',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }} />
            </div>
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🛒</span>
              去看宝宝选了啥 ({totalCount}件)
            </span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}