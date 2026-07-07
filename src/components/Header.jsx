import { motion } from 'framer-motion'

export default function Header({ title, subtitle, right }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: '12px 0 8px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'var(--color-surface)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ flex: 1 }}>
          {typeof title === 'string' ? (
            <h1 className="t-h1" style={{ fontFamily: 'var(--font-display)' }}>{title}</h1>
          ) : (
            <div>{title}</div>
          )}
          {subtitle && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
              <span className="t-caption">{subtitle}</span>
            </div>
          )}
        </div>
        {right && <div>{right}</div>}
      </div>
    </motion.div>
  )
}
