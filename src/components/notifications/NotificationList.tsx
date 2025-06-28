"use client"
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/supabaseClient'
import NotificationItem from './NotificationItem'
import { Bell } from 'lucide-react'

export default function NotificationList({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient(undefined)

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          user:users!notifications_user_id_fkey(username, profile_image)
        `)
        .eq('to_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching notifications:', error.message)
      } else {
        setNotifications(data || [])
        
        // Mark all as read when viewing the notifications page
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('to_user_id', userId)
          .eq('is_read', false)
      }
      setLoading(false)
    }

    fetchNotifications()

    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `to_user_id=eq.${userId}`
        }, 
        (payload) => {
          // Fetch the user data for the new notification
          const fetchNewNotification = async () => {
            const { data, error } = await supabase
              .from('notifications')
              .select(`
                *,
                user:users!notifications_user_id_fkey(username, profile_image)
              `)
              .eq('id', payload.new.id)
              .single()

            if (!error && data) {
              setNotifications(prev => [data, ...prev])
              // Show browser notification
              showBrowserNotification(data)
            }
          }
          
          fetchNewNotification()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const markAsRead = async (notificationId: number) => {
    // Update local state
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, is_read: true } 
        : notification
    ))
    
    // Update in database
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
  }

  const showBrowserNotification = (notification: any) => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("This browser does not support desktop notification")
      return
    }

    if (Notification.permission === "granted") {
      let title, body, url
      
      switch (notification.type) {
        case 1:
          title = `${notification.user.username} liked your post`
          body = `They liked your post`
          url = notification.post_id ? `/post/${notification.post_id}` : '/'
          break
        case 2:
          title = `${notification.user.username} commented on your post`
          body = `They left a comment on your post`
          url = notification.post_id ? `/post/${notification.post_id}` : '/'
          break
        case 3:
          title = `${notification.user.username} started following you`
          body = `You have a new follower`
          url = `/user/${notification.user.username}`
          break
        default:
          title = "New notification"
          body = "You have a new notification"
          url = '/'
      }
      
      const notif = new Notification(title, { 
        body,
        icon: '/images/logo_512.png',
        tag: `notification-${notification.id}` // Prevent duplicate notifications
      })
      
      // Add click handler to browser notification
      notif.onclick = function() {
        window.focus()
        window.location.href = url
      }
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2 px-4 border-b">
        <h2 className="text-xl font-semibold flex items-center">
          <Bell className="mr-2 flex-shrink-0" size={20} />
          <span>Notifications</span>
        </h2>
      </div>
      
      <div className="px-4 pb-20">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {notifications.map(notification => (
              <li key={notification.id}>
                <NotificationItem 
                  notification={notification} 
                  onRead={markAsRead}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 mt-4 bg-gray-50 rounded-lg text-center">
            <Bell className="text-gray-400 mb-3" size={40} />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">When you get notifications, they'll appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}