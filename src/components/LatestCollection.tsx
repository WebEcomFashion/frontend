"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchProductsThunk } from "../redux/thunks/productThunks"
import type { AppDispatch, RootState } from "../redux/store"
import ProductCard from "./ProductCard"

const LatestCollection = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { products, loading } = useSelector((state: RootState) => state.productR)

  useEffect(() => {
    dispatch(fetchProductsThunk({ page: 1, perPage: 8 }))
  }, [dispatch])

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Collection</h2>
        <p className="text-gray-600">Discover our newest arrivals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
        ))}
      </div>

      <div className="text-center">
        <a
          href="/collection"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
        >
          View All
        </a>
      </div>
    </div>
  )
}

export default LatestCollection
