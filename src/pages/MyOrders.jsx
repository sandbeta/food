import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import KissIcon from '../components/KissIcon'

const STATUS_MAP = {
  pending: { text: '等着呢', color: 'rgba(255,107,53,0.1)', textColor: '#E55A2B', bar: '#FF8F5A' },
  preparing: { text: '在做了', color: 'rgba(87,107,149,0.1)', textColor: '#576B95', bar: '#8BA7C7' },
  completed: { text: '做好啦', color: 'rgba(7,193,96,0.1)', textColor: '#07C160', bar: '#A8C5A0' },
}

/* ══════════════════════════════════════════
   MY ORDERS — Glass Bento UI
   ══════════════════════════════════════════ */

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { setOrders(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="page-container-tight">
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>我们的订单</h1>
        {orders.length > 0 && <p className="t-caption">一共 {orders.length} 笔</p>}
      </div>

      {loading ? (
        /* Skeleton */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map(i => (
            <div key={i} className="glass-card" style={{ padding: 14 }}>
              <div className="skeleton skeleton-text" style={{ width: '35%', marginBottom: 8 }} />
              <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: 6 }} />
              <div className="skeleton skeleton-text" style={{ width: '25%' }} />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty */
        <div className="glass-card" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '64px 16px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,107,53,0.06), transparent 70%)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
          </div>
          <div style={{
            fontSize: 56, marginBottom: 16, position: 'relative',
            animation: 'float 3s ease-in-out infinite',
          }}>
            📋
          </div>
          <p className="t-h2" style={{ marginBottom: 4, position: 'relative' }}>还没有下过单</p>
          <p className="t-caption" style={{ marginBottom: 24, position: 'relative' }}>快去一起选点好吃的吧~</p>
          <Link to="/menu" className="btn btn-primary" style={{ position: 'relative' }}>去选菜</Link>
        </div>
      ) : (
        /* Orders List */
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
            const itemNames = order.items.map(i => `${i.dish_name}×${i.quantity}`).join('、')
            return (
              <Link key={order.id} to={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  whileTap={{ scale: 0.985 }}
                  className="glass-card"
                  style={{ overflow: 'hidden' }}
                >
                  {/* Status bar */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${status.bar}, ${status.bar}30)` }} />
                  <div style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="t-caption" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={0.5}>
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        {new Date(order.created_at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="tag" style={{
                        background: status.color, color: status.textColor, fontWeight: 700,
                        border: 'none', fontSize: 11,
                      }}>
                        {status.text}
                      </span>
                    </div>
                    <p className="t-body" style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {itemNames}
                    </p>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <KissIcon className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                        <span className="t-h3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                          {order.total_price}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ display: 'flex', marginRight: -4 }}>
                          {order.items.slice(0, 3).map((it, idx) => (
                            <div key={idx} style={{
                              width: 24, height: 24, borderRadius: '50%', border: '2px solid white',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, marginLeft: idx > 0 ? -6 : 0,
                              background: it.added_by === 'me' ? 'rgba(250,81,81,0.1)' : 'rgba(87,107,149,0.1)',
                            }}>
                              {it.added_by === 'me' ? '🐱' : '🐰'}
                            </div>
                          ))}
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}