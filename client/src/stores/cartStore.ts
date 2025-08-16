import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  menu_item_id: number
  name: string
  price: number
  quantity: number
  size?: string
  crust?: string
  toppings?: string[]
  customizations?: Record<string, any>
  special_instructions?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

interface CartActions {
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  updateCustomizations: (id: number, customizations: Record<string, any>) => void
  updateSpecialInstructions: (id: number, instructions: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  initializeCart: () => void
}

type CartStore = CartState & CartActions

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,

      // Actions
      addItem: (newItem: Omit<CartItem, 'id'>) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          item => 
            item.menu_item_id === newItem.menu_item_id &&
            JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations)
        )

        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += newItem.quantity
          set({ items: updatedItems })
        } else {
          // Add new item
          const newCartItem: CartItem = {
            ...newItem,
            id: Date.now() + Math.random(), // Simple ID generation
          }
          set({ items: [...items, newCartItem] })
        }
      },

      removeItem: (id: number) => {
        const { items } = get()
        set({ items: items.filter(item => item.id !== id) })
      },

      updateQuantity: (id: number, quantity: number) => {
        const { items } = get()
        if (quantity <= 0) {
          set({ items: items.filter(item => item.id !== id) })
        } else {
          const updatedItems = items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
          set({ items: updatedItems })
        }
      },

      updateCustomizations: (id: number, customizations: Record<string, any>) => {
        const { items } = get()
        const updatedItems = items.map(item =>
          item.id === id ? { ...item, customizations } : item
        )
        set({ items: updatedItems })
      },

      updateSpecialInstructions: (id: number, instructions: string) => {
        const { items } = get()
        const updatedItems = items.map(item =>
          item.id === id ? { ...item, special_instructions: instructions } : item
        )
        set({ items: updatedItems })
      },

      clearCart: () => {
        set({ items: [], isOpen: false })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      toggleCart: () => {
        const { isOpen } = get()
        set({ isOpen: !isOpen })
      },

      initializeCart: () => {
        // This is called on app initialization
        // The persist middleware will automatically restore the cart state
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)

// Computed values
export const useCartTotal = () => {
  const { items } = useCartStore()
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export const useCartItemCount = () => {
  const { items } = useCartStore()
  return items.reduce((count, item) => count + item.quantity, 0)
}

export const useCartItems = () => {
  const { items } = useCartStore()
  return items
}
