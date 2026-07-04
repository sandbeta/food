import { motion } from 'framer-motion'

export default function Header({ title, subtitle, right }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="sticky top-0 z-40 backdrop-blur-2xl"
      style={{
        background: 'linear-gradient(180deg, var(--color-cream) 0%, rgba(255,247,239,0.92) 75%, rgba(255,247,239,0.80) 100%)',
        boxShadow: 'inset 0 -1px 0 0 rgba(0,0,0,0.04)',
      }}
    >
      <div className="px-5 pt-12 pb-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 52, opacity: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 300, damping: 24 }}
              className="h-[3px] rounded-full mb-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
              style={{
                boxShadow: '0 0 8px rgba(255,140,66,0.35), 0 0 16px rgba(255,140,66,0.12)',
              }}
            />
            <h1 className="text-[32px] font-bold text-[var(--color-text)] leading-tight tracking-[-0.02em] truncate">{title}</h1>
            {subtitle && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                <p className="text-[13px] text-[var(--color-text-secondary)] font-semibold">{subtitle}</p>
              </div>
            )}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </div>
      </div>
    </motion.div>
  )
}
