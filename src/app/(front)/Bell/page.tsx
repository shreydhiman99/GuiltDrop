import React from 'react'
import { createClient } from '@/lib/supabase/supabaseServer'
import NotificationList from '@/components/notifications/NotificationList'
import { redirect } from 'next/navigation'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getSession()
  
  // Redirect if not logged in
  if (!sessionData.session) {
    return redirect('/login')
  }
  
  return (
    <div className="container py-6">
      <NotificationList userId={sessionData.session.user.id} />
    </div>
  )
}