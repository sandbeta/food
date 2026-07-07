import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../components/CartContext'
import LovePrice from '../components/LovePrice'
import DishImage from '../components/DishImage'
import { getCategoryEmoji } from '../lib/categoryIcons'
import { getDishRecipe } from '../lib/dishRecipes'

const baseUrl = import.meta.env.BASE_URL || '/'

/* ══════════════════════════════════════════
   Skeleton
   ══════════════════════════════════════════ */

function DishSkeleton() {
  return (
    <div className="page-container-tight">
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1', borderRadius: 20, marginBottom: 16 }} />
      <div className="glass-card p-4" style={{ marginBottom: 12 }}>
        <div className="skeleton skeleton-title" style={{ marginBottom: 8 }} />
        <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: 6 }} />
        <div className="skeleton skeleton-text" style={{ width: '30%' }} />
      </div>
      <div className="glass-card p-4" style={{ marginBottom: 12 }}>
        <div className="skeleton" style={{ height: 48, borderRadius: 12 }} />
      </div>
      <div className="skeleton" style={{ height: 52, borderRadius: 16 }} />
    </div>
  )
}

/* ══════════════════════════════════════════
   Toast Component
   ══════════════════════════════════════════ */

function Toast({ message, visible, type = 'success' }) {
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
            background: type === 'success' ? 'linear-gradient(135deg, #07C160, #06AD56)' : 'linear-gradient(135deg, #FA5151, #E04040)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: type === 'success' ? '0 4px 16px rgba(7,193,96,0.35)' : '0 4px 16px rgba(250,81,81,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <span>{type === 'success' ? '✅' : '❌'}</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════
   DISH DETAIL PAGE — Glass Bento UI
   ══════════════════════════════════════════ */

export default function DishDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, whoAmI } = useCart()
  const [dish, setDish] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [recipeOpen, setRecipeOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })

  useEffect(() => {
    fetch('/api/dishes/all')
      .then(r => r.json())
      .then(data => {
        const d = data.find(x => x.id === Number(id))
        setDish(d || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast({ visible: false, message: '', type }), 2000)
  }

  const handleAdd = () => {
    if (!dish) return
    for (let i = 0; i < quantity; i++) addItem(dish)
    showToast(`已添加 ${quantity} 份${dish.name}`)
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/menu')
    }
  }

  if (loading) return <DishSkeleton />

  if (!dish) {
    return (
      <div className="page-container">
        <div className="glass-card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '64px 16px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>😵</div>
          <p className="t-h2" style={{ marginBottom: 4 }}>找不到这道菜</p>
          <p className="t-caption" style={{ marginBottom: 20 }}>可能已经被下架了哦~</p>
          <button className="btn btn-primary" onClick={() => navigate('/menu')}>去菜单看看</button>
        </div>
      </div>
    )
  }

  const recipe = getDishRecipe(Number(id))

  return (
    <div>
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />

      {/* ═══ Header Bar ═══ */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30, padding: '12px 16px',
        background: 'var(--color-surface)', backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleBack}
          className="btn btn-ghost btn-sm"
          style={{ minHeight: 36, padding: '4px 12px', fontSize: 13, fontWeight: 600 }}
        >
          ← 返回
        </motion.button>
        <h1 className="t-h3" style={{ fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'center', margin: '0 8px' }}>
          {dish.name}
        </h1>
        <div style={{ width: 56 }} />
      </div>

      <div className="page-container-tight">
        {/* ═══ Hero Image ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card"
          style={{
            width: '100%', aspectRatio: '1', borderRadius: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', marginBottom: 14, position: 'relative',
          }}
        >
          <DishImage dish={dish} size={'100%'} radius={24} style={{ width: '100%', height: '100%' }} />
        </motion.div>

        {/* ═══ Dish Info ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card"
          style={{ padding: 16, marginBottom: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>{dish.name}</h2>
            <span className="tag">{dish.category}</span>
          </div>
          <p className="t-body" style={{ color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            {dish.description || '一道美味的菜品~'}
          </p>
          <LovePrice price={dish.price} size="2xl" showLabel />
        </motion.div>

        {/* ═══ Recipe Section ═══ */}
        {recipe && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="glass-card"
            style={{ overflow: 'hidden', marginBottom: 12 }}
          >
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
                cursor: 'pointer', userSelect: 'none',
              }}
              onClick={() => setRecipeOpen(!recipeOpen)}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 10, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,107,53,0.1)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  <path d="M8 7h8M8 11h5" />
                </svg>
              </div>
              <h3 className="t-h3" style={{ flex: 1 }}>简单做法</h3>
              <motion.span
                animate={{ rotate: recipeOpen ? 180 : 0 }}
                style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--color-text-secondary)', background: 'var(--color-border)' }}
              >
                ▼
              </motion.span>
            </div>
            <AnimatePresence>
              {recipeOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 16px 16px' }}>
                    {/* Ingredients */}
                    <div style={{ marginBottom: 12 }}>
                      <p className="t-caption" style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 6 }}>🥘 食材</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {recipe.ingredients.map((item, i) => (
                          <span key={i} className="tag" style={{ fontSize: 10 }}>{item}</span>
                        ))}
                      </div>
                    </div>
                    {/* Steps */}
                    <div style={{ marginBottom: 12 }}>
                      <p className="t-caption" style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 6 }}>📝 步骤</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {recipe.steps.map((step, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{
                              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                              background: 'var(--color-primary)', color: 'white',
                              fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              marginTop: 1,
                            }}>
                              {i + 1}
                            </span>
                            <span className="t-body" style={{ fontSize: 13 }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Tip */}
                    {recipe.tip && (
                      <div style={{
                        borderRadius: 14, padding: 10,
                        background: 'rgba(255,107,53,0.06)',
                      }}>
                        <p className="t-caption" style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 2 }}>💡 小贴士</p>
                        <p className="t-body" style={{ fontSize: 12 }}>{recipe.tip}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ═══ Quantity Selector ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, marginBottom: 12 }}
        >
          <span className="t-h3">数量</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="btn btn-icon-sm"
              style={{ background: 'var(--color-border)', color: 'var(--color-text)', fontWeight: 700, fontSize: 18 }}
            >
              -
            </motion.button>
            <motion.span
              key={quantity}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="t-h2"
              style={{ width: 24, textAlign: 'center', fontFamily: 'var(--font-display)' }}
            >
              {quantity}
            </motion.span>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setQuantity(quantity + 1)}
              className="btn btn-icon-sm"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                color: 'white', fontWeight: 700, fontSize: 18,
              }}
            >
              +
            </motion.button>
          </div>
        </motion.div>

        {/* ═══ Add to Cart Button ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            className="btn btn-hero"
            style={{ fontSize: 16, marginBottom: 12 }}
          >
            <span>{whoAmI === 'me' ? '🐱' : '🐰'} 加入购物车</span>
          </motion.button>
          <button
            className="btn btn-ghost"
            style={{ width: '100%', fontSize: 13, color: 'var(--color-text-secondary)' }}
            onClick={() => navigate('/menu')}
          >
            继续逛逛
          </button>
        </motion.div>
      </div>
    </div>
  )
}