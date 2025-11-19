"use client"

import { useContext } from "react"
import { NotificationContext } from "../context/NotificationContext"

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useContext(NotificationContext)

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg text-white shadow-lg animate-fade-in ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{notification.message}</span>
            <button onClick={() => removeNotification(notification.id)} className="ml-4 text-white hover:text-gray-200">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
