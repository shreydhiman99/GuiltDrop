"use client"
import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotificationPermission() {
  const [permission, setPermission] = useState<string>("default")
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])
  
  const requestPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === "granted") {
        new Notification("Notifications enabled!", {
          body: "You'll now receive notifications from GuiltDrop",
          icon: '/images/logo_512.png'
        })
      }
    }
  }
  
  // Don't render anything during SSR
  if (!mounted) return null
  
  // Don't show if notifications are already granted or not supported
  if (permission === "granted" || (typeof window !== "undefined" && !("Notification" in window))) {
    return null
  }
  
  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white p-4 rounded-lg shadow-lg z-50 border">
      <div className="flex items-start">
        <Bell className="text-primary mr-3 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">Enable notifications</h3>
          <p className="text-sm text-gray-600 mb-3">
            Get notified about likes, comments and more!
          </p>
          <Button 
            size="sm" 
            onClick={requestPermission}
            className="w-full"
          >
            Enable notifications
          </Button>
        </div>
      </div>
    </div>
  )
}