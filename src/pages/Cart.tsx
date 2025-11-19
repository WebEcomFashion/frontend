"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { removeFromCart, updateCartItem, clearCart } from "../redux/slices/cartSlice"
import type { AppDispatch, RootState } from "../redux/store"
import { formatPrice } from "../utils/helpers"
import { toast } from "react-toastify"

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { cartItems, totalPrice } = useSelector((state: RootState) => state.cartR)
  const isLoggedIn = useSelector((state: RootState) => state.authR.authenticated)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId))
    toast.success("Item removed from cart")
  }

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ id: itemId, quantity: newQuantity }))
    }
  }

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to checkout")
      navigate("/login")
      return
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsProcessing(true)
    try {
      navigate("/checkout")
    } catch (error) {
      toast.error("Failed to proceed to checkout")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinueShopping = () => {
    navigate("/collection")
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to get started!</p>
            <button
              onClick={handleContinueShopping}
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-6 flex gap-6">
                  {/* Item Image Placeholder */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-400">Image</span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.productTitle}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="font-semibold text-gray-900">{formatPrice(item.unitPrice)}</p>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Remove
                    </button>

                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-200 transition"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-200 transition"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-semibold text-gray-900">{formatPrice(item.unitPrice * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleContinueShopping} className="mt-8 text-black font-medium hover:underline">
              ← Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(totalPrice * 0.1)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>{formatPrice(totalPrice * 1.1)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {isProcessing ? "Processing..." : "Proceed to Checkout"}
              </button>

              <button
                onClick={() => dispatch(clearCart())}
                className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
