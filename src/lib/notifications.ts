import { createClient } from './supabase/supabaseClient'

// Notification types
export enum NotificationType {
  LIKE = 1,
  COMMENT = 2,
  FOLLOW = 3
}

/**
 * Create a notification in the database
 */
export async function createNotification({
  userId,
  toUserId,
  postId = null,
  type
}: {
  userId: string
  toUserId: string
  postId?: number | null
  type: NotificationType
}) {
  // Don't create notifications for yourself
  if (userId === toUserId) return null
  
  const supabase = createClient(undefined)
  
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      to_user_id: toUserId,
      post_id: postId,
      type
    })
    .select()
    .single()
    
  if (error) {
    console.error('Error creating notification:', error.message)
    return null
  }
  
  return data
}