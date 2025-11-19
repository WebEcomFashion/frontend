import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartItem } from "../../types/CartItem"

interface CartState {
  cartItems: CartItem[]
  totalPrice: number
  cartId: number | null
}

const initialState: CartState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems") || "[]"),
  totalPrice: Number.parseFloat(localStorage.getItem("totalPrice") || "0"),
  cartId: localStorage.getItem("cartId") ? Number.parseInt(localStorage.getItem("cartId")!) : null,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.cartItems.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color,
      )

      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.cartItems.push(action.payload)
      }

      state.totalPrice = state.cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0)

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
      localStorage.setItem("totalPrice", state.totalPrice.toString())
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload)
      state.totalPrice = state.cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
      localStorage.setItem("totalPrice", state.totalPrice.toString())
    },

    updateCartItem: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.cartItems.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
        state.totalPrice = state.cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        localStorage.setItem("totalPrice", state.totalPrice.toString())
      }
    },

    clearCart: (state) => {
      state.cartItems = []
      state.totalPrice = 0
      state.cartId = null
      localStorage.removeItem("cartItems")
      localStorage.removeItem("totalPrice")
      localStorage.removeItem("cartId")
    },

    setCartId: (state, action: PayloadAction<number>) => {
      state.cartId = action.payload
      localStorage.setItem("cartId", action.payload.toString())
    },
  },
})

export const { addToCart, removeFromCart, updateCartItem, clearCart, setCartId } = cartSlice.actions
export default cartSlice.reducer
