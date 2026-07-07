import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext()
const CART_KEY = 'couple_order_cart_v3'

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] }
  })
  // Frontend-facing mode: only 'her' (girlfriend orders for herself) is exposed.
  // 'chef' is the admin identity used in the backend for fulfillment notifications.
  const [mode, setMode] = useState(() => localStorage.getItem('couple_order_mode') || 'her')

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)) }, [items])
  useEffect(() => { localStorage.setItem('couple_order_mode', mode) }, [mode])

  const addItem = useCallback((dish) => {
    setItems(prev => {
      const existing = prev.find(i => i.dish_id === dish.id && i.added_by === mode)
      if (existing) {
        return prev.map(i => i.dish_id === dish.id && i.added_by === mode ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { dish_id: dish.id, name: dish.name, price: dish.price, quantity: 1, added_by: mode }]
    })
  }, [mode])

  const removeItem = useCallback((dishId, addedBy) => {
    setItems(prev => prev.filter(i => !(i.dish_id === dishId && (!addedBy || i.added_by === addedBy))))
  }, [])

  const updateQuantity = useCallback((dishId, quantity, addedBy) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => !(i.dish_id === dishId && (!addedBy || i.added_by === addedBy))))
    } else {
      setItems(prev => prev.map(i => i.dish_id === dishId && (!addedBy || i.added_by === addedBy) ? { ...i, quantity } : i))
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalCount, mode, setMode }}>
      {children}
    </CartContext.Provider>
  )
}
