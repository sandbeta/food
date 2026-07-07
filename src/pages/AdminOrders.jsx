import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import KissIcon from '../components/KissIcon'

const STATUS_FILTERS = [
  { value: '', label: '全部', emoji: '✨' },
  { value: 'pending', label: '等着呢', emoji: '⏳' },
  { value: 'preparing', label: '在做了', emoji: '👨‍🍳' },
  { value: 'completed', label: '做好啦', emoji: '✅' },
]
const STATUS_MAP = {
  pending: { text: '等着呢', tagBg: 'rgba(255,107,53,0.1)', tagText: '#E55A2B', bar: '#D4A574' },
  preparing: { text: '在做了', tagBg: 'rgba(87,107,149,0.1)', tagText: '#576B95', bar: '#8BA7C7' },
  completed: { text: '做好啦', tagBg: 'rgba(7,193,96,0.1)', tagText: '#07C160', bar: '#A8C5A0' },
}
const STATUS_ACTIONS = {
  pending: { next: 'preparing', text: '开始做', emoji: '🔥' },
  preparing: { next: 'completed', text: '做好了', emoji: '✅' },
}
const PAYER_LABEL = { aa: 'AA', me: '我请', partner: 'TA请' }

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const loadOrders = () => {
    const url = filter ? `/api/orders?status=${filter}` : '/api/orders'
    fetch(url).then(r => r.json()).then(d => { setOrders(d); setLoading(false) })
  }
  useEffect(() => { loadOrders() }, [filter])

  const handleStatusChange = async (id, s) => {
    await fetch(`/api/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: s }) })
    loadOrders()
  }

  return (
    <div className="page-container-tight">
      <div style={{ marginBottom: 14 }}>
        <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>厨房看板</h1>
        {orders.length > 0 && <p className="t-caption">{orders.length} 笔订单</p>}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12 }} className="hide-scrollbar">
        {STATUS_FILTERS.map(f => (
          <motion.button
            key={f.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f.value)}
            className={`tag ${filter === f.value ? 'tag-active' : ''}`}
            style={{
              cursor: 'pointer', fontWeight: 700, fontSize: 12, padding: '8px 14px',
              boxShadow: filter === f.value ? '0 2px 10px rgba(255,107,53,0.25)' : 'none',
              flexShrink: 0,
            }}
          >
            <span>{f.emoji}</span>
            {f.label}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
          <motion.div style={{ fontSize: 48 }}
            animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >📋</motion.div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
            {[0, 1, 2].map(i => (
              <motion.div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '64px 16px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>📋</div>
          <p className="t-caption">暂时没有订单</p>
        </div>
      ) : (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {orders.map(order => {
            const status = STATUS_MAP[order.status] || STATUS_MAP.pending
            const action = STATUS_ACTIONS[order.status]
            const itemNames = order.items.map(i => `${i.dish_name}×${i.quantity}`).join('、')
            return (
              <motion.div
                key={order.id}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="glass-card"
                style={{ overflow: 'hidden' }}
              >
                <div style={{ height: 2, background: `linear-gradient(90deg, ${status.bar}, ${status.bar}30)` }} />
                <div style={{ padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="t-caption" style={{ fontSize: 11, background: 'var(--color-border)', padding: '2px 6px', borderRadius: 6 }}>
                        #{order.id}
                      </span>
                      {order.payer && (
                        <span className="tag" style={{ fontSize: 10, border: 'none', background: 'rgba(255,107,53,0.08)', color: 'var(--color-primary)' }}>
                          {PAYER_LABEL[order.payer]}
                        </span>
                      )}
                    </div>
                    <span className="tag" style={{
                      background: status.tagBg, color: status.tagText, fontWeight: 700,
                      border: 'none', fontSize: 11,
                    }}>
                      {status.text}
                    </span>
                  </div>
                  <p className="t-body" style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
                    {itemNames}
                  </p>
                  {order.note && (
                    <div style={{
                      marginTop: 6, padding: '8px 10px', borderRadius: 10,
                      background: 'rgba(255,107,53,0.04)', position: 'relative',
                    }}>
                      <div style={{
                        position: 'absolute', left: 0, top: 4, bottom: 4, width: 2, borderRadius: 2,
                        background: 'var(--color-primary-light)',
                      }} />
                      <p className="t-caption" style={{ paddingLeft: 6 }}>💬 {order.note}</p>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '4px 10px', borderRadius: 10, background: 'rgba(255,107,53,0.06)' }}>
                        <KissIcon className="w-3 h-3 text-[var(--color-secondary)]" />
                        <span className="t-h3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                          {order.total_price}
                        </span>
                      </div>
                      <span className="t-caption" style={{ fontSize: 11 }}>
                        {new Date(order.created_at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {action && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => handleStatusChange(order.id, action.next)}
                        className="btn btn-sm"
                        style={{
                          fontWeight: 700, fontSize: 12, borderRadius: 12, padding: '6px 14px',
                          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                          color: 'white',
                        }}
                      >
                        {action.emoji} {action.text}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}