import { useState } from 'react'
import { getCategoryEmoji } from '../lib/categoryIcons'

const baseUrl = import.meta.env.BASE_URL || '/'

/**
 * 统一的菜品图片组件。
 * - 优先使用 dish.image_url
 * - 图片加载失败时显示 emoji fallback，并保留原始 alt 文本
 * - 支持 loading="lazy" 和自定义容器样式
 */
export default function DishImage({ dish, size = 64, radius = 16, className = '', style = {} }) {
  const [failed, setFailed] = useState(false)

  const imageUrl = dish?.image_url || ''
  const emoji = getCategoryEmoji(dish?.category)
  const normalizedUrl = imageUrl.startsWith('http') || imageUrl.startsWith('data:') ? imageUrl : `${baseUrl}${imageUrl.replace(/^\//, '')}`

  const isNumber = typeof size === 'number'
  const wrapperStyle = {
    width: size,
    height: isNumber ? size : '100%',
    borderRadius: radius,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.04)',
    ...style,
  }

  if (!imageUrl || failed) {
    return (
      <div className={className} style={wrapperStyle}>
        <span style={{ fontSize: isNumber ? size * 0.42 : '40%', lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))' }}>
          {emoji}
        </span>
      </div>
    )
  }

  return (
    <div className={className} style={wrapperStyle}>
      <img
        src={normalizedUrl}
        alt={dish?.name || '菜品图片'}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    </div>
  )
}
