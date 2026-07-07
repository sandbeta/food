import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../components/CartContext'
import LovePrice, { LoveTotal } from '../components/LovePrice'

const PAYER_OPTIONS = [
  { value: 'aa', label: 'AA', emoji: '✌️' },
  { value: 'me', label: '我请', emoji: '🙋' },
  { value: 'partner', label: 'TA请', emoji: '💝' },
]

const PAYER_LABEL = { aa: 'AA', me: '我请客', partner: 'TA请客' }

/* ══════════════════════════════════════════
   CHECKOUT PAGE — Glass Bento UI
   ══════════════════════════════════════════ */

export default function Checkout() {
  const { items, totalPrice, totalCount, clearCart } = useCart()
  const [payer, setPayer] = useState(() => localStorage.getItem('couple_order_checkout_payer') || 'aa')
  const [note, setNote] = useState(() => localStorage.getItem('couple_order_checkout_note') || '')
  const [submitting, setSubmitting] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ dish_id: i.dish_id, quantity: i.quantity, added_by: i.added_by })),
          note, payer,
        }),
      })
      const order = await res.json()
      setCelebrating(true)
      // Clean up checkout data
      localStorage.removeItem('couple_order_checkout_note')
      localStorage.removeItem('couple_order_checkout_payer')
      await new Promise(r => setTimeout(r, 1200))
      clearCart()
      navigate(`/orders/${order.id}`)
    } catch {
      alert('提交失败，再试一次嘛~')
      setSubmitting(false)
    }
  }

  if (celebrating) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(247,247,248,0.95)', backdropFilter: 'blur(12px)',
      }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          style={{ fontSize: 80, marginBottom: 16 }}
        >
          🎉
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="t-h1"
          style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}
        >
          下单成功！
        </motion.p>
      </div>
    )
  }

  return (
    <div className="page-container-tight">
      {/* ═══ Header ═══ */}
      <div style={{ marginBottom: 14 }}>
        <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>确认订单</h1>
        <p className="t-caption">共 {totalCount} 件</p>
      </div>

      {/* ═══ Items Summary ═══ */}
      <div className="glass-card" style={{ padding: 14, marginBottom: 10 }}>
        <h2 className="t-h3" style={{ marginBottom: 10 }}>📝 都选了啥</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map(item => (
            <div key={`${item.dish_id}-${item.added_by}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, background: item.added_by === 'me' ? 'rgba(250,81,81,0.1)' : 'rgba(87,107,149,0.1)',
                }}>
                  {item.added_by === 'me' ? '🐱' : '🐰'}
                </div>
                <span className="t-body" style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </span>
                <span className="t-caption">×{item.quantity}</span>
              </div>
              <LovePrice price={Math.round(item.price * item.quantity * 100) / 100} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Note ═══ */}
      <div className="glass-card" style={{ padding: 14, marginBottom: 10 }}>
        <label className="t-caption" style={{ fontWeight: 700, display: 'block', marginBottom: 6 }}>备注</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          className="input-glass"
          rows={2}
          placeholder="少盐、不要香菜..."
          style={{ resize: 'none', fontSize: 13 }}
        />
      </div>

      {/* ═══ Payer ═══ */}
      <div className="glass-card" style={{ padding: 14, marginBottom: 10 }}>
        <p className="t-caption" style={{ fontWeight: 700, marginBottom: 10 }}>谁来买单？</p>
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
              <div style={{ fontSize: 24, marginBottom: 4 }}>{opt.emoji}</div>
              <div className="t-h3" style={{ fontSize: 13 }}>{opt.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══ Total + Submit ═══ */}
      <div className="glass-card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="t-h3" style={{ color: 'var(--color-text-secondary)' }}>合计</span>
          <LoveTotal total={totalPrice} label="这一顿" />
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary"
          style={{
            width: '100%', minHeight: 48, borderRadius: 16, fontSize: 15, fontWeight: 700,
            opacity: submitting ? 0.5 : 1,
          }}
        >
          {submitting ? '提交中...' : '确认下单'}
        </motion.button>
      </div>
    </div>
  )
}