import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../components/CartContext'
import LovePrice from '../components/LovePrice'
import Header from '../components/Header'
import KissIcon from '../components/KissIcon'
import { getDishImage, getCategoryEmoji } from '../lib/categoryIcons'
import { getDishRecipe } from '../lib/dishRecipes'

export default function DishDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, whoAmI } = useCart()
  const [dish, setDish] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [recipeOpen, setRecipeOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/dishes/all`).then(r => r.json())
      .then(data => {
        const d = data.find(x => x.id === Number(id))
        setDish(d || null)
        setLoading(false)
      })
  }, [id])

  const handleAdd = () => {
    if (!dish) return
    for (let i = 0; i < quantity; i++) addItem(dish)
    navigate('/menu')
  }

  if (loading) return <div className="flex items-center justify-center py-32"><motion.div className="text-5xl" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>🍳</motion.div></div>
  if (!dish) return <div className="flex flex-col items-center justify-center py-32 text-[var(--color-text-secondary)]"><div className="text-6xl mb-4">😵</div><p>找不到这道菜</p></div>

  return (
    <div>
      <Header title={dish.name}
        right={<motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="d3-btn-sm px-3 py-1.5 bg-[var(--color-cream-dark)] text-[var(--color-text-secondary)]">← 返回</motion.button>} />

      <div className="px-4 space-y-4">
        {/* 大图 */}
        <motion.div initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5 }}
          className="d3-card-face w-full aspect-square rounded-3xl flex items-center justify-center overflow-hidden"
          style={{ perspective: '800px' }}>
          {getDishImage(dish) ? (
                    <img src={getDishImage(dish)} alt={dish.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-8xl">{getCategoryEmoji(dish?.category)}</span>
                  )}
        </motion.div>

        {/* 信息 */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="d3-card-face p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>{dish.name}</h2>
            <span className="d3-badge">{dish.category}</span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{dish.description || '一道美味的菜品~'}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <KissIcon className="w-5 h-5 text-[var(--color-secondary)]" />
            <LovePrice price={dish.price} size="2xl" showLabel />
          </div>
        </motion.div>

        {/* 做法提示 */}
        {getDishRecipe(Number(id)) && (() => {
          const recipe = getDishRecipe(Number(id))
          return (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="d3-card-face overflow-hidden">
              <div className="px-4 pt-4 pb-2 flex items-center gap-2 cursor-pointer select-none" onClick={() => setRecipeOpen(!recipeOpen)}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-primary-light)' }}>
                  <svg className="w-3.5 h-3.5 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    <path d="M8 7h8M8 11h5"/>
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text)] flex-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>简单做法</h3>
                <motion.span animate={{ rotate: recipeOpen ? 180 : 0 }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-[var(--color-text-secondary)]"
                  style={{ background: 'var(--color-cream)' }}>▼</motion.span>
              </div>
              <AnimatePresence>
                {recipeOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-3">
                      {/* 食材 */}
                      <div>
                        <p className="text-xs font-bold text-[var(--color-primary)] mb-1.5">🥘 食材</p>
                        <div className="flex flex-wrap gap-1.5">
                          {recipe.ingredients.map((item, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-cream)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">{item}</span>
                          ))}
                        </div>
                      </div>
                      {/* 步骤 */}
                      <div>
                        <p className="text-xs font-bold text-[var(--color-primary)] mb-1.5">📝 步骤</p>
                        <div className="space-y-1.5">
                          {recipe.steps.map((step, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* 小贴士 */}
                      {recipe.tip && (
                        <div className="rounded-xl bg-[var(--color-primary-light)] p-2.5">
                          <p className="text-[10px] font-bold text-[var(--color-primary)] mb-0.5">💡 小贴士</p>
                          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{recipe.tip}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })()}

        {/* 数量 */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="d3-card-face p-4 flex items-center justify-between">
          <span className="text-sm font-bold text-[var(--color-text)]">数量</span>
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-xl bg-[var(--color-cream-dark)] flex items-center justify-center text-[var(--color-text)] font-bold text-lg">-</motion.button>
            <motion.span key={quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-6 text-center font-bold text-lg">{quantity}</motion.span>
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, var(--color-peach), var(--color-primary))' }}>+</motion.button>
          </div>
        </motion.div>

        {/* 加入购物车 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <motion.button whileTap={{ scale: 0.97, y: 2 }} whileHover={{ y: -1 }}
            onClick={handleAdd}
            className="d3-btn d3-btn-primary w-full py-4 text-center rounded-2xl font-extrabold text-[15px]">
            <span className="relative z-10">{whoAmI === 'me' ? '🐱' : '🐰'} 加入购物车</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
