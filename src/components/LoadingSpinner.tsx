"use client"

import { useContext } from "react"
import { LoadingContext } from "../context/LoadingContext"

export const LoadingSpinner = () => {
  const { isLoading } = useContext(LoadingContext)

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
