import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import KissIcon from '../components/KissIcon'

const STATUS_CONFIG = {
  pending: { text: '等着呢', emoji: '⏳', desc: '交给厨房啦，等着就好~', ring: ['#F5E6D3', '#D4A574'], tagBg: 'rgba(255,107,53,0.1)', tagText: '#E55A2B', cardBg: 'linear-gradient(135deg, rgba(255,107,53,0.04), rgba(255,149,0,0.02))' },
  preparing: { text: '在做了', emoji: '👨‍🍳', desc: '正在努力做呢，快好了~', ring: ['#D6E4F0', '#8BA7C7'], tagBg: 'rgba(87,107,149,0.1)', tagText: '#576B95', cardBg: 'linear-gradient(135deg, rgba(87,107,149,0.04), rgba(87,107,149,0.02))' },
  completed: { text: '做好啦', emoji: '🎉', desc: '快来吃吧，趁热~', ring: ['#D4EDDA', '#A8C5A0'], tagBg: 'rgba(7,193,96,0.1)', tagText: '#07C160', cardBg: 'linear-gradient(135deg, rgba(7,193,96,0.04), rgba(7,193,96,0.02))' },
}

const PAYER_LABEL = { treat: '老公请', self: '宝宝请客', split: '记小本' }

/* ══════════════════════════════════════════
   ORDER DETAIL — Glass Bento UI
   ══════════════════════════════════════════ */

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(data => { setOrder(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <div style={{ position: 'relative' }}>
          <motion.div style={{ fontSize: 48 }}
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >🍳</motion.div>
          <div style={{
            position: 'absolute', inset: -24, borderRadius: '50%', opacity: 0.15,
            background: 'radial-gradient(circle, var(--color-primary-light), transparent 70%)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }} />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="page-container">
        <div className="glass-card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '64px 16px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>😵</div>
          <p className="t-h2" style={{ marginBottom: 4 }}>找不到这个订单了</p>
          <Link to="/orders" className="btn btn-primary" style={{ marginTop: 16 }}>回到订单列表</Link>
        </div>
      </div>
    )
  }

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending

  return (
    <div className="page-container-tight">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>订单详情</h1>
        <Link to="/orders" className="btn btn-ghost btn-sm" style={{ fontSize: 12, fontWeight: 600 }}>
          全部订单
        </Link>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card"
        style={{ padding: 24, textAlign: 'center', overflow: 'hidden', position: 'relative', marginBottom: 10 }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, background: status.cardBg }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            style={{ fontSize: 56, marginBottom: 12 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {status.emoji}
          </motion.div>
          <span className="tag" style={{ background: status.tagBg, color: status.tagText, fontWeight: 700, border: 'none', fontSize: 13, padding: '6px 16px' }}>
            {status.text}
          </span>
          <p className="t-caption" style={{ marginTop: 8 }}>{status.desc}</p>
        </div>
      </motion.div>

      {/* Items */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card"
        style={{ padding: 14, marginBottom: 10 }}
      >
        <h2 className="t-h3" style={{ marginBottom: 10 }}>📝 都选了啥</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {order.items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + idx * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, background: item.added_by === 'share' ? 'rgba(87,107,149,0.1)' : 'rgba(250,81,81,0.1)',
                }}>
                  {item.added_by === 'share' ? '🐱🐰' : '🐰'}
                </div>
                <span className="t-body" style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.dish_name}
                </span>
                <span className="t-caption">×{item.quantity}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <KissIcon className="w-3 h-3 text-[var(--color-secondary)]" />
                <span className="t-h3" style={{ fontFamily: 'var(--font-display)' }}>
                  {Math.round(item.price * item.quantity * 100) / 100}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Total */}
        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="t-h3">合计</span>
            {order.payer && (
              <span className="tag" style={{ background: 'rgba(255,107,53,0.08)', color: 'var(--color-primary)', fontWeight: 600, border: 'none', fontSize: 11 }}>
                {PAYER_LABEL[order.payer]}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <KissIcon className="w-4 h-4 text-[var(--color-secondary)]" />
            <span className="t-h1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
              {order.total_price}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Note */}
      {order.note && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
          style={{ padding: 14, marginBottom: 10, position: 'relative', overflow: 'hidden' }}
        >
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
            background: 'linear-gradient(to bottom, var(--color-primary), var(--color-secondary))',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, paddingLeft: 4 }}>
            <span style={{ fontSize: 14 }}>💬</span>
            <span className="t-caption" style={{ fontWeight: 600 }}>备注</span>
          </div>
          <p className="t-body" style={{ fontSize: 13, paddingLeft: 4 }}>{order.note}</p>
        </motion.div>
      )}

      {/* Timestamp */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="t-caption"
        style={{ textAlign: 'center', padding: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={0.4}>
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        {new Date(order.created_at).toLocaleString('zh-CN')}
      </motion.p>
    </div>
  )
}