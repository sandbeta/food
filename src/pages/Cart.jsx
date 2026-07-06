import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../components/CartContext'
import LovePrice, { LoveTotal } from '../components/LovePrice'
import Header from '../components/Header'
import KissIcon from '../components/KissIcon'
import { getDishImage } from '../lib/categoryIcons'

const PAYER_OPTIONS = [
  { value: 'aa', label: 'AA', emoji: '✌️', desc: '各付各的' },
  { value: 'me', label: '我请', emoji: '🙋', desc: '今天我买单' },
  { value: 'partner', label: 'TA请', emoji: '💝', desc: '让TA来~' },
]

const IDENTITY_COLORS = {
  me: { color: '#FA5151', gradient: 'linear-gradient(135deg, #FFAA7A, #FA5151)', bg: 'rgba(232, 105, 126, 0.06)' },
  partner: { color: '#576B95', gradient: 'linear-gradient(135deg, #576B95, #567BB5)', bg: 'rgba(94, 132, 196, 0.06)' },
}

export default function Cart() {
  const { items, totalPrice, totalCount, updateQuantity, removeItem, clearCart } = useCart()
  const [note, setNote] = useState('')
  const [payer, setPayer] = useState('aa')
  const [submitting, setSubmitting] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (items.length === 0) return
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(255,243,233,0.92)] backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="text-7xl mb-4"
            >
              🎉
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              下单成功！
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-[var(--color-text-secondary)] mt-2"
            >
              去订单里看看吧~
            </motion.p>
          </motion.div>
        )}
        <Header title="已选的菜" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 px-4">
          {/* 装饰背景 */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full animate-cart-empty-bounce"
              style={{ background: 'linear-gradient(135deg, rgba(232,128,74,0.10), rgba(250,81,81,0.08))' }}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">🛒</span>
              </div>
            </div>
            {/* 装饰小元素 */}
            <motion.div className="absolute -top-2 -right-3 w-6 h-6 rounded-full"
              animate={{ y: [0, -5, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ background: 'radial-gradient(circle, rgba(232,128,74,0.20), transparent)' }}>
              <div className="w-full h-full flex items-center justify-center text-xs">✨</div>
            </motion.div>
            <motion.div className="absolute -bottom-1 -left-2 w-5 h-5 rounded-full"
              animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
              style={{ background: 'radial-gradient(circle, rgba(250,81,81,0.18), transparent)' }}>
              <div className="w-full h-full flex items-center justify-center text-[10px]">💫</div>
            </motion.div>
          </div>
          <p className="text-[var(--color-text)] mb-1.5 text-base font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>还没选好呀</p>
          <p className="text-[var(--color-text-secondary)] text-sm mb-8 text-center leading-relaxed max-w-[220px]">饿了吗？<br/>去点点好吃的吧~</p>
          <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.04 }} onClick={() => navigate('/menu')}
            className="d3-btn d3-btn-primary text-white px-8 py-3 rounded-2xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}>
            去选菜
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      <Header title="已选的菜" subtitle={`共 ${totalCount} 件`} />

      <div className="px-4 space-y-3.5">
        <AnimatePresence>
          {items.map(item => {
            const identity = IDENTITY_COLORS[item.added_by]
            return (
              <motion.div key={`${item.dish_id}-${item.added_by}`} layout
                initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15, height: 0 }}
                className="d3-card-face p-3.5 flex items-center gap-3 overflow-hidden relative group">
                {/* 左侧身份色条 */}
                <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-all duration-300 opacity-50 group-hover:opacity-90"
                  style={{ background: identity.gradient }} />
                {/* 头像增大到 36px + 边框 */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 ring-2 ring-white/60 ${item.added_by === 'me' ? 'avatar-me' : 'avatar-partner'}`}
                  style={{ boxShadow: `0 2px 8px ${identity.color}25` }}>
                  {item.added_by === 'me' ? '🐱' : '🐰'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[14px] text-[var(--color-text)] truncate" style={{ fontFamily: 'Fredoka, sans-serif' }}>{item.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <KissIcon className="w-3 h-3 text-[var(--color-secondary)]" />
                    <LovePrice price={item.price} size="sm" />
                  </div>
                </div>
                {/* 数量控制器 - 按钮增大到 34px */}
                <div className="flex items-center gap-1.5">
                  <motion.button whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.06 }}
                    onClick={() => updateQuantity(item.dish_id, item.quantity - 1, item.added_by)}
                    className="w-[34px] h-[34px] rounded-full bg-[var(--color-cream-dark)] flex items-center justify-center text-[var(--color-text)] transition-all duration-200 hover:scale-105 active:scale-90">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </motion.button>
                  <motion.span
                    key={item.quantity}
                    initial={{ scale: 1.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                    className="w-6 text-center font-bold text-[15px] tabular-nums"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {item.quantity}
                  </motion.span>
                  <motion.button whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.06 }}
                    onClick={() => updateQuantity(item.dish_id, item.quantity + 1, item.added_by)}
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-90"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </motion.button>
                </div>
                {/* 删除按钮 - 增加 hover 效果 */}
                <motion.button whileTap={{ scale: 0.75 }} whileHover={{ scale: 1.15, rotate: 90 }}
                  onClick={() => removeItem(item.dish_id, item.added_by)}
                  className="text-gray-300 active:text-[var(--color-secondary)] ml-0.5 transition-all duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </motion.button>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* 备注输入框 - 增加浮动图标和渐变聚焦边框 */}
        <div className="d3-card p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <motion.span className="text-base"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>💬</motion.span>
            <label className="text-sm text-[var(--color-text-secondary)] font-semibold">想说点啥</label>
          </div>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            className="d3-input w-full rounded-2xl px-3.5 py-2.5 text-sm resize-none placeholder:text-[var(--color-text-secondary)]/50 font-medium transition-all duration-300"
            style={{
              background: 'var(--color-cream-dark)',
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(var(--color-cream-dark), var(--color-cream-dark)), linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
            onFocus={(e) => {
              e.target.style.backgroundImage = 'linear-gradient(var(--color-cream-dark), var(--color-cream-dark)), linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.12), 0 4px 12px rgba(255, 107, 53, 0.08)'
            }}
              onBlur={(e) => {
                e.target.style.boxShadow = ""
              }}
            rows={2} placeholder="少盐、不要香菜、多放蒜..." />
        </div>

        {/* 买单选择器 - 增加精致的选中态效果 */}
        <div className="d3-card p-4">
          <p className="text-sm text-[var(--color-text-secondary)] font-semibold mb-3">谁来买单？</p>
          <div className="flex gap-2">
            {PAYER_OPTIONS.map(opt => (
              <motion.button key={opt.value}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setPayer(opt.value)}
                className={`flex-1 d3-card-face py-3 rounded-xl text-center transition-all duration-300 relative overflow-hidden ${payer === opt.value ? 'd3-btn-primary ring-[2.5px]' : ''}`}
                style={payer === opt.value ? {
                  background: 'linear-gradient(135deg, var(--color-primary-light) 0%, rgba(255,228,210,0.5) 100%)',
                  borderColor: 'var(--color-primary)',
                  ringColor: 'var(--color-primary)',
                  boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.12), 0 4px 16px rgba(255, 107, 53, 0.15)',
                } : {}}>
                {/* 选中态发光效果 */}
                {payer === opt.value && (
                  <motion.div className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ background: 'radial-gradient(circle at 50% 30%, rgba(232,128,74,0.08), transparent 70%)' }} />
                )}
                <motion.div className="text-2xl mb-1 relative"
                  animate={payer === opt.value ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}>
                  {opt.emoji}
                </motion.div>
                <div className="text-sm font-bold text-[var(--color-text)] relative" style={{ fontFamily: 'Fredoka, sans-serif' }}>{opt.label}</div>
                <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 relative">{opt.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 合计区域 - 增大总价、渐变按钮、预估等待时间 */}
        <div className="d3-card p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[var(--color-text-secondary)] font-semibold">合计</span>
            <div className="flex items-center gap-1.5">
              <KissIcon className="w-5 h-5 text-[var(--color-secondary)]" />
              <motion.span
                key={totalPrice}
                initial={{ scale: 1.3, y: -4 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="text-[28px] font-bold text-[var(--color-primary)]"
                style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {totalPrice}
              </motion.span>
            </div>
          </div>
          {/* 预估等待时间 */}
          <div className="flex items-center gap-1.5 mb-3.5 py-1.5 px-2.5 rounded-xl self-start"
            style={{ background: 'linear-gradient(135deg, rgba(232,128,74,0.06), rgba(250,81,81,0.04))' }}>
            <span className="text-xs">⏱️</span>
            <span className="text-xs text-[var(--color-text-secondary)]">预估等待约 20-30 分钟</span>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }} onClick={handleSubmit} disabled={submitting}
            className="d3-btn d3-btn-primary w-full disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-[15px] relative overflow-hidden animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 50%, var(--color-secondary) 100%)',
              backgroundSize: '200% 200%',
            }}>
            {/* 按钮内光效 */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <motion.div className="absolute -top-1/2 -left-1/4 w-[50%] h-[200%] rotate-[15deg]"
                animate={{ x: ['0%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
            </div>
            <span className="relative">{submitting ? '提交中...' : '下单啦~'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
