"use client"

import type React from "react"
import { createContext, useState, useCallback } from "react"

interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type: "success" | "error" | "info") => void
  removeNotification: (id: string) => void
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
})

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((message: string, type: "success" | "error" | "info") => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      removeNotification(id)
    }, 3000)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}
