import { motion } from 'framer-motion'

const SWEET_LABELS = [
  { max: 15, label: '小小心意', emoji: '💕' },
  { max: 30, label: '爱的投喂', emoji: '💋' },
  { max: 50, label: '宠溺升级', emoji: '🥰' },
  { max: 9999, label: '豪华宠爱', emoji: '👑' },
]

export function getSweetLabel(price) {
  const item = SWEET_LABELS.find(l => price <= l.max)
  return item || SWEET_LABELS[0]
}

export default function LovePrice({ price, size = 'md', showLabel = false }) {
  const sweet = getSweetLabel(price)

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-[15px]',
    xl: 'text-lg',
    '2xl': 'text-2xl',
  }

  return (
    <motion.span
      className={`inline-flex items-center gap-1 font-bold text-[var(--color-primary)] ${sizeClasses[size] || sizeClasses.md}`}
      style={{ fontFamily: 'Fredoka, sans-serif' }}
      whileTap={{ scale: 0.9 }}
    >
      <span className="inline-block" style={{ filter: 'drop-shadow(0 1px 2px rgba(255,140,66,0.3))' }}>
        💋
      </span>
      <span>{price}</span>
      {showLabel && (
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full ml-0.5"
          style={{
            background: 'linear-gradient(135deg, #FFF0EB, #FFE4D9)',
            color: 'var(--color-primary)',
            border: '1px solid rgba(255,140,66,0.15)',
          }}>
          {sweet.label}
        </span>
      )}
    </motion.span>
  )
}

export function LoveTotal({ total, label = '本次约会' }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[11px] text-[var(--color-text-secondary)] mb-0.5">
        {label}需支付
      </span>
      <motion.span
        className="flex items-center gap-1.5 text-[26px] font-bold text-[var(--color-primary)]"
        style={{ fontFamily: 'Fredoka, sans-serif' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span className="text-2xl">💋</span>
        <span>{total}</span>
        <span className="text-sm text-[var(--color-text-secondary)] font-normal">个亲亲</span>
      </motion.span>
    </div>
  )
}
