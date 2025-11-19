"use client"

import type React from "react"
import { createContext, useState } from "react"

interface LoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
})

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  return <LoadingContext.Provider value={{ isLoading, setIsLoading }}>{children}</LoadingContext.Provider>
}
