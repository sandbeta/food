import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import D3StatusRing from '../components/D3StatusRing'
import KissIcon from '../components/KissIcon'

const STATUS_CONFIG = {
  pending: { text: '等着呢', emoji: '⏳', desc: '交给厨房啦，等着就好~', ring: ['#F5E6D3', '#D4A574'], tagBg: 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]', cardBg: 'linear-gradient(135deg, #FFF8F0, #F5E6D3 50%, #FFF8F0)' },
  preparing: { text: '在做了', emoji: '👨‍🍳', desc: '正在努力做呢，快好了~', ring: ['#D6E4F0', '#8BA7C7'], tagBg: 'bg-[var(--color-haze-light)] text-[var(--color-haze)]', cardBg: 'linear-gradient(135deg, #F0F4FA, #D6E4F0 50%, #F0F4FA)' },
  completed: { text: '做好啦', emoji: '🎉', desc: '快来吃吧，趁热~', ring: ['#D4EDDA', '#A8C5A0'], tagBg: 'bg-green-100 text-green-600', cardBg: 'linear-gradient(135deg, #F0FAF0, #D4EDDA 50%, #F0FAF0)' },
}

const PAYER_LABEL = { aa: 'AA', me: '我请客', partner: 'TA请客' }


export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${id}`).then(r => r.json())
      .then(data => { setOrder(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative">
        <motion.div className="text-5xl" animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🍳</motion.div>
        <motion.div className="absolute -inset-6 rounded-full opacity-15"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: 'radial-gradient(circle, var(--color-primary-light), transparent 70%)' }} />
      </div>
    </div>
  )

  if (!order) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--color-primary-light), transparent 70%)' }} />
      <motion.div className="text-7xl mb-4 relative z-10" animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>😵</motion.div>
      <p className="text-[var(--color-text-secondary)] relative z-10 font-medium">找不到这个订单了</p>
      <Link to="/my-orders" className="mt-4 d3-btn d3-btn-primary text-xs text-[var(--color-primary)] font-semibold bg-[var(--color-primary-light)] px-4 py-2 rounded-full relative z-10">
        回到订单列表
      </Link>
    </motion.div>
  )

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending

  return (
    <div>
      <Header title="订单详情"
        right={<Link to="/my-orders" className="text-xs text-[var(--color-primary)] font-semibold bg-[var(--color-primary-light)] px-3 py-1.5 rounded-full">全部订单</Link>} />

      <div className="px-4 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="d3-card-face p-5 text-center overflow-hidden relative">
          <div className="absolute inset-0 opacity-40" style={{ background: status.cardBg }} />
          <div className="relative z-10">
            <D3StatusRing config={status} />
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${status.tagBg}`}>{status.text}</motion.span>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-[var(--color-text-secondary)] text-sm mt-2">{status.desc}</motion.p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="d3-card-face p-4">
          <h2 className="font-bold text-sm text-[var(--color-text)] mb-3 flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            📝 都选了啥
          </h2>
          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + idx * 0.04 }}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 -mx-2 hover:bg-[var(--color-cream-dark)]/50 transition-colors duration-150 relative group">
                <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full group-hover:bg-[var(--color-primary-light)] transition-colors duration-150" />
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] ${item.added_by === 'me' ? 'avatar-me' : 'avatar-partner'}`}>
                    {item.added_by === 'me' ? '🐱' : '🐰'}
                  </div>
                  <span className="text-sm text-[var(--color-text)] font-medium">{item.dish_name}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">×{item.quantity}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <KissIcon className="w-3 h-3 text-[var(--color-secondary)]" />
                  <span className="text-sm font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 pt-3 relative">
            <div className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-border) 20%, var(--color-border) 80%, transparent)' }} />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--color-text)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>合计</span>
                {order.payer && <span className="text-xs bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] px-2 py-0.5 rounded-full font-medium">{PAYER_LABEL[order.payer]}</span>}
              </div>
              <div className="flex items-center gap-1">
                <KissIcon className="w-4 h-4 text-[var(--color-secondary)]" />
                <span className="text-[20px] font-bold text-[var(--color-primary)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>{order.total_price}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {order.note && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="d3-card-face p-3.5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(to bottom, var(--color-primary-light), var(--color-secondary))' }} />
            <div className="flex items-center gap-1.5 mb-1 pl-1">
              <span className="text-sm">💬</span>
              <span className="text-xs text-[var(--color-text-secondary)] font-semibold">备注</span>
            </div>
            <p className="text-sm text-[var(--color-text)] pl-1">{order.note}</p>
          </motion.div>
        )}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center text-xs text-[var(--color-text-secondary)] py-3 flex items-center justify-center gap-1.5">
          <svg className="w-3 h-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          {new Date(order.created_at).toLocaleString('zh-CN')}
        </motion.p>
      </div>
    </div>
  )
}
