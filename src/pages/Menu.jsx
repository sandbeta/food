import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../components/CartContext'
import Header from '../components/Header'
import KissIcon from '../components/KissIcon'
import { getDishImage, getCategoryEmoji } from '../lib/categoryIcons'
import { getDishRecipe } from '../lib/dishRecipes'

const CATEGORY_CONFIG = {
  '全部': { emoji: '✨', light: '#FFF1E5', color: '#FF6B35' },
  '家常菜': { emoji: '🍳', light: '#FFF0E7', color: '#F0A860' },
  '硬菜': { emoji: '🥩', light: '#FFE8EC', color: '#FA5151' },
  '素菜': { emoji: '🥬', light: '#EAF7E7', color: '#6BBF5C' },
  '主食': { emoji: '🍚', light: '#FFF7D7', color: '#E8C84A' },
  '小吃': { emoji: '🍢', light: '#F4E9FF', color: '#A06CD5' },
  '水果': { emoji: '🍎', light: '#FFE9EF', color: '#F47A92' },
  '饮品': { emoji: '🧋', light: '#E5F7FA', color: '#4AB8C8' },
  '汤类': { emoji: '🍲', light: '#FFF0E7', color: '#E8A050' },
  '川菜': { emoji: '🌶️', light: '#FFE3DC', color: '#E85040' },
  '粤菜': { emoji: '🥢', light: '#FFF1D8', color: '#E8C060' },
  '湘菜': { emoji: '🔥', light: '#FFE7D6', color: '#E88040' },
  '鲁菜': { emoji: '🍤', light: '#FFECD1', color: '#D09050' },
  '苏菜': { emoji: '🪷', light: '#F2E9FF', color: '#9070C8' },
  '浙菜': { emoji: '🐟', light: '#E5F7FA', color: '#50A8B8' },
  '闽菜': { emoji: '🦐', light: '#E6F5FF', color: '#5898D0' },
  '徽菜': { emoji: '🍲', light: '#EFE6DC', color: '#A08060' },
  '东北菜': { emoji: '🥟', light: '#F0F6E8', color: '#80A858' },
  '西北菜': { emoji: '🍖', light: '#FFF0D8', color: '#C89848' },
  '云贵菜': { emoji: '🍄', light: '#EAF7E7', color: '#6BBF5C' },
  '其他': { emoji: '🍽️', light: '#F5F5F5', color: '#A0A0A0' },
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.045 } } }
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }

function WhoSelector({ whoAmI, setWhoAmI }) {
  return (
    <div className="d3-card-face p-1.5 flex items-center gap-1.5 mb-4">
      <span className="pl-2 pr-1 text-xs text-[var(--color-text-secondary)] font-bold">给谁点</span>
      {[{ value: 'me', label: '自己', icon: '🐱' }, { value: 'partner', label: 'TA', icon: '🐰' }].map(opt => (
        <motion.button key={opt.value} whileTap={{ scale: 0.95 }} onClick={() => setWhoAmI(opt.value)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ease-out ${whoAmI === opt.value ? (opt.value === 'me' ? 'avatar-me glow-primary' : 'avatar-partner') : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-cream)]'}`}
          animate={whoAmI === opt.value ? { scale: 1.02 } : { scale: 1 }}>
          <motion.span className="w-5 h-5 rounded-full bg-[#FFF8F2]/30 flex items-center justify-center text-[10px]"
            animate={whoAmI === opt.value ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5 }}>{opt.icon}</motion.span>
          {opt.label}
        </motion.button>
      ))}
    </div>
  )
}

function RecommendCard({ dishes, onAdd, spawnParticle }) {
  const randomDish = useMemo(() => {
    if (dishes.length === 0) return null
    return dishes[Math.floor(Math.random() * dishes.length)]
  }, [dishes])

  if (!randomDish) return null
  const cfg = CATEGORY_CONFIG[randomDish.category] || CATEGORY_CONFIG['其他']

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      className="d3-card-face p-4 mb-4 overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${cfg.light} 0%, rgba(255,255,255,.95) 100%)`,
          borderColor: `${cfg.color}30`,
      }}>
      {/* 多个模糊圆形装饰元素 */}
      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full animate-float-gentle"
        style={{ background: `radial-gradient(circle, ${cfg.color}20, transparent 70%)` }} />
      <div className="absolute -left-6 -bottom-6 w-20 h-20 rounded-full animate-float"
        style={{ background: `radial-gradient(circle, ${cfg.color}15, transparent 70%)`, animationDelay: '1s' }} />
      <div className="absolute right-12 top-1 w-12 h-12 rounded-full animate-pulse-soft"
        style={{ background: `radial-gradient(circle, ${cfg.color}12, transparent 70%)`, animationDelay: '0.5s' }} />
      <div className="absolute left-1/3 -top-4 w-8 h-8 rounded-full animate-pulse-soft"
        style={{ background: `radial-gradient(circle, ${cfg.color}10, transparent 70%)`, animationDelay: '1.5s' }} />

      <div className="relative flex items-center justify-between mb-3">
        <span className="badge-soft text-xs font-extrabold px-2.5 py-1 rounded-full"
          style={{ background: `linear-gradient(135deg, ${cfg.color}18, ${cfg.color}08)` }}>今日灵感</span>
        <span className="text-xs text-[var(--color-text-secondary)]">不知道吃啥就选它</span>
      </div>
      <div className="relative flex items-center gap-3">
        <div className="w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${cfg.light} 0%, #FFFFFF 60%, ${cfg.color}08 100%)`,
            boxShadow: `inset 0 2px 8px ${cfg.color}12, 0 4px 12px ${cfg.color}15`,
          }}>
          <span className="text-3xl drop-shadow-sm">{cfg.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[17px] text-[var(--color-text)] truncate">{randomDish.name}</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-1">{randomDish.description || '好吃的~'}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <KissIcon className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
            <span className="text-[15px] font-extrabold text-[var(--color-primary)]">{randomDish.price}</span>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }} onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          spawnParticle(rect.left + rect.width / 2, rect.top)
          onAdd(randomDish)
        }}
          className="d3-btn d3-btn-primary text-white px-3.5 py-2 rounded-2xl text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
          加一份
        </motion.button>
      </div>
    </motion.div>
  )
}

const CATEGORY_GROUPS = [
  {
    label: '家常',
    items: ['全部', '家常菜', '硬菜', '素菜', '主食', '小吃', '水果', '饮品', '汤类']
  },
  {
    label: '八大菜系',
    items: ['川菜', '粤菜', '湘菜', '鲁菜', '苏菜', '浙菜', '闽菜', '徽菜']
  },
  {
    label: '地方风味',
    items: ['东北菜', '西北菜', '云贵菜', '其他']
  }
]

export default function Menu() {
  const [dishes, setDishes] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('全部')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const searchRef = useRef(null)
  const [particles, setParticles] = useState([])
  const { addItem, totalCount, whoAmI, setWhoAmI } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/dishes/categories').then(r => r.json()).then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/dishes?category=${encodeURIComponent(activeCategory)}`)
      .then(r => r.json())
      .then(data => { setDishes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeCategory])

  const filteredDishes = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    if (!q) return dishes
    return dishes.filter(d => `${d.name} ${d.category} ${d.description || ''}`.toLowerCase().includes(q))
  }, [dishes, keyword])

  const spawnParticle = (x, y) => {
    const id = Date.now() + Math.random()
    setParticles(prev => [...prev, { id, x, y }])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id))
    }, 950)
  }

  return (
    <div>
      <Header title="今天吃什么？" subtitle="一起选点好吃的吧~" />

      <div className="px-4 pb-4">
        <WhoSelector whoAmI={whoAmI} setWhoAmI={setWhoAmI} />

        {/* 搜索框 - 增加聚焦发光和搜索图标动画 */}
        <div className={`d3-card-face flex items-center gap-2 px-3 py-2.5 mb-4 bg-[var(--color-card)]/90 transition-all duration-300 ${searchFocused ? 'ring-[3px] ring-[var(--color-primary)]/20 border-[var(--color-primary)]/40' : ''}`}
          ref={searchRef}>
          <motion.svg className={`w-4 h-4 text-[var(--color-text-secondary)] transition-colors duration-300 ${searchFocused ? 'text-[var(--color-primary)]' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
            animate={searchFocused ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}>
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </motion.svg>
          <input value={keyword} onChange={e => setKeyword(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="搜搜想吃的菜..."
            className="d3-input bg-transparent flex-1 text-sm placeholder:text-[var(--color-text-secondary)]/60 outline-none" />
          <AnimatePresence>
            {keyword && (
              <motion.button onClick={() => setKeyword('')}
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                className="text-xs text-[var(--color-primary)] font-bold px-1 whitespace-nowrap overflow-hidden">清空</motion.button>
            )}
          </AnimatePresence>
        </div>

        {!loading && <RecommendCard dishes={filteredDishes.length ? filteredDishes : dishes} onAdd={addItem} spawnParticle={spawnParticle} />}

        {/* 分类标签 - 可折叠分组网格布局 */}
        <div className="mb-3">
          {/* 常用分类（始终显示） */}
          <div className="flex flex-wrap gap-2 items-center">
            {CATEGORY_GROUPS[0].items.map(cat => {
              const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['其他']
              const active = activeCategory === cat
              return (
                <motion.button key={cat}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ y: -1 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${active ? 'd3-btn d3-btn-primary text-white' : 'd3-btn-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)]'}`}
                  style={active ? {
                    background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
                    boxShadow: '0 4px 14px rgba(255, 107, 53, 0.30), 0 1px 3px rgba(196, 95, 44, 0.15)',
                  } : {}}>
                  <span className="text-xs">{cfg.emoji}</span>{cat}
                </motion.button>
              )
            })}
            {/* 更多菜系展开/收起按钮 */}
            {!showAllCategories && (
              <motion.button
                key="toggle-btn"
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllCategories(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all duration-300">
                更多菜系
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 4.5L6 7.5L9 4.5" />
                </svg>
                <span className="inline-flex items-center justify-center w-4 h-3 rounded-full bg-[var(--color-primary)] text-white text-[9px] leading-none font-extrabold">
                  {CATEGORY_GROUPS.slice(1).reduce((sum, g) => sum + g.items.length, 0)}
                </span>
              </motion.button>
            )}
          </div>

          {/* 展开区域 - 八大菜系 + 地方风味 */}
          <AnimatePresence>
            {showAllCategories && (
              <motion.div
                key="expanded-categories"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-1.5">
                  {/* 收起按钮 */}
                  <div className="flex justify-end">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAllCategories(false)}
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200">
                      收起
                      <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7.5L6 4.5L9 7.5" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* 分组列表 */}
                  {CATEGORY_GROUPS.slice(1).map(group => (
                    <div key={group.label}>
                      <div className="text-[10px] font-extrabold px-0.5 pb-1"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                        {group.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map(cat => {
                          const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['其他']
                          const active = activeCategory === cat
                          return (
                            <motion.button key={cat}
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ y: -1 }}
                              onClick={() => setActiveCategory(cat)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${active ? 'd3-btn d3-btn-primary text-white' : 'd3-btn-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary-dark)]'}`}
                              style={active ? {
                                background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
                                boxShadow: '0 4px 14px rgba(255, 107, 53, 0.30), 0 1px 3px rgba(196, 95, 44, 0.15)',
                              } : {}}>
                              <span className="text-xs">{cfg.emoji}</span>{cat}
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

        {loading ? (
          /* 骨架屏 - 优化占位动画 */
          <div className="space-y-3.5">
            {[1,2,3,4].map(i => (
              <div key={i} className="d3-card p-3.5 flex items-center gap-3 overflow-hidden">
                <div className="w-[70px] h-[70px] rounded-[24px] animate-shimmer-fade shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-[16px] w-[55%] animate-shimmer-fade rounded-full" style={{ animationDelay: `${i * 0.15}s` }} />
                  <div className="h-[12px] w-[35%] animate-shimmer-fade rounded-full" style={{ animationDelay: `${i * 0.15 + 0.1}s` }} />
                  <div className="h-[12px] w-[25%] animate-shimmer-fade rounded-full" style={{ animationDelay: `${i * 0.15 + 0.2}s` }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDishes.length === 0 ? (
          /* 空状态 - 增加插画感 */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="d3-card flex flex-col items-center justify-center py-16 px-4">
            {/* 装饰背景圆 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="w-32 h-32 rounded-full animate-pulse-soft"
                style={{ background: 'radial-gradient(circle, rgba(232,128,74,0.08), transparent 70%)' }} />
            </div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 animate-float"
                style={{ background: 'linear-gradient(135deg, rgba(232,128,74,0.10), rgba(250,81,81,0.08))' }}>
                <span className="text-5xl">🔍</span>
              </div>
            </div>
            <p className="text-[var(--color-text)] font-bold text-base">没搜到这口</p>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1.5 text-center max-w-[200px] leading-relaxed">换个关键词试试~<br/>也许换个名字就能找到啦</p>
          </motion.div>
        ) : (
          <motion.div className="space-y-3.5" variants={container} initial="hidden" animate="show">
            {filteredDishes.map(dish => {
              const cfg = CATEGORY_CONFIG[dish.category] || CATEGORY_CONFIG['其他']
              return (
                <motion.div key={`${dish.id}-${dish.name}`} variants={item}
                  whileTap={{ scale: 0.985 }}
                  whileHover={{ y: -1 }}
                  className="d3-card cursor-pointer overflow-hidden group">
                  <div className="d3-card-face p-3.5 flex items-center gap-3"
                    onClick={() => navigate(`/dish/${dish.id}`)}>
                  {/* 左侧彩色装饰条 */}
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-all duration-300 opacity-60 group-hover:opacity-100"
                    style={{ background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}80)` }} />
                  <div className="w-[70px] h-[70px] rounded-[24px] flex items-center justify-center shrink-0 overflow-hidden transition-all duration-300"
                    style={{
                      background: `linear-gradient(145deg, ${cfg.light} 0%, #FFFFFF 50%, ${cfg.color}06 100%)`,
                      boxShadow: `inset 0 2px 6px ${cfg.color}10, 0 4px 10px ${cfg.color}12`,
                    }}>
                    {dish.image_url ? <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" /> : <span className="text-3xl drop-shadow-sm">{cfg.emoji}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-[16px] text-[var(--color-text)] truncate">{dish.name}</h3>
                      <span className="badge-soft text-[10px] px-1.5 py-0.5 rounded-full font-bold">{dish.category}</span>
                    </div>
                    {dish.description && <p className="text-[13px] text-[var(--color-text-secondary)] mt-1 line-clamp-1 leading-relaxed">{dish.description}{getDishRecipe(dish.id) && <span className="text-[var(--color-primary)] ml-1 opacity-70">· 点击查看做法 →</span>}</p>}
                    {!dish.description && getDishRecipe(dish.id) && <p className="text-[13px] text-[var(--color-primary)] mt-1 opacity-70">点击查看做法 →</p>}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1">
                        <KissIcon className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                        <span className="text-[18px] font-extrabold text-[var(--color-primary)] leading-tight">{dish.price}</span>
                      </div>
                      <motion.button whileTap={{ scale: 0.82 }} whileHover={{ scale: 1.08 }} onClick={(e) => {
                        e.stopPropagation()
                        const rect = e.currentTarget.getBoundingClientRect()
                        spawnParticle(rect.left + rect.width / 2, rect.top)
                        addItem(dish)
                      }} aria-label={`添加${dish.name}`}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-90"
                        style={{
                          background: whoAmI === 'me' ? 'linear-gradient(135deg, var(--color-peach), var(--color-secondary))' : 'linear-gradient(135deg, var(--color-haze), #567BB5)',
                          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.20), 0 2px 6px rgba(196, 95, 44, 0.12), inset 0 1px 0 rgba(255,255,255,0.65)',
                        }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
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

      {/* +1 飘升粒子 */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -60, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[100] pointer-events-none"
            style={{ left: p.x, top: p.y }}
          >
            <div className="flex items-center gap-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-xs font-extrabold px-2 py-1 rounded-full shadow-lg">
              <span>+1</span>
              <KissIcon className="w-3 h-3" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 底部悬浮按钮 - 增加脉动发光动画 */}
      {totalCount > 0 && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[448px] z-40">
          <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} onClick={() => navigate('/cart')}
            className="d3-btn d3-btn-primary block w-full text-white text-center py-3.5 rounded-2xl font-extrabold text-[15px] animate-pulse-glow relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
            {/* 按钮内部光效 */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute -top-1/2 -left-1/4 w-[60%] h-[200%] rotate-[20deg] animate-pulse-soft"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
            </div>
            <span className="relative flex items-center justify-center gap-2">
              <span className="text-lg">🛒</span>
              去看我们选了啥 ({totalCount}件)
            </span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
