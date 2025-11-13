// src/store/useProductStore.ts
import { create } from 'zustand'
import type { Product } from '@/types/product'

interface CartItem extends Product {
  quantity: number
}

interface ProductStore {
  products: Product[]
  selectedCategory: string
  searchTerm: string
  cart: CartItem[]
  isCartOpen: boolean
  cartCount: number
  setProducts: (products: Product[]) => void
  setSelectedCategory: (category: string) => void
  setSearchTerm: (term: string) => void
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  toggleCart: () => void
  clearCart: () => void
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedCategory: 'Todos',
  searchTerm: '',
  cart: [],
  isCartOpen: false,
  cartCount: 0,
  
  setProducts: (products) => set({ products }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  addToCart: (product) => {
    const { cart } = get()
    const existing = cart.find(item => item.id === product.id)
    
    if (existing) {
      const newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      set({ 
        cart: newCart,
        cartCount: newCart.reduce((sum, item) => sum + item.quantity, 0)
      })
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }]
      set({ 
        cart: newCart,
        cartCount: newCart.reduce((sum, item) => sum + item.quantity, 0)
      })
    }
  },
  
  removeFromCart: (productId) => {
    const newCart = get().cart.filter(item => item.id !== productId)
    set({ 
      cart: newCart,
      cartCount: newCart.reduce((sum, item) => sum + item.quantity, 0)
    })
  },
  
  toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
  
  clearCart: () => set({ cart: [], cartCount: 0 })
}))