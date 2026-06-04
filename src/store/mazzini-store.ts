import { create } from 'zustand'

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  quantity: number
}

export interface WishlistItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
}

interface MazziniStore {
  cartItems: CartItem[]
  wishlistItems: WishlistItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, qty: number) => void
  clearCart: () => void
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: number) => void
  getCartTotal: () => number
  getCartCount: () => number
}

export const useMazziniStore = create<MazziniStore>((set, get) => ({
  cartItems: [],
  wishlistItems: [],

  addToCart: (item) => {
    set((state) => {
      const existing = state.cartItems.find((ci) => ci.id === item.id)
      if (existing) {
        return {
          cartItems: state.cartItems.map((ci) =>
            ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
          ),
        }
      }
      return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] }
    })
  },

  removeFromCart: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((ci) => ci.id !== id),
    }))
  },

  updateQuantity: (id, qty) => {
    if (qty <= 0) {
      get().removeFromCart(id)
      return
    }
    set((state) => ({
      cartItems: state.cartItems.map((ci) =>
        ci.id === id ? { ...ci, quantity: qty } : ci
      ),
    }))
  },

  clearCart: () => set({ cartItems: [] }),

  addToWishlist: (item) => {
    set((state) => {
      const exists = state.wishlistItems.find((wi) => wi.id === item.id)
      if (exists) return state
      return { wishlistItems: [...state.wishlistItems, item] }
    })
  },

  removeFromWishlist: (id) => {
    set((state) => ({
      wishlistItems: state.wishlistItems.filter((wi) => wi.id !== id),
    }))
  },

  getCartTotal: () => {
    return get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  getCartCount: () => {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0)
  },
}))
