"use client"
import React from 'react'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { Heart, MessageCircle, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

type NotificationType = {
  id: number
  created_at: string
  user_id: string
  post_id: number | null
  to_user_id: string
  type: number
  is_read: boolean
  user: {
    username: string
    profile_image: string | null
  }
}

export default function NotificationItem({ notification, onRead }: { 
  notification: NotificationType,
  onRead?: (id: number) => void
}) {
  const router = useRouter()
  
  // Define notification content based on type
  const getNotificationContent = () => {
    switch (notification.type) {
      case 1:
        return {
          icon: <Heart className="text-red-500" size={18} />,
          message: <span><strong>{notification.user.username}</strong> liked your post</span>,
          link: notification.post_id ? `/post/${notification.post_id}` : '/'
        }
      case 2:
        return {
          icon: <MessageCircle className="text-blue-500" size={18} />,
          message: <span><strong>{notification.user.username}</strong> commented on your post</span>,
          link: notification.post_id ? `/post/${notification.post_id}` : '/'
        }
      case 3:
        return {
          icon: <UserPlus className="text-green-500" size={18} />,
          message: <span><strong>{notification.user.username}</strong> started following you</span>,
          link: `/user/${notification.user.username}`
        }
      default:
        return {
          icon: null,
          message: <span>You have a new notification</span>,
          link: '/'
        }
    }
  }

  const { icon, message, link } = getNotificationContent()
  
  const handleClick = async () => {
    if (!notification.is_read && onRead) {
      onRead(notification.id)
    }
    router.push(link)
  }
  
  return (
    <div 
      onClick={handleClick} 
      className={`flex items-start py-4 px-3 ${!notification.is_read ? 'bg-blue-50' : 'hover:bg-gray-50'} rounded-lg transition-colors cursor-pointer`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0">{icon}</span>
          <p className="text-sm text-gray-800 line-clamp-2">{message}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
      
      {notification.post_id && (
        <div className="flex-shrink-0 ml-2 self-center">
          <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
            View
          </span>
        </div>
      )}
    </div>
  )
}