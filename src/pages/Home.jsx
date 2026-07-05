import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import KissIcon from '../components/KissIcon'
import { getDishImage, getCategoryEmoji } from '../lib/categoryIcons'

const baseUrl = import.meta.env.BASE_URL || '/'

const QUICK_ACTIONS = [
  { label: '菜单', emoji: '🍜', path: '/menu', color: '#FF6B35', bg: '#FFF0EB' },
  { label: '收藏', emoji: '⭐', path: '/favorites', color: '#FF8F5A', bg: '#FEF9C3' },
  { label: '订单', emoji: '📋', path: '/orders', color: '#E55A2B', bg: '#FFF0EB' },
  { label: '我的', emoji: '👤', path: '/profile', color: '#666666', bg: '#F5F5F4' },
]

const CATEGORY_QUICK = [
  { name: '川菜', icon: `${baseUrl}dish-images/icon-sichuan.png`, taste: '麻辣', emoji: '🌶️', color: '#FA5151' },
  { name: '粤菜', icon: `${baseUrl}dish-images/icon-cantonese.png`, taste: '清鲜', emoji: '🦐', color: '#EA580C' },
  { name: '湘菜', icon: `${baseUrl}dish-images/icon-hunan.png`, taste: '香辣', emoji: '🌶️', color: '#CA8A04' },
  { name: '鲁菜', icon: `${baseUrl}dish-images/icon-shandong.png`, taste: '咸鲜', emoji: '🍖', color: '#7C2D12' },
  { name: '苏菜', icon: `${baseUrl}dish-images/icon-jiangsu.png`, taste: '甜鲜', emoji: '🦀', color: '#0891B2' },
  { name: '浙菜', icon: `${baseUrl}dish-images/icon-zhejiang.png`, taste: '鲜嫩', emoji: '🐟', color: '#059669' },
  { name: '闽菜', icon: `${baseUrl}dish-images/icon-fujian.png`, taste: '汤鲜', emoji: '🍲', color: '#7C3AED' },
  { name: '徽菜', icon: `${baseUrl}dish-images/icon-anhui.png`, taste: '醇厚', emoji: '🍄', color: '#BE185D' },
]

const MOTIVATIONS = [
  '吃饱了才有力气减肥~', '今天也要好好吃饭呀', '唯有美食与爱不可辜负',
  '吃好喝好，长生不老', '人生苦短，再来一碗', '肚子饱了，心情就好了',
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20, rotateX: 10 }, show: { opacity: 1, y: 0, rotateX: 0 } }

export default function Home() {
  const [recentOrders, setRecentOrders] = useState([])
  const [recommendDishes, setRecommendDishes] = useState([])
  const [popularDishes, setPopularDishes] = useState([])
  const [bannerIndex, setBannerIndex] = useState(0)
  const [motivation] = useState(() => MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(d => setRecentOrders(d.slice(0, 3)))
    fetch('/api/dishes?category=全部').then(r => r.json()).then(d => {
      const shuffled = [...d].sort(() => 0.5 - Math.random())
      setRecommendDishes(shuffled.slice(0, 5))
      setPopularDishes(shuffled.slice(5, 10))
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const banners = recommendDishes.slice(0, 3)

  return (
    <div>
      <Header title={`${getGreeting()}，今天吃什么？`} subtitle={motivation} />

      <div className="px-4 pb-4 space-y-5">
        {/* 3D 轮播 Banner */}
        {banners.length > 0 && (
          <div className="relative h-44 rounded-3xl overflow-hidden d3-card-face" style={{ perspective: '800px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={bannerIndex}
                initial={{ opacity: 0, rotateY: 30, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -30, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 cursor-pointer preserve-3d"
                onClick={() => navigate(`/dish/${banners[bannerIndex]?.id}`)}
              >
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FFF0EB, #FFE4D9)' }}>
                  {banners[bannerIndex]?.image_url ? (
                    <img src={banners[bannerIndex].image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <div className="text-6xl mb-2">{['🔥', '✨', '🍽️'][bannerIndex]}</div>
                      <p className="text-lg font-bold text-[var(--color-text)]">{banners[bannerIndex]?.name}</p>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{banners[bannerIndex]?.description || '今日特推，不容错过~'}</p>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {banners.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === bannerIndex ? 'w-6 bg-[var(--color-primary)]' : 'w-1.5 bg-white/50'}`} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* 快捷入口 */}
        <motion.div className="grid grid-cols-4 gap-3" variants={container} initial="hidden" animate="show">
          {QUICK_ACTIONS.map((action) => (
            <motion.button key={action.label} variants={item}
              whileTap={{ scale: 0.92, y: 2 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400 } }}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-1.5 py-2"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${action.bg}, ${action.color}15)`,
                  boxShadow: `0 4px 12px ${action.color}20, inset 0 1px 0 rgba(255,255,255,0.5)`,
                  border: `1.5px solid ${action.color}18`
                }}>
                {action.emoji}
              </div>
              <span className="text-[11px] font-bold text-[var(--color-text-secondary)]">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* 八大菜系快捷入口 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>八大菜系</h2>
            <button onClick={() => navigate('/menu')} className="text-xs text-[var(--color-primary)] font-bold">全部 →</button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {CATEGORY_QUICK.map((cat, i) => (
              <motion.button key={cat.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -3 }}
                onClick={() => navigate('/menu')}
                className="shrink-0 flex flex-col items-center gap-1.5 py-2 px-1"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}18, ${cat.color}08)`,
                    border: `2px solid ${cat.color}25`,
                    boxShadow: `0 2px 8px ${cat.color}15`
                  }}>
                  <img src={cat.icon} alt={cat.name} className="w-9 h-9 object-cover rounded-full" />
                </div>
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)]">{cat.name}</span>
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ color: cat.color, background: `${cat.color}12` }}>{cat.taste}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 为你推荐 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>为你推荐</h2>
            <button onClick={() => navigate('/menu')} className="text-xs text-[var(--color-primary)] font-bold">查看更多</button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {recommendDishes.map((dish, i) => (
              <motion.div key={dish.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/dish/${dish.id}`)}
                className="shrink-0 w-[140px] cursor-pointer"
              >
                <div className="d3-card-face w-[140px] h-[140px] rounded-2xl flex items-center justify-center mb-2 overflow-hidden">
                  {getDishImage(dish) ? (
                    <img src={getDishImage(dish)} className="w-full h-full object-cover" alt={dish.name} />
                  ) : (
                    <span className="text-5xl">{getCategoryEmoji(dish?.category)}</span>
                  )}
                </div>
                <p className="text-xs font-bold text-[var(--color-text)] truncate">{dish.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <KissIcon className="w-3 h-3 text-[var(--color-secondary)]" />
                  <span className="text-xs font-bold text-[var(--color-primary)]">{dish.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 大家爱吃 */}
        {popularDishes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>🔥 大家爱吃</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {popularDishes.slice(0, 4).map((dish, i) => (
                <motion.div key={dish.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/dish/${dish.id}`)}
                  className="d3-card-face p-3 cursor-pointer flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: 'linear-gradient(145deg, #FFFFFF, #FAFAFA)' }}>
                    {getDishImage(dish) ? <img src={getDishImage(dish)} className='w-full h-full object-cover rounded-xl' alt={dish.name} /> : <span className='text-2xl'>{getCategoryEmoji(dish?.category)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--color-text)] truncate">{dish.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <KissIcon className="w-2.5 h-2.5 text-[var(--color-secondary)]" />
                      <span className="text-xs font-bold text-[var(--color-primary)]">{dish.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 最近订单 */}
        {recentOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>最近订单</h2>
              <button onClick={() => navigate('/orders')} className="text-xs text-[var(--color-primary)] font-bold">全部</button>
            </div>
            <div className="space-y-2.5">
              {recentOrders.map((order, i) => (
                <motion.div key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="d3-card-face p-3.5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: 'linear-gradient(135deg, #FFF0EB, #FFE4D9)' }}>📦</div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text)]">订单 #{order.id}</p>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                        {order.items.map(i => `${i.dish_name}×${i.quantity}`).join('、').slice(0, 18)}{order.items.length > 1 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <KissIcon className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                    <span className="text-sm font-bold text-[var(--color-primary)]">{order.total_price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
