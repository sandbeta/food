import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CATEGORY_OPTIONS = [
  { value: '家常菜', emoji: '🍳' }, { value: '硬菜', emoji: '🥩' }, { value: '素菜', emoji: '🥬' },
  { value: '主食', emoji: '🍚' }, { value: '汤类', emoji: '🍲' }, { value: '小吃', emoji: '🍢' },
  { value: '水果', emoji: '🍎' }, { value: '饮品', emoji: '🧋' }, { value: '川菜', emoji: '🌶️' },
  { value: '粤菜', emoji: '🥢' }, { value: '湘菜', emoji: '🔥' }, { value: '鲁菜', emoji: '🍤' },
  { value: '苏菜', emoji: '🪷' }, { value: '浙菜', emoji: '🐟' }, { value: '闽菜', emoji: '🦐' },
  { value: '徽菜', emoji: '🍲' }, { value: '东北菜', emoji: '🥟' }, { value: '西北菜', emoji: '🍖' },
  { value: '云贵菜', emoji: '🍄' }, { value: '其他', emoji: '🍽️' },
]

const FIELDS = [
  { label: '菜名', key: 'name', type: 'text', placeholder: '红烧肉', required: true, icon: '🍜' },
  { label: '亲亲数量', key: 'price', type: 'number', inputMode: 'numeric', placeholder: '15', min: '0', step: '1', required: true, icon: '💕' },
  { label: '图片链接', key: 'image_url', type: 'url', placeholder: 'https://...', icon: '🖼️' },
  { label: '一句话描述', key: 'description', type: 'text', placeholder: '好吃到飞起~', icon: '✨' },
]

export default function AddDishModal({ dish, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', price: '', category: '家常菜', image_url: '', description: '' })

  useEffect(() => {
    if (dish) setForm({ name: dish.name || '', price: dish.price || '', category: dish.category || '家常菜', image_url: dish.image_url || '', description: dish.description || '' })
  }, [dish])

  const handleSubmit = (e) => { e.preventDefault(); if (!form.name || !form.price) return; onSave({ ...form, price: Number(form.price) }) }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(0,0,0,0.15)',
        }}
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', zIndex: 50 }}
      >
        <div
          className="glass-card"
          style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflow: 'hidden' }}
        >
          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{
              width: 40, height: 4, borderRadius: 2,
              background: 'linear-gradient(90deg, var(--color-primary-light), var(--color-primary), var(--color-primary-light))',
            }} />
          </div>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                fontSize: 14,
              }}>
                <span>{dish ? '✏️' : '➕'}</span>
              </div>
              <h2 className="t-h2" style={{ fontFamily: 'var(--font-display)' }}>{dish ? '改改这道菜' : '加一道新菜'}</h2>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="btn btn-ghost btn-icon-sm"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '0 20px 24px', overflowY: 'auto', maxHeight: 'calc(85vh - 80px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label className="t-caption" style={{ fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 14, opacity: 0.6, pointerEvents: 'none',
                    }}>
                      {f.icon}
                    </span>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="input-glass"
                      style={{ paddingLeft: 36, fontSize: 14 }}
                      placeholder={f.placeholder}
                      min={f.min}
                      step={f.step}
                      required={f.required}
                      inputMode={f.inputMode}
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="t-caption" style={{ fontWeight: 700, display: 'block', marginBottom: 6 }}>分类</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 14, opacity: 0.6, pointerEvents: 'none',
                  }}>
                    {CATEGORY_OPTIONS.find(c => c.value === form.category)?.emoji || '🍽️'}
                  </span>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="input-glass"
                    style={{ paddingLeft: 36, fontSize: 14, appearance: 'none', cursor: 'pointer' }}
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.emoji} {c.value}</option>
                    ))}
                  </select>
                  <svg style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    width: 14, height: 14, color: 'var(--color-text-secondary)', opacity: 0.4, pointerEvents: 'none',
                  }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="btn btn-ghost"
                style={{ flex: 1, fontWeight: 700, fontSize: 14, borderRadius: 16, minHeight: 44, border: '1px solid var(--color-border)' }}
              >
                算了
              </motion.button>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary"
                style={{ flex: 1, fontWeight: 700, fontSize: 14, borderRadius: 16, minHeight: 44 }}
              >
                好啦
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  )
}