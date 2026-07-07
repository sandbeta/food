import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../components/CartContext'
import { getCategoryEmoji } from '../lib/categoryIcons'
import LovePrice, { getSweetLabel } from '../components/LovePrice'

const baseUrl = import.meta.env.BASE_URL || '/'

/* ══════════════════════════════════════════
   CONSTANTS — Sweet & Cute
   ══════════════════════════════════════════ */

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 9) return '早安呀'
  if (hour < 11) return '早上好呀'
  if (hour < 14) return '中午好呀'
  if (hour < 17) return '下午好呀'
  if (hour < 19) return '傍晚好呀'
  if (hour < 22) return '晚上好呀'
  return '夜深啦'
}

function getGreetingEmoji() {
  const hour = new Date().getHours()
  if (hour < 9) return '🌅'
  if (hour < 11) return '☀️'
  if (hour < 14) return '🍱'
  if (hour < 17) return '☕'
  if (hour < 19) return '🌇'
  if (hour < 22) return '🌙'
  return '✨'
}

const NICKNAMES = ['小可爱', '小宝贝', '小甜心', '宝儿', '宝子', '我家小朋友', '小馋猫', '甜妹', '小仙女', '公主殿下']
function getNickname() { return NICKNAMES[new Date().getDate() % NICKNAMES.length] }

const MOTIVATIONS = [
  '今天的你和美食都很甜呀～', '喂饱自己，才有力气拥抱世界呀',
  '恋爱可以慢慢谈，饭要趁热吃噢～', '不吃饭的女孩子会变成小怪兽的！',
  '这一口，是给自己最好的奖励～', '心情不好的时候，就让胃先快乐起来吧',
  '是甜食先动的手，不是我先嘴馋的！', '吃饱饱，没烦恼，今天也辛苦啦',
  '本可爱决定先爱自己，从这顿饭开始~', '对全世界温柔，不如对自己好一点呀',
  '今天的我：吃饭第一名，减肥明天再说', '想和你一起，把烟火气吃进肚子里～',
  '女孩子要吃甜甜的才会有好心情呀', '好好吃饭就是头等大事，不接受反驳！',
]

const SWEET_TIPS = [
  '少喝点奶茶多喝热水（才怪，继续吨吨吨）',
  '告诉你一个秘密：吃饱了真的会变开心噢～',
  '今天也要做一只元气满满的小吃货呀！',
  '不要压抑自己的食欲，想吃就是身体在撒娇～',
  '吃完美食记得自拍，记录每个心动瞬间！',
  '女孩子就是要对自己好呀，想吃就吃！',
  '辣到怀疑人生？那就对了，这叫入乡随俗！',
  '别忘了你还有半杯奶茶在冰箱等你～',
]

const QUICK_ACTIONS = [
  { label: '点单', emoji: '🍜', path: '/menu', color: '#FF6B35' },
  { label: '心动', emoji: '💖', path: '/favorites', color: '#FF9500' },
  { label: '订单', emoji: '🧾', path: '/orders', color: '#07C160' },
]

/* ══════════════════════════════════════════
   SKELETON — Loading State
   ══════════════════════════════════════════ */

function HomeSkeleton() {
  return (
    <div className="page-container">
      <div className="skeleton skeleton-title" style={{ height: 22, width: '50%', marginBottom: 8 }} />
      <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: 20 }} />
      <div className="bento-grid">
        <div className="bento-col-2"><div className="skeleton skeleton-card" style={{ height: 80 }} /></div>
        <div className="bento-col-1"><div className="skeleton skeleton-card" style={{ height: 80 }} /></div>
        <div className="bento-col-1"><div className="skeleton skeleton-card" style={{ height: 80 }} /></div>
      </div>
      <div className="section-gap"><div className="skeleton skeleton-card" style={{ height: 180 }} /></div>
      <div className="section-gap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 14 }} />)}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   HOME PAGE — Bento UI
   ══════════════════════════════════════════ */

export default function Home() {
  const navigate = useNavigate()
  const { totalCount } = useCart()
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroDish, setHeroDish] = useState(null)
  const motivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]
  const sweetTip = SWEET_TIPS[new Date().getDate() % SWEET_TIPS.length]

  const CATEGORIES = [
    { key: '川菜', label: '川菜', taste: '麻辣', icon: 'icon-sichuan' },
    { key: '粤菜', label: '粤菜', taste: '清鲜', icon: 'icon-cantonese' },
    { key: '湘菜', label: '湘菜', taste: '香辣', icon: 'icon-hunan' },
    { key: '鲁菜', label: '鲁菜', taste: '咸鲜', icon: 'icon-shandong' },
    { key: '苏菜', label: '苏菜', taste: '甜鲜', icon: 'icon-jiangsu' },
    { key: '浙菜', label: '浙菜', taste: '鲜嫩', icon: 'icon-zhejiang' },
    { key: '闽菜', label: '闽菜', taste: '汤鲜', icon: 'icon-fujian' },
    { key: '徽菜', label: '徽菜', taste: '醇厚', icon: 'icon-anhui' },
  ]

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/dishes?category=全部')
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setDishes(data)
        if (data.length > 0) {
          const idx = new Date().getDate() % data.length
          setHeroDish(data[idx])
        }
      } catch (e) {
        console.error('Home fetch error:', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const getRandomDishes = useCallback((count) => {
    if (!dishes.length) return []
    const shuffled = [...dishes].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }, [dishes])

  if (loading) return <HomeSkeleton />

  const recommendDishes = getRandomDishes(4)
  const popularDishes = getRandomDishes(4)

  return (
    <div className="page-container">
      {/* ═══ Section 1: Header — Brand + Greeting ═══ */}
      <motion.div
        className="flex items-start justify-between mb-1"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="text-2xl inline-block"
            >{getGreetingEmoji()}</motion.span>
            <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>
              {getGreeting()}，{getNickname()}～
            </h1>
          </div>
          <p className="t-caption mt-1">{motivation}</p>
        </div>
      </motion.div>

      {/* ═══ Section 2: Bento Grid — 3 Quick Actions ═══ */}
      <motion.div
        className="section-gap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {/* Sweet Tip Card (spans 2 cols) */}
        <div className="glass-card-love bento-col-2 p-4 flex items-center gap-3" style={{ display: 'flex', marginBottom: 12 }}>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-2xl shrink-0"
          >💝</motion.span>
          <div className="min-w-0">
            <p className="t-h3" style={{ color: 'var(--color-love)' }}>今日份的小提醒</p>
            <p className="t-caption">{sweetTip}</p>
          </div>
        </div>

        {/* 3 Quick Action Buttons */}
        <div className="bento-grid">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.path}
              className="glass-card p-3 flex flex-col items-center gap-1.5 cursor-pointer"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 72 }}
              onClick={() => navigate(action.path)}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="t-tiny" style={{ color: action.color, fontWeight: 600 }}>{action.label}</span>
            </motion.button>
          ))}
          {/* Cart quick action */}
          <motion.button
            className="glass-card p-3 flex flex-col items-center gap-1.5 cursor-pointer relative"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 72 }}
            onClick={() => navigate('/cart')}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <span className="text-2xl">🛒</span>
            <span className="t-tiny" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>购物车</span>
            {totalCount > 0 && (
              <motion.span
                className="cart-badge"
                style={{ top: 4, right: 8 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >{totalCount}</motion.span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ═══ Section 3: Hero Card — Full Width Featured Dish ═══ */}
      {heroDish && (
        <motion.div
          className="section-gap"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <div
            className="glass-card-accent p-4 cursor-pointer"
            style={{ display: 'flex', alignItems: 'center', gap: 14, overflow: 'hidden', position: 'relative' }}
            onClick={() => navigate(`/dish/${heroDish.id}`)}
          >
            {/* Dish Image */}
            <div className="shrink-0" style={{ width: 88, height: 88, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
              <img
                src={`${baseUrl}${heroDish.image_url}`}
                alt={heroDish.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('img-fallback') }}
                loading="lazy"
              />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <span className="tag" style={{ fontSize: 10, marginBottom: 4, display: 'inline-block' }}>
                {getCategoryEmoji(heroDish.category)} 今日推荐
              </span>
              <h3 className="t-h2 mt-1" style={{ fontSize: 16 }}>{heroDish.name}</h3>
              <p className="t-caption" style={{ WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {heroDish.description || '超好吃，不骗你！'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <LovePrice price={heroDish.price} size="md" showLabel />
                <span className="t-tiny" style={{ color: 'var(--color-primary)' }}>去尝尝 →</span>
              </div>
            </div>
            {/* Decorative gradient */}
            <div style={{
              position: 'absolute', right: -20, top: -20, width: 100, height: 100,
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)'
            }} />
          </div>
        </motion.div>
      )}

      {/* ═══ Section 4: Cuisine Grid — 2x4 Bento ═══ */}
      <motion.div
        className="section-gap"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1.5">
            <h2 className="t-h2" style={{ fontFamily: 'var(--font-display)' }}>八大菜系</h2>
            <span className="t-tiny">每一口都是远方～</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/menu')} style={{ minHeight: 32, padding: '4px 12px', fontSize: 12 }}>
            逛逛 →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.key}
              className="glass-card p-2 flex flex-col items-center gap-1 cursor-pointer"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 72 }}
              onClick={() => navigate(`/menu?cat=${encodeURIComponent(cat.key)}`)}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + i * 0.03 }}
            >
              <img
                src={`${baseUrl}dish-images/${cat.icon}.png`}
                alt={cat.label}
                style={{ width: 32, height: 32, objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none' }}
                loading="lazy"
              />
              <span className="t-tiny" style={{ fontWeight: 600 }}>{cat.label}</span>
              <span className="t-tiny" style={{ fontSize: 9, opacity: 0.7 }}>{cat.taste}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ═══ Section 5: Recommend — Horizontal Scroll ═══ */}
      <motion.div
        className="section-gap"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="t-h2" style={{ fontFamily: 'var(--font-display)' }}>
            猜你想吃 <span className="t-tiny" style={{ color: 'var(--color-love)' }}>💗</span>
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/menu')} style={{ minHeight: 32, padding: '4px 12px', fontSize: 12 }}>
            看更多 →
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar" style={{ paddingBottom: 4 }}>
          {recommendDishes.map((dish, i) => (
            <motion.div
              key={dish.id}
              className="glass-card shrink-0 cursor-pointer"
              style={{ width: 140, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              onClick={() => navigate(`/dish/${dish.id}`)}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.26 + i * 0.04 }}
            >
              <div style={{ width: 140, height: 100, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={`${baseUrl}${dish.image_url}`}
                  alt={dish.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('img-fallback') }}
                  loading="lazy"
                />
                <div className="tag" style={{
                  position: 'absolute', top: 6, left: 6, fontSize: 10,
                  background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', backdropFilter: 'blur(4px)'
                }}>
                  {getCategoryEmoji(dish.category)} {dish.category}
                </div>
              </div>
              <div className="p-2.5">
                <p className="t-body" style={{ fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dish.name}</p>
                <div className="mt-1">
                  <LovePrice price={dish.price} size="sm" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ Section 6: Popular — 2x2 Grid ═══ */}
      <motion.div
        className="section-gap"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
      >
        <h2 className="t-h2 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          吃货都在抢 <span className="t-tiny">🍴</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {popularDishes.map((dish, i) => (
            <motion.div
              key={dish.id}
              className="glass-card cursor-pointer"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              onClick={() => navigate(`/dish/${dish.id}`)}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.31 + i * 0.04 }}
            >
              <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={`${baseUrl}${dish.image_url}`}
                  alt={dish.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('img-fallback') }}
                  loading="lazy"
                />
              </div>
              <div className="p-2.5">
                <p className="t-body" style={{ fontWeight: 600, lineHeight: 1.3 }}>{dish.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <LovePrice price={dish.price} size="sm" />
                  <span className="t-tiny">{getCategoryEmoji(dish.category)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ Bottom Spacer ═══ */}
      <div style={{ height: 40 }} />
    </div>
  )
}
