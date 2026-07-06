import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import KissIcon from '../components/KissIcon'
import LovePrice from '../components/LovePrice'
import { getDishImage, getCategoryEmoji } from '../lib/categoryIcons'

const baseUrl = import.meta.env.BASE_URL || '/'

const QUICK_ACTIONS = [
  { label: '点单', emoji: '🍜', path: '/menu', color: '#FF6B35', bg: '#FFF0EB' },
  { label: '心动', emoji: '💖', path: '/favorites', color: '#FF8F5A', bg: '#FEF9C3' },
  { label: '订单', emoji: '🧾', path: '/orders', color: '#E55A2B', bg: '#FFF0EB' },
  { label: '我的', emoji: '🐰', path: '/profile', color: '#666666', bg: '#F5F5F4' },
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
  '今天的你和美食都很甜呀～', '喂饱自己，才有力气拥抱世界呀',
  '恋爱可以慢慢谈，饭要趁热吃噢～', '不吃饭的女孩子会变成小怪兽的！',
  '这一口，是给自己最好的奖励～', '心情不好的时候，就让胃先快乐起来吧',
  '今日宜：好好吃饭、好好生活～', '是甜食先动的手，不是我先嘴馋的！',
  '比奶茶更甜的，是此刻想吃啥就吃啥的你～', '吃饱饱，没烦恼，今天也辛苦啦',
  '本可爱决定先爱自己，从这顿饭开始~', '别人是充电五分钟，我是吃饭两小时',
  '对全世界温柔，不如对自己好一点呀', '今天的我：吃饭第一名，减肥明天再说',
  '想和你一起，把烟火气吃进肚子里～', '有你的饭桌，每一顿都是小确幸',
  '今天的快乐是食物给的，感谢每一口～', '一个胃装得下所有想吃的东西耶！',
  '女孩子要吃甜甜的才会有好心情呀', '好好吃饭就是头等大事，不接受反驳！',
]

const SWEET_TIPS = [
  '少喝点奶茶多喝热水（才怪，继续吨吨吨）',
  '你刚才说不要辣，结果点了变态辣，真的很你～',
  '今天已经吃了 3 顿了，距离小仙女只差 0 顿！',
  '别忘了你还有半杯奶茶在冰箱等你～',
  '辣到怀疑人生？那就对了，这叫入乡随俗！',
  '女孩子就是要对自己好呀，想吃就吃！',
  '告诉你一个秘密：吃饱了真的会变开心噢～',
  '今天也要做一只元气满满的小吃货呀！',
  '不要压抑自己的食欲，想吃就是身体在撒娇～',
  '吃完美食记得自拍，记录每个心动瞬间！',
]

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
function getNickname() {
  const day = new Date().getDate()
  return NICKNAMES[day % NICKNAMES.length]
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
      <Header
        title={
          <span className="flex items-center gap-1.5">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block text-2xl"
            >{getGreetingEmoji()}</motion.span>
            <span>{getGreeting()}，{getNickname()}～</span>
          </span>
        }
        subtitle={motivation}
      />

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
                      <div className="text-6xl mb-2">{['💖', '✨', '🍽️'][bannerIndex]}</div>
                      <p className="text-lg font-bold text-[var(--color-text)]">{banners[bannerIndex]?.name}</p>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{banners[bannerIndex]?.description || '心动预警，请捂好小钱包～'}</p>
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

        {/* 今日甜蜜小贴士 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="d3-card-face p-3 flex items-center gap-2.5"
          style={{
            background: 'linear-gradient(135deg, #FFF5F8 0%, #FFEDF4 50%, #FFF0EB 100%)',
            borderColor: '#FFB8D1',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-xl shrink-0"
          >💝</motion.span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: '#E91E63' }}>今日份的小提醒</p>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{SWEET_TIPS[new Date().getDate() % SWEET_TIPS.length]}</p>
          </div>
        </motion.div>

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
            <div className="flex items-baseline gap-1.5">
              <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>八大菜系</h2>
              <span className="text-[10px] text-[var(--color-text-tertiary)]">每一口都是远方～</span>
            </div>
            <button onClick={() => navigate('/menu')} className="text-xs text-[var(--color-primary)] font-bold">逛逛 →</button>
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
            <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>猜你想吃 <span className="text-xs text-[var(--color-primary)] ml-0.5">💗</span></h2>
            <button onClick={() => navigate('/menu')} className="text-xs text-[var(--color-primary)] font-bold">看更多 →</button>
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
                  <LovePrice price={dish.price} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 大家爱吃 */}
        {popularDishes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>吃货都在抢 🍴</h2>
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
                      <LovePrice price={dish.price} size="sm" />
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
              <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>你最近点的 🧾</h2>
              <button onClick={() => navigate('/orders')} className="text-xs text-[var(--color-primary)] font-bold">看全部 →</button>
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
