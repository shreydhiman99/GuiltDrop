"use client"
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/supabaseClient'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NotificationBadge({ userId }: { userId: string }) {
  const [count, setCount] = useState(0)
  const pathName = usePathname()
  const supabase = createClient(undefined)
  
  useEffect(() => {
    // Get initial count
    const fetchCount = async () => {
      const { count: notificationCount, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('to_user_id', userId)
        .eq('is_read', false);
      
      if (!error && notificationCount !== null) {
        setCount(notificationCount);
      }
    }
    
    fetchCount()
    
    // Listen for new notifications
    const subscription = supabase
      .channel('new_notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `to_user_id=eq.${userId}`
        }, 
        () => {
          setCount(prev => prev + 1)
        }
      )
      .subscribe()
      
    return () => {
      subscription.unsubscribe()
    }
  }, [userId])
  
  // Reset badge when visiting notifications page
  useEffect(() => {
    if (pathName === '/Bell') {
      setCount(0)
    }
  }, [pathName])
  
  return (
    <Link 
      href="/Bell"
      className={`relative cursor-pointer hover:text-foreground ${
        pathName === "/Bell" ? "text-primary font-medium" : "text-gray-500"
      }`}
    >
      <Bell size={30} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}