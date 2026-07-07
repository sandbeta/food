import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../components/CartContext'
import LovePrice, { LoveTotal } from '../components/LovePrice'
import { getCategoryEmoji } from '../lib/categoryIcons'

const baseUrl = import.meta.env.BASE_URL || '/'

const PAYER_OPTIONS = [
  { value: 'aa', label: 'AA', emoji: '✌️', desc: '各付各的' },
  { value: 'me', label: '我请', emoji: '🙋', desc: '今天我买单' },
  { value: 'partner', label: 'TA请', emoji: '💝', desc: '让TA来~' },
]

/* ══════════════════════════════════════════
   CART PAGE — Glass Bento UI
   ══════════════════════════════════════════ */

export default function Cart() {
  const { items, totalPrice, totalCount, updateQuantity, removeItem } = useCart()
  const [note, setNote] = useState('')
  const [payer, setPayer] = useState('aa')
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (items.length === 0) return
    // Pass note & payer via localStorage for Checkout to read
    localStorage.setItem('couple_order_checkout_note', note)
    localStorage.setItem('couple_order_checkout_payer', payer)
    navigate('/checkout')
  }

  /* ── Empty State ── */
  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="glass-card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '64px 16px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 140, height: 140, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,107,53,0.06), transparent 70%)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
          </div>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, position: 'relative',
            background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(250,81,81,0.06))',
            animation: 'float 3s ease-in-out infinite',
          }}>
            <span style={{ fontSize: 44 }}>🛒</span>
          </div>
          <p className="t-h2" style={{ marginBottom: 4, position: 'relative' }}>还没选好呀</p>
          <p className="t-caption" style={{ textAlign: 'center', marginBottom: 24, position: 'relative' }}>
            饿了吗？<br />去点点好吃的吧~
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/menu')} style={{ position: 'relative' }}>
            去选菜
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container-tight">
      {/* ═══ Header ═══ */}
      <div style={{ marginBottom: 14 }}>
        <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>已选的菜</h1>
        <p className="t-caption">共 {totalCount} 件</p>
      </div>

      {/* ═══ Items List ═══ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        <AnimatePresence>
          {items.map(item => {
            const identityColor = item.added_by === 'me' ? '#FA5151' : '#576B95'
            const identityGradient = item.added_by === 'me'
              ? 'linear-gradient(135deg, #FFAA7A, #FA5151)'
              : 'linear-gradient(135deg, #576B95, #567BB5)'
            return (
              <motion.div
                key={`${item.dish_id}-${item.added_by}`}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                className="glass-card"
                style={{ position: 'relative', overflow: 'hidden', padding: 12 }}
              >
                {/* Left identity bar */}
                <div style={{
                  position: 'absolute', left: 0, top: 10, bottom: 10, width: 3,
                  borderRadius: '0 3px 3px 0',
                  background: identityGradient, opacity: 0.5,
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, background: `rgba(255,255,255,0.8)`,
                    boxShadow: `0 2px 8px ${identityColor}20`,
                  }}>
                    {item.added_by === 'me' ? '🐱' : '🐰'}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="t-h3" style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </h3>
                    <LovePrice price={item.price} size="sm" />
                  </div>
                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.dish_id, item.quantity - 1, item.added_by)}
                      className="btn btn-icon-sm"
                      style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </motion.button>
                    <motion.span
                      key={item.quantity}
                      initial={{ scale: 1.4 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className="t-h3"
                      style={{ width: 20, textAlign: 'center', fontFamily: 'var(--font-display)' }}
                    >
                      {item.quantity}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.dish_id, item.quantity + 1, item.added_by)}
                      className="btn btn-icon-sm"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                        color: 'white',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </motion.button>
                  </div>
                  {/* Delete */}
                  <motion.button
                    whileTap={{ scale: 0.75 }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    onClick={() => removeItem(item.dish_id, item.added_by)}
                    className="btn btn-ghost btn-icon-sm"
                    style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* ═══ Note ═══ */}
      <div className="glass-card" style={{ padding: 14, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>💬</span>
          <label className="t-h3" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>想说点啥</label>
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          className="input-glass"
          rows={2}
          placeholder="少盐、不要香菜、多放蒜..."
          style={{ resize: 'none', fontSize: 13 }}
        />
      </div>

      {/* ═══ Payer ═══ */}
      <div className="glass-card" style={{ padding: 14, marginBottom: 10 }}>
        <p className="t-h3" style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 10 }}>谁来买单？</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {PAYER_OPTIONS.map(opt => (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPayer(opt.value)}
              className="glass-card"
              style={{
                flex: 1, padding: '12px 8px', textAlign: 'center', cursor: 'pointer',
                borderColor: payer === opt.value ? 'var(--color-primary)' : 'var(--color-border)',
                boxShadow: payer === opt.value ? '0 0 0 3px rgba(255,107,53,0.1)' : 'none',
                transition: 'all 0.25s',
              }}
            >
              <motion.div
                style={{ fontSize: 24, marginBottom: 4 }}
                animate={payer === opt.value ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {opt.emoji}
              </motion.div>
              <div className="t-h3" style={{ fontSize: 13 }}>{opt.label}</div>
              <div className="t-tiny">{opt.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══ Total + Checkout ═══ */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span className="t-h3" style={{ color: 'var(--color-text-secondary)' }}>合计</span>
          <motion.span
            key={totalPrice}
            initial={{ scale: 1.3, y: -4 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="t-h1"
            style={{ fontSize: 28, fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
          >
            <span style={{ fontSize: 20 }}>💋</span>
            {totalPrice}
          </motion.span>
        </div>
        {/* Estimate */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', borderRadius: 10, marginBottom: 12,
          background: 'rgba(255,107,53,0.06)',
        }}>
          <span style={{ fontSize: 12 }}>⏱️</span>
          <span className="t-caption">预估等待约 20-30 分钟</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleCheckout}
          className="btn-primary"
          style={{
            width: '100%', minHeight: 48, borderRadius: 16, fontSize: 15, fontWeight: 700,
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 50%, var(--color-secondary) 100%)',
            backgroundSize: '200% 200%',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 16, pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute', top: '-50%', left: '-25%', width: '50%', height: '200%',
              transform: 'rotate(15deg)',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
          </div>
          <span style={{ position: 'relative' }}>下单啦~</span>
        </motion.button>
      </div>
    </div>
  )
}